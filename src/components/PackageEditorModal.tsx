'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, Save, Upload, Plus, Trash2, Image as ImageIcon, MapPin, Calendar, 
  HelpCircle, UserCheck, CheckCircle2, Compass, ListChecks, ShieldAlert, Star
} from 'lucide-react';
import { HolidayPackage } from '@/data/packages';

interface PackageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageData: HolidayPackage | null;
  onSave: (updatedPkg: HolidayPackage) => void;
}

const DEFAULT_INCLUSIONS = [
  'All accommodation (guesthouses, homestays, tented camp)',
  'All meals as specified in the itinerary',
  'Experienced local guide + assistant guide',
  'Private vehicle (Innova/Bolero) for all transfers',
  'Innerline Permit for restricted areas',
  'First aid kit + oxygen cylinder',
  'Go Banjara welcome kit (journal + map)'
];

const DEFAULT_EXCLUSIONS = [
  'Flights or train tickets to/from destination',
  'Mandatory travel insurance',
  'Personal expenses, snacks & soft drinks',
  'Tips for driver and local tour guides',
  'Any emergency evacuation or medical cost'
];

const DEFAULT_PACKING_LIST = [
  'Heavy fleece jackets & windbreaker',
  'Sturdy water-resistant hiking boots',
  'Polarized sunglasses & SPF 50 sunscreen',
  'Reusable thermos water bottle',
  'High capacity power bank & extra camera batteries'
];

const DEFAULT_REVIEWS = [
  {
    name: 'Jithendra V.',
    date: 'July, 2026',
    verified: true,
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&fit=crop&q=80',
    comment: 'Go Banjara did an extraordinary job mapping out our route. Highly recommend booking a curated tour! Every detail was well thought out and perfectly executed.'
  },
  {
    name: 'Aarav Sharma',
    date: 'June, 2026',
    verified: true,
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&fit=crop&q=80',
    comment: 'Unforgettable expedition! The guides were extremely knowledgeable and took safety very seriously.'
  }
];

