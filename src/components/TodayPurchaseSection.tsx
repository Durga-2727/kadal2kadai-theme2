/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data';
import { ShoppingCart, Check, ChevronDown, PackageCheck, Zap } from 'lucide-react';
import { ProductImage } from './ProductImage';

interface TodayPurchaseSectionProps {
  onAddToCart: (product: Product, weight: string, processing: string, qty: number) => void;
  onSelectProduct: (product: Product) => void;
}

interface PurchaseStats {
  productId: string;
  count: number;
  demandPercentage: number;
  popularityLabel: string;
}

export default function TodayPurchaseSection({
  onAddToCart,
  onSelectProduct
}: TodayPurchaseSectionProps) {
  const [selectedWeights, setSelectedWeights] = useState<{ [productId: string]: string }>({});
  const [selectedProcessings, setSelectedProcessings] = useState<{ [productId: string]: string }>({});
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  // Pick 10 random products once per page session
  const recentPurchasesProducts = useMemo(() => {
    if (PRODUCTS.length === 0) return [];
    // Shuffle a copy of PRODUCTS and take 10 items
    const shuffled = [...PRODUCTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  }, []);

  const popularityLabels = [
    '🔥 Near Sold Out',
    '⚡ High Volume',
    '🔥 Trending #1',
    '✨ Chef Choice',
    '⚡ Active Orders',
    '🔥 Household Favorite',
    '✨ Rare Catch',
    '⚡ Salt Sourced',
    '🔥 Hot Deal',
    '🔥 Over 70 Ordered'
  ];

  // Dynamically assign realistic stats to the selected random items
  const purchaseStats = useMemo(() => {
    const stats: { [id: string]: { count: number; demandPercentage: number; popularityLabel: string } } = {};
    recentPurchasesProducts.forEach((p, idx) => {
      const count = Math.floor(15 + Math.random() * 60);
      const demandPercentage = Math.floor(70 + Math.random() * 29);
      const popularityLabel = popularityLabels[idx % popularityLabels.length];
      stats[p.id] = { count, demandPercentage, popularityLabel };
    });
    return stats;
  }, [recentPurchasesProducts]);

  if (recentPurchasesProducts.length === 0) {
    return null;
  }

  // Double the list to support perfect 0 to -50% infinite scrolling loop
  const doubleProducts = useMemo(() => {
    return [...recentPurchasesProducts, ...recentPurchasesProducts];
  }, [recentPurchasesProducts]);

  const handleWeightChange = (productId: string, weight: string) => {
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };

  const handleProcessingChange = (productId: string, processing: string) => {
    setSelectedProcessings(prev => ({ ...prev, [productId]: processing }));
  };

  const getAdjustedPrice = (product: Product) => {
    const weight = selectedWeights[product.id] || product.availableWeights[0];
    const multiplier = product.weightMultipliers[weight] || 1;
    return Math.round(product.price * multiplier);
  };

  const triggerAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const weight = selectedWeights[product.id] || product.availableWeights[0];
    const processing = selectedProcessings[product.id] || product.processingOptions[0] || 'Whole Cleaned';
    
    setAddingToCartId(product.id);
    onAddToCart(product, weight, processing, 1);
    
    setTimeout(() => {
      setAddingToCartId(null);
    }, 800);
  };

  return (
    <section id="recent-purchases" className="py-10 sm:py-12 bg-white overflow-hidden relative">
      {/* Background soft styling lines for sea concept */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ECFCCB] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F7FEE7] border border-[#10B981]/20 rounded-full mb-3 text-[10px] sm:text-xs uppercase font-bold text-[#064E3B] tracking-wider font-mono">
            <PackageCheck className="h-4.5 w-4.5 text-[#10B981]" />
            <span>Community Social Proof</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-[#064E3B] tracking-tight">
            Today's Purchases
          </h2>
          <div className="w-16 h-1 bg-[#F7FEE7]0 mx-auto mt-4 rounded-full" />
          <p className="text-xs sm:text-sm text-[#064E3B]/70 mt-4 leading-relaxed font-sans max-w-xl mx-auto">
            Real-time visual diary of what other coastal lovers are cooking right now in their Chennai kitchens. Direct from Dawn, dispatched to home.
          </p>
        </div>

        {/* Endless Moving Carousel Belt Wrapper */}
        {/* Uses .animate-marquee-right for staggered movement contrast to 'Top Selling' section */}
        <div className="relative w-full overflow-hidden pause-marquee -mx-4 sm:mx-0">
          {/* Edge Blur Faders */}
          <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-20 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-20 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

          {/* Scrolling Marquee Container scrolling from left-to-right (opposite) */}
          <div className="animate-marquee-right flex gap-6 py-4 px-4 sm:px-0">
            {doubleProducts.map((p, idx) => {
              const weightSelected = selectedWeights[p.id] || p.availableWeights[0];
              const processingSelected = selectedProcessings[p.id] || p.processingOptions[0] || 'Whole Cleaned';
              const isFirstAdded = addingToCartId === p.id;
              const currentPrice = getAdjustedPrice(p);
              
              // Extract seeded statistics
              const stats = purchaseStats[p.id] || { count: 25, demandPercentage: 80, popularityLabel: '⚡ Popular choice' };

              return (
                <div
                  key={`${p.id}-purchase-${idx}`}
                  id={`purchase-card-${p.id}-${idx}`}
                  className="w-[200px] sm:w-[240px] lg:w-[250px] shrink-0 group bg-[#F7FEE7]/50 rounded-2xl border border-[#ECFCCB]/50/85 hover:bg-white hover:border-[#ECFCCB]/50 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden relative cursor-pointer"
                  onClick={() => onSelectProduct(p)}
                >
                  {/* Image Block */}
                  <div className="relative aspect-square overflow-hidden bg-[#F7FEE7] select-none">
                    <ProductImage
                      productId={p.id}
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-contain p-2"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent z-10" />

                    {/* Left Badges */}
                    <div className="absolute top-2.5 left-2.5 z-25 flex flex-col gap-1.5">
                      <span className="bg-[#A3E635] text-white text-[8px] sm:text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg flex items-center gap-0.5 shadow-sm font-sans">
                        <Zap className="w-2.5 h-2.5 text-[#10B981] fill-[#10B981]" />
                        <span>Recently Bought</span>
                      </span>
                    </div>

                    {/* Social proof absolute countdown strip */}
                    <div className="absolute bottom-2.5 left-2.5 z-20 text-[9px] font-bold font-sans text-white bg-[#10B981]/90 backdrop-blur-xs px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-sm">
                      <span className="w-1.5 h-1.5 bg-[#ECFCCB] rounded-full animate-ping" />
                      <span>{stats.count} households bought today</span>
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Sub-label and Popularity Indicator */}
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-[#10B981] uppercase font-mono block max-w-[120px] truncate">
                          {p.localName}
                        </span>
                        <span className="text-[9px] font-bold text-[#064E3B]/70 font-sans tracking-wide shrink-0">
                          {stats.popularityLabel}
                        </span>
                      </div>

                      {/* Name of Product */}
                      <p className="font-serif text-sm sm:text-base font-bold text-[#064E3B] tracking-tight group-hover:text-[#10B981] transition-colors truncate">
                        {p.name}
                      </p>

                      {/* Dynamic demand indicator bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-[8px] sm:text-[9px] font-medium font-mono text-[#064E3B]/50 mb-1">
                          <span>Demand Level:</span>
                          <span className="font-bold text-[#064E3B]/80">{stats.demandPercentage}%</span>
                        </div>
                        <div className="w-full h-1 bg-[#ECFCCB]/60 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#F7FEE7]0 rounded-full transition-all duration-1000" 
                            style={{ width: `${stats.demandPercentage}%` }}
                          />
                        </div>
                      </div>

                      {/* Weight Selector */}
                      <div className="mt-3.5 flex items-center justify-between gap-1 group/select" onClick={(e) => e.stopPropagation()}>
                        <span className="text-[10px] font-medium text-[#064E3B]/50 font-mono">Weight:</span>
                        <div className="relative">
                          <select
                            id={`purchase-weight-select-${p.id}-${idx}`}
                            value={weightSelected}
                            onChange={(e) => handleWeightChange(p.id, e.target.value)}
                            className="bg-[#F7FEE7] border border-[#ECFCCB]/50 text-[10px] font-bold text-[#064E3B]/80 pr-5 pl-1.5 py-0.5 rounded-md appearance-none focus:outline-none cursor-pointer group-hover/select:border-[#10B981] transition-all"
                          >
                            {p.availableWeights.map(w => (
                              <option key={w} value={w}>{w}</option>
                            ))}
                          </select>
                          <ChevronDown className="h-3 w-3 absolute right-1 top-1 pointer-events-none text-[#064E3B]/50" />
                        </div>
                      </div>

                      {/* Processing options */}
                      {p.processingOptions.length > 0 && (
                        <div className="mt-1.5 flex items-center justify-between gap-1 group/select" onClick={(e) => e.stopPropagation()}>
                          <span className="text-[10px] font-medium text-[#064E3B]/50 font-mono font-light">Cuts:</span>
                          <div className="relative">
                            <select
                              id={`purchase-processing-select-${p.id}-${idx}`}
                              value={processingSelected}
                              onChange={(e) => handleProcessingChange(p.id, e.target.value)}
                              className="bg-[#F7FEE7] border border-[#ECFCCB]/50 text-[10px] font-bold text-[#064E3B]/80 pr-5 pl-1.5 py-0.5 rounded-md appearance-none focus:outline-none cursor-pointer"
                            >
                              {p.processingOptions.map(o => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                            <ChevronDown className="h-3 w-3 absolute right-1 top-1 pointer-events-none text-[#064E3B]/50" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom strip Price & Add Button */}
                    <div className="mt-4 pt-2.5 border-t border-[#ECFCCB]/50 flex items-center justify-between">
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xs font-bold text-[#064E3B]">₹</span>
                          <span className="text-base font-extrabold text-[#064E3B]">{currentPrice}</span>
                        </div>
                        <span className="text-[9px] text-[#064E3B]/50 font-mono">/{weightSelected}</span>
                      </div>

                      <button
                        id={`purchase-add-btn-${p.id}-${idx}`}
                        onClick={(e) => triggerAddToCart(e, p)}
                        className={`p-2 px-3 rounded-xl cursor-pointer text-[10px] sm:text-xs font-extrabold transition-all duration-300 flex items-center gap-1 shadow-sm ${
                          isFirstAdded
                            ? 'bg-[#A3E635] text-white shadow-[#A3E635]/10'
                            : 'bg-gradient-to-r from-[#10B981] to-[#059669] text-white hover:from-[#059669] hover:to-[#65A30D] hover:shadow-md shadow-[#10B981]/20'
                        }`}
                      >
                        {isFirstAdded ? (
                          <>
                            <Check className="h-3 w-3" />
                            <span className="hidden sm:inline">Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-3 w-3" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
