/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, X, Trash2, ArrowRight, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { PRODUCTS } from '../data';
import { ProductImage } from './ProductImage';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistIds: string[];
  onRemoveFromWishlist: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, weight: string, processing: string, qty: number) => void;
  onShopNow?: () => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlistIds,
  onRemoveFromWishlist,
  onSelectProduct,
  onAddToCart,
  onShopNow
}: WishlistDrawerProps) {
  
  // Resolve wishlist products from raw storage keys
  const resolvedProducts = wishlistIds
    .map(id => PRODUCTS.find(p => p.id === id))
    .filter(Boolean) as Product[];

  const triggerAddToCart = (p: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(p, p.availableWeights[0], p.processingOptions[0] || 'Whole Cleaned', 1);
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
          {/* Drawer body frame */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between"
          >
            {/* Header info bar */}
            <div className="p-6 border-b border-[#ECFCCB]/50 flex items-center justify-between bg-[#064E3B] text-white">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-[#10B981] fill-[#10B981]" />
                <h3 className="font-serif text-lg font-bold">Your Saved Catch</h3>
                <span className="bg-[#10B981]/20 text-[#ECFCCB] text-xs px-2 py-0.5 rounded-full font-bold">
                  {wishlistIds.length} Saved
                </span>
              </div>
              <button
                id="wishlist-drawer-close"
                onClick={onClose}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* List column scrolls */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {resolvedProducts.length === 0 ? (
                <div className="text-center py-24 text-[#064E3B]/50 select-none">
                  <Heart className="h-12 w-12 text-[#ECFCCB] mx-auto mb-4" />
                  <p className="text-[#064E3B] font-serif text-sm font-bold">Your Wishlist is Empty</p>
                  <p className="text-xs text-[#064E3B]/50 max-w-xs mx-auto mt-1 leading-normal font-sans">
                    Browse Today's Fresh Catch rosters on-ice. Save your favorites to track catch times and fisherman allocations.
                  </p>
                  <button
                    id="wishlist-shop-btn"
                    onClick={() => {
                      onClose();
                      onShopNow?.();
                    }}
                    className="mt-4 px-5 py-2.5 bg-[#064E3B] text-white rounded-xl text-xs font-bold tracking-wider uppercase cursor-pointer"
                  >
                    Browse Catch Rosters
                  </button>
                </div>
              ) : (
                resolvedProducts.map((p) => (
                  <div
                    key={p.id}
                    id={`wishlist-item-${p.id}`}
                    onClick={() => {
                      onSelectProduct(p);
                      onClose();
                    }}
                    className="bg-[#F7FEE7] border border-[#ECFCCB]/50 px-3.5 py-4 rounded-2xl flex gap-3.5 items-center justify-between relative group cursor-pointer hover:shadow-md transition-all duration-300"
                  >
                    
                    {/* Circle/Box Image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-[#ECFCCB] shrink-0">
                      <ProductImage
                        productId={p.id}
                        src={p.images[0]}
                        alt={p.name}
                        className="w-full h-full object-contain p-1 bg-[#F7FEE7]"
                        showUploadButton={false}
                      />
                    </div>

                    {/* Mid details */}
                    <div className="flex-1 truncate">
                      <span className="text-[9px] font-bold text-[#10B981] block uppercase font-mono">{p.localName}</span>
                      <h4 className="text-xs sm:text-sm font-serif font-bold text-[#064E3B] truncate block group-hover:text-[#10B981] transition-colors">{p.name}</h4>
                      <p className="text-[10px] text-[#10B981] font-semibold font-mono mt-0.5">
                        ₹{p.price} <span className="text-[#064E3B]/50 font-normal">/{p.unit} Base</span>
                      </p>
                    </div>

                    {/* Actions and Trashes */}
                    <div className="flex items-center gap-1">
                      <button
                        id={`wishlist-cart-${p.id}`}
                        onClick={(e) => triggerAddToCart(p, e)}
                        className="p-2 hover:bg-gradient-to-r hover:from-[#10B981] hover:to-[#059669] hover:text-white hover:border-transparent bg-white border border-[#ECFCCB] text-[#064E3B]/70 rounded-xl transition-all shadow-xs cursor-pointer"
                        title="Add base pack to Cart"
                      >
                        <ShoppingCart className="h-4 w-4" />
                      </button>
                      <button
                        id={`wishlist-trash-${p.id}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveFromWishlist(p.id);
                        }}
                        className="p-2 text-[#064E3B]/50 hover:text-[#10B981] rounded-xl hover:bg-[#F7FEE7]/50 transition-colors cursor-pointer"
                        title="Delete from wishlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Bottom Actions columns */}
            <div className="p-6 border-t border-[#ECFCCB]/50 bg-[#F7FEE7]">
              <button
                id="wishlist-close-bottom-btn"
                onClick={onClose}
                className="w-full bg-[#064E3B] hover:bg-black text-white text-xs font-bold tracking-widest uppercase py-3.5 rounded-xl cursor-pointer"
              >
                Close Saved Items
              </button>
            </div>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
