'use client';

import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, Phone, Mail, User, Clock, Compass, Check, ChevronLeft, ChevronRight, ShieldCheck } from 'lucide-react';
import { HOLIDAY_PACKAGES } from '@/data/packages';

export default function ConnectTeamModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(26); // Default 26 Jul 2026
  const [currentMonth, setCurrentMonth] = useState('July 2026');
  
  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTour, setSelectedTour] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');
  const [message, setMessage] = useState('');
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Auto-open popup on page load after 3.5 seconds if not seen in current session
  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('go_banjara_callback_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        sessionStorage.setItem('go_banjara_callback_seen', 'true');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaChecked) {
      alert('Please complete the verification check before submitting.');
      return;
    }
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setIsOpen(false);
    }, 2500);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 999,
          background: 'rgba(29, 73, 62, 1)',
          color: '#FFFFFF',
          padding: '12px 20px',
          borderRadius: '50px',
          boxShadow: '0 10px 25px -5px rgba(29, 73, 62, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: 'Faktum, var(--font-sans), sans-serif',
          fontWeight: 600,
          fontSize: '14px',
          border: '1.5px solid rgba(255, 98, 62, 0.5)',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className="hover:scale-105 active:scale-95 group"
        aria-label="Request Callback"
      >
        <div className="w-8 h-8 rounded-full bg-[#FF623E] flex items-center justify-center text-white shrink-0 shadow-xs">
          <Phone className="w-4 h-4" />
        </div>
        <span>Connect with Team</span>
      </button>
    );
  }

  // Days in July 2026 calendar matrix (Starts Wednesday)
  const calendarDays = [
    null, null, 1, 2, 3, 4, 5,
    6, 7, 8, 9, 10, 11, 12,
    13, 14, 15, 16, 17, 18, 19,
    20, 21, 22, 23, 24, 25, 26,
    27, 28, 29, 30, 31
  ];

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
      }}
      className="animate-in fade-in duration-300"
    >
      {/* Modal Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '920px',
          background: '#FFFFFF',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          flexDirection: 'row',
          position: 'relative',
        }}
        className="flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden"
      >
        {/* Close Button Top Right */}
        <button
          onClick={() => setIsOpen(false)}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 30,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#2B2B2B',
            transition: 'background-color 0.2s ease',
          }}
          className="hover:bg-gray-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── LEFT PANEL: Calendar & Brand Accent (Go Banjara Deep Forest Green) ── */}
        <div
          style={{
            width: '100%',
            maxWidth: '380px',
            background: '#1D493E',
            color: '#FFFFFF',
            padding: '36px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            position: 'relative',
          }}
          className="w-full md:w-[380px] shrink-0"
        >
          {/* Header Title */}
          <div className="space-y-1.5 text-center">
            <h2
              style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '30px',
                fontWeight: 600,
                color: '#FFFFFF',
                margin: 0,
                lineHeight: '1.2',
              }}
            >
              Connect with Team
            </h2>
            <p
              style={{
                fontFamily: 'Faktum, var(--font-sans), sans-serif',
                fontSize: '15px',
                color: 'rgba(255, 255, 255, 0.85)',
                margin: 0,
                fontWeight: 500,
              }}
            >
              Choose a date for callback
            </p>
          </div>

          {/* Interactive Mini Calendar Box */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '12px',
              padding: '20px 16px',
              color: '#2B2B2B',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            }}
          >
            {/* Calendar Month Header */}
            <div className="flex items-center justify-between mb-4 px-2">
              <button 
                type="button" 
                className="p-1 rounded hover:bg-gray-100 text-gray-600 transition"
                onClick={() => {}}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span 
                style={{ fontFamily: 'Fraunces, Georgia, serif' }} 
                className="font-bold text-base text-[#1D493E]"
              >
                {currentMonth}
              </span>
              <button 
                type="button" 
                className="p-1 rounded hover:bg-gray-100 text-gray-600 transition"
                onClick={() => {}}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Weekdays Row */}
            <div className="grid grid-cols-7 text-center gap-1 mb-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <span 
                  key={day} 
                  style={{ fontFamily: 'Faktum, var(--font-sans), sans-serif' }}
                  className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider"
                >
                  {day}
                </span>
              ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="h-8" />;
                }
                const isSelected = selectedDate === day;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    style={{
                      height: '32px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontFamily: 'Faktum, var(--font-sans), sans-serif',
                      fontSize: '13px',
                      fontWeight: isSelected ? 700 : 500,
                      background: isSelected ? '#FF623E' : 'transparent',
                      color: isSelected ? '#FFFFFF' : '#2B2B2B',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    className={!isSelected ? 'hover:bg-gray-100' : ''}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Summary */}
          <div className="bg-[#15342c] p-3.5 rounded-lg border border-[#23584b] flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF623E] flex items-center justify-center shrink-0">
              <CalendarIcon className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-white/70 font-semibold m-0">Scheduled Callback Date</p>
              <p className="text-sm font-bold text-white m-0">{selectedDate} July, 2026</p>
            </div>
          </div>

          {/* Guarantee Badge */}
          <div className="flex items-center gap-2 text-xs text-white/80 mt-auto justify-center">
            <ShieldCheck className="w-4 h-4 text-[#FF623E]" />
            <span>Guaranteed 100% Confidential Callback</span>
          </div>
        </div>

        {/* ── RIGHT PANEL: Form Inputs ── */}
        <div
          style={{
            flex: 1,
            padding: '36px 32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            backgroundColor: '#FFFFFF',
          }}
        >
          {isSubmitted ? (
            <div className="my-auto text-center space-y-4 py-12">
              <div className="w-16 h-16 rounded-full bg-[#1D493E]/10 text-[#1D493E] flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 
                style={{ fontFamily: 'Fraunces, Georgia, serif' }} 
                className="text-2xl font-bold text-[#1D493E] m-0"
              >
                Callback Scheduled!
              </h3>
              <p className="text-sm text-gray-600 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-gray-900">{fullName || 'Wanderer'}</span>! Our travel expert will call you on <span className="font-semibold text-[#FF623E]">{selectedDate} July 2026</span> during your preferred time ({preferredTime}).
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Row 1: Full Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1 text-left">
                  <label style={{ fontFamily: 'Faktum, sans-serif' }} className="text-xs font-semibold text-gray-700 block">
                    Full Name*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Enter full name"
                      style={{
                        width: '100%',
                        height: '42px',
                        borderBottom: '1.5px solid #E2E8F0',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        fontSize: '14px',
                        color: '#1A202C',
                        outline: 'none',
                        background: 'transparent',
                        padding: '0 4px',
                      }}
                      className="focus:border-[#1D493E] transition-colors placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-1 text-left">
                  <label style={{ fontFamily: 'Faktum, sans-serif' }} className="text-xs font-semibold text-gray-700 block">
                    Email*
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    style={{
                      width: '100%',
                      height: '42px',
                      borderBottom: '1.5px solid #E2E8F0',
                      borderTop: 'none',
                      borderLeft: 'none',
                      borderRight: 'none',
                      fontSize: '14px',
                      color: '#1A202C',
                      outline: 'none',
                      background: 'transparent',
                      padding: '0 4px',
                    }}
                    className="focus:border-[#1D493E] transition-colors placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Row 2: Phone & Pick a Tour */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Phone */}
                <div className="space-y-1 text-left">
                  <label style={{ fontFamily: 'Faktum, sans-serif' }} className="text-xs font-semibold text-gray-700 block">
                    Phone*
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700 shrink-0 pb-1">+91 (India)</span>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      style={{
                        width: '100%',
                        height: '42px',
                        borderBottom: '1.5px solid #E2E8F0',
                        borderTop: 'none',
                        borderLeft: 'none',
                        borderRight: 'none',
                        fontSize: '14px',
                        color: '#1A202C',
                        outline: 'none',
                        background: 'transparent',
                        padding: '0 4px',
                      }}
                      className="focus:border-[#1D493E] transition-colors placeholder:text-gray-400"
                    />
                  </div>
                </div>

                {/* Pick a Tour */}
                <div className="space-y-1 text-left">
                  <label style={{ fontFamily: 'Faktum, sans-serif' }} className="text-xs font-semibold text-gray-700 block">
                    Pick a Tour*
                  </label>
                  <select
                    required
                    value={selectedTour}
                    onChange={(e) => setSelectedTour(e.target.value)}
                    style={{
                      width: '100%',
                      height: '42px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      padding: '0 12px',
                      fontSize: '14px',
                      color: selectedTour ? '#1A202C' : '#9CA3AF',
                      outline: 'none',
                      background: '#FFFFFF',
                    }}
                    className="focus:border-[#1D493E] transition-colors cursor-pointer"
                  >
                    <option value="" disabled>Choose Tour</option>
                    {HOLIDAY_PACKAGES.map((pkg) => (
                      <option key={pkg.id} value={pkg.name}>
                        {pkg.name} ({pkg.duration})
                      </option>
                    ))}
                    <option value="Custom Group Tour">Custom Tailored Tour</option>
                  </select>
                </div>
              </div>

              {/* Row 3: Preferred Time to Call */}
              <div className="space-y-1 text-left pt-2">
                <label style={{ fontFamily: 'Faktum, sans-serif' }} className="text-xs font-semibold text-gray-700 block">
                  Preferred Time to Call*
                </label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  style={{
                    width: '100%',
                    height: '42px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    padding: '0 12px',
                    fontSize: '14px',
                    color: '#1A202C',
                    outline: 'none',
                    background: '#FFFFFF',
                  }}
                  className="focus:border-[#1D493E] transition-colors cursor-pointer"
                >
                  <option value="10:00 AM - 12:00 PM">Morning (10:00 AM - 12:00 PM)</option>
                  <option value="12:00 PM - 03:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                  <option value="03:00 PM - 06:00 PM">Evening (03:00 PM - 06:00 PM)</option>
                  <option value="06:00 PM - 09:00 PM">Night (06:00 PM - 09:00 PM)</option>
                </select>
              </div>

              {/* Row 4: Message */}
              <div className="space-y-1 text-left pt-2">
                <label style={{ fontFamily: 'Faktum, sans-serif' }} className="text-xs font-semibold text-gray-700 block">
                  Message*
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message or travel preferences..."
                  style={{
                    width: '100%',
                    borderBottom: '1.5px solid #E2E8F0',
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    fontSize: '14px',
                    color: '#1A202C',
                    outline: 'none',
                    background: 'transparent',
                    padding: '4px',
                    resize: 'none',
                  }}
                  className="focus:border-[#1D493E] transition-colors placeholder:text-gray-400"
                />
              </div>

              {/* Row 5: reCAPTCHA & Submit Button */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4">
                
                {/* Simulated reCAPTCHA Widget */}
                <div
                  onClick={() => setCaptchaChecked(!captchaChecked)}
                  style={{
                    border: '1px solid #D1D5DB',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    background: '#F9FAFB',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    cursor: 'pointer',
                    userSelect: 'none',
                  }}
                  className="hover:border-gray-400 transition"
                >
                  <div
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '3px',
                      border: captchaChecked ? 'none' : '2px solid #9CA3AF',
                      background: captchaChecked ? '#1D493E' : '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {captchaChecked && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </div>
                  <span className="text-xs font-medium text-gray-700">I&apos;m not a robot</span>
                  <div className="ml-auto text-right text-[9px] text-gray-400 leading-tight">
                    <span className="block font-bold text-gray-500">reCAPTCHA</span>
                    <span>Privacy - Terms</span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  style={{
                    background: '#1D493E',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 28px',
                    fontFamily: 'Faktum, var(--font-sans), sans-serif',
                    fontWeight: 700,
                    fontSize: '15px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(29, 73, 62, 0.25)',
                    transition: 'all 0.2s ease',
                  }}
                  className="hover:bg-[#15342c] active:scale-95 text-center"
                >
                  Send Message
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
