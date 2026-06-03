/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { ProductImage } from './ProductImage';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (itemId: string, newQty: number) => void;
  onRemoveItem: (itemId: string) => void;
  onLaunchCheckout: (subtotal: number, discount: number) => void;
  onShopNow?: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onLaunchCheckout,
  onShopNow
}: CartDrawerProps) {
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoFeedback, setPromoFeedback] = useState('');

  const rawSubtotal = cart.reduce((sum, item) => sum + item.pricePerUnit * item.quantity, 0);

  const discountValue = promoApplied ? Math.round(rawSubtotal * 0.15) : 0; // 15% off
  const finalSubtotal = rawSubtotal - discountValue;

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === 'FRESHBOAT') {
      setPromoApplied(true);
      setPromoFeedback('Promo FRESHBOAT Applied successfully! 15% discount loaded.');
    } else {
      setPromoApplied(false);
      setPromoFeedback('Invalid promo code. Try "FRESHBOAT".');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end"
        >
          {/* Drawer Body container */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Header column */}
            <div className="p-6 border-b border-[#ECFCCB]/50 flex items-center justify-between bg-[#064E3B] text-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#ECFCCB]" />
                <h3 className="font-serif text-lg font-bold">Your Seafood Basket</h3>
                <span className="bg-[#10B981]/20 text-[#ECFCCB] text-xs px-2 py-0.5 rounded-full font-bold">
                  {cart.length} Sourced Packs
                </span>
              </div>
              <button
                id="cart-drawer-close"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Middle Product lists area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-24 text-[#064E3B]/50 select-none">
                  <ShoppingBag className="h-12 w-12 text-[#ECFCCB] mx-auto mb-4 animate-bounce" />
                  <p className="text-[#064E3B] font-serif text-sm font-bold">Your basket is empty</p>
                  <p className="text-xs text-[#064E3B]/50 max-w-xs mx-auto mt-1 leading-normal font-sans">
                    Browse Today's Catch catalog list and add premium cuts to start. Same-morning cold delivery active.
                  </p>
                  <button
                    id="cart-shop-now-btn"
                    onClick={() => {
                      onClose();
                      onShopNow?.();
                    }}
                    className="mt-4 px-5 py-2.5 bg-[#064E3B] text-white rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer"
                  >
                    Shop Sourced Catch Now
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.id}
                    id={`cart-item-${item.id}`}
                    className="bg-[#F7FEE7] border border-[#ECFCCB]/50 p-3 sm:p-4 rounded-2xl flex gap-3.5 items-center justify-between relative group overflow-hidden"
                  >
                    {/* Item Thumbnail */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#ECFCCB] shrink-0">
                      <ProductImage
                        productId={item.product.id}
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-contain p-1 bg-[#F7FEE7]"
                        showUploadButton={false}
                      />
                    </div>

                    {/* Middle details column */}
                    <div className="flex-1 truncate">
                      <span className="text-[9px] font-bold text-[#10B981] block uppercase font-mono">{item.product.localName}</span>
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-[#064E3B] truncate block">{item.product.name}</h4>
                      <p className="text-[10px] text-[#064E3B]/50 font-mono tracking-wide mt-0.5 font-medium">
                        Weight: <strong>{item.selectedWeight}</strong> · Cuts: <strong>{item.selectedProcessing}</strong>
                      </p>

                      <div className="flex items-center gap-1 mt-2">
                        {/* Qty incrementors */}
                        <div className="flex items-center bg-white border border-[#ECFCCB] rounded-lg py-0.5 px-1 bg-[#F7FEE7] shadow-xs">
                          <button
                            id={`cart-qty-dec-${item.id}`}
                            onClick={() => onUpdateQty(item.id, Math.max(1, item.quantity - 1))}
                            className="p-1 text-[#064E3B]/70 hover:text-[#064E3B] shrink-0 cursor-pointer"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="text-xs font-bold text-[#064E3B] px-2.5 font-mono">{item.quantity}</span>
                          <button
                            id={`cart-qty-inc-${item.id}`}
                            onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                            className="p-1 text-[#064E3B]/70 hover:text-[#064E3B] shrink-0 cursor-pointer"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Price & Thrash column */}
                    <div className="text-right flex flex-col justify-between items-end h-full min-h-[50px]">
                      <button
                        id={`cart-remove-${item.id}`}
                        onClick={() => onRemoveItem(item.id)}
                        className="p-1.5 text-[#064E3B]/50 hover:text-[#10B981] rounded-lg group-hover:bg-[#F7FEE7]/50 transition-colors pointer-events-auto cursor-pointer"
                        title="Remove selection"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>

                      <div className="text-xs sm:text-sm font-extrabold text-[#064E3B] font-sans mt-2">
                        ₹{item.pricePerUnit * item.quantity}
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Bottom summary & actions columns */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#ECFCCB]/50 bg-[#F7FEE7] space-y-4">
                
                {/* Promo Coupon Module */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#064E3B]/70 uppercase tracking-widest block font-mono">Promo Code (Apply "FRESHBOAT")</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="FRESHBOAT"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 border border-[#ECFCCB] focus:outline-[#10B981] rounded-xl text-xs bg-white text-[#064E3B] uppercase font-bold font-mono"
                      />
                      <Ticket className="h-4 w-4 absolute left-2.5 top-2.5 text-[#064E3B]/50" />
                    </div>
                    <button
                      id="cart-promo-apply-btn"
                      onClick={handleApplyPromo}
                      className="px-4 py-2 bg-[#064E3B] border border-[#064E3B] text-white rounded-xl text-xs font-bold uppercase hover:bg-black transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {promoFeedback && (
                    <p className={`text-[10px] ${promoApplied ? 'text-[#10B981]' : 'text-[#10B981]'} font-semibold font-sans leading-normal`}>
                      {promoFeedback}
                    </p>
                  )}
                </div>

                {/* Subtotals breakdown list */}
                <div className="space-y-2 text-xs text-[#064E3B]/70 font-mono pt-2 border-t border-[#ECFCCB]">
                  <div className="flex justify-between items-center">
                    <span>Trays Raw Subtotal:</span>
                    <strong>₹{rawSubtotal}</strong>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between items-center text-[#10B981]">
                      <span>Promo 15% Off discount:</span>
                      <strong>-₹{discountValue}</strong>
                    </div>
                  )}
                  <div className="flex justify-between items-center text-[#064E3B]/70">
                    <span>Hygienic Ice Cold Shipping:</span>
                    <strong className="text-[#10B981] uppercase font-bold">FREE Today</strong>
                  </div>
                  <div className="flex justify-between items-center text-[#064E3B] text-sm font-extrabold font-serif pt-2 border-t border-[#ECFCCB]">
                    <span className="text-[#064E3B]">Immediate Final Billing:</span>
                    <strong className="text-[#064E3B]">₹{finalSubtotal}</strong>
                  </div>
                </div>

                {/* Checkout Trigger */}
                <button
                  id="checkout-trigger-drawer"
                  onClick={() => onLaunchCheckout(finalSubtotal, discountValue)}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white py-3.5 rounded-2xl text-xs tracking-widest uppercase font-bold shadow-lg shadow-[#064E3B]/20 transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <span>Proceed to Safe Ordering</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#064E3B]/50 font-mono pt-1">
                  <ShieldCheck className="h-4 w-4 text-[#10B981] shrink-0" />
                  <span>Direct daily dawn payments safe & SSL encrypted.</span>
                </div>

              </div>
            )}

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
