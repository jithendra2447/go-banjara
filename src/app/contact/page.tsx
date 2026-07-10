'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="space-y-16 pb-24 font-sans">
      {/* Header Banner */}
      <section className="bg-primary-dark text-white py-24 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] opacity-70" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-yellow/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 space-y-3 relative z-10">
          <span className="badge bg-brand-orange/20 text-brand-orange border border-brand-orange/30 font-black text-xs px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Get In Touch
          </span>
          <h1 className="text-4xl md:text-6xl font-black font-serif text-slate-100">Connect With Us</h1>
          <p className="text-brand-beige/80 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
            Have questions about a travel package, custom corporate spice gift baskets, or product shipping? Drop us a line.
          </p>
        </div>
      </section>

      {/* Form and Info */}
      <section className="max-w-6xl mx-auto px-4 grid md:grid-cols-12 gap-12 items-start">
        
        {/* Info Cards */}
        <div className="md:col-span-5 space-y-6">
          <h2 className="text-3xl font-black font-serif text-primary-dark">Our Headquarters</h2>
          <p className="text-primary-dark/70 text-sm leading-relaxed">
            We are rooted in Kerala and operate travel experiences and spice packing centers across different hubs.
          </p>

          <div className="space-y-4">
            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-primary-dark/8 shadow-sm">
              <div className="w-10 h-10 bg-brand-yellow/20 rounded-xl flex items-center justify-center text-primary-dark border border-brand-yellow/30 shrink-0">
                <MapPin className="w-5 h-5 text-brand-orange" />
              </div>
              <div>
                <h4 className="font-extrabold text-primary-dark text-sm">Main Office</h4>
                <p className="text-xs text-primary-dark/65 mt-1 leading-relaxed">
                  Banjara House, Alappuzha Jetty Rd, <br />
                  Alleppey, Kerala 688011, India
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-primary-dark/8 shadow-sm">
              <div className="w-10 h-10 bg-brand-seaweed/10 rounded-xl flex items-center justify-center text-brand-seaweed border border-brand-seaweed/25 shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-primary-dark text-sm">Email Support</h4>
                <p className="text-xs text-primary-dark/65 mt-1">
                  hello@gobanjara.in <br />
                  bookings@gobanjara.in
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl bg-white border border-primary-dark/8 shadow-sm">
              <div className="w-10 h-10 bg-brand-lavender/10 rounded-xl flex items-center justify-center text-brand-lavender border border-brand-lavender/25 shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-primary-dark text-sm">Call Center</h4>
                <p className="text-xs text-primary-dark/65 mt-1">
                  +91 (477) 224-8390 <br />
                  Mon - Sat, 9:00 AM - 6:00 PM IST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-7 bg-white border border-primary-dark/8 rounded-3xl p-8 shadow-sm">
          <h3 className="text-2xl font-serif font-black text-primary-dark mb-6">Send A Message</h3>
          
          {submitted ? (
            <div className="py-12 text-center flex flex-col items-center space-y-4 animate-[fadeIn_0.5s_ease]">
              <div className="w-16 h-16 rounded-full bg-brand-beige text-primary-dark flex items-center justify-center border border-brand-yellow">
                <CheckCircle2 className="w-10 h-10 text-primary-dark" />
              </div>
              <h4 className="text-xl font-black font-serif text-primary-dark">Message Received!</h4>
              <p className="text-primary-dark/70 text-xs max-w-sm">
                Thank you for connecting. Our representative will email you back within 1-2 business days.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-primary-dark/75 mb-1.5">Your Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Rahul"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-slate-300 bg-brand-beige/20 focus:outline-none focus:ring-2 focus:ring-primary-dark/10 focus:border-primary-dark transition text-sm text-primary-dark"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-primary-dark/75 mb-1.5">Email Address</label>
                  <input 
                    type="email" 
                    required
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3.5 rounded-xl border border-slate-300 bg-brand-beige/20 focus:outline-none focus:ring-2 focus:ring-primary-dark/10 focus:border-primary-dark transition text-sm text-primary-dark"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black uppercase tracking-wider text-primary-dark/75 mb-1.5">Message / Inquiry</label>
                <textarea 
                  required
                  rows={5}
                  placeholder="How can we help you plan your journey or choose a product?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-3.5 rounded-xl border border-slate-300 bg-brand-beige/20 focus:outline-none focus:ring-2 focus:ring-primary-dark/10 focus:border-primary-dark transition text-sm text-primary-dark"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-primary-dark hover:bg-brand-orange text-white p-4.5 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-md transition-all duration-300"
              >
                Send Message
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
