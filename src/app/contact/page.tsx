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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
      setFormData({
        name: '',
        email: '',
        mobile: '',
        address: ''
      });
      setTimeout(() => setFormSubmitted(false), 5000);
    }, 1200);
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
        {/* SECTION 1: HERO SECTION (Styled exactly to Figma specs 1440x220) */}
        <section 
          style={{
            width: "100%",
            maxWidth: "1440px",
            minHeight: "140px",
            paddingTop: "24px",
            paddingBottom: "12px",
            background: "rgba(255, 255, 255, 1)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            boxSizing: "border-box"
          }}
          className="mx-auto text-center px-6 md:px-20"
        >
          {/* Contact Us Badge (Figma Spec) */}
          <span 
            style={{ 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center",
              width: "104px",
              height: "18px",
              background: "rgba(255, 98, 62, 1)",
              color: "rgba(255, 255, 255, 1)",
              fontFamily: "Faktum, sans-serif",
              fontWeight: 600,
              fontSize: "14px",
              lineHeight: "100%",
              letterSpacing: "1.2px",
              textTransform: "uppercase",
              borderRadius: "2px",
            }}
          >
            Contact Us
          </span>
          
          {/* Main Title Let's Get in Touch (Figma Spec) */}
          <h1 
            style={{
              width: "100%",
              maxWidth: "1280px",
              height: "52px",
              fontFamily: "Fraunces, serif",
              fontWeight: 600,
              fontSize: "42px",
              lineHeight: "100%",
              letterSpacing: "0px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            className="text-3xl md:text-[42px]"
          >
            Let’s Get in Touch
          </h1>

          {/* Subtitle with email link (Figma Spec) */}
          <p 
            style={{
              width: "100%",
              maxWidth: "1280px",
              height: "32px",
              fontFamily: "Faktum, sans-serif",
              fontWeight: 500,
              fontSize: "24px",
              lineHeight: "32px",
              letterSpacing: "0px",
              color: "rgba(43, 43, 43, 1)",
              margin: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}
            className="text-base md:text-[24px]"
          >
            or Just reach out manually to{" "}
            <a 
              href="mailto:hello@gobanjara.com" 
              style={{
                fontFamily: "Faktum, sans-serif",
                fontWeight: 500,
                fontSize: "24px",
                lineHeight: "32px",
                letterSpacing: "0px",
                textDecoration: "underline",
                textDecorationStyle: "solid",
                color: "rgba(63, 136, 255, 1)",
                transition: "opacity 0.2s"
              }}
              className="hover:opacity-80"
            >
              hello@gobanjara.com
            </a>
          </p>
        </section>

        {/* SECTION 2: FORM & IMAGE GRID (Figma spec 1440x817, padding 62px 80px) */}
        <section 
          style={{
            width: "100%",
            maxWidth: "1440px",
            minHeight: "680px",
            paddingTop: "12px",
            paddingBottom: "12px",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto"
          }}
          className="relative"
        >
          <div className="w-full max-w-[1280px] mx-auto flex flex-col md:flex-row gap-[48px] items-center justify-center min-h-[580px] px-4 md:px-0">
            
            {/* Left Column: Tilted Mascot Card with Soft Red Glow Behind (Height: 580px) */}
            <div 
              style={{
                height: "580px",
                width: "537px",
                maxWidth: "100%"
              }}
              className="flex items-center justify-center relative select-none"
            >
              {/* Soft red glow background bubble */}
              <div 
                style={{
                  position: "absolute",
                  top: "-40px",
                  left: "-40px",
                  width: "160px",
                  height: "160px",
                  borderRadius: "9999px",
                  background: "rgba(224, 84, 52, 0.3)",
                  filter: "blur(48px)",
                  zIndex: 0,
                  pointerEvents: "none"
                }}
              />
              <div 
                style={{
                  transform: "rotate(-2deg)",
                  width: "100%",
                  height: "580px",
                  maxHeight: "100%",
                  zIndex: 10,
                  boxShadow: "0px 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  borderRadius: "12px"
                }}
                className="overflow-hidden transition-all duration-500 hover:rotate-0 hover:scale-102 cursor-pointer bg-white border border-[#1D493E]/10"
              >
                <img 
                  src="/llama_mascot.png" 
                  alt="Bonjo Llama Mascot" 
                  style={{
                    transform: "scale(1.4) translateY(24px) rotate(2deg)",
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Right Column: Enquiry Form Card (Figma Spec scaled to fit screen: 487px x 580px) */}
            {formSubmitted ? (
              <div 
                style={{
                  width: "487px",
                  maxWidth: "100%",
                  height: "580px",
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
                className="shadow-xs"
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
                  width: "487px",
                  maxWidth: "100%",
                  height: "580px",
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
                className="shadow-xs text-left"
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

        {/* SECTION 2.5: CUSTOM STATS BANNER (Figma spec 1440x145) */}
        <section 
          style={{
            width: "100%",
            maxWidth: "1440px",
            minHeight: "145px",
            height: "auto",
            paddingTop: "24px",
            paddingBottom: "24px",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderTop: "1px solid rgba(229, 231, 235, 1)",
            borderBottom: "1px solid rgba(229, 231, 235, 1)"
          }}
          className="px-6 md:px-20"
        >
          <div 
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              maxWidth: "1280px"
            }}
            className="flex-wrap md:flex-nowrap gap-6 md:gap-[47px] w-full"
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

        {/* SECTION 3: WE'D LOVE TO HEAR FROM YOU (Figma spec 1440x677, padding 62px 80px) */}
        <section 
          style={{
            width: "100%",
            maxWidth: "1440px",
            paddingTop: "62px",
            paddingBottom: "62px",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "32px"
          }}
          className="px-6 md:px-20 text-left"
        >
          <div className="space-y-3">
            <span 
              style={{
                fontFamily: "Faktum, Outfit, sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "rgba(255, 98, 62, 1)",
                background: "rgba(255, 98, 62, 0.1)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "28px",
                padding: "0 16px",
                borderRadius: "4px"
              }}
            >
              Reach out to us
            </span>
            <h2 
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "42px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#2B2B2B"
              }}
              className="text-3xl md:text-[42px]"
            >
              We’d love to <span style={{ color: "#FF623E" }}>hear from you</span>
            </h2>
            <p 
              style={{
                fontFamily: "Faktum, Outfit, sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "24px",
                color: "rgba(43, 43, 43, 1)"
              }}
              className="text-base"
            >
              or Just reach out manually to{" "}
              <a 
                href="mailto:hello@gobanjara.com"
                style={{
                  color: "rgba(63, 136, 255, 1)",
                  textDecoration: "underline"
                }}
                className="hover:opacity-85 transition"
              >
                hello@gobanjara.com
              </a>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-[32px] w-full justify-between items-center mt-4">
            
            {/* Card 1: Email Support */}
            <div 
              style={{
                background: "#F9F9F9",
                borderRadius: "4px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "405.33px",
                maxWidth: "100%",
                height: "327px",
                boxSizing: "border-box"
              }}
              className="border border-gray-100 shadow-2xs hover:shadow-xs transition duration-200"
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-full border-[1.5px] border-[#FF623E] bg-white flex items-center justify-center text-[#FF623E]">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#2B2B2B" }} className="font-bold text-xl">
                    Email Support
                  </h3>
                  <p style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#666666" }} className="text-sm font-medium">
                    Our team can respond in real time
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <a 
                  href="mailto:hello@gobanjara.com"
                  style={{
                    fontFamily: "Faktum, Outfit, sans-serif",
                    color: "rgba(63, 136, 255, 1)",
                    textDecoration: "underline",
                    fontSize: "14px",
                    fontWeight: 600
                  }}
                  className="hover:opacity-80 transition block truncate"
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
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "405.33px",
                maxWidth: "100%",
                height: "327px",
                boxSizing: "border-box"
              }}
              className="border border-gray-100 shadow-2xs hover:shadow-xs transition duration-200"
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-full border-[1.5px] border-[#FF623E] bg-white flex items-center justify-center text-[#FF623E]">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#2B2B2B" }} className="font-bold text-xl">
                    Visit Our Office
                  </h3>
                  <p style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#666666" }} className="text-sm font-medium">
                    Visit our location in real time
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <a 
                  href="https://maps.google.com/?q=1st+Floor,+DSR+Tranquil,+102,+Plot+%23+901,+Ayyappa+Society+Main+Rd,+SBH+Officers+Colony,+Mega+Hills,+Madhapur,+Hyderabad,+Telangana+500081"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "Faktum, Outfit, sans-serif",
                    color: "rgba(63, 136, 255, 1)",
                    textDecoration: "underline",
                    fontSize: "13px",
                    fontWeight: 600,
                    lineHeight: "1.5"
                  }}
                  className="hover:opacity-80 transition block text-left"
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
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "405.33px",
                maxWidth: "100%",
                height: "327px",
                boxSizing: "border-box"
              }}
              className="border border-gray-100 shadow-2xs hover:shadow-xs transition duration-200"
            >
              <div className="space-y-6">
                <div className="w-12 h-12 rounded-full border-[1.5px] border-[#FF623E] bg-white flex items-center justify-center text-[#FF623E]">
                  <Compass className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                  <h3 style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#2B2B2B" }} className="font-bold text-xl">
                    Call us directly
                  </h3>
                  <p style={{ fontFamily: "Faktum, Outfit, sans-serif", color: "#666666" }} className="text-sm font-medium">
                    Available during working hours
                  </p>
                </div>
              </div>
              <div className="pt-6">
                <a 
                  href="tel:+919489094392"
                  style={{
                    fontFamily: "Faktum, Outfit, sans-serif",
                    color: "rgba(63, 136, 255, 1)",
                    textDecoration: "underline",
                    fontSize: "14px",
                    fontWeight: 600
                  }}
                  className="hover:opacity-80 transition block"
                >
                  (+91) 9489094392
                </a>
              </div>
            </div>

          </div>
        </section>

        <section 
          style={{
            width: "100%",
            maxWidth: "1440px",
            paddingTop: "42px",
            paddingBottom: "42px",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            gap: "24px"
          }}
          className="px-6 md:px-20 text-left border-t border-gray-100"
        >
          <div className="space-y-3">
            <span 
              style={{
                fontFamily: "var(--font-sans)",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "rgba(255, 98, 62, 1)",
                background: "rgba(255, 98, 62, 0.1)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: "28px",
                padding: "0 16px",
                borderRadius: "4px"
              }}
            >
              FAQ'S
            </span>
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "42px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#2B2B2B",
                margin: 0
              }}
              className="text-3xl md:text-[42px]"
            >
              Frequently asked questions
            </h2>
          </div>

          <div className="w-full flex flex-col border-t border-gray-200 mt-2">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="w-full border-b border-gray-200 py-5 flex flex-col text-left transition-colors duration-200"
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer"
                  >
                    <span 
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 600,
                        fontSize: "18px",
                        lineHeight: "26px",
                        color: "#2C2C2C"
                      }}
                      className="text-base md:text-[18px]"
                    >
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <span className="text-2xl font-semibold text-[#FF623E] select-none shrink-0 ml-4">−</span>
                    ) : (
                      <span className="text-2xl font-semibold text-[#1D493E] select-none shrink-0 ml-4">+</span>
                    )}
                  </button>
                  {isOpen && (
                    <p 
                      style={{
                        fontFamily: "var(--font-sans)",
                        fontWeight: 500,
                        fontSize: "14px",
                        lineHeight: "22px",
                        color: "#666666",
                        margin: 0,
                        paddingTop: "8px"
                      }}
                      className="text-sm animate-fade-in-up"
                    >
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: PRE-FOOTER NEWSLETTER/CTA SECTION (Figma spec 1440x342, padding 42px 80px) */}
        <section 
          style={{
            width: "100%",
            maxWidth: "1440px",
            paddingTop: "42px",
            paddingBottom: "42px",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "32px"
          }}
          className="px-6 md:px-20 text-center border-t border-gray-100"
        >
          <div className="space-y-4 max-w-[1280px]">
            <h2
              style={{
                fontFamily: "Fraunces, serif",
                fontWeight: 600,
                fontSize: "42px",
                lineHeight: "100%",
                letterSpacing: "0px",
                color: "#2B2B2B",
                margin: 0,
              }}
              className="text-[28px] md:text-[42px]"
            >
              The <span style={{ color: "#FF623E" }}>best adventures</span> find their way to your inbox.
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
              className="text-base"
            >
              Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
            </p>
          </div>

          <Link
            href="/travel"
            style={{
              width: "286px",
              height: "48px",
              borderRadius: "4px",
              background: "rgba(29, 73, 62, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              fontFamily: "Faktum, Outfit, sans-serif",
              fontWeight: 600,
              fontSize: "16px",
              lineHeight: "100%",
              textDecoration: "none",
              transition: "opacity 0.2s",
            }}
            className="hover:opacity-90 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Reserve your tour now</span>
            <span className="text-lg font-sans">↗</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