export const PackageEditorModal: React.FC<PackageEditorModalProps> = ({
  isOpen,
  onClose,
  packageData,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'gallery' | 'overview' | 'itinerary' | 'inclusions' | 'faqs' | 'reviews'>('basic');
  const [formData, setFormData] = useState<HolidayPackage | null>(null);
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [isCustomDifficulty, setIsCustomDifficulty] = useState(false);

  const stdCategories = ['Road Trip', 'Trek', 'Weekend', 'Camping'];
  const stdDifficulties = ['Easy', 'Moderate', 'Challenging', 'Extreme'];

  useEffect(() => {
    if (packageData) {
      const rawImgs = Array.isArray(packageData.images) && packageData.images.length > 0
        ? packageData.images
        : [packageData.image || '/travel-leh-6.jpg'];
      const gallery = rawImgs.length >= 6 
        ? rawImgs.slice(0, 6) 
        : [...rawImgs, ...Array(6 - rawImgs.length).fill(rawImgs[0] || packageData.image || '/travel-leh-6.jpg')];

      const cat = packageData.category || 'Road Trip';
      const diff = packageData.difficulty || 'Moderate';

      setIsCustomCategory(!stdCategories.includes(cat));
      setIsCustomDifficulty(!stdDifficulties.includes(diff));

      // Rich fallbacks if package has simple 2-word inclusions or empty arrays
      const inc = (packageData.inclusions && packageData.inclusions.length > 2)
        ? packageData.inclusions 
        : DEFAULT_INCLUSIONS;

      const exc = (packageData.exclusions && packageData.exclusions.length > 0)
        ? packageData.exclusions 
        : DEFAULT_EXCLUSIONS;

      const pack = (packageData.packingList && packageData.packingList.length > 0)
        ? packageData.packingList 
        : DEFAULT_PACKING_LIST;

      const revs = (packageData.reviews && packageData.reviews.length > 0)
        ? packageData.reviews 
        : DEFAULT_REVIEWS;

      setFormData({
        ...packageData,
        images: gallery,
        highlights: packageData.highlights || [],
        inclusions: inc,
        exclusions: exc,
        packingList: pack,
        faqs: packageData.faqs || [],
        reviews: revs as any,
        itinerary: packageData.itinerary || [],
        guide: packageData.guide || {
          name: 'Vikram Aditya',
          role: 'Lead Expedition Coordinator',
          image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=120&h=120&fit=crop&q=60',
          rating: 5.0,
          trips: 143,
          bio: 'Certified wilderness first responder with 10+ years of high altitude guiding experience.'
        }
      });
    }
  }, [packageData]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    const primaryImg = formData.images && formData.images[0] ? formData.images[0] : formData.image;
    const finalPkg: HolidayPackage = {
      ...formData,
      image: primaryImg,
    };
    onSave(finalPkg);
  };

  const updateGalleryImage = (idx: number, url: string) => {
    const nextImages = [...(formData.images || [])];
    nextImages[idx] = url;
    setFormData({
      ...formData,
      image: idx === 0 ? url : (formData.image || url),
      images: nextImages,
    });
  };

  const handleFileUploadForGallery = (idx: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (evt) => {
      const res = evt.target?.result as string;
      if (res) updateGalleryImage(idx, res);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 sm:p-8 font-sans text-left">
      <div className="bg-[#FAF9F6] border border-[#E5E0D5] rounded-3xl w-full max-w-[1240px] shadow-2xl flex flex-col max-h-[95vh] h-[92vh] overflow-hidden">
        
        {/* BRAND MODAL HEADER */}
        <div className="px-8 py-6 border-b border-[#E5E0D5] flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-[#1D493E] tracking-tight">
              Package Content & Details Editor
            </h2>
            <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
              Editing tour package details for <span className="font-bold text-[#1D493E]">{formData.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-[#FAF9F6] hover:bg-[#E5E0D5] text-[#1D493E] border border-[#E5E0D5] flex items-center justify-center font-bold text-sm transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GO BANJARA BRAND TAB BAR */}
        <div className="px-6 py-3 bg-white border-b border-[#E5E0D5] shrink-0">
          <div className="flex items-center gap-1.5 p-1.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-2xl overflow-x-auto whitespace-nowrap scrollbar-none">
            {[
              { id: 'basic', label: '1. Basic Info', icon: Compass },
              { id: 'gallery', label: '2. 6 Gallery Photos', icon: ImageIcon },
              { id: 'overview', label: '3. Overview & Guide', icon: UserCheck },
              { id: 'itinerary', label: '4. Day Schedule', icon: Calendar },
              { id: 'inclusions', label: '5. Inclusions & Exclusions', icon: ListChecks },
              { id: 'faqs', label: '6. Gear & FAQs', icon: HelpCircle },
              { id: 'reviews', label: '7. Customer Reviews', icon: Star },
            ].map((tab) => {
              const IconComponent = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 min-w-[130px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#1D493E] text-white shadow-xs'
                      : 'text-[#6B7280] hover:text-[#1D493E] hover:bg-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* SPACIOUS FORM BODY */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 sm:p-10 space-y-10">
          
          {/* TAB 1: BASIC & PRICING */}
          {activeTab === 'basic' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Package Title</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-base text-[#2B2B2B] font-bold focus:outline-none focus:border-[#1D493E] shadow-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Price / Person (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price || 0}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-base text-[#1D493E] font-bold focus:outline-none focus:border-[#1D493E]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-base text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Duration String</label>
                  <input
                    type="text"
                    placeholder="6 Days / 5 Nights"
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-base text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Destination</label>
                  <input
                    type="text"
                    placeholder="Kashmir / Himachal / Kerala"
                    value={formData.destination || ''}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value as any })}
                    className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Start Point</label>
                  <input
                    type="text"
                    placeholder="Srinagar / Manali / Kochi"
                    value={formData.startPoint || ''}
                    onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                    className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Next Departure Date</label>
                  <input
                    type="text"
                    placeholder="Aug, 2026"
                    value={formData.nextDeparture || ''}
                    onChange={(e) => setFormData({ ...formData, nextDeparture: e.target.value })}
                    className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider flex items-center justify-between">
                    <span>Category</span>
                    {!isCustomCategory ? (
                      <button
                        type="button"
                        onClick={() => { setIsCustomCategory(true); setFormData({ ...formData, category: '' as any }); }}
                        className="text-[11px] text-[#1D493E] font-bold underline cursor-pointer"
                      >
                        + Add Custom
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setIsCustomCategory(false); setFormData({ ...formData, category: 'Road Trip' as any }); }}
                        className="text-[11px] text-[#6B7280] font-bold underline cursor-pointer"
                      >
                        Select Standard
                      </button>
                    )}
                  </label>
                  {!isCustomCategory ? (
                    <select
                      value={formData.category || 'Road Trip'}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsCustomCategory(true);
                          setFormData({ ...formData, category: '' as any });
                        } else {
                          setFormData({ ...formData, category: e.target.value as any });
                        }
                      }}
                      className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#1D493E] font-bold focus:outline-none focus:border-[#1D493E]"
                    >
                      <option value="Road Trip">Road Trip</option>
                      <option value="Trek">Trek</option>
                      <option value="Weekend">Weekend</option>
                      <option value="Camping">Camping</option>
                      <option value="__custom__">+ Add Custom Category...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Type Custom Category"
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                      className="w-full p-4 bg-white border border-[#1D493E] rounded-2xl text-sm text-[#1D493E] font-bold focus:outline-none"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider flex items-center justify-between">
                    <span>Difficulty</span>
                    {!isCustomDifficulty ? (
                      <button
                        type="button"
                        onClick={() => { setIsCustomDifficulty(true); setFormData({ ...formData, difficulty: '' as any }); }}
                        className="text-[11px] text-[#1D493E] font-bold underline cursor-pointer"
                      >
                        + Add Custom
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => { setIsCustomDifficulty(false); setFormData({ ...formData, difficulty: 'Moderate' as any }); }}
                        className="text-[11px] text-[#6B7280] font-bold underline cursor-pointer"
                      >
                        Select Standard
                      </button>
                    )}
                  </label>
                  {!isCustomDifficulty ? (
                    <select
                      value={formData.difficulty || 'Moderate'}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsCustomDifficulty(true);
                          setFormData({ ...formData, difficulty: '' as any });
                        } else {
                          setFormData({ ...formData, difficulty: e.target.value as any });
                        }
                      }}
                      className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#1D493E] font-bold focus:outline-none focus:border-[#1D493E]"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Challenging">Challenging</option>
                      <option value="Extreme">Extreme</option>
                      <option value="__custom__">+ Add Custom Difficulty...</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      placeholder="Type Custom Difficulty"
                      value={formData.difficulty || ''}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                      className="w-full p-4 bg-white border border-[#1D493E] rounded-2xl text-sm text-[#1D493E] font-bold focus:outline-none"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Group Type</label>
                  <input
                    type="text"
                    placeholder="Curated group Trip"
                    value={formData.groupType || ''}
                    onChange={(e) => setFormData({ ...formData, groupType: e.target.value })}
                    className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Route Map Sequence</label>
                <input
                  type="text"
                  placeholder="Srinagar → Kargil → Leh → Nubra → Pangong"
                  value={formData.route || ''}
                  onChange={(e) => setFormData({ ...formData, route: e.target.value })}
                  className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                />
              </div>

              <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-extrabold text-[#1D493E]">Homepage Showcase (Featured Card)</h4>
                  <p className="text-xs text-emerald-800/80 font-medium mt-0.5">Showcase this tour package prominently on the main website homepage.</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl border border-emerald-300 shadow-xs">
                  <input
                    type="checkbox"
                    checked={formData.showOnHome === true}
                    onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                    className="w-5 h-5 accent-[#1D493E] rounded cursor-pointer"
                  />
                  <span className="text-xs font-bold text-[#1D493E]">
                    {formData.showOnHome === true ? 'Featured on Homepage' : 'Off'}
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 2: 6 GALLERY PICTURES */}
          {activeTab === 'gallery' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="bg-white border border-[#E5E0D5] rounded-2xl p-5 flex items-center gap-4">
                <ImageIcon className="w-6 h-6 text-[#1D493E] shrink-0" />
                <p className="text-sm text-[#2B2B2B] font-medium leading-relaxed">
                  Upload or paste URLs for all <span className="font-bold text-[#1D493E]">6 Hero Gallery Photos</span>. Photo #1 will be used as the main package cover.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[0, 1, 2, 3, 4, 5].map((idx) => {
                  const imgUrl = (formData.images && formData.images[idx]) || '';
                  return (
                    <div key={idx} className="bg-white border border-[#E5E0D5] rounded-2xl p-5 space-y-4 shadow-xs">
                      <div className="flex items-center justify-between text-xs font-extrabold text-[#1D493E]">
                        <span>Photo #{idx + 1} {idx === 0 ? '(Main Cover)' : ''}</span>
                      </div>
                      
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-[#E5E0D5] bg-[#FAF9F6] flex items-center justify-center">
                        {imgUrl ? (
                          <img src={imgUrl} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs text-[#6B7280] font-medium">No Image Uploaded</span>
                        )}
                      </div>

                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Paste image URL (https://...)"
                          value={imgUrl}
                          onChange={(e) => updateGalleryImage(idx, e.target.value)}
                          className="w-full p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                        />
                        <label className="w-full py-3 bg-[#FAF9F6] hover:bg-[#1D493E] text-[#1D493E] hover:text-white border border-[#E5E0D5] rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer">
                          <Upload className="w-4 h-4" />
                          <span>Upload Photo {idx + 1}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUploadForGallery(idx, file);
                            }}
                          />
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: OVERVIEW & GUIDE */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Overview Description Paragraph</label>
                <textarea
                  rows={5}
                  placeholder="Detailed tour overview paragraph..."
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E] resize-y leading-relaxed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Tour Highlights (One per line)</label>
                <textarea
                  rows={5}
                  placeholder="Drive through Atal Tunnel & Kunzum Pass&#10;Visit ancient Key & Dhankar monasteries&#10;Stargazing at Chandratal Lake"
                  value={(formData.highlights || []).join('\n')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    highlights: e.target.value.split('\n').filter(h => h.trim() !== '') 
                  })}
                  className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E] resize-y leading-relaxed"
                />
              </div>

              {/* GUIDE SECTION */}
              <div className="border-t border-[#E5E0D5] pt-8 space-y-6">
                <h3 className="text-base font-extrabold text-[#1D493E] uppercase tracking-wider flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-[#1D493E]" /> Know Your Guide Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Guide Name</label>
                    <input
                      type="text"
                      placeholder="Vikram Aditya"
                      value={formData.guide?.name || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        guide: { ...formData.guide!, name: e.target.value }
                      })}
                      className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Guide Title / Role</label>
                    <input
                      type="text"
                      placeholder="Lead Expedition Coordinator"
                      value={formData.guide?.role || ''}
                      onChange={(e) => setFormData({
                        ...formData,
                        guide: { ...formData.guide!, role: e.target.value }
                      })}
                      className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider flex items-center justify-between">
                      <span>Guide Photo</span>
                      <span className="text-[10px] text-[#6B7280] font-normal">URL or Upload</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="https://..."
                        value={formData.guide?.image || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          guide: { ...formData.guide!, image: e.target.value }
                        })}
                        className="flex-1 p-3.5 bg-white border border-[#E5E0D5] rounded-2xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                      />
                      <label className="px-4 py-3 bg-[#FAF9F6] hover:bg-[#1D493E] text-[#1D493E] hover:text-white border border-[#E5E0D5] rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0">
                        <Upload className="w-4 h-4" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (evt) => {
                                const res = evt.target?.result as string;
                                if (res) {
                                  setFormData({
                                    ...formData,
                                    guide: { ...formData.guide!, image: res }
                                  });
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Trips Led Count</label>
                    <input
                      type="number"
                      placeholder="143"
                      value={formData.guide?.trips || 140}
                      onChange={(e) => setFormData({
                        ...formData,
                        guide: { ...formData.guide!, trips: parseInt(e.target.value) || 0 }
                      })}
                      className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Rating Score</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="5.0"
                      value={formData.guide?.rating || 5.0}
                      onChange={(e) => setFormData({
                        ...formData,
                        guide: { ...formData.guide!, rating: parseFloat(e.target.value) || 5.0 }
                      })}
                      className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block">Guide Biography</label>
                  <textarea
                    rows={4}
                    placeholder="Short guide bio..."
                    value={formData.guide?.bio || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      guide: { ...formData.guide!, bio: e.target.value }
                    })}
                    className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E] resize-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DAY-BY-DAY ITINERARY */}
          {activeTab === 'itinerary' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5]">
                <div>
                  <h3 className="text-base font-extrabold text-[#1D493E] uppercase tracking-wider">
                    Day-by-Day Itinerary Schedule
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">Manage day titles, location segments, activities, and insider tips</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextNum = (formData.itinerary || []).length + 1;
                    const nextItinerary = [
                      ...(formData.itinerary || []),
                      {
                        day: `Day ${nextNum}`,
                        title: `Expedition Day ${nextNum}`,
                        location: formData.destination || 'Destination',
                        places: [],
                        offering: 'Breakfast & Dinner',
                        activities: ['Exploration & Sightseeing'],
                        insiderTip: 'Carry warm layer and camera.'
                      }
                    ];
                    setFormData({ ...formData, itinerary: nextItinerary });
                  }}
                  className="px-6 py-3 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-2xl text-xs sm:text-sm font-extrabold transition flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Day
                </button>
              </div>

              {(formData.itinerary || []).length === 0 ? (
                <div className="p-10 text-center bg-white border border-[#E5E0D5] rounded-3xl text-sm text-[#6B7280]">
                  No itinerary days configured yet. Click "Add New Day" above to build the day schedule.
                </div>
              ) : (
                <div className="space-y-6">
                  {(formData.itinerary || []).map((dayItem, idx) => (
                    <div key={idx} className="p-6 sm:p-8 bg-white border border-[#E5E0D5] rounded-3xl space-y-6 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-4">
                        <span className="text-base font-extrabold text-[#1D493E] uppercase tracking-wider">
                          Day {idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = (formData.itinerary || []).filter((_, i) => i !== idx);
                            setFormData({ ...formData, itinerary: updated });
                          }}
                          className="text-rose-700 hover:text-rose-900 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 rounded-xl"
                        >
                          <Trash2 className="w-4 h-4" /> Remove Day
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-[#1D493E] uppercase">Day Title</label>
                          <input
                            type="text"
                            value={dayItem.title || ''}
                            onChange={(e) => {
                              const updated = [...(formData.itinerary || [])];
                              updated[idx] = { ...updated[idx], title: e.target.value };
                              setFormData({ ...formData, itinerary: updated });
                            }}
                            className="w-full p-4 bg-[#FAF9F6] border border-[#E5E0D5] rounded-2xl text-sm font-bold text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-[#1D493E] uppercase">Location / Segment</label>
                          <input
                            type="text"
                            value={dayItem.location || ''}
                            onChange={(e) => {
                              const updated = [...(formData.itinerary || [])];
                              updated[idx] = { ...updated[idx], location: e.target.value };
                              setFormData({ ...formData, itinerary: updated });
                            }}
                            className="w-full p-4 bg-[#FAF9F6] border border-[#E5E0D5] rounded-2xl text-sm font-bold text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#1D493E] uppercase">Activities & Details (One per line)</label>
                        <textarea
                          rows={4}
                          value={(dayItem.activities || []).join('\n')}
                          onChange={(e) => {
                            const updated = [...(formData.itinerary || [])];
                            updated[idx] = { 
                              ...updated[idx], 
                              activities: e.target.value.split('\n').filter(a => a.trim() !== '') 
                            };
                            setFormData({ ...formData, itinerary: updated });
                          }}
                          className="w-full p-4 bg-[#FAF9F6] border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E] resize-y leading-relaxed font-sans"
                        />
                      </div>

                      <div className="space-y-2 bg-[#FAF9F6] border border-[#E5E0D5] p-5 rounded-2xl">
                        <label className="text-xs font-extrabold text-[#1D493E] uppercase block">Insider Tip</label>
                        <input
                          type="text"
                          value={dayItem.insiderTip || ''}
                          onChange={(e) => {
                            const updated = [...(formData.itinerary || [])];
                            updated[idx] = { ...updated[idx], insiderTip: e.target.value };
                            setFormData({ ...formData, itinerary: updated });
                          }}
                          className="w-full p-4 bg-white border border-[#E5E0D5] rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: INCLUSIONS & EXCLUSIONS */}
          {activeTab === 'inclusions' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="space-y-3">
                <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#1D493E]" /> What's Included (One item per line)
                </label>
                <textarea
                  rows={7}
                  placeholder="All accommodation (guesthouses, homestays, tented camp)&#10;All meals as specified in itinerary&#10;Private vehicle (Innova/Bolero) for all transfers&#10;Innerline Permit & Oxygen support"
                  value={(formData.inclusions || []).join('\n')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    inclusions: e.target.value.split('\n').filter(i => i.trim() !== '') 
                  })}
                  className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E] resize-y leading-relaxed font-sans"
                />
              </div>

              <div className="space-y-3 pt-6 border-t border-[#E5E0D5]">
                <label className="text-xs font-extrabold text-rose-800 uppercase tracking-wider block flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-rose-700" /> What's NOT Included (One item per line)
                </label>
                <textarea
                  rows={6}
                  placeholder="Flights or train tickets to destination&#10;Mandatory travel insurance&#10;Personal snacks & drinks&#10;Tips for guide & driver"
                  value={(formData.exclusions || []).join('\n')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    exclusions: e.target.value.split('\n').filter(x => x.trim() !== '') 
                  })}
                  className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-rose-500 resize-y leading-relaxed font-sans"
                />
              </div>
            </div>
          )}

          {/* TAB 6: PREP & FAQS */}
          {activeTab === 'faqs' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* PREPARE FOR YOUR JOURNEY PACKING LIST */}
              <div className="space-y-3">
                <label className="text-xs font-extrabold text-[#1D493E] uppercase tracking-wider block flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-[#1D493E]" /> Prepare for Your Journey (Packing Checklist - One item per line)
                </label>
                <textarea
                  rows={6}
                  placeholder="Heavy fleece jackets & windbreaker&#10;Sturdy water-resistant hiking boots&#10;Polarized sunglasses & SPF sunscreen&#10;Reusable thermos water bottle&#10;High capacity power bank"
                  value={(formData.packingList || []).join('\n')}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    packingList: e.target.value.split('\n').filter(p => p.trim() !== '') 
                  })}
                  className="w-full p-4 bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E] resize-y leading-relaxed font-sans"
                />
              </div>

              {/* FAQS SECTION */}
              <div className="border-t border-[#E5E0D5] pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-[#1D493E] uppercase tracking-wider flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#1D493E]" /> Commonly Asked Questions (FAQs)
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const nextFaqs = [
                        ...(formData.faqs || []),
                        { q: 'New question title?', a: 'Detailed clear answer for travelers...' }
                      ];
                      setFormData({ ...formData, faqs: nextFaqs });
                    }}
                    className="px-5 py-2.5 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-4 h-4" /> Add FAQ
                  </button>
                </div>

                {(formData.faqs || []).length === 0 ? (
                  <div className="p-8 text-center bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#6B7280]">
                    No custom FAQs added. Standard defaults will render on the page.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {(formData.faqs || []).map((faq, idx) => (
                      <div key={idx} className="p-6 bg-white border border-[#E5E0D5] rounded-2xl space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#1D493E] uppercase">FAQ #{idx + 1}</span>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (formData.faqs || []).filter((_, i) => i !== idx);
                              setFormData({ ...formData, faqs: updated });
                            }}
                            className="text-rose-700 hover:text-rose-900 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 px-3 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        </div>
                        <input
                          type="text"
                          placeholder="Question?"
                          value={faq.q || ''}
                          onChange={(e) => {
                            const updated = [...(formData.faqs || [])];
                            updated[idx] = { ...updated[idx], q: e.target.value };
                            setFormData({ ...formData, faqs: updated });
                          }}
                          className="w-full p-4 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-sm font-bold text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                        />
                        <textarea
                          rows={3}
                          placeholder="Answer..."
                          value={faq.a || ''}
                          onChange={(e) => {
                            const updated = [...(formData.faqs || [])];
                            updated[idx] = { ...updated[idx], a: e.target.value };
                            setFormData({ ...formData, faqs: updated });
                          }}
                          className="w-full p-4 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E] resize-none leading-relaxed"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 7: CUSTOMER REVIEWS */}
          {activeTab === 'reviews' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D5]">
                <div>
                  <h3 className="text-base font-extrabold text-[#1D493E] uppercase tracking-wider flex items-center gap-2">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Customer Testimonials & Reviews
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">Manage customer reviews, ratings, reviewer names, and avatar photos</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const nextRevs = [
                      ...((formData as any).reviews || []),
                      {
                        name: 'Verified Traveler',
                        date: 'August, 2026',
                        verified: true,
                        rating: 5,
                        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&fit=crop&q=80',
                        comment: 'Wonderful experience with Go Banjara! Highly recommended.'
                      }
                    ];
                    setFormData({ ...formData, reviews: nextRevs });
                  }}
                  className="px-5 py-2.5 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-2xl text-xs font-extrabold transition flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <Plus className="w-4 h-4" /> Add Review
                </button>
              </div>

              {((formData as any).reviews || []).length === 0 ? (
                <div className="p-8 text-center bg-white border border-[#E5E0D5] rounded-2xl text-sm text-[#6B7280]">
                  No reviews configured. Click "Add Review" above to add customer testimonials.
                </div>
              ) : (
                <div className="space-y-6">
                  {((formData as any).reviews || []).map((rev: any, idx: number) => (
                    <div key={idx} className="p-6 bg-white border border-[#E5E0D5] rounded-3xl space-y-5 shadow-xs">
                      <div className="flex items-center justify-between border-b border-[#E5E0D5] pb-3">
                        <span className="text-xs font-extrabold text-[#1D493E] uppercase">
                          Review #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = ((formData as any).reviews || []).filter((_: any, i: number) => i !== idx);
                            setFormData({ ...formData, reviews: updated });
                          }}
                          className="text-rose-700 hover:text-rose-900 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 px-3 py-1 bg-rose-50 hover:bg-rose-100 rounded-lg"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-[#1D493E] uppercase">Reviewer Name</label>
                          <input
                            type="text"
                            value={rev.name || ''}
                            onChange={(e) => {
                              const updated = [...((formData as any).reviews || [])];
                              updated[idx] = { ...updated[idx], name: e.target.value };
                              setFormData({ ...formData, reviews: updated });
                            }}
                            className="w-full p-3.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-sm font-bold text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-[#1D493E] uppercase">Date String</label>
                          <input
                            type="text"
                            placeholder="July, 2026"
                            value={rev.date || ''}
                            onChange={(e) => {
                              const updated = [...((formData as any).reviews || [])];
                              updated[idx] = { ...updated[idx], date: e.target.value };
                              setFormData({ ...formData, reviews: updated });
                            }}
                            className="w-full p-3.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-sm font-bold text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-extrabold text-[#1D493E] uppercase">Rating Stars (1 to 5)</label>
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={rev.rating || 5}
                            onChange={(e) => {
                              const updated = [...((formData as any).reviews || [])];
                              updated[idx] = { ...updated[idx], rating: parseInt(e.target.value) || 5 };
                              setFormData({ ...formData, reviews: updated });
                            }}
                            className="w-full p-3.5 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-sm font-bold text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#1D493E] uppercase flex items-center justify-between">
                          <span>Avatar Photo</span>
                          <span className="text-[10px] text-[#6B7280] font-normal">URL or Upload</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="https://..."
                            value={rev.avatar || ''}
                            onChange={(e) => {
                              const updated = [...((formData as any).reviews || [])];
                              updated[idx] = { ...updated[idx], avatar: e.target.value };
                              setFormData({ ...formData, reviews: updated });
                            }}
                            className="flex-1 p-3 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-xs text-[#2B2B2B] focus:outline-none focus:border-[#1D493E]"
                          />
                          <label className="px-4 py-2.5 bg-[#FAF9F6] hover:bg-[#1D493E] text-[#1D493E] hover:text-white border border-[#E5E0D5] rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0">
                            <Upload className="w-4 h-4" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (evt) => {
                                    const res = evt.target?.result as string;
                                    if (res) {
                                      const updated = [...((formData as any).reviews || [])];
                                      updated[idx] = { ...updated[idx], avatar: res };
                                      setFormData({ ...formData, reviews: updated });
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-extrabold text-[#1D493E] uppercase">Review Comment Text</label>
                        <textarea
                          rows={3}
                          value={rev.comment || rev.text || ''}
                          onChange={(e) => {
                            const updated = [...((formData as any).reviews || [])];
                            updated[idx] = { ...updated[idx], comment: e.target.value, text: e.target.value };
                            setFormData({ ...formData, reviews: updated });
                          }}
                          className="w-full p-4 bg-[#FAF9F6] border border-[#E5E0D5] rounded-xl text-sm text-[#2B2B2B] focus:outline-none focus:border-[#1D493E] resize-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* FOOTER ACTION BUTTONS */}
          <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#E5E0D5] shrink-0 bg-white p-6 -mx-8 -mb-8 sm:-mx-10 sm:-mb-10 rounded-b-3xl">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3.5 bg-[#FAF9F6] hover:bg-[#E5E0D5] text-[#2B2B2B] border border-[#E5E0D5] rounded-xl text-sm font-extrabold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3.5 bg-[#1D493E] hover:bg-[#15342c] text-white rounded-xl text-sm font-extrabold transition flex items-center gap-2.5 cursor-pointer shadow-md"
            >
              <Save className="w-5 h-5" /> Save Package Updates
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
