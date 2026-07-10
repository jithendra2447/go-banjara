'use client';

import React from 'react';
import { X, Plus, Minus, Trash2, Calendar, Users, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '@/components/providers';
import { BonjoMascot } from '@/components/BonjoMascot';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setCartOpen,
    removeFromCart,
    updateQuantity,
    cartTotal,
    setCheckoutOpen,
  } = useCart();

  if (!isCartOpen) return null;

  const gst = Math.round(cartTotal * 0.05); // 5% GST
  const grandTotal = cartTotal + gst;

  const handleCheckoutClick = () => {
    setCartOpen(false);
    setCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity duration-300 animate-[fadeIn_0.2s_ease-out]"
        onClick={() => setCartOpen(false)}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md transform transition-all duration-300 ease-in-out glass border-l border-primary-dark/10 flex flex-col h-full shadow-2xl animate-[slideInRight_0.3s_cubic-bezier(0.16,1,0.3,1)]">
          {/* Header */}
          <div className="p-6 border-b border-primary-dark/8 flex items-center justify-between">
            <h2 className="text-xl font-bold font-serif text-primary-dark flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-orange" />
              Your Travel & Shop Bag
            </h2>
            <button 
              onClick={() => setCartOpen(false)}
              className="p-2 rounded-full hover:bg-primary-dark/5 text-primary-dark/60 hover:text-primary-dark transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                <div className="relative group">
                  <BonjoMascot width={130} height={130} withHat={true} withGoggles={true} interactive={true} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl font-black text-primary-dark">Your bag is empty</h3>
                  <p className="text-sm text-primary-dark/70 max-w-xs mx-auto">
                    Start adding beautiful spices, traditional apparel, or immersive travel packages!
                  </p>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="px-6 py-3 bg-primary-dark hover:bg-brand-orange text-white rounded-xl font-bold shadow-md hover:scale-105 transition-all duration-300"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.id}-${item.date || ''}`}
                  className="flex gap-4 p-4 rounded-2xl bg-white border border-primary-dark/5 shadow-sm hover:shadow-md transition-all"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-20 h-20 rounded-xl object-cover border border-primary-dark/5"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="font-extrabold text-primary-dark text-sm leading-snug line-clamp-2">
                          {item.name}
                        </h4>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-primary-dark/40 hover:text-brand-orange p-1 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <span className={`inline-block text-[9px] uppercase font-black tracking-widest px-2.5 py-0.5 rounded-full mt-1.5 ${
                        item.type === 'travel' 
                          ? 'bg-brand-yellow/30 text-primary-dark border border-brand-yellow/50' 
                          : 'bg-brand-seaweed/10 text-brand-seaweed border border-brand-seaweed/25'
                      }`}>
                        {item.type}
                      </span>

                      {/* Travel Details */}
                      {item.type === 'travel' && (
                        <div className="mt-2 space-y-1 text-xs text-primary-dark/70 bg-brand-yellow/10 p-2.5 rounded-xl border border-brand-yellow/20">
                          {item.date && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-brand-orange" />
                              <span>Date: <strong>{item.date}</strong></span>
                            </div>
                          )}
                          {item.guests && (
                            <div className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-brand-orange" />
                              <span>Travelers: <strong>{item.guests}</strong></span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Shop Size Details */}
                      {item.type === 'shop' && item.size && (
                        <div className="mt-2 text-xs text-primary-dark/70 bg-[#F3FFEF] py-1.5 px-3 rounded-lg border border-[#1D493E]/8 w-fit">
                          Size: <strong className="text-primary-dark font-black uppercase">{item.size}</strong>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Controller for Shop products */}
                      {item.type === 'shop' ? (
                        <div className="flex items-center border border-primary-dark/10 rounded-lg overflow-hidden bg-white">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 px-2.5 hover:bg-brand-beige text-primary-dark/70 transition"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-sm font-black text-primary-dark">
                            {item.quantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 px-2.5 hover:bg-brand-beige text-primary-dark/70 transition"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-primary-dark/60 font-semibold italic">
                          Fixed booking package
                        </div>
                      )}
                      
                      <span className="font-extrabold text-primary-dark text-sm">
                        ₹{(item.price * (item.guests || 1) * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-primary-dark/8 bg-brand-beige/50 space-y-4">
              <div className="space-y-2 text-sm text-primary-dark/80">
                <div className="flex justify-between">
                  <span>Bag Subtotal</span>
                  <span className="font-extrabold text-primary-dark">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%)</span>
                  <span className="font-extrabold text-primary-dark">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-primary-dark/8 my-2 pt-2.5 flex justify-between text-base font-black text-primary-dark">
                  <span>Grand Total</span>
                  <span className="text-brand-orange text-lg">₹{grandTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={handleCheckoutClick}
                className="w-full bg-primary-dark hover:bg-brand-orange text-white py-4 rounded-xl font-extrabold flex items-center justify-center gap-2 shadow-md hover:scale-[1.01] transition-all duration-300"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global CSS animations injected for Tailwind side effect fallback */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};
