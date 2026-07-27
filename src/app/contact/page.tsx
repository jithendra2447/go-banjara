'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MapPin, Mail, Phone, Calendar, Clock, Star, ArrowUpRight, 
  CheckCircle2, Send, ShieldCheck, Compass, MessageSquare, 
  ChevronDown, ChevronUp, Users, Heart
} from 'lucide-react';
import { TrustBanner } from '@/components/TrustBanner';

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: ''
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          message: formData.address || 'Inquiry from Contact Us page',
        }),
      });
    } catch (err) {
      console.warn('Contact submission API notice:', err);
    }

    setIsSubmitting(false);
    setFormSubmitted(true);
    setFormData({
      name: '',
      email: '',
      mobile: '',
      address: ''
    });
    setTimeout(() => setFormSubmitted(false), 5000);
  };

  const FAQ_ITEMS = [
    {
      question: "What materials are the badges made from? Zinc alloy with glossy enamel fill.",
      answer: "Lightweight, durable, and safe to pin on bags, jackets, or backpacks without damaging fabric."
    },
    {
      question: "How big are the stickers?",
      answer: "Our stickers are standard 3x3 inches, printed on high-grade weatherproof vinyl with a matte finish."
    },
    {
      question: "Do you ship across India?",
      answer: "Yes, we ship to all pin codes across India with free standard delivery on all orders."
    },
    {
      question: "Can I return a product if I don't like it?",
      answer: "Yes, we offer a hassle-free 7-day return policy for unused items in their original packaging."
    },
    {
      question: "I have no reviews on this product. Is it safe to buy?",
      answer: "Absolutely! All our products go through strict quality control, and we offer secure payment gateways along with customer support to assist you at every step."
    }
  ];

  return (
    <div 
      style={{
        width: "100%",
        minHeight: "auto",
        background: "rgba(255, 255, 255, 1)",
        boxSizing: "border-box",
        paddingTop: "0px",
        paddingBottom: "24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
      }}
      className="relative z-10 w-full bg-white"
    >
      <div>
        {/* SECTION 1: HERO SECTION (Mobile 430x112 | Desktop 1440x220) */}
        <section 
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: 1,
            boxSizing: "border-box"
          }}
          className="mx-auto text-center w-full max-w-[430px] md:max-w-[1440px] px-[20px] py-[12px] md:pt-[62px] md:pb-[12px] md:px-20 gap-2 md:gap-[10px] min-h-[112px] md:min-h-[140px]"
        >
          {/* Contact Us Badge (Figma Spec) */}
          <span className="inline-flex items-center justify-center h-[26px] w-fit text-[12px] font-bold uppercase tracking-[0.12em] text-[#FF5B37] bg-[#FFEBE5] px-3 rounded-[4px]">
            CONTACT US
          </span>
          
          {/* Main Title Let's Get in Touch (Figma Spec) */}
          <h1 
            style={{
              width: "100%",
              maxWidth: "1280px",
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              letterSpacing: "0px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            className="text-2xl sm:text-3xl md:text-[42px] leading-tight text-center h-auto min-h-[32px] md:h-[52px]"
          >
            Let’s Get in Touch
          </h1>

          {/* Subtitle with email link (Figma Spec) */}
          <p 
            style={{
              width: "100%",
              maxWidth: "1280px",
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              letterSpacing: "0px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px"
            }}
            className="text-xs sm:text-base md:text-[24px] leading-relaxed md:leading-[32px] text-center h-auto min-h-[24px] md:h-[32px]"
          >
            <span>Just reach out manually to</span>{" "}
            <a 
              href="mailto:hello@gobanjara.com" 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                letterSpacing: "0px",
                textDecoration: "underline",
                textDecorationStyle: "solid",
                color: "rgba(63, 136, 255, 1)",
                transition: "opacity 0.2s"
              }}
              className="hover:opacity-80 text-xs sm:text-base md:text-[24px]"
            >
              hello@gobanjara.com
            </a>
          </p>
        </section>

        {/* SECTION 2: FORM & IMAGE GRID (Mobile 430x925 | Figma spec 1440x817) */}
        <section 
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            opacity: 1,
          }}
          className="relative w-full max-w-[430px] md:max-w-[1440px] px-[20px] py-[12px] md:py-[12px] md:px-0"
        >
          <div className="w-full max-w-[1280px] mx-auto flex flex-col md:flex-row gap-6 md:gap-[48px] items-center justify-center min-h-auto md:min-h-[580px]">
            
            {/* Left Column: Bonjo Mascot Card (About Us Style Effect) */}
            <div 
              style={{
                maxWidth: "100%"
              }}
              className="flex items-center justify-center relative select-none group w-full max-w-[390px] md:max-w-[537px] aspect-square md:aspect-auto h-auto md:h-[580px]"
            >
              {/* Soft radial glow background bubble */}
              <div 
                className="absolute -top-[40px] -left-[40px] w-[220px] h-[220px] pointer-events-none" 
                style={{
                  background: 'radial-gradient(circle, rgba(224, 84, 52, 0.35) 0%, rgba(224, 84, 52, 0) 70%)',
                  zIndex: 0
                }}
              />
              <div 
                style={{
                  width: "100%",
                  maxHeight: "100%",
                  zIndex: 10,
                  borderRadius: "12px"
                }}
                className="relative overflow-hidden transition-all duration-500 hover:rotate-2 cursor-pointer bg-transparent rounded-[12px] w-full h-full"
              >
                <img 
                  src="/llama_mascot.png" 
                  alt="Bonjo Llama Mascot" 
                  style={{ imageRendering: '-webkit-optimize-contrast', transform: 'translateZ(0)', borderRadius: '12px' }}
                  className="w-full h-full object-cover filter drop-shadow-[0_25px_35px_rgba(0,0,0,0.2)] rounded-[12px] group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Right Column: Enquiry Form Card (Figma Spec scaled to fit screen: 487px x 580px) */}
            {formSubmitted ? (
              <div 
                style={{
                  maxWidth: "100%",
                  padding: "20px",
                  borderWidth: "1px",
                  borderColor: "rgba(204, 204, 204, 1)",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box",
                  gap: "24px"
                }}
                className="shadow-xs w-full max-w-[390px] md:max-w-[487px] h-auto min-h-[400px] md:h-[580px]"
              >
                <div className="w-16 h-16 bg-[#F3FFEF] text-[#1D493E] rounded-full flex items-center justify-center mx-auto border border-[#1D493E]/20 animate-bounce">
                  <CheckCircle2 className="w-8 h-8 text-[#FF623E]" />
                </div>
                <h3 className="font-serif font-bold text-2xl text-[#1D493E]">Enquiry Dispatched!</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium text-center leading-relaxed">
                  Your details have been registered. A Go Banjara expedition coordinator will contact you shortly to plan your journey.
                </p>
              </div>
            ) : (
              <form 
                onSubmit={handleSubmit}
                style={{
                  maxWidth: "100%",
                  padding: "20px",
                  borderWidth: "1px",
                  borderColor: "rgba(204, 204, 204, 1)",
                  borderRadius: "4px",
                  background: "rgba(255, 255, 255, 1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxSizing: "border-box"
                }}
                className="shadow-xs text-left w-full max-w-[390px] md:max-w-[487px] h-auto md:h-[580px] gap-4 md:gap-0"
              >
                <style>{`
                  .contact-form-input::placeholder, 
                  .contact-form-textarea::placeholder {
                    font-family: Faktum, sans-serif !important;
                    font-weight: 500 !important;
                    font-size: 20px !important;
                    color: rgba(141, 141, 141, 1) !important;
                    opacity: 1 !important;
                  }
                  .contact-form-input, .contact-form-textarea {
                    font-size: 16px !important;
                  }
                `}</style>

                {/* Input Fields Wrapper Container (Mobile spec 366x392 | gap 24px) */}
                <div 
                  style={{
                    width: "100%",
                    opacity: 1,
                  }}
                  className="flex flex-col gap-[24px] md:gap-[16px] w-full max-w-[366px] md:max-w-full mx-auto"
                >
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label 
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        fontSize: "18px",
                        lineHeight: "100%",
                        letterSpacing: "0px",
                        color: "#2C2C2C",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      Full Name <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 700, fontSize: "18px", lineHeight: "100%", color: "#FF623E" }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      style={{ 
                        height: "53px",
                        borderRadius: "4px",
                        border: "1px solid rgba(204, 204, 204, 1)",
                        background: "rgba(255, 255, 255, 1)"
                      }}
                      className="contact-form-input w-full px-4 font-medium text-gray-800 focus:outline-none focus:border-[#1D493E] transition"
                    />
                  </div>

                  {/* Email Address */}
                  <div className="space-y-1">
                    <label 
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        fontSize: "18px",
                        lineHeight: "100%",
                        letterSpacing: "0px",
                        color: "#2C2C2C",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      Email Address <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 700, fontSize: "18px", lineHeight: "100%", color: "#FF623E" }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      style={{ 
                        height: "53px",
                        borderRadius: "4px",
                        border: "1px solid rgba(204, 204, 204, 1)",
                        background: "rgba(255, 255, 255, 1)"
                      }}
                      className="contact-form-input w-full px-4 font-medium text-gray-800 focus:outline-none focus:border-[#1D493E] transition"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div className="space-y-1">
                    <label 
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        fontSize: "18px",
                        lineHeight: "100%",
                        letterSpacing: "0px",
                        color: "#2C2C2C",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      Mobile Number <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 700, fontSize: "18px", lineHeight: "100%", color: "#FF623E" }}>*</span>
                    </label>
                    <div 
                      style={{ 
                        height: "53px",
                        borderRadius: "4px",
                        border: "1px solid rgba(204, 204, 204, 1)",
                        background: "rgba(255, 255, 255, 1)"
                      }}
                      className="flex overflow-hidden focus-within:border-[#1D493E]"
                    >
                      <span className="bg-[#1D493E]/5 border-r border-gray-300 text-slate-700 text-sm font-semibold px-4 flex items-center justify-center shrink-0">
                        + 91
                      </span>
                      <input
                        type="tel"
                        required
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="9492906356"
                        className="contact-form-input flex-1 px-4 bg-white font-medium text-gray-800 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Complete Address */}
                  <div className="space-y-1">
                    <label 
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        fontSize: "18px",
                        lineHeight: "100%",
                        letterSpacing: "0px",
                        color: "#2C2C2C",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      Complete Address <span style={{ fontFamily: "Faktum, sans-serif", fontWeight: 700, fontSize: "18px", lineHeight: "100%", color: "#FF623E" }}>*</span>
                    </label>
                    <textarea
                      required
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Type something specific here"
                      style={{ 
                        height: "115px", 
                        resize: "none",
                        borderRadius: "4px",
                        border: "1px solid rgba(204, 204, 204, 1)",
                        background: "rgba(255, 255, 255, 1)"
                      }}
                      className="contact-form-textarea w-full px-4 py-3 font-medium text-gray-800 focus:outline-none focus:border-[#1D493E] transition leading-relaxed"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ height: "53px" }}
                  className="w-full bg-[#1D493E] hover:bg-[#1D493E]/90 text-white font-bold rounded-[4px] transition duration-200 cursor-pointer shadow-sm text-sm"
                >
                  {isSubmitting ? "Submitting..." : "Submit Enquiry"}
                </button>
              </form>
            )}

          </div>
        </section>

        {/* SECTION 2.5: CUSTOM STATS BANNER (Mobile 430x208 2x2 Grid | Desktop 1440x145 Bar) */}
        <section 
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            opacity: 1,
          }}
          className="w-full max-w-[430px] md:max-w-[1440px] px-[20px] py-[12px] md:py-[24px] md:px-20 border-t border-b border-gray-200"
        >
          {/* Mobile 2x2 Grid Layout (Figma Spec 430x208) */}
          <div className="grid grid-cols-2 gap-y-3 gap-x-0 w-full md:hidden relative py-1">
            {/* Horizontal divider line */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-200 -translate-y-1/2 pointer-events-none" />
            
            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center py-2 px-1 text-center border-r border-gray-200">
              <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-2xl font-bold text-[#2B2B2B] leading-tight">10+</span>
              <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-xs font-medium text-[#2B2B2B] mt-1">Travel Packages</span>
            </div>

            {/* Stat 2 */}
            <div className="flex flex-col items-center justify-center py-2 px-1 text-center">
              <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-2xl font-bold text-[#2B2B2B] leading-tight">15k+</span>
              <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-xs font-medium text-[#2B2B2B] mt-1">Nomads Joined</span>
            </div>

            {/* Stat 3 */}
            <div className="flex flex-col items-center justify-center py-2 px-1 text-center border-r border-gray-200">
              <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-2xl font-bold text-[#2B2B2B] leading-tight">24/7</span>
              <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-xs font-medium text-[#2B2B2B] mt-1">On-road Support</span>
            </div>

            {/* Stat 4 */}
            <div className="flex flex-col items-center justify-center py-2 px-1 text-center">
              <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-2xl font-bold text-[#2B2B2B] leading-tight">7+</span>
              <span style={{ fontFamily: "Faktum, sans-serif" }} className="text-xs font-medium text-[#2B2B2B] mt-1">Shop Products</span>
            </div>
          </div>

          {/* Desktop Single Row Bar (Untouched) */}
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "1280px"
            }}
            className="hidden md:flex flex-nowrap gap-[47px] w-full mx-auto"
          >
            {/* Stat 1 */}
            <div 
              style={{
                width: "177px",
                height: "97px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxSizing: "border-box"
              }}
              className="text-center"
            >
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "rgba(43, 43, 43, 1)",
                  fontWeight: 600
                }}
                className="text-[32px] leading-none"
              >
                10+
              </span>
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "rgba(43, 43, 43, 1)",
                  fontWeight: 500
                }}
                className="text-[20px] whitespace-nowrap"
              >
                Travel Packages
              </span>
            </div>

            {/* Separator */}
            <div className="h-12 w-[1px] bg-gray-200 shrink-0 hidden md:block" />

            {/* Stat 2 */}
            <div 
              style={{
                width: "177px",
                height: "97px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxSizing: "border-box"
              }}
              className="text-center"
            >
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "rgba(43, 43, 43, 1)",
                  fontWeight: 600
                }}
                className="text-[32px] leading-none"
              >
                15k+
              </span>
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "rgba(43, 43, 43, 1)",
                  fontWeight: 500
                }}
                className="text-[20px] whitespace-nowrap"
              >
                Nomads Joined
              </span>
            </div>

            {/* Separator */}
            <div className="h-12 w-[1px] bg-gray-200 shrink-0 hidden md:block" />

            {/* Stat 3 */}
            <div 
              style={{
                width: "177px",
                height: "97px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxSizing: "border-box"
              }}
              className="text-center"
            >
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "rgba(43, 43, 43, 1)",
                  fontWeight: 600
                }}
                className="text-[32px] leading-none"
              >
                24/7
              </span>
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "rgba(43, 43, 43, 1)",
                  fontWeight: 500
                }}
                className="text-[20px] whitespace-nowrap"
              >
                On-road Support
              </span>
            </div>

            {/* Separator */}
            <div className="h-12 w-[1px] bg-gray-200 shrink-0 hidden md:block" />

            {/* Stat 4 */}
            <div 
              style={{
                width: "177px",
                height: "97px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxSizing: "border-box"
              }}
              className="text-center"
            >
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "rgba(43, 43, 43, 1)",
                  fontWeight: 600
                }}
                className="text-[32px] leading-none"
              >
                7+
              </span>
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "rgba(43, 43, 43, 1)",
                  fontWeight: 500
                }}
                className="text-[20px] whitespace-nowrap"
              >
                Shop Products
              </span>
            </div>

            {/* Separator */}
            <div className="h-12 w-[1px] bg-gray-200 shrink-0 hidden md:block" />

            {/* Stat 5 */}
            <div 
              style={{
                width: "177px",
                height: "97px",
                padding: "12px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxSizing: "border-box"
              }}
              className="text-center"
            >
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "rgba(43, 43, 43, 1)",
                  fontWeight: 600
                }}
                className="text-[32px] leading-none"
              >
                4.5+
              </span>
              <span 
                style={{ 
                  fontFamily: "var(--font-sans)", 
                  color: "rgba(43, 43, 43, 1)",
                  fontWeight: 500
                }}
                className="text-[20px] whitespace-nowrap"
              >
                Average trip rating
              </span>
            </div>
          </div>
        </section>

        {/* SECTION 3: WE'D LOVE TO HEAR FROM YOU (Mobile 430x913 | Desktop 1440x677) */}
        <section 
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            opacity: 1,
          }}
          className="w-full max-w-[430px] md:max-w-[1440px] px-[20px] py-[12px] md:py-[62px] md:px-20 text-left gap-3 md:gap-8"
        >
          {/* Header Title */}
          <div className="space-y-1">
            <h2 
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                letterSpacing: "0px",
              }}
              className="text-2xl sm:text-3xl md:text-[42px] leading-tight text-[#2B2B2B]"
            >
              We’d love to <span style={{ color: "#FF623E" }}>hear from you</span>
            </h2>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:gap-[32px] w-full justify-between items-center mt-1 md:mt-4">
            
            {/* Card 1: Email Support */}
            <div 
              style={{
                background: "#F9F9F9",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
              className="w-full max-w-[390px] md:w-[405px] h-auto md:h-[327px] p-4 md:p-6 flex flex-col justify-between gap-4 md:gap-0 border border-gray-100/80 shadow-2xs text-left"
            >
              <div className="space-y-3 md:space-y-6">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-[4px] border border-gray-200 bg-white flex items-center justify-center text-[#FF623E]">
                  <Compass className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h3 style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#2B2B2B" }} className="font-bold text-base md:text-xl">
                    Email Support
                  </h3>
                  <p style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#666666" }} className="text-xs md:text-sm font-medium">
                    Our team can respond in real time
                  </p>
                </div>
              </div>
              <div className="pt-2 md:pt-6">
                <a 
                  href="mailto:hello@gobanjara.com"
                  style={{
                    fontFamily: "Faktum, Outfit, sans-serif",
                    color: "rgba(63, 136, 255, 1)",
                    textDecoration: "underline",
                    fontWeight: 600
                  }}
                  className="hover:opacity-80 transition block truncate text-xs md:text-[14px]"
                >
                  hello@gobanjara.com
                </a>
              </div>
            </div>

            {/* Card 2: Visit Our Office */}
            <div 
              style={{
                background: "#F9F9F9",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
              className="w-full max-w-[390px] md:w-[405px] h-auto md:h-[327px] p-4 md:p-6 flex flex-col justify-between gap-4 md:gap-0 border border-gray-100/80 shadow-2xs text-left"
            >
              <div className="space-y-3 md:space-y-6">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-[4px] border border-gray-200 bg-white flex items-center justify-center text-[#FF623E]">
                  <Compass className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h3 style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#2B2B2B" }} className="font-bold text-base md:text-xl">
                    Visit Our Office
                  </h3>
                  <p style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#666666" }} className="text-xs md:text-sm font-medium">
                    Visit our location in real time
                  </p>
                </div>
              </div>
              <div className="pt-2 md:pt-6">
                <a 
                  href="https://maps.google.com/?q=1st+Floor,+DSR+Tranquil,+102,+Plot+%23+901,+Ayyappa+Society+Main+Rd,+SBH+Officers+Colony,+Mega+Hills,+Madhapur,+Hyderabad,+Telangana+500081"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "Faktum, Outfit, sans-serif",
                    color: "rgba(63, 136, 255, 1)",
                    textDecoration: "underline",
                    fontWeight: 600,
                    lineHeight: "1.5"
                  }}
                  className="hover:opacity-80 transition block text-left text-xs md:text-[13px]"
                >
                  1st Floor, DSR Tranquil, 102, Plot # 901, Ayyappa Society Main Rd, SBH Officers Colony, Mega Hills, Madhapur, Hyderabad, Telangana 500081
                </a>
              </div>
            </div>

            {/* Card 3: Call us directly */}
            <div 
              style={{
                background: "#F9F9F9",
                borderRadius: "4px",
                boxSizing: "border-box"
              }}
              className="w-full max-w-[390px] md:w-[405px] h-auto md:h-[327px] p-4 md:p-6 flex flex-col justify-between gap-4 md:gap-0 border border-gray-100/80 shadow-2xs text-left"
            >
              <div className="space-y-3 md:space-y-6">
                <div className="w-9 h-9 md:w-12 md:h-12 rounded-[4px] border border-gray-200 bg-white flex items-center justify-center text-[#FF623E]">
                  <Compass className="w-5 h-5 md:w-6 md:h-6" />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <h3 style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#2B2B2B" }} className="font-bold text-base md:text-xl">
                    Call us directly
                  </h3>
                  <p style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#666666" }} className="text-xs md:text-sm font-medium">
                    Available during working hours
                  </p>
                </div>
              </div>
              <div className="pt-2 md:pt-6">
                <a 
                  href="tel:+919489094392"
                  style={{
                    fontFamily: "Faktum, Outfit, sans-serif",
                    color: "rgba(63, 136, 255, 1)",
                    textDecoration: "underline",
                    fontWeight: 600
                  }}
                  className="hover:opacity-80 transition block text-xs md:text-[14px]"
                >
                  (+91) 9489094392
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 4: FAQ SECTION (Mobile 430x582 | Desktop 1440x400) */}
        <section 
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            opacity: 1
          }}
          className="w-full max-w-[430px] md:max-w-[1440px] px-[20px] py-[12px] md:py-[42px] md:px-20 text-left gap-3 md:gap-6 border-t border-gray-100"
        >
          {/* Header Title */}
          <div className="space-y-1">
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                letterSpacing: "0px",
                color: "#2B2B2B",
                margin: 0
              }}
              className="text-2xl sm:text-3xl md:text-[42px]"
            >
              FAQ’s
            </h2>
          </div>

          <div className="w-full flex flex-col border-t border-gray-200 mt-1">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="w-full border-b border-gray-200 py-3.5 md:py-5 flex flex-col text-left transition-colors duration-200"
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer gap-3"
                  >
                    <span 
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 600,
                        color: "#2C2C2C"
                      }}
                      className="text-sm sm:text-base md:text-[18px] leading-snug"
                    >
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#2B2B2B] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#2B2B2B] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p 
                      style={{
                        fontFamily: "Faktum, sans-serif",
                        fontWeight: 500,
                        color: "#666666",
                        margin: 0,
                      }}
                      className="text-xs sm:text-sm pt-2 leading-relaxed animate-fade-in-up"
                    >
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: PRE-FOOTER NEWSLETTER/CTA SECTION (Mobile 430x182 | Desktop 1440x342) */}
        <section 
          style={{
            width: "100%",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            opacity: 1
          }}
          className="w-full max-w-[430px] md:max-w-[1440px] px-[20px] pt-[12px] pb-[62px] md:py-[42px] md:px-20 text-center gap-3 md:gap-[32px] border-t border-gray-100"
        >
          <div className="space-y-2 md:space-y-4 max-w-[1280px]">
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                letterSpacing: "0px",
                color: "#2B2B2B",
                margin: 0,
              }}
              className="text-xl sm:text-2xl md:text-[42px] leading-tight"
            >
              The <span style={{ color: "#FF623E" }}>best adventures</span> find their way to you inbox
            </h2>
            <p
              style={{
                fontFamily: "Faktum, Outfit, sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "26px",
                color: "#666666",
                maxWidth: "1000px",
                margin: "0 auto",
              }}
              className="hidden md:block text-base"
            >
              Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
            </p>
          </div>

          <Link
            href="/travel"
            style={{
              borderRadius: "4px",
              background: "#1D493E",
              color: "#FFFFFF",
              fontFamily: "'Faktum', 'Outfit', sans-serif",
              fontWeight: 600,
              textDecoration: "none",
            }}
            className="group hover:bg-[#15342c] transition-all duration-300 inline-flex items-center justify-center gap-2 cursor-pointer h-[48px] md:h-[55px] px-6 md:px-[36px] text-sm md:text-[16px] mt-1 md:mt-0"
          >
            <span>Reserve your tour now</span>
            <span className="text-lg font-sans group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">↗</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
