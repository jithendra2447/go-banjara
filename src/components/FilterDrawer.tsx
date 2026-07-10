'use client';

import React, { useState } from 'react';
import { X, SlidersHorizontal, Check, ChevronDown } from 'lucide-react';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedGroup: string | null;
  setSelectedGroup: (group: string | null) => void;
  selectedTypes: string[];
  setSelectedTypes: React.Dispatch<React.SetStateAction<string[]>>;
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  selectedCount: number;
  onClear: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  selectedGroup,
  setSelectedGroup,
  selectedTypes,
  setSelectedTypes,
  selectedTheme,
  setSelectedTheme,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  selectedCount,
  onClear,
}) => {
  const CATEGORY_GROUPS = [
    'Collectibles & Accessories',
    'Lifestyle & Utility',
    'Fashion & Apparel',
    'Bags & Travel',
  ];

  const PRODUCT_TYPES = [
    'Stickers',
    'Badges / Pins',
    'Bookmarks',
    'Fridge Magnets',
    'Keychains',
    'Luggage Tags',
    'Journals',
    'Slippers',
    'Shot Glasses',
    'Passport Covers',
    'Wallets',
    'Travel Pillows',
    'Tote Bags',
    'Backpacks',
    'T-Shirts'
  ];

  const GROUP_TO_TYPES_MAP: Record<string, string[]> = {
    'Collectibles & Accessories': ['Stickers', 'Badges / Pins', 'Bookmarks', 'Fridge Magnets', 'Keychains', 'Luggage Tags'],
    'Lifestyle & Utility': ['Journals', 'Slippers', 'Shot Glasses', 'Passport Covers', 'Wallets', 'Travel Pillows'],
    'Fashion & Apparel': ['T-Shirts', 'Slippers'],
    'Bags & Travel': ['Tote Bags', 'Backpacks'],
  };

  const visibleTypes = selectedGroup ? (GROUP_TO_TYPES_MAP[selectedGroup] || []) : PRODUCT_TYPES;

  const THEMES = [
    'All Themes',
    'Travel',
    'Adventure',
    'Nature',
    'Wildlife',
    'Mountains',
    'Beach',
    'Heritage',
    'Cultural',
    'Quotes',
    'Funny',
    'Minimal',
    'Art & Illustration'
  ];

  const COLORS = [
    'All Colors',
    'Black',
    'Blue',
    'Green',
    'Red',
    'White',
    'Orange',
    'Grey'
  ];

  const SIZES = [
    'All Sizes',
    'S - Small',
    'M - Medium',
    'L - Large',
    'XL - Extra Large',
    'XXL - Super Extra Large'
  ];

  // Custom Dropdown Open States
  const [themeOpen, setThemeOpen] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const [sizeOpen, setSizeOpen] = useState(false);

  const toggleProductType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleGroupSelect = (group: string) => {
    const isSelected = selectedGroup === group;
    const nextGroup = isSelected ? null : group;
    setSelectedGroup(nextGroup);
    
    // Clear product types that are not part of the newly selected category group
    if (nextGroup) {
      const allowed = GROUP_TO_TYPES_MAP[nextGroup] || [];
      setSelectedTypes((prev) => prev.filter((t) => allowed.includes(t)));
    }
  };

  return (
    <>
      {/* Dark backdrop overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300 backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      {/* Slide-out drawer panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-full max-w-[420px] bg-white shadow-2xl z-[101] transition-transform duration-350 ease-out overflow-y-auto flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 sticky top-0 bg-white z-50">
          <div className="flex items-center gap-2 text-slate-800">
            <SlidersHorizontal className="w-4.5 h-4.5 text-slate-650" />
            <span className="font-bold text-base">Filters</span>
            {selectedCount > 0 && (
              <span className="text-xs text-[#3B82F6] font-semibold bg-[#EFF6FF] px-2.5 py-0.5 rounded-full ml-1.5">
                {selectedCount} Selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {selectedCount > 0 && (
              <button
                onClick={onClear}
                className="text-xs font-bold text-[#EF4444] hover:text-red-700 transition cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Body content */}
        <div className="p-6 space-y-8 flex-1">
          
          {/* Section 1: Category Group */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Category Group
            </h4>
            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
              {CATEGORY_GROUPS.map((group) => {
                const isSelected = selectedGroup === group;
                return (
                  <button
                    key={group}
                    onClick={() => handleGroupSelect(group)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium hover:bg-slate-50 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-[#1D493E] bg-[#1D493E]'
                            : 'border-slate-300 group-hover:border-slate-400'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <span className={isSelected ? 'text-[#1D493E] font-semibold' : 'text-slate-700'}>
                        {group}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#1D493E]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Product Type (Dynamic based on Category Group) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Product Type
            </h4>
            {visibleTypes.length > 0 ? (
              <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 bg-white">
                {visibleTypes.map((type) => {
                  const isSelected = selectedTypes.includes(type);
                  return (
                    <button
                      key={type}
                      onClick={() => toggleProductType(type)}
                      className="w-full flex items-center justify-between px-4 py-3.5 text-left text-sm font-medium hover:bg-slate-50 transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-all ${
                            isSelected
                              ? 'border-[#1D493E] bg-[#1D493E]'
                              : 'border-slate-300 group-hover:border-slate-400'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className={isSelected ? 'text-[#1D493E] font-semibold' : 'text-slate-700'}>
                          {type}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#1D493E]" />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-400 font-medium italic">No product types available for this selection.</p>
            )}
          </div>

          {/* Section 3: Custom Theme Dropdown */}
          <div className="space-y-2 relative">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Theme
            </h4>
            <button
              onClick={() => {
                setThemeOpen(!themeOpen);
                setColorOpen(false);
                setSizeOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:border-slate-300 transition-colors cursor-pointer"
            >
              <span>{selectedTheme === 'All' ? 'All Themes' : selectedTheme}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${themeOpen ? 'rotate-180' : ''}`} />
            </button>
            {themeOpen && (
              <div className="absolute left-0 w-full mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-40 max-h-60 overflow-y-auto divide-y divide-slate-50">
                {THEMES.map((theme) => {
                  const val = theme === 'All Themes' ? 'All' : theme;
                  const isSelected = selectedTheme === val;
                  return (
                    <button
                      key={theme}
                      onClick={() => {
                        setSelectedTheme(val);
                        setThemeOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-slate-50 text-[#1D493E]' : 'text-slate-650'
                      }`}
                    >
                      <span>{theme}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#1D493E]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 4: Custom Color Dropdown */}
          <div className="space-y-2 relative">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Color
            </h4>
            <button
              onClick={() => {
                setColorOpen(!colorOpen);
                setThemeOpen(false);
                setSizeOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:border-slate-300 transition-colors cursor-pointer"
            >
              <span>{selectedColor === 'All' ? 'All Colors' : selectedColor}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${colorOpen ? 'rotate-180' : ''}`} />
            </button>
            {colorOpen && (
              <div className="absolute left-0 w-full mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-40 max-h-60 overflow-y-auto divide-y divide-slate-50">
                {COLORS.map((color) => {
                  const val = color === 'All Colors' ? 'All' : color;
                  const isSelected = selectedColor === val;
                  return (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(val);
                        setColorOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-slate-50 text-[#1D493E]' : 'text-slate-650'
                      }`}
                    >
                      <span>{color}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#1D493E]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 5: Custom Size Dropdown */}
          <div className="space-y-2 relative">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Size
            </h4>
            <button
              onClick={() => {
                setSizeOpen(!sizeOpen);
                setThemeOpen(false);
                setColorOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:border-slate-300 transition-colors cursor-pointer"
            >
              <span>{selectedSize === 'All' ? 'All Sizes' : selectedSize}</span>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${sizeOpen ? 'rotate-180' : ''}`} />
            </button>
            {sizeOpen && (
              <div className="absolute left-0 w-full mt-1.5 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-40 max-h-60 overflow-y-auto divide-y divide-slate-50">
                {SIZES.map((size) => {
                  const val = size === 'All Sizes' ? 'All' : size;
                  const isSelected = selectedSize === val;
                  return (
                    <button
                      key={size}
                      onClick={() => {
                        setSelectedSize(val);
                        setSizeOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 text-left text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors ${
                        isSelected ? 'bg-slate-50 text-[#1D493E]' : 'text-slate-650'
                      }`}
                    >
                      <span>{size}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#1D493E]" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

        </div>

        {/* Apply Filters Sticky Button on bottom */}
        <div className="p-6 border-t border-slate-100 sticky bottom-0 bg-white flex gap-3">
          <button
            onClick={onClose}
            className="w-full py-3 bg-[#1D493E] hover:bg-[#16372f] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition cursor-pointer shadow-sm text-center"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </>
  );
};
