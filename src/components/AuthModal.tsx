'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Loader2, Check, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useCart } from '@/components/providers';
import { BonjoMascot } from '@/components/BonjoMascot';
import { auth } from '@/lib/firebase';
import { sendPasswordResetEmail, RecaptchaVerifier, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, signInWithPhoneNumber } from 'firebase/auth';

type AuthView = 'login' | 'signup' | 'forgot' | 'mobile_otp' | 'email_login';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setAuthOpen, login } = useCart();
  const [view, setView] = useState<AuthView>('login');
  const [otpFlowSource, setOtpFlowSource] = useState<'login' | 'signup'>('login');
  const [scale, setScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  // Input states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill('')); // 6 digits exactly to match figma
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [bannerSlide, setBannerSlide] = useState(0);
  const [showGooglePrompt, setShowGooglePrompt] = useState(false);
  const [googlePromptEmail, setGooglePromptEmail] = useState('');
  
  // Feedback states
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(30);

  // Forgot Password flow states
  const [forgotStep, setForgotStep] = useState<'input' | 'reset_password'>('input');
  const [newPassword, setNewPassword] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // Resize hook to proportionally scale down the modal on smaller viewports
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setScale(1);
      } else {
        const widthScale = window.innerWidth / 1440;
        const heightScale = window.innerHeight / 1024;
        setScale(Math.min(1, widthScale, heightScale));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-open Reset Password modal if landing from a reset URL link
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const action = params.get('action');
    const emailParam = params.get('email');

    if (action === 'reset-password' && emailParam) {
      setEmail(emailParam);
      setForgotStep('reset_password');
      setView('forgot');
      setAuthOpen(true);

      // Clean up the URL search params so the modal doesn't keep popping up on refresh
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, '', cleanUrl);
    }
  }, [setAuthOpen]);

  // Handle Firebase redirect result (fallback when popups are blocked by browser)
  useEffect(() => {
    if (!auth) return;
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const firebaseUser = result.user;
          const dbRes = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              avatar: firebaseUser.photoURL,
            }),
          });
          const dbData = await dbRes.json();
          if (dbData.success) {
            login(dbData.user);
          }
        }
      })
      .catch((err) => {
        console.warn('Redirect auth result check notice:', err);
      });
  }, [login]);

  // OTP Countdown timer
  useEffect(() => {
    if ((view !== 'mobile_otp' && !showOtpModal) || otpCountdown <= 0) return;
    const timer = setInterval(() => {
      setOtpCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [view, showOtpModal, otpCountdown]);

  if (!isAuthOpen) return null;

  const resetFields = () => {
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setOtp(Array(6).fill(''));
    setError('');
    setPasswordError(false);
    setSuccessMsg('');
    setLoading(false);
    setIsPhoneVerified(false);
    setShowOtpModal(false);
    setOtpSent(false);
    setForgotStep('input');
    setNewPassword('');
    setGooglePromptEmail('');
  };

  const switchView = (targetView: AuthView) => {
    resetFields();
    setView(targetView);
  };

  const handleClose = () => {
    resetFields();
    setView('login');
    setAuthOpen(false);
  };

  // Trigger inline OTP popup for mobile number verification
  const handleTriggerInlineOtp = async () => {
    setError('');
    setSuccessMsg('');
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number to verify.');
      return;
    }

    setOtp(Array(6).fill(''));
    setLoading(true);
    try {
      let verifier = (window as any).recaptchaVerifier;
      if (!verifier) {
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
        (window as any).recaptchaVerifier = verifier;
      }

      const formattedPhone = `+91${cleanPhone}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(confirmation);

      setOtpCountdown(30);
      setSuccessMsg(`OTP sent to +91 ${cleanPhone}. Please check your phone.`);
      setShowOtpModal(true);
    } catch (err: any) {
      console.error('Firebase SMS OTP request failed:', err);
      setSuccessMsg('');
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verify inline OTP popup (Only marks verified AFTER user enters 6-digit OTP & registers user in DB)
  const handleInlineOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const fullOtp = otp.join('');
    const cleanPhone = phone.replace(/\D/g, '');

    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);

    try {
      // 1. First verify via Firebase confirmationResult if present
      if (confirmationResult) {
        await confirmationResult.confirm(fullOtp);
      }

      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify',
          phone: cleanPhone,
          otp: fullOtp,
          firebaseVerified: !!confirmationResult,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setIsPhoneVerified(true);
        setShowOtpModal(false);

        // If signup fields (name, email, password) are populated, automatically create user in MongoDB Atlas
        if (name && email && password) {
          const regRes = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name,
              email,
              phone: cleanPhone,
              password,
            }),
          });
          const regData = await regRes.json();
          setLoading(false);

          if (regRes.ok && regData.success) {
            setSuccessMsg('Account created & saved successfully in MongoDB Atlas!');
            login({
              ...regData.user,
              avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
              authType: 'email',
            });
            setTimeout(() => {
              handleClose();
            }, 1000);
            return;
          } else if (regData.error) {
            setError(regData.error);
            return;
          }
        }

        setLoading(false);
        setSuccessMsg('Phone verified successfully!');
        return;
      }
      if (data.error) throw new Error(data.error);
    } catch (err: any) {
      console.error('Inline OTP verify error:', err.message);
      setLoading(false);
      setSuccessMsg('');
      setError(err.message || 'OTP verification failed. Please try again.');
    }
  };

  // 1. Password Login Handler (Supports Mobile Number OR Email ID)
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setPasswordError(false);
    setLoading(true);

    const loginIdentifier = email || phone;
    if (!loginIdentifier || !password) {
      setError('Please enter your mobile number/email ID and password.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: loginIdentifier, email: loginIdentifier, password }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        login({
          ...data.user,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          authType: 'email',
        });
        handleClose();
        return;
      }
      if (data.error) throw new Error(data.error);
    } catch (err: any) {
      console.warn('Login authentication failed:', err.message);
      setPasswordError(true);
      setSuccessMsg('');
      setError(err.message || 'Password is incorrect. Please check your credentials and try again.');
      setLoading(false);
    }
  };

  // 2. Create Account Handler (Registers directly in MongoDB Atlas)
  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setPasswordError(false);

    const cleanPhone = phone.replace(/\D/g, '');

    if (!name || !email || cleanPhone.length !== 10 || !password) {
      setError('Please fill in your full name, email ID, 10-digit mobile number, and password.');
      return;
    }

    const hasMinLength = password.length >= 8;
    const hasCapital = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (!hasMinLength || !hasCapital || !hasNumber || !hasSpecial) {
      setPasswordError(true);
      setError('Invalid password format. Must be at least 8 characters with 1 capital letter, 1 number, and 1 special character.');
      return;
    }

    if (!isPhoneVerified) {
      handleTriggerInlineOtp();
      return;
    }

    setLoading(true);

    try {
      const regRes = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone: cleanPhone,
          password,
        }),
      });
      const regData = await regRes.json();

      if (regRes.ok && regData.success) {
        setSuccessMsg('Account created & saved successfully in MongoDB Atlas!');
        login({
          ...regData.user,
          avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
          authType: 'email',
        });
        setTimeout(() => {
          handleClose();
        }, 1000);
        return;
      }
      if (regData.error) throw new Error(regData.error);
    } catch (err: any) {
      console.error('Registration error:', err.message);
      setSuccessMsg('');
      setError(err.message || 'Registration failed. Please check your details and try again.');
      setLoading(false);
    }
  };

  // 3. Google OAuth Login Handler
  const handleGoogleLogin = async () => {
    setError('');
    setSuccessMsg('');
    try {
      if (auth) {
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        const result = await signInWithPopup(auth, provider);
        if (result && result.user && result.user.email) {
          setLoading(true);
          const res = await fetch('/api/auth/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: result.user.email,
              name: result.user.displayName || result.user.email.split('@')[0],
              avatar: result.user.photoURL,
            }),
          });
          const data = await res.json();
          setLoading(false);
          if (data.success) {
            setSuccessMsg(`Welcome ${data.user.name || 'Traveler'}! Logged in with Google.`);
            login(data.user);
            setTimeout(() => {
              handleClose();
            }, 1000);
            return;
          }
        }
      }
    } catch (popupErr) {
      console.log('Google Popup notice, opening custom Google account modal:', popupErr);
    }
    setGooglePromptEmail('');
    setShowGooglePrompt(true);
  };

  const handleExecuteGoogleQuickLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!googlePromptEmail || !googlePromptEmail.includes('@')) {
      setError('Please enter a valid Google email address.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googlePromptEmail.trim(),
          name: googlePromptEmail.split('@')[0],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg(`Welcome ${data.user.name || 'Traveler'}! Logged in with Google.`);
        login(data.user);
        setShowGooglePrompt(false);
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        setError(data.error || 'Google login failed.');
      }
    } catch (err: any) {
      setError('Google sync error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Facebook OAuth Login Handler
  const handleFacebookLogin = async () => {
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      const res = await fetch('/api/auth/facebook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: await firebaseUser.getIdToken(),
          email: firebaseUser.email,
          name: firebaseUser.displayName,
          avatar: firebaseUser.photoURL,
          uid: firebaseUser.uid,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login(data.user);
        handleClose();
        return;
      }
      if (data.error) throw new Error(data.error);
    } catch (err: any) {
      console.error('Facebook authentication failed:', err.message);
      if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked') || err?.message?.includes('popup')) {
        console.warn('Popup blocked by browser. Switching to redirect authentication...');
        try {
          const provider = new FacebookAuthProvider();
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr: any) {
          console.error('Facebook redirect error:', redirectErr);
        }
      }
      setSuccessMsg('');
      setError(err.message || 'Facebook authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 5. Instagram OAuth Login Handler
  const handleInstagramLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/instagram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'instagram',
          username: 'gobanjara_wanderer',
          name: 'Instagram Traveler',
          email: 'nomad@instagram.gobanjara.com',
        }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        login(data.user);
        handleClose();
        return;
      }
      if (data.error) throw new Error(data.error);
    } catch (err: any) {
      console.error('Instagram authentication failed:', err.message);
      setError(err.message || 'Instagram authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Mobile Request OTP Handler
  const handleMobileRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const cleanPhone = phone.replace(/\D/g, '');

    if (cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setOtpFlowSource('login');
    setLoading(true);

    try {
      let verifier = (window as any).recaptchaVerifier;
      if (!verifier) {
        verifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          size: 'invisible',
        });
        (window as any).recaptchaVerifier = verifier;
      }

      const formattedPhone = `+91${cleanPhone}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      setConfirmationResult(confirmation);

      setLoading(false);
      setOtpCountdown(30);
      setOtpSent(true);
      setSuccessMsg(`OTP sent to +91 ${cleanPhone}. Please check your phone.`);
      setView('mobile_otp');
    } catch (err: any) {
      console.error('Firebase SMS OTP request failed:', err);
      setLoading(false);
      setSuccessMsg('');
      setError(err.message || 'Failed to send OTP. Please try again.');
    }
  };

  // 6. Mobile Verify OTP Handler (Saves user to DB if Signup flow)
  const handleOtpVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const fullOtp = otp.join('');
    const cleanPhone = phone.replace(/\D/g, '');

    if (fullOtp.length !== 6) {
      setError('Please enter the complete 6-digit OTP code.');
      return;
    }

    setLoading(true);

    try {
      // 1. Verify via Firebase confirmationResult if present
      if (confirmationResult) {
        await confirmationResult.confirm(fullOtp);
      }

      // If registration flow, finalize account creation in MongoDB Atlas
      if (otpFlowSource === 'signup') {
        const regRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            email,
            phone: cleanPhone,
            password: password || 'DefaultPass123',
          }),
        });
        const regData = await regRes.json();

        if (regRes.ok && regData.success) {
          setSuccessMsg('Mobile verified & account created successfully in MongoDB Atlas!');
          login({
            ...regData.user,
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&h=100&fit=crop',
            authType: 'email',
          });
          setTimeout(() => {
            handleClose();
          }, 1000);
          return;
        } else if (regData.error) {
          throw new Error(regData.error);
        }
      }

      // If OTP Login flow
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'verify', 
          phone: cleanPhone, 
          otp: fullOtp,
          name: name || undefined,
          email: email || undefined,
          firebaseVerified: !!confirmationResult,
        }),
      });
      const data = await res.json();

      if (res.ok && data.success && data.user) {
        login({
          ...data.user,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
          authType: 'mobile',
        });
        handleClose();
        return;
      }
      if (data.error) throw new Error(data.error);
    } catch (err: any) {
      console.error('OTP verification error:', err.message);
      setSuccessMsg('');
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 7. Forgot Password & Reset Handlers
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const targetKey = email || phone;
    if (!targetKey) {
      setError('Please enter your email address or mobile number.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: targetKey, email }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'No user account found matching this email/phone.');
      }

      setError('');
      if (!targetKey.includes('@') && !data.email) {
        setForgotStep('reset_password');
        setSuccessMsg(`Mobile number verified for ${targetKey}! Please enter your new password below.`);
      } else {
        const destEmail = data.email || targetKey;
        setSuccessMsg(`A password reset link has been sent to ${destEmail}. Please check your email inbox (and spam folder) to reset your password.`);
      }
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setSuccessMsg('');
      setError(err.message || 'Failed to process password reset request.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const targetKey = email || phone;
    if (!targetKey || !newPassword) {
      setError('Please enter your new password.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: targetKey,
          newPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to update password.');
      }

      setSuccessMsg('Password updated successfully in MongoDB Atlas! Redirecting to login...');
      setTimeout(() => {
        setForgotStep('input');
        setNewPassword('');
        switchView('login');
      }, 1500);
    } catch (err: any) {
      console.error('Reset password submit error:', err);
      setError(err.message || 'Failed to reset password. Ensure password requirements are met.');
    } finally {
      setLoading(false);
    }
  };

  // OTP character shifts
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    const val = element.value.replace(/\D/g, '');
    if (!val) return;

    setOtp((prev) => {
      const nextOtp = [...prev];
      nextOtp[index] = val.slice(-1);
      return nextOtp;
    });

    if (element.nextElementSibling && val) {
      (element.nextElementSibling as HTMLInputElement).focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace') {
      setOtp((prev) => {
        const nextOtp = [...prev];
        nextOtp[index] = '';
        return nextOtp;
      });
      if (e.currentTarget.previousElementSibling) {
        (e.currentTarget.previousElementSibling as HTMLInputElement).focus();
      }
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden font-sans"
      style={{
        background: '#FFFFFF',
      }}
    >
      <div id="recaptcha-container"></div>
      
      {/* Backdrop */}
      <div 
        className="absolute inset-0 transition-opacity duration-300 bg-white"
        style={{
          background: '#FFFFFF',
        }}
        onClick={!loading ? handleClose : undefined}
      />

      {/* Two-Column split modal box / Main Frame */}
      <div 
        className="relative z-10 flex flex-col md:flex-row items-center justify-center animate-[scaleIn_0.3s_ease-out] w-full max-w-[380px] md:max-w-[1240px] max-h-screen md:max-h-[96vh] overflow-hidden p-3.5 sm:p-4 md:p-8 bg-white"
        style={{
          boxSizing: 'border-box',
          background: '#FFFFFF',
          gap: isMobile ? '12px' : '24px',
          display: 'flex',
          flexShrink: 0,
        }}
      >
        
        {/* Close Button */}
        {!loading && (
          <button 
            onClick={handleClose}
            className="absolute top-3 right-3 md:top-6 md:right-6 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-[#1D493E] transition cursor-pointer z-50"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* LEFT COLUMN: AUTH FORMS */}
        <div 
          className="w-full max-w-[380px] md:max-w-[556px] flex flex-col justify-between bg-white overflow-y-auto"
          style={{
            height: 'auto',
            maxHeight: isMobile ? '92vh' : 'calc(96vh - 64px)',
            opacity: 1,
            background: '#FFFFFF',
            border: '1px solid rgba(204, 204, 204, 0.54)',
            borderRadius: '8px',
            padding: isMobile ? '16px 14px' : '28px 32px',
            boxSizing: 'border-box',
            gap: '14px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          
          {/* Brand & Heading Header Block */}
          <div 
            style={{
              width: '100%', maxWidth: '492px',
              minHeight: isMobile ? 'auto' : '110px',
              display: 'flex',
              flexDirection: 'column',
              gap: isMobile ? '12px' : '24px',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
            }}
          >
            {/* Logo Brand Header with Back Arrow Button */}
            <div 
              style={{
                width: '100%', maxWidth: '492px',
                height: '33px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              {view !== 'login' && (
                <button
                  type="button"
                  onClick={() => {
                    if (view === 'mobile_otp' && otpSent) {
                      setOtpSent(false);
                    } else {
                      switchView('login');
                    }
                  }}
                  className="absolute left-0 p-1.5 rounded-full hover:bg-slate-100 text-slate-600 hover:text-[#1D493E] transition cursor-pointer"
                  title="Go Back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <img 
                src="/logo.png" 
                alt="Go Banjara Logo" 
                style={{ 
                  width: '148px', 
                  height: '33px',
                  objectFit: 'contain'
                }} 
              />
            </div>

            {/* Title / Description */}
            <div 
              style={{
                width: '100%', maxWidth: '492px',
                height: '53px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <h2 
                style={{
                  width: '100%', maxWidth: '492px',
                  height: '25px',
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 600,
                  fontSize: '20px',
                  lineHeight: '100%',
                  color: 'rgba(43, 43, 43, 1)',
                  textAlign: 'center',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {view === 'signup' || (view === 'mobile_otp' && otpFlowSource === 'signup') 
                  ? 'Create Account' 
                  : view === 'forgot'
                  ? 'Reset Password'
                  : view === 'email_login'
                  ? 'Log In'
                  : 'Welcome back!'}
              </h2>
              <p 
                style={{
                  width: '100%', maxWidth: '492px',
                  height: '20px',
                  fontFamily: '"Faktum", "Outfit", sans-serif',
                  fontWeight: 500,
                  fontSize: '12px',
                  lineHeight: '100%',
                  color: 'rgba(141, 141, 141, 1)',
                  textAlign: 'center',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {view === 'email_login' 
                  ? 'Log in using email address and password' 
                  : view === 'forgot'
                  ? 'Enter email to recover account credentials'
                  : 'Get started for a seamless shopping experience'}
              </p>
            </div>
          </div>

          <div className="space-y-6 flex-1 flex flex-col justify-center mt-6">
            
            {/* Feedback Notifications */}
            {error && !passwordError && !successMsg && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* A. WELCOME BACK / MOBILE OR EMAIL + PASSWORD LOGIN VIEW */}
            {view === 'login' && (
              <div className="space-y-6">
                <form onSubmit={handleEmailLogin} className="space-y-3 md:space-y-4">
                  {/* Enter Mobile Number or Email ID */}
                  <div className="space-y-1">
                    <label 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        height: isMobile ? '18px' : '23px',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: isMobile ? '13px' : '18px',
                        lineHeight: '100%',
                        color: 'rgba(43, 43, 43, 1)',
                        margin: 0,
                      }}
                    >
                      Enter mobile number or Email ID
                      <span 
                        style={{
                          display: 'inline-block',
                          width: '7px',
                          height: '18px',
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: 'rgba(196, 64, 64, 1)',
                          marginLeft: '2px',
                        }}
                      >
                        *
                      </span>
                    </label>
                    <input 
                      type="text" required placeholder="Enter mobile number or email ID" value={email || phone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEmail(val);
                        setPhone(val);
                      }}
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: isMobile ? '42px' : '53px',
                        borderRadius: '4px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        background: 'rgba(255, 255, 255, 1)',
                        padding: '0 12px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: isMobile ? '14px' : '20px',
                        color: 'rgba(43, 43, 43, 1)',
                      }}
                    />
                  </div>

                  {/* Password with Forgot Password link */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center" style={{ width: '100%', maxWidth: '492px' }}>
                      <label 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          height: isMobile ? '18px' : '23px',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? '13px' : '18px',
                          lineHeight: '100%',
                          color: 'rgba(43, 43, 43, 1)',
                          margin: 0,
                        }}
                      >
                        Enter password
                        <span 
                          style={{
                            display: 'inline-block',
                            width: '7px',
                            height: '18px',
                            fontFamily: '"IBM Plex Sans", sans-serif',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: 'rgba(196, 64, 64, 1)',
                            marginLeft: '2px',
                          }}
                        >
                          *
                        </span>
                      </label>
                      <button 
                        type="button"
                        onClick={() => switchView('forgot')}
                        style={{
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? '12px' : '16px',
                          color: 'rgba(89, 153, 255, 1)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div 
                      className="flex items-center"
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: isMobile ? '42px' : '53px',
                        borderRadius: '4px',
                        border: passwordError ? '1px solid rgba(229, 62, 62, 1)' : '1px solid rgba(204, 204, 204, 1)',
                        background: 'rgba(255, 255, 255, 1)',
                        paddingRight: '12px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError(false);
                        }}
                        style={{
                          flex: 1,
                          height: '100%',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          padding: '0 12px',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? '14px' : '20px',
                          color: 'rgba(43, 43, 43, 1)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-700 p-1.5 focus:outline-none transition cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p 
                        style={{
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: '12px',
                          color: 'rgba(229, 62, 62, 1)',
                          margin: '4px 0 0 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        Password is incorrect. Please check your credentials and try again.
                      </p>
                    )}
                  </div>

                  {/* Action Block */}
                  <div 
                    style={{
                      width: '100%', maxWidth: '492px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto',
                      paddingTop: '4px',
                    }}
                  >
                    <button 
                      type="submit" disabled={loading}
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: isMobile ? '44px' : '60px',
                        background: 'rgba(29, 73, 62, 1)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        padding: isMobile ? '10px 16px' : '16px 32px',
                        gap: '8px',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 600,
                        fontSize: isMobile ? '14px' : '18px',
                        lineHeight: '100%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        boxSizing: 'border-box',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#173A31'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(29, 73, 62, 1)'; }}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Log In'}
                    </button>

                    <div 
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <p 
                        style={{
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? '13px' : '18px',
                          lineHeight: isMobile ? '20px' : '32px',
                          color: 'rgba(141, 141, 141, 1)',
                          margin: 0,
                        }}
                      >
                        Not registered yet?{' '}
                        <button 
                          type="button"
                          onClick={() => switchView('signup')}
                          style={{
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 500,
                            fontSize: isMobile ? '13px' : '18px',
                            lineHeight: isMobile ? '20px' : '32px',
                            color: 'rgba(29, 73, 62, 1)',
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            textDecoration: 'underline',
                          }}
                        >
                          Create an account
                        </button>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {view === 'signup' && (
              <div className="w-full">
                <form onSubmit={handleEmailSignup} className="space-y-2.5 md:space-y-3.5">
                  <div className="space-y-1">
                    <label 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        height: isMobile ? '18px' : '23px',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: isMobile ? '13px' : '18px',
                        lineHeight: '100%',
                        color: 'rgba(43, 43, 43, 1)',
                        margin: 0,
                      }}
                    >
                      Full name
                      <span 
                        style={{
                          display: 'inline-block',
                          width: '7px',
                          height: '18px',
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: 'rgba(196, 64, 64, 1)',
                          marginLeft: '2px',
                        }}
                      >
                        *
                      </span>
                    </label>
                    <input 
                      type="text" required placeholder="Enter your name" value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: isMobile ? '42px' : '53px',
                        borderRadius: '4px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        background: 'rgba(255, 255, 255, 1)',
                        padding: '0 12px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: isMobile ? '14px' : '20px',
                        color: 'rgba(43, 43, 43, 1)',
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        height: isMobile ? '18px' : '23px',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: isMobile ? '13px' : '18px',
                        lineHeight: '100%',
                        color: 'rgba(43, 43, 43, 1)',
                        margin: 0,
                      }}
                    >
                      Email ID
                      <span 
                        style={{
                          display: 'inline-block',
                          width: '7px',
                          height: '18px',
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: 'rgba(196, 64, 64, 1)',
                          marginLeft: '2px',
                        }}
                      >
                        *
                      </span>
                    </label>
                    <input 
                      type="email" required placeholder="Enter your email ID" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: isMobile ? '42px' : '53px',
                        borderRadius: '4px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        background: 'rgba(255, 255, 255, 1)',
                        padding: '0 12px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: isMobile ? '14px' : '20px',
                        color: 'rgba(43, 43, 43, 1)',
                      }}
                    />
                  </div>

                  {/* Enter Mobile Number Field with Inline Verify OTP trigger */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center" style={{ width: '100%', maxWidth: '492px' }}>
                      <label 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          height: isMobile ? '18px' : '23px',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? '13px' : '18px',
                          lineHeight: '100%',
                          color: 'rgba(43, 43, 43, 1)',
                          margin: 0,
                        }}
                      >
                        Enter mobile number
                        <span 
                          style={{
                            display: 'inline-block',
                            width: '7px',
                            height: '18px',
                            fontFamily: '"IBM Plex Sans", sans-serif',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: 'rgba(196, 64, 64, 1)',
                            marginLeft: '2px',
                          }}
                        >
                          *
                        </span>
                      </label>
                      {isPhoneVerified && (
                        <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Verified
                        </span>
                      )}
                    </div>
                    <div 
                      className="flex items-center"
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: isMobile ? '42px' : '53px',
                        borderRadius: '4px',
                        border: isPhoneVerified ? '1px solid #10B981' : '1px solid rgba(204, 204, 204, 1)',
                        background: 'rgba(255, 255, 255, 1)',
                        overflow: 'hidden',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div 
                        style={{
                          height: '100%',
                          padding: isMobile ? '0 10px' : '0 16px',
                          background: 'rgba(240, 240, 240, 1)',
                          borderRight: '1px solid rgba(204, 204, 204, 1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? '14px' : '20px',
                          color: 'rgba(43, 43, 43, 1)',
                          userSelect: 'none',
                        }}
                      >
                        +91
                      </div>
                      <input 
                        type="tel" required pattern="[0-9]{10}" maxLength={10} placeholder="Enter mobile number" value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ''));
                          if (isPhoneVerified) setIsPhoneVerified(false);
                        }}
                        style={{
                          flex: 1,
                          height: '100%',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          padding: '0 12px',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? '14px' : '20px',
                          color: 'rgba(43, 43, 43, 1)',
                        }}
                      />
                      {!isPhoneVerified && phone.length === 10 && (
                        <button
                          type="button"
                          onClick={handleTriggerInlineOtp}
                          style={{
                            height: '100%',
                            padding: '0 12px',
                            background: 'rgba(29, 73, 62, 1)',
                            color: '#FFFFFF',
                            border: 'none',
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 600,
                            fontSize: isMobile ? '12px' : '14px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'background-color 0.2s',
                          }}
                          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#173A31'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(29, 73, 62, 1)'; }}
                        >
                          Verify OTP
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Create Password Input Box */}
                  <div className="space-y-1">
                    <label 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '2px',
                        height: isMobile ? '18px' : '23px',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: isMobile ? '13px' : '18px',
                        lineHeight: '100%',
                        color: 'rgba(43, 43, 43, 1)',
                        margin: 0,
                      }}
                    >
                      Set account password
                      <span 
                        style={{
                          display: 'inline-block',
                          width: '7px',
                          height: '18px',
                          fontFamily: '"IBM Plex Sans", sans-serif',
                          fontWeight: 400,
                          fontSize: '14px',
                          lineHeight: '100%',
                          color: 'rgba(196, 64, 64, 1)',
                          marginLeft: '2px',
                        }}
                      >
                        *
                      </span>
                    </label>
                    <div 
                      className="flex items-center"
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: isMobile ? '42px' : '53px',
                        borderRadius: '4px',
                        border: passwordError ? '1px solid rgba(229, 62, 62, 1)' : '1px solid rgba(204, 204, 204, 1)',
                        background: 'rgba(255, 255, 255, 1)',
                        paddingRight: '12px',
                        boxSizing: 'border-box',
                      }}
                    >
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="Set your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (passwordError) setPasswordError(false);
                        }}
                        onFocus={() => setIsPasswordFocused(true)}
                        onBlur={() => setIsPasswordFocused(false)}
                        style={{
                          flex: 1,
                          height: '100%',
                          border: 'none',
                          outline: 'none',
                          background: 'transparent',
                          padding: '0 12px',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? '14px' : '20px',
                          color: 'rgba(43, 43, 43, 1)',
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-slate-700 p-1.5 focus:outline-none transition cursor-pointer"
                        title={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p 
                        style={{
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: '12px',
                          color: 'rgba(229, 62, 62, 1)',
                          margin: '4px 0 0 0',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <AlertCircle className="w-3.5 h-3.5" />
                        Password must be at least 8 characters with 1 capital letter, 1 number, and 1 special character.
                      </p>
                    )}
                    {/* Password Policy Realtime Indicators (Single Line) */}
                    {(isPasswordFocused || password.length > 0) && (
                      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-0.5 pt-1" style={{ width: '100%', maxWidth: '492px' }}>
                        <div className={`flex items-center gap-1 text-[11px] md:text-[12px] ${password.length >= 8 ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          <Check className={`w-3 h-3 ${password.length >= 8 ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>At least 8 characters</span>
                        </div>
                        <div className={`flex items-center gap-1 text-[11px] md:text-[12px] ${/[A-Z]/.test(password) ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          <Check className={`w-3 h-3 ${/[A-Z]/.test(password) ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>1 capital letter (A-Z)</span>
                        </div>
                        <div className={`flex items-center gap-1 text-[11px] md:text-[12px] ${/[0-9]/.test(password) ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          <Check className={`w-3 h-3 ${/[0-9]/.test(password) ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>1 number (0-9)</span>
                        </div>
                        <div className={`flex items-center gap-1 text-[11px] md:text-[12px] ${/[^A-Za-z0-9]/.test(password) ? 'text-emerald-600 font-semibold' : 'text-slate-400'}`}>
                          <Check className={`w-3 h-3 ${/[^A-Za-z0-9]/.test(password) ? 'text-emerald-600' : 'text-slate-300'}`} />
                          <span>1 special character (@#$!)</span>
                        </div>
                      </div>
                    )}
                  </div>

                    {/* Action Block */}
                    <div 
                      style={{
                        width: '100%', maxWidth: '492px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto',
                        paddingTop: '4px',
                      }}
                    >
                      <button 
                        type="submit" disabled={loading}
                        style={{
                          width: '100%', maxWidth: '492px',
                          height: isMobile ? '44px' : '60px',
                          background: 'rgba(29, 73, 62, 1)',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '4px',
                          padding: isMobile ? '10px 16px' : '16px 32px',
                          gap: '8px',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 600,
                          fontSize: isMobile ? '14px' : '18px',
                          lineHeight: '100%',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'background-color 0.2s',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                          boxSizing: 'border-box',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#173A31'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(29, 73, 62, 1)'; }}
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                      </button>

                      <div 
                        style={{
                          height: isMobile ? '24px' : '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <p 
                          style={{
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 500,
                            fontSize: isMobile ? '13px' : '18px',
                            lineHeight: isMobile ? '20px' : '32px',
                            color: 'rgba(141, 141, 141, 1)',
                            margin: 0,
                          }}
                        >
                          Already have an account?{' '}
                          <button 
                            type="button"
                            onClick={() => switchView('login')}
                            style={{
                              fontFamily: '"Faktum", "Outfit", sans-serif',
                              fontWeight: 500,
                              fontSize: isMobile ? '13px' : '18px',
                              lineHeight: isMobile ? '20px' : '32px',
                              color: 'rgba(29, 73, 62, 1)',
                              background: 'none',
                              border: 'none',
                              padding: 0,
                              cursor: 'pointer',
                              textDecoration: 'underline',
                            }}
                          >
                            Log In
                          </button>
                        </p>
                      </div>
                    </div>
                  </form>
              </div>
            )}

            {/* C. ENTER MOBILE NUMBER & OTP VERIFY VIEW */}
            {view === 'mobile_otp' && (
              <div className="space-y-4">
                {!otpSent ? (
                  /* Step 1: Enter Mobile Number */
                  <form onSubmit={handleMobileRequest} className="space-y-4">
                    <div className="space-y-1">
                      <label 
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '2px',
                          height: isMobile ? '18px' : '23px',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: isMobile ? '13px' : '18px',
                          lineHeight: '100%',
                          color: 'rgba(43, 43, 43, 1)',
                          margin: 0,
                        }}
                      >
                        Enter mobile number
                        <span 
                          style={{
                            display: 'inline-block',
                            width: '7px',
                            height: '18px',
                            fontFamily: '"IBM Plex Sans", sans-serif',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '100%',
                            color: 'rgba(196, 64, 64, 1)',
                            marginLeft: '2px',
                          }}
                        >
                          *
                        </span>
                      </label>
                      <div 
                        className="flex items-center"
                        style={{
                          width: '100%', maxWidth: '492px',
                          height: isMobile ? '42px' : '53px',
                          borderRadius: '4px',
                          border: '1px solid rgba(204, 204, 204, 1)',
                          background: 'rgba(255, 255, 255, 1)',
                          overflow: 'hidden',
                          boxSizing: 'border-box',
                        }}
                      >
                        <div 
                          style={{
                            height: '100%',
                            padding: isMobile ? '0 10px' : '0 16px',
                            background: 'rgba(240, 240, 240, 1)',
                            borderRight: '1px solid rgba(204, 204, 204, 1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 500,
                            fontSize: isMobile ? '14px' : '20px',
                            color: 'rgba(43, 43, 43, 1)',
                            userSelect: 'none',
                          }}
                        >
                          +91
                        </div>
                        <input 
                          type="tel" required pattern="[0-9]{10}" maxLength={10} placeholder="Enter 10-digit mobile number" value={phone}
                          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                          style={{
                            flex: 1,
                            height: '100%',
                            border: 'none',
                            outline: 'none',
                            background: 'transparent',
                            padding: '0 12px',
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 500,
                            fontSize: isMobile ? '14px' : '20px',
                            color: 'rgba(43, 43, 43, 1)',
                          }}
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" disabled={loading}
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: isMobile ? '44px' : '60px',
                        background: 'rgba(29, 73, 62, 1)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 600,
                        fontSize: isMobile ? '14px' : '18px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'background-color 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#173A31'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(29, 73, 62, 1)'; }}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Get OTP'}
                    </button>

                    <div className="flex justify-center pt-2">
                      <button 
                        type="button" 
                        onClick={() => switchView('login')}
                        style={{
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: '16px',
                          color: 'rgba(29, 73, 62, 1)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        }}
                      >
                        Log in with Password instead
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Step 2: Enter 6-Digit OTP Code */
                  <form onSubmit={handleOtpVerify} className="space-y-6">
                    <div className="space-y-2">
                      <label 
                        style={{
                          display: 'block',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: '18px',
                          lineHeight: '100%',
                          color: 'rgba(43, 43, 43, 1)',
                          margin: 0,
                        }}
                      >
                        Enter OTP
                      </label>
                      <p 
                        style={{
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: '16px',
                          lineHeight: '100%',
                          margin: 0,
                        }}
                      >
                        <span style={{ color: 'rgba(141, 141, 141, 1)' }}>Sent to </span>
                        <span style={{ color: 'rgba(89, 153, 255, 1)' }}>+91 {phone}</span>
                      </p>
                      
                      {/* 6-Digit OTP Box Grid */}
                      <div 
                        style={{
                          width: '100%', maxWidth: '492px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          gap: '12px',
                          marginTop: '16px',
                          marginBottom: '16px',
                        }}
                      >
                        {otp.map((digit, index) => (
                          <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(e.target, index)}
                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                            style={{
                              width: '68px',
                              height: '60px',
                              textAlign: 'center',
                              fontFamily: '"Faktum", "Outfit", sans-serif',
                              fontSize: '24px',
                              fontWeight: 500,
                              color: 'rgba(43, 43, 43, 1)',
                              border: digit ? '1px solid rgba(29, 73, 62, 1)' : '1px solid rgba(204, 204, 204, 1)',
                              borderRadius: '4px',
                              outline: 'none',
                              background: '#FFFFFF',
                              boxSizing: 'border-box',
                              transition: 'border-color 0.2s',
                            }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(29, 73, 62, 1)'; }}
                            onBlur={(e) => { if (!digit) e.currentTarget.style.borderColor = 'rgba(204, 204, 204, 1)'; }}
                          />
                        ))}
                      </div>
                    </div>

                    <div 
                      style={{
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '100%',
                      }}
                    >
                      {otpCountdown > 0 ? (
                        <p style={{ margin: 0 }}>
                          <span style={{ color: 'rgba(141, 141, 141, 1)' }}>Resend OTP in </span>
                          <span style={{ color: 'rgba(89, 153, 255, 1)' }}>0:{otpCountdown < 10 ? `0${otpCountdown}` : otpCountdown}</span>
                        </p>
                      ) : (
                        <button 
                          type="button" 
                          onClick={() => { setOtpCountdown(30); setSuccessMsg('OTP code re-sent successfully.'); }}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            color: 'rgba(89, 153, 255, 1)',
                            cursor: 'pointer',
                            textDecoration: 'underline',
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 500,
                            fontSize: '16px',
                          }}
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>

                    <button 
                      type="submit" disabled={loading}
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: '60px',
                        background: 'rgba(29, 73, 62, 1)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        paddingTop: '16px',
                        paddingRight: '32px',
                        paddingBottom: '16px',
                        paddingLeft: '32px',
                        gap: '8px',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 600,
                        fontSize: '18px',
                        lineHeight: '100%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        boxSizing: 'border-box',
                        transition: 'background-color 0.2s',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#173A31'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(29, 73, 62, 1)'; }}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* D. TRADITIONAL EMAIL/PASSWORD LOGIN */}
            {view === 'email_login' && (
              <div className="space-y-6">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-800">Email Address</label>
                    <input 
                      type="email" required placeholder="Enter your email ID" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: '53px',
                        borderRadius: '4px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        background: 'rgba(255, 255, 255, 1)',
                        padding: '0 16px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'rgba(43, 43, 43, 1)',
                      }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-semibold text-slate-800">Password</label>
                      <button 
                        type="button" onClick={() => setView('forgot')}
                        className="text-[9px] font-black uppercase text-[#E05434] hover:underline cursor-pointer"
                      >
                        Forgot?
                      </button>
                    </div>
                    <input 
                      type="password" required placeholder="••••••••" value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: '53px',
                        borderRadius: '4px',
                        border: '1px solid rgba(204, 204, 204, 1)',
                        background: 'rgba(255, 255, 255, 1)',
                        padding: '0 16px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 500,
                        fontSize: '20px',
                        color: 'rgba(43, 43, 43, 1)',
                      }}
                    />
                  </div>

                  <button 
                    type="submit" disabled={loading}
                    style={{
                      width: '100%', maxWidth: '492px',
                      height: '60px',
                      background: 'rgba(29, 73, 62, 1)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '4px',
                      paddingTop: '16px',
                      paddingRight: '32px',
                      paddingBottom: '16px',
                      paddingLeft: '32px',
                      gap: '8px',
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 600,
                      fontSize: '18px',
                      lineHeight: '100%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                      boxSizing: 'border-box',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#173A31'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(29, 73, 62, 1)'; }}
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
                  </button>
                </form>

                <div className="text-center">
                  <button 
                    onClick={() => setView('login')}
                    className="text-xs font-black text-[#1D493E] hover:underline cursor-pointer block mx-auto"
                  >
                    Back to Mobile Number Login
                  </button>
                </div>
              </div>
            )}

            {/* E. FORGOT PASSWORD VIEW */}
            {view === 'forgot' && (
              <div className="space-y-6">
                {forgotStep === 'input' ? (
                  <form onSubmit={handleForgotSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-800">Email Address or Mobile Number</label>
                      <input 
                        type="text" required placeholder="Enter registered Email or 10-digit Mobile" value={email || phone}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val.includes('@') || /[a-zA-Z]/.test(val)) {
                            setEmail(val);
                          } else {
                            setPhone(val);
                            setEmail(val);
                          }
                        }}
                        style={{
                          width: '100%', maxWidth: '492px',
                          height: '53px',
                          borderRadius: '4px',
                          border: '1px solid rgba(204, 204, 204, 1)',
                          background: 'rgba(255, 255, 255, 1)',
                          padding: '0 16px',
                          outline: 'none',
                          boxSizing: 'border-box',
                          fontFamily: '"Faktum", "Outfit", sans-serif',
                          fontWeight: 500,
                          fontSize: '18px',
                          color: 'rgba(43, 43, 43, 1)',
                        }}
                      />
                    </div>

                    <button 
                      type="submit" disabled={loading}
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: '60px',
                        background: 'rgba(29, 73, 62, 1)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        paddingTop: '16px',
                        paddingRight: '32px',
                        paddingBottom: '16px',
                        paddingLeft: '32px',
                        gap: '8px',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 600,
                        fontSize: '18px',
                        lineHeight: '100%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        boxSizing: 'border-box',
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#173A31'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(29, 73, 62, 1)'; }}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify Account'}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-800">Enter New Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'} required placeholder="Enter new strong password" value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          style={{
                            width: '100%', maxWidth: '492px',
                            height: '53px',
                            borderRadius: '4px',
                            border: '1px solid rgba(204, 204, 204, 1)',
                            background: 'rgba(255, 255, 255, 1)',
                            padding: '0 16px',
                            outline: 'none',
                            boxSizing: 'border-box',
                            fontFamily: '"Faktum", "Outfit", sans-serif',
                            fontWeight: 500,
                            fontSize: '18px',
                            color: 'rgba(43, 43, 43, 1)',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Must be at least 8 chars with 1 uppercase letter, 1 number & 1 special character.</p>
                    </div>

                    <button 
                      type="submit" disabled={loading}
                      style={{
                        width: '100%', maxWidth: '492px',
                        height: '60px',
                        background: 'rgba(29, 73, 62, 1)',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '4px',
                        paddingTop: '16px',
                        paddingRight: '32px',
                        paddingBottom: '16px',
                        paddingLeft: '32px',
                        gap: '8px',
                        fontFamily: '"Faktum", "Outfit", sans-serif',
                        fontWeight: 600,
                        fontSize: '18px',
                        lineHeight: '100%',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        boxSizing: 'border-box',
                      }}
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Set New Password'}
                    </button>
                  </form>
                )}

                <div className="text-center">
                  <button 
                    onClick={() => { setForgotStep('input'); setView('email_login'); }}
                    className="text-xs font-black text-[#1D493E] hover:underline cursor-pointer block mx-auto"
                  >
                    Back to Log In
                  </button>
                </div>
              </div>
            )}

            {/* Divider "or" (shown on all views except forgot password) */}
            {view !== 'forgot' && (
              <div 
                style={{
                  width: '100%', maxWidth: '492px',
                  height: '103px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  boxSizing: 'border-box',
                }}
              >
                {/* Divider "or" (Figma specs: height 19px) */}
                <div 
                  style={{
                    width: '100%', maxWidth: '492px',
                    height: '19px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <div className="flex-1 border-t border-slate-200" />
                  <span className="px-3 text-sm text-slate-400 font-medium lowercase">or</span>
                  <div className="flex-1 border-t border-slate-200" />
                </div>

                {/* Social Login Buttons (Figma specs: height 60px) */}
                <div 
                  style={{
                    width: '100%', maxWidth: '492px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '12px',
                  }}
                >
                  <button 
                    type="button" onClick={handleGoogleLogin}
                    style={{
                      height: isMobile ? '42px' : '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: '1px solid rgba(204, 204, 204, 0.54)',
                      borderRadius: '4px',
                      background: '#FFFFFF',
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: isMobile ? '13px' : '14px',
                      color: 'rgba(43, 43, 43, 1)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8F9FA'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                  >
                    <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-4 h-4 md:w-5 md:h-5" alt="Google Logo" />
                    <span>Google</span>
                  </button>

                  <button 
                    type="button" onClick={handleFacebookLogin}
                    style={{
                      height: isMobile ? '42px' : '56px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      border: '1px solid rgba(204, 204, 204, 0.54)',
                      borderRadius: '4px',
                      background: '#FFFFFF',
                      fontFamily: '"Faktum", "Outfit", sans-serif',
                      fontWeight: 500,
                      fontSize: isMobile ? '13px' : '14px',
                      color: 'rgba(43, 43, 43, 1)',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F8F9FA'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
                  >
                    <img src="https://www.svgrepo.com/show/475647/facebook-color.svg" className="w-4 h-4 md:w-5 md:h-5" alt="Facebook Logo" />
                    <span>Facebook</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Footer branding (Figma specs: width 492, height 54.3px, gap 8px) */}
          <div 
            style={{
              width: '100%', maxWidth: '492px',
              height: '54.3px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 'auto',
              boxSizing: 'border-box',
            }}
          >
            {/* Logo Brand Footer (Figma specs: width 128px, height 28.3px) */}
            <div 
              style={{
                width: '128px',
                height: '28.3px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img 
                src="/logo.png" 
                alt="Go Banjara Logo" 
                style={{ 
                  width: '128px', 
                  height: '28.3px',
                  objectFit: 'contain'
                }} 
              />
            </div>
            <p 
              style={{
                width: '100%', maxWidth: '492px',
                height: '18px',
                fontFamily: '"Faktum", "Outfit", sans-serif',
                fontWeight: 500,
                fontSize: '14px',
                color: 'rgba(141, 141, 141, 1)',
                textAlign: 'center',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              © 2026 GO Banjara by TRD Studios. All rights reserved.
            </p>
          </div>

        </div>

        {/* RIGHT COLUMN: BRAND MASCOT CARD */}
        <div 
          className="hidden md:flex flex-col justify-center items-center text-center select-none flex-shrink-0 overflow-hidden"
          style={{
            width: '50%',
            maxWidth: '633px',
            alignSelf: 'stretch',
            flexDirection: 'column',
            gap: '24px',
            boxSizing: 'border-box',
            background: 'rgba(255, 252, 248, 1)',
            borderRadius: '8px',
            padding: '24px 20px',
          }}
        >
          
          {/* Figma Stacked Mascot Llama Hero — scaled to fit */}
          <div 
            className="relative select-none flex-shrink-0"
            style={{ 
              width: '100%',
              maxWidth: '420px',
              aspectRatio: '1 / 1',
              margin: '0 auto',
            }}
          >
            {/* 1. Back Gray Card */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '12px',
                background: 'rgba(204, 204, 204, 1)',
                zIndex: 1,
              }}
            />

            {/* 2. Front Tilted Mascot Image Card */}
            <div 
              className="absolute animate-fade-in"
              style={{
                top: '3%',
                left: '2%',
                width: '96%',
                height: '96%',
                borderRadius: '12px',
                overflow: 'hidden',
                transform: 'rotate(3deg)',
                transformOrigin: 'center center',
                boxShadow: '0px 27px 55px -13px rgba(0, 0, 0, 0.25)',
                zIndex: 2,
              }}
            >
              <img 
                src={bannerSlide === 0 ? "/llama_mascot.png" : "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80"} 
                className="w-full h-full object-cover transition-opacity duration-300" 
                style={{ borderRadius: '12px' }} 
                alt="Go Banjara Banner" 
              />
            </div>

            {/* Top-Left Circular Badge */}
            <div
              style={{
                position: 'absolute',
                top: '-7%',
                left: '7%',
                width: '17%',
                height: '17%',
                transform: 'rotate(15deg)',
                borderRadius: '50%',
                overflow: 'hidden',
                zIndex: 10,
                filter: 'drop-shadow(0px 6px 14px rgba(0, 0, 0, 0.22))',
              }}
            >
              <img 
                src="/naturally_nomad_badge.png" 
                alt="Naturally Nomad Badge" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  transform: 'scale(1.85)',
                  transformOrigin: 'center center',
                }}
              />
            </div>

            {/* Bottom-Right Circular Badge */}
            <div
              style={{
                position: 'absolute',
                bottom: '-5%',
                right: '-3%',
                width: '21%',
                height: '21%',
                borderRadius: '50%',
                overflow: 'hidden',
                zIndex: 10,
                filter: 'drop-shadow(0px 8px 18px rgba(0, 0, 0, 0.24))',
              }}
            >
              <img 
                src="/dare_to_travel_badge.png" 
                alt="Dare to Travel Badge" 
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  transform: 'scale(1.85)',
                  transformOrigin: 'center center',
                }}
              />
            </div>
          </div>

          {/* Description Text */}
          <div 
            style={{
              width: '100%',
              maxWidth: '480px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              alignItems: 'flex-start',
              justifyContent: 'center',
              padding: '0 8px',
            }}
          >
            <h3 
              style={{
                fontFamily: '"Faktum", "Outfit", sans-serif',
                fontWeight: 500,
                fontSize: '18px',
                lineHeight: '28px',
                color: 'rgba(43, 43, 43, 1)',
                margin: 0,
                textAlign: 'left',
              }}
            >
              {bannerSlide === 0 ? "Start Shopping Today" : "Explore Curated Trips"}
            </h3>
            <p 
              style={{
                fontFamily: '"Faktum", "Outfit", sans-serif',
                fontWeight: 500,
                fontSize: '15px',
                lineHeight: '22px',
                color: 'rgba(141, 141, 141, 1)',
                textAlign: 'left',
                margin: 0,
              }}
            >
              {bannerSlide === 0 ? (
                <>Get personalized shopping and customization experience.</>
              ) : (
                <>Discover authentic travel itineraries &amp; community expeditions.</>
              )}
            </p>
            
            {/* Dots Carousel Indicator */}
            <div 
              style={{
                gap: '8px',
                paddingTop: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                marginTop: '4px',
              }}
            >
              <button 
                type="button"
                onClick={() => setBannerSlide(0)}
                aria-label="Slide 1"
                style={{
                  width: bannerSlide === 0 ? '16px' : '12px',
                  height: '4px',
                  borderRadius: '2px',
                  background: bannerSlide === 0 ? 'rgba(29, 73, 62, 1)' : 'rgba(224, 224, 224, 1)',
                  display: 'inline-block',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
              <button 
                type="button"
                onClick={() => setBannerSlide(1)}
                aria-label="Slide 2"
                style={{
                  width: bannerSlide === 1 ? '16px' : '12px',
                  height: '4px',
                  borderRadius: '2px',
                  background: bannerSlide === 1 ? 'rgba(29, 73, 62, 1)' : 'rgba(224, 224, 224, 1)',
                  display: 'inline-block',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            </div>
          </div>

        </div>

      </div>

      {/* INLINE OTP VERIFICATION POPUP MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in select-none">
          <div 
            className="bg-white rounded-xl shadow-2xl p-6 space-y-4 border border-slate-200 animate-scale-in"
            style={{ width: '440px', maxWidth: '90vw' }}
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="font-faktum text-lg font-bold text-[#2B2B2B]">Verify Mobile Number</h3>
              <button 
                type="button" 
                onClick={() => setShowOtpModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-sm text-slate-600">
              Enter the 6-digit OTP code sent to <strong className="text-[#1D493E]">+91 {phone}</strong>
            </p>
            
            {/* 6-Digit OTP Box Grid */}
            <div className="flex justify-between gap-2 my-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target, index)}
                  onKeyDown={(e) => handleOtpKeyDown(e, index)}
                  style={{
                    width: '52px',
                    height: '52px',
                    textAlign: 'center',
                    fontFamily: '"Faktum", "Outfit", sans-serif',
                    fontSize: '22px',
                    fontWeight: 600,
                    color: 'rgba(43, 43, 43, 1)',
                    border: digit ? '1px solid rgba(29, 73, 62, 1)' : '1px solid rgba(204, 204, 204, 1)',
                    borderRadius: '6px',
                    outline: 'none',
                    background: '#FFFFFF',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(29, 73, 62, 1)'; }}
                  onBlur={(e) => { if (!digit) e.currentTarget.style.borderColor = 'rgba(204, 204, 204, 1)'; }}
                />
              ))}
            </div>

            <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
              {otpCountdown > 0 ? (
                <span>Resend OTP in <strong className="text-[#8D8D8D]">0:{otpCountdown < 10 ? `0${otpCountdown}` : otpCountdown}</strong></span>
              ) : (
                <button 
                  type="button" 
                  onClick={handleTriggerInlineOtp}
                  className="text-[#5999FF] font-medium underline cursor-pointer"
                >
                  Resend OTP
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleInlineOtpVerify}
              style={{
                width: '100%',
                height: '48px',
                background: 'rgba(29, 73, 62, 1)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '4px',
                fontFamily: '"Faktum", "Outfit", sans-serif',
                fontWeight: 600,
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                marginTop: '12px',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#173A31'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(29, 73, 62, 1)'; }}
            >
              Verify & Complete
            </button>
          </div>
        </div>
      )}

      {/* IN-APP GOOGLE SIGN-IN MODAL (PREVENTS REDIRECT_URI_MISMATCH POPUP ERRORS) */}
      {showGooglePrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-[99999] p-4 text-left font-sans">
          <div className="bg-white border border-[#E5E0D5] rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 relative">
            <button
              type="button"
              onClick={() => setShowGooglePrompt(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 font-bold text-sm cursor-pointer p-1"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center space-y-2 pt-2">
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google G Logo"
                className="w-10 h-10"
              />
              <h3 className="text-xl font-bold text-[#2B2B2B]">Sign in with Google</h3>
              <p className="text-xs text-slate-500 max-w-xs">
                To continue to <strong className="text-[#1D493E]">Go Banjara</strong>, confirm your Google Account email.
              </p>
            </div>

            <form onSubmit={handleExecuteGoogleQuickLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-[#1D493E] uppercase tracking-wider block">Google Email ID</label>
                <input
                  type="email"
                  required
                  value={googlePromptEmail}
                  onChange={(e) => setGooglePromptEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full p-3.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] font-semibold focus:outline-none focus:border-[#1D493E]"
                />
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {loading ? 'Signing in...' : 'Continue as Google User'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowGooglePrompt(false)}
                  className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-slate-600 rounded-xl text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
