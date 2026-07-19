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
  // Tabs for the interactive form
  const [activeTab, setActiveTab] = useState<'trip' | 'gear' | 'collab' | 'general'>('trip');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tripType: 'Trek',
    orderNumber: '',
    company: '',
    subject: '',
    message: '',
    preferredDate: '',
    guestsCount: '2'
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        phone: '',
        tripType: 'Trek',
        orderNumber: '',
        company: '',
        subject: '',
        message: '',
        preferredDate: '',
        guestsCount: '2'
      });
      setTimeout(() => setFormSubmitted(false), 5000);
    }, 1200);
  };

  const FAQ_ITEMS = [
    {
      question: "How quickly does your team respond to inquiries?",
      answer: "Our team of travel coordinators and customer support representatives typically responds to all inquiries within 12 to 24 hours. For urgent booking issues or active expeditions, our support lines are open 24/7."
    },
    {
      question: "Can you customize travel itineraries for private groups?",
      answer: "Absolutely! We design customized, slow-travel itineraries for corporate groups, families, and private adventurer tribes. Simply select 'Plan a Trip' in our contact form, specify your preferences, and we will build a tailored journey."
    },
    {
      question: "Can I customize the corporate bulk orders for apparel and badges?",
      answer: "Yes, we specialize in high-quality custom apparel, premium enamel badges, and co-branded journals for corporate retreats, outdoor clubs, and events. Drop us a line under the 'Collaborations' tab."
    },
    {
      question: "Where is your Srinagar basecamp located and can I visit?",
      answer: "Our Himalayan Basecamp is located at Houseboat Row 3, Dal Lake, Srinagar. We love hosting fellow wanderers! Please schedule an appointment via the form or email us in advance so we can prepare some fresh Kahwa for you."
    },
    {
      question: "How can I collaborate with Go Banjara as a local guide or host?",
      answer: "We are always looking to partner with authentic native guides, family homestay hosts, and local artisans. Select 'Collaborations & Partnerships' in the form and attach details about your location and experience."
    }
  ];

  return (
    <div 
      style={{
        width: "100%",
        maxWidth: "1440px",
        minHeight: "2897px",
        background: "rgba(255, 255, 255, 1)",
        boxSizing: "border-box",
        margin: "0 auto",
        paddingBottom: "62px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
      className="relative z-10"
    >
      <div>
        {/* SECTION 1: HERO SECTION */}
        <section className="w-full px-6 md:px-20 pt-16 pb-10 text-center flex flex-col items-center">
          <div className="max-w-[1280px] w-full flex flex-col items-center gap-6">
            <span 
              style={{ 
                display: "inline-flex", 
                alignItems: "center", 
                justifyContent: "center",
                height: "28px",
                padding: "0 16px",
                borderRadius: "4px",
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                fontWeight: 600,
                fontSize: "14px",
                lineHeight: "100%",
                letterSpacing: "1.2px",
                textTransform: "uppercase",
                color: "rgba(255, 98, 62, 1)",
                background: "rgba(255, 98, 62, 0.1)",
              }}
            >
              Get In Touch
            </span>
            <h1 
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                letterSpacing: "-0.5px",
                color: "rgba(29, 73, 62, 1)",
                margin: 0,
              }}
              className="text-4xl md:text-[56px] leading-tight"
            >
              Let's Connect <span style={{ color: "rgba(255, 98, 62, 1)" }}>With the Tribe</span>
            </h1>
            <p 
              style={{
                width: "100%",
                maxWidth: "800px",
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                fontWeight: 500,
                fontSize: "20px",
                lineHeight: "30px",
                color: "rgba(43, 43, 43, 0.8)",
                margin: 0,
              }}
              className="text-sm sm:text-base md:text-[20px]"
            >
              Whether you are planning a Himalayan trek, checking on a custom clothing order, or just want to swap travel stories over a hot cup of kahwa—we are here for it.
            </p>
          </div>
        </section>

        {/* SECTION 2: INTERACTIVE FORM & DIRECT INFO GRID */}
        <section className="w-full px-6 md:px-20 py-10">
          <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Column: Direct Info Card & Mascot */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-[#F3FFEF] border border-[#1D493E]/10 rounded-[24px] p-8 space-y-8">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-2xl text-[#1D493E]">Direct Outposts</h3>
                  <p className="text-sm text-[#1D493E]/70 font-medium">Skip the form and reach us directly via basecamp waves.</p>
                </div>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1D493E]/5 text-[#FF623E] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono uppercase font-black tracking-wider text-gray-400">Email Basecamp</h4>
                      <p className="text-[16px] font-bold text-[#1D493E] hover:text-[#FF623E] transition cursor-pointer">
                        explore@gobanjara.com
                      </p>
                      <p className="text-xs text-gray-400">Response time: &lt; 12 hours</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1D493E]/5 text-[#FF623E] flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono uppercase font-black tracking-wider text-gray-400">Satellite Hotline</h4>
                      <p className="text-[16px] font-bold text-[#1D493E] hover:text-[#FF623E] transition cursor-pointer">
                        +91 98450 12345
                      </p>
                      <p className="text-xs text-gray-400">Operating: Mon-Sat, 9AM - 6PM IST</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#1D493E]/5 text-[#FF623E] flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-[10px] font-mono uppercase font-black tracking-wider text-gray-400">Basecamp Hours</h4>
                      <p className="text-[16px] font-bold text-[#1D493E]">
                        Srinagar: Open 24 Hours
                      </p>
                      <p className="text-xs text-gray-400">Bengaluru: 10:00 AM – 7:00 PM IST</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#1D493E]/10 flex items-center gap-3.5">
                  <div className="flex -space-x-2">
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150" alt="Guide 1" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150" alt="Guide 2" />
                    <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=150" alt="Guide 3" />
                  </div>
                  <span className="text-xs font-semibold text-[#1D493E]/80">5 Active local guides on duty.</span>
                </div>
              </div>

              {/* Brand Ethos Card */}
              <div className="border border-[#1D493E]/15 rounded-[24px] p-8 space-y-4 bg-white shadow-2xs">
                <Compass className="w-8 h-8 text-[#FF623E] animate-spin-slow" />
                <h4 className="font-serif font-bold text-lg text-[#1D493E]">The Nomad Promise</h4>
                <p className="text-xs leading-relaxed text-slate-500 font-medium">
                  We believe in slow, responsible travel that respects local communities, protects native trails, and brings you genuine local connections. Your safety and experiences are at the absolute center of everything we build.
                </p>
              </div>
            </div>

            {/* Right Column: Multi-tab Interactive Inquiry Form */}
            <div className="lg:col-span-7 bg-white border-2 border-[#1D493E] rounded-[28px] shadow-[6px_6px_0px_0px_#1D493E] overflow-hidden">
              {/* Tab headers */}
              <div className="flex border-b border-[#1D493E]/10 bg-gray-50/50">
                <button 
                  onClick={() => { setActiveTab('trip'); setFormSubmitted(false); }}
                  className={`flex-1 py-4 text-center text-xs font-mono font-black uppercase tracking-wider transition ${
                    activeTab === 'trip' 
                      ? 'bg-white border-b-2 border-b-[#FF623E] text-[#FF623E]' 
                      : 'text-[#1D493E]/60 hover:bg-gray-50 hover:text-[#1D493E]'
                  }`}
                >
                  Plan a Trip
                </button>
                <button 
                  onClick={() => { setActiveTab('gear'); setFormSubmitted(false); }}
                  className={`flex-1 py-4 text-center text-xs font-mono font-black uppercase tracking-wider transition ${
                    activeTab === 'gear' 
                      ? 'bg-white border-b-2 border-b-[#FF623E] text-[#FF623E]' 
                      : 'text-[#1D493E]/60 hover:bg-gray-50 hover:text-[#1D493E]'
                  }`}
                >
                  Gear & Orders
                </button>
                <button 
                  onClick={() => { setActiveTab('collab'); setFormSubmitted(false); }}
                  className={`flex-1 py-4 text-center text-xs font-mono font-black uppercase tracking-wider transition ${
                    activeTab === 'collab' 
                      ? 'bg-white border-b-2 border-b-[#FF623E] text-[#FF623E]' 
                      : 'text-[#1D493E]/60 hover:bg-gray-50 hover:text-[#1D493E]'
                  }`}
                >
                  Collabs
                </button>
                <button 
                  onClick={() => { setActiveTab('general'); setFormSubmitted(false); }}
                  className={`flex-1 py-4 text-center text-xs font-mono font-black uppercase tracking-wider transition ${
                    activeTab === 'general' 
                      ? 'bg-white border-b-2 border-b-[#FF623E] text-[#FF623E]' 
                      : 'text-[#1D493E]/60 hover:bg-gray-50 hover:text-[#1D493E]'
                  }`}
                >
                  General
                </button>
              </div>

              {/* Form Content Wrapper */}
              <div className="p-8">
                {formSubmitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-[#F3FFEF] text-[#1D493E] rounded-full flex items-center justify-center mx-auto border border-[#1D493E]/20">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-[#1D493E]">Message Dispatched!</h3>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">
                      Your query has successfully reached our basecamp routers. A nomad coordinator will coordinate with you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    
                    {/* Common Fields: Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block text-left">
                          Full Name
                        </label>
                        <input 
                          type="text"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Your Adventurous Name"
                          className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-bold text-[#1D493E] focus:outline-none focus:border-[#1D493E] text-center"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block text-left">
                          Email Address
                        </label>
                        <input 
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="nomad@explore.com"
                          className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-bold text-[#1D493E] focus:outline-none focus:border-[#1D493E] text-center"
                        />
                      </div>
                    </div>

                    {/* Conditional Fields based on active tab */}
                    {activeTab === 'trip' && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block text-left">
                              Select Trip Category
                            </label>
                            <select 
                              name="tripType"
                              value={formData.tripType}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-bold text-[#1D493E] focus:outline-none focus:border-[#1D493E] text-center"
                            >
                              <option value="Trek">Mountain Trekking</option>
                              <option value="Weekend">Weekend Escape</option>
                              <option value="Road Trip">Road Trip Expedition</option>
                              <option value="Camping">Scenic Camping</option>
                            </select>
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block text-left">
                              No of Guests
                            </label>
                            <input 
                              type="number"
                              name="guestsCount"
                              min="1"
                              value={formData.guestsCount}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-bold text-[#1D493E] focus:outline-none focus:border-[#1D493E] text-center"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block text-left">
                            Target Departure Date
                          </label>
                          <input 
                            type="date"
                            name="preferredDate"
                            value={formData.preferredDate}
                            onChange={handleInputChange}
                            onClick={(e) => {
                              try { e.currentTarget.showPicker(); } catch (err) {}
                            }}
                            onFocus={(e) => {
                              try { e.currentTarget.showPicker(); } catch (err) {}
                            }}
                            style={{ textAlign: "center" }}
                            className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-bold text-[#1D493E] focus:outline-none focus:border-[#1D493E] text-center hide-calendar-picker-icon cursor-pointer"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'gear' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block text-left">
                            Order Number (Optional)
                          </label>
                          <input 
                            type="text"
                            name="orderNumber"
                            value={formData.orderNumber}
                            onChange={handleInputChange}
                            placeholder="e.g. #GB-8921"
                            className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-bold text-[#1D493E] focus:outline-none focus:border-[#1D493E] text-center"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block text-left">
                            Hotline Subject
                          </label>
                          <input 
                            type="text"
                            name="subject"
                            required
                            value={formData.subject}
                            onChange={handleInputChange}
                            placeholder="e.g. Size Exchange / Missing Badges"
                            className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-bold text-[#1D493E] focus:outline-none focus:border-[#1D493E] text-center"
                          />
                        </div>
                      </div>
                    )}

                    {activeTab === 'collab' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block text-left">
                            Company or Agency
                          </label>
                          <input 
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleInputChange}
                            placeholder="Your Brand / Agency"
                            className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-bold text-[#1D493E] focus:outline-none focus:border-[#1D493E] text-center"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block text-left">
                            Collaboration Scope
                          </label>
                          <select 
                            name="subject"
                            value={formData.subject}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-bold text-[#1D493E] focus:outline-none focus:border-[#1D493E] text-center"
                          >
                            <option value="Local Guide Partnership">Local Guide Partnership</option>
                            <option value="Artisan Homestay Host">Artisan Homestay Host</option>
                            <option value="Corporate Custom Badges">Corporate Custom Badges</option>
                            <option value="Creator / Sponsorship">Creator / Sponsorship</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {activeTab === 'general' && (
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block text-left">
                          Subject of Interest
                        </label>
                        <input 
                          type="text"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleInputChange}
                          placeholder="What would you like to talk about?"
                          className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-bold text-[#1D493E] focus:outline-none focus:border-[#1D493E] text-center"
                        />
                      </div>
                    )}

                    {/* Common Field: Message Box */}
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-mono font-black uppercase tracking-wider text-[#1D493E]/60 block">
                        Detailed Message
                      </label>
                      <textarea 
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Detail your requirements, dates, or ideas here..."
                        className="w-full px-4 py-3 border border-[#1D493E]/20 rounded-xl bg-white text-xs font-semibold text-[#1D493E] focus:outline-none focus:border-[#1D493E] leading-relaxed"
                      />
                    </div>

                    {/* Submit Button */}
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[55px] bg-[#1D493E] hover:bg-[#1D493E]/90 text-white rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <span>Transmitting Signals...</span>
                      ) : (
                        <>
                          <span>Transmit Message</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>

                  </form>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 3: BASECAMPS & HQ LOCATIONS MAP */}
        <section className="w-full px-6 md:px-20 py-16 bg-[#F3FFEF]/40 border-t border-b border-[#1D493E]/5">
          <div className="max-w-[1280px] mx-auto space-y-12">
            <div className="text-center space-y-3">
              <span className="text-[10px] font-mono uppercase font-black tracking-widest text-[#FF623E] bg-[#FF623E]/10 px-2.5 py-0.5 rounded-[4px]">
                Ground Operations
              </span>
              <h2 className="font-serif font-bold text-3xl md:text-4xl text-[#1D493E]">Our Basecamps</h2>
              <p className="text-sm text-slate-500 max-w-xl mx-auto font-medium">
                Step off the road and walk into our physical sanctuaries. We design gear and coordinate treks here.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Srinagar Basecamp */}
              <div className="bg-white border border-[#1D493E]/10 rounded-[24px] overflow-hidden shadow-2xs hover:shadow-lg transition duration-300">
                <div className="h-48 relative bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1566838318109-a86075b517a6?q=80&w=600&auto=format&fit=crop" 
                    alt="Srinagar Basecamp" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#FF623E] text-white text-[9px] font-mono uppercase font-black px-2 py-0.5 rounded">
                    Expedition Base
                  </div>
                </div>
                <div className="p-6 space-y-4 text-left">
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-xl text-[#1D493E]">Srinagar Basecamp</h3>
                    <p className="text-[11px] font-mono text-gray-400">34.0837° N, 74.7973° E</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Houseboat Row 3, Dal Lake, Srinagar, J&K. This is where we finalize Kashmir permissions and check Himalayan weather conditions.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#1D493E]">
                    <MapPin className="w-4 h-4 text-[#FF623E]" />
                    <span>Dal Lake Outpost</span>
                  </div>
                </div>
              </div>

              {/* Bengaluru HQ */}
              <div className="bg-white border border-[#1D493E]/10 rounded-[24px] overflow-hidden shadow-2xs hover:shadow-lg transition duration-300">
                <div className="h-48 relative bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1582298538104-fc2c0a5a0028?q=80&w=600&auto=format&fit=crop" 
                    alt="Bengaluru Studio" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#1D493E] text-white text-[9px] font-mono uppercase font-black px-2 py-0.5 rounded">
                    Design Studio & HQ
                  </div>
                </div>
                <div className="p-6 space-y-4 text-left">
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-xl text-[#1D493E]">Bengaluru Studio</h3>
                    <p className="text-[11px] font-mono text-gray-400">12.9716° N, 77.5946° E</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    42, Wind Tunnel Road, Murugeshpalya, Bengaluru, Karnataka. Design center for our enamel badges, journals, and street apparel.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#1D493E]">
                    <MapPin className="w-4 h-4 text-[#FF623E]" />
                    <span>Apparel & Design Lab</span>
                  </div>
                </div>
              </div>

              {/* Leh Outpost */}
              <div className="bg-white border border-[#1D493E]/10 rounded-[24px] overflow-hidden shadow-2xs hover:shadow-lg transition duration-300">
                <div className="h-48 relative bg-slate-100">
                  <img 
                    src="https://images.unsplash.com/photo-1596701062351-df1f8d4cf783?q=80&w=600&auto=format&fit=crop" 
                    alt="Leh Basecamp" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-[#FF623E] text-white text-[9px] font-mono uppercase font-black px-2 py-0.5 rounded">
                    Aviation & Gear Hub
                  </div>
                </div>
                <div className="p-6 space-y-4 text-left">
                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-xl text-[#1D493E]">Leh Outpost</h3>
                    <p className="text-[11px] font-mono text-gray-400">34.1526° N, 77.5771° E</p>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-medium">
                    Fort Road, Near Main Bazaar, Leh, Ladakh. Acclimatization camp, local motorcycle garages, and high-altitude rental gear center.
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs font-bold text-[#1D493E]">
                    <MapPin className="w-4 h-4 text-[#FF623E]" />
                    <span>Ladakh Acclimatization Center</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* SECTION 4: FAQ ACCORDION SECTION (Matching exact styles of other pages) */}
        <section className="w-full max-w-[1280px] bg-white rounded-[4px] py-16 px-6 flex flex-col gap-[32px] mx-auto border-t border-gray-100">
          <div className="w-full h-auto flex flex-col gap-[12px] justify-center text-left mx-auto">
            <span 
              style={{
                fontFamily: "'Faktum', 'Outfit', sans-serif",
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
                width: "fit-content",
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
                color: "rgba(29, 73, 62, 1)",
                margin: 0
              }}
              className="text-[28px] md:text-[42px]"
            >
              Inquiry Questions
            </h2>
            <p
              style={{
                fontFamily: "'Faktum', 'Outfit', sans-serif",
                fontWeight: 500,
                fontSize: "24px",
                lineHeight: "32px",
                color: "rgba(43, 43, 43, 1)",
                margin: 0
              }}
              className="text-base md:text-[24px]"
            >
              Have quick doubts? Check our support log lines.
            </p>
          </div>

          <div className="w-full flex flex-col border-t border-slate-200">
            {FAQ_ITEMS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div 
                  key={idx} 
                  className="w-full border-b-[2px] border-[rgba(204,204,204,0.54)] py-6 flex flex-col gap-4 text-left transition-colors duration-200"
                >
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex justify-between items-center text-left focus:outline-none cursor-pointer"
                  >
                    <span 
                      style={{
                        fontFamily: "'Faktum', 'Outfit', sans-serif",
                        fontWeight: 600,
                        fontSize: "24px",
                        lineHeight: "32px",
                        color: "rgba(43, 43, 43, 1)"
                      }}
                      className="text-lg md:text-[24px]"
                    >
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-6 h-6 text-[#FF623E] shrink-0" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-[#1D493E] shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <p 
                      style={{
                        fontFamily: "'Faktum', 'Outfit', sans-serif",
                        fontWeight: 500,
                        fontSize: "18px",
                        lineHeight: "28px",
                        color: "rgba(43, 43, 43, 0.8)",
                        margin: 0
                      }}
                      className="text-sm md:text-[18px] animate-fade-in-up"
                    >
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION 5: PRE-FOOTER NEWSLETTER/CTA SECTION (Section 10) */}
        <section 
          style={{
            width: "100%",
            maxWidth: "1280px",
            background: "rgba(255, 255, 255, 1)",
            boxSizing: "border-box",
            margin: "0 auto",
          }}
          className="py-16 px-6"
        >
          <div 
            style={{
              width: "100%",
              height: "235px",
              paddingTop: "24px",
              paddingBottom: "24px",
              gap: "24px",
              borderRadius: "4px",
              background: "rgba(255, 98, 62, 0.1)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              boxSizing: "border-box",
            }}
            className="px-6 md:px-20"
          >
            <div 
              style={{
                width: "100%",
                maxWidth: "1280px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <h2
                style={{
                  fontFamily: "Fraunces, serif",
                  fontWeight: 600,
                  fontSize: "42px",
                  lineHeight: "100%",
                  letterSpacing: "0px",
                  textAlign: "center",
                  color: "#2B2B2B",
                  maxWidth: "1280px",
                  margin: 0,
                }}
                className="text-[28px] md:text-[42px]"
              >
                The <span style={{ color: "#FF5A36" }}>best adventures</span> find their way to your inbox.
              </h2>
              <p
                style={{
                  fontFamily: "Faktum, sans-serif",
                  fontWeight: 500,
                  fontSize: "24px",
                  lineHeight: "32px",
                  letterSpacing: "0px",
                  textAlign: "center",
                  color: "rgba(43, 43, 43, 1)",
                  maxWidth: "1280px",
                  margin: 0,
                }}
                className="text-base md:text-[24px]"
              >
                Hidden places, exclusive trip drops, curated gear, and stories from the road delivered before anyone else hears about them.
              </p>
            </div>

            <Link
              href="/travel"
              style={{
                width: "286px",
                height: "55px",
                paddingTop: "16px",
                paddingBottom: "16px",
                paddingLeft: "32px",
                paddingRight: "32px",
                borderRadius: "4px",
                background: "rgba(29, 73, 62, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#FFFFFF",
                fontFamily: "'Faktum','Outfit',sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "100%",
                letterSpacing: "0px",
                textDecoration: "none",
                transition: "opacity 0.2s",
              }}
              className="hover:opacity-90 inline-flex items-center gap-2 mt-4"
            >
              <span>Reserve your tour now</span>
              <span className="text-lg font-sans">↗</span>
            </Link>
          </div>
        </section>
      </div>

      {/* SECTION 6: TRUST BANNER */}
      <div className="w-full">
        <TrustBanner />
      </div>
    </div>
  );
}
