/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data';
import { Heart, ShoppingCart, Clock, Check, ChevronDown, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductImage } from './ProductImage';

interface CatchProductGridProps {
  wishlist: string[];
  onToggleWishlist: (productId: string) => void;
  onAddToCart: (product: Product, weight: string, processing: string, qty: number) => void;
  onSelectProduct: (product: Product) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  searchTerm: string;
}

export default function CatchProductGrid({
  wishlist,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  selectedCategory,
  setSelectedCategory,
  searchTerm
}: CatchProductGridProps) {
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('popular'); // popular, price-low, price-high, fresh
  const [selectedWeights, setSelectedWeights] = useState<{ [productId: string]: string }>({});
  const [selectedProcessings, setSelectedProcessings] = useState<{ [productId: string]: string }>({});
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null);

  // Re-sync page 1 on filter trigger
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy]);

  // Categories list
  const filterPills = [
    { label: 'All', id: 'all' },
    { label: 'Fish', id: 'fish' },
    { label: 'Prawns', id: 'prawns' },
    { label: 'Crab', id: 'crab' },
    { label: 'Lobster', id: 'lobster' }
  ];

  // Process, filter & sort products
  const processedProducts = useMemo(() => {
    let result = [...PRODUCTS].filter(p => p.category !== 'dry-fish' && p.category !== 'premium');

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.localName.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term) ||
        p.catchLocation.toLowerCase().includes(term)
      );
    }

    // Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'fresh') {
      result.sort((a, b) => (b.isFreshToday ? 1 : 0) - (a.isFreshToday ? 1 : 0));
    } else {
      // popular / default
      result.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }

    return result;
  }, [selectedCategory, searchTerm, sortBy]);

  const paginatedProducts = processedProducts;
  const hasMore = false;

  const handleWeightChange = (productId: string, weight: string) => {
    setSelectedWeights(prev => ({ ...prev, [productId]: weight }));
  };

  const handleProcessingChange = (productId: string, processing: string) => {
    setSelectedProcessings(prev => ({ ...prev, [productId]: processing }));
  };

  const triggerAddToCart = (product: Product) => {
    const weight = selectedWeights[product.id] || product.availableWeights[0];
    const processing = selectedProcessings[product.id] || product.processingOptions[0] || 'Whole Cleaned';
    
    setAddingToCartId(product.id);
    onAddToCart(product, weight, processing, 1);
    
    setTimeout(() => {
      setAddingToCartId(null);
    }, 800);
  };

  // Get dynamic adjusted price based on selected weight multiplier
  const getAdjustedPrice = (product: Product) => {
    const weight = selectedWeights[product.id] || product.availableWeights[0];
    const multiplier = product.weightMultipliers[weight] || 1;
    return Math.round(product.price * multiplier);
  };

  return (
    <section id="fresh-catch" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:lg:px-8">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFDF7] border border-[#FF7F50]/20 rounded-full mb-3 text-[10px] uppercase font-bold text-[#1B3A4B] tracking-wider">
              <RefreshCw className="h-3 w-3 animate-spin duration-3000 text-[#14B8A6]" />
              <span>Live: Sourced At Dawn Today</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-[#1B3A4B] tracking-tight">
              Today's Fresh Catch
            </h2>
            <p className="text-sm text-[#1B3A4B]/70 mt-2 max-w-xl font-sans">
              Locally sourced directly from ocean boats at 4:30 AM, thoroughly checked for chemical freshness, processed beautifully in sterile corridors.
            </p>
          </div>

          {/* Sort Menu */}
          <div className="flex items-center gap-2 self-start md:self-auto bg-[#FFFDF7] border border-[#FDE68A] p-1.5 rounded-2xl">
            <span className="text-[11px] font-semibold text-[#1B3A4B]/70 uppercase tracking-wider pl-3 font-mono">Sort By:</span>
            <div className="relative">
              <select
                id="catch-sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-bold text-[#1B3A4B] pr-8 pl-2 py-1.5 focus:outline-none appearance-none cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price Low to High</option>
                <option value="price-high">Price High to Low</option>
                <option value="fresh">Freshness Priority</option>
              </select>
              <ChevronDown className="h-4.5 w-4.5 absolute right-2 top-1.5 pointer-events-none text-[#1B3A4B]/70" />
            </div>
          </div>
        </div>

        {/* Filter Pills Tab bar */}
        <div className="flex items-center gap-3 overflow-x-auto pb-5 mb-10 scrollbar-none border-b border-[#FDE68A]/50">
          {filterPills.map((pill) => (
            <button
              key={pill.id}
              id={`filter-pill-${pill.id}`}
              onClick={() => setSelectedCategory(pill.id)}
              className={`px-7 py-3 rounded-2xl text-sm sm:text-base md:text-lg font-extrabold tracking-wider cursor-pointer transition-all duration-300 ${
                selectedCategory === pill.id
                  ? 'bg-[#FF7F50] text-white shadow-lg shadow-[#1B3A4B]/10 scale-105'
                  : 'bg-[#FFFDF7] hover:bg-[#FFFDF7] text-[#1B3A4B]/70 hover:shadow-md'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>

        {/* Dynamic Catalog Results Header */}
        <div className="flex justify-between items-center mb-6 text-xs text-[#1B3A4B]/50 font-mono">
          <span>Showing {paginatedProducts.length} of {processedProducts.length} seafood selections</span>
          {searchTerm && <span>Filtered by: "{searchTerm}"</span>}
        </div>

        {/* No Results Block */}
        {processedProducts.length === 0 && (
          <div className="text-center py-20 bg-[#FFFDF7] rounded-3xl p-6">
            <ShoppingCart className="h-12 w-12 text-[#FDE68A] mx-auto mb-4" />
            <h4 className="text-[#1B3A4B] font-serif text-lg font-bold">No seafood found</h4>
            <p className="text-xs text-[#1B3A4B]/70 mt-1 max-w-sm mx-auto">We couldn't find matching items. Please adjust filters or clear the active product text search bar.</p>
            <button
              id="clear-filters-btn"
              onClick={() => {
                setSelectedCategory('all');
                setSortBy('popular');
              }}
              className="mt-4 px-4 py-2 bg-[#1B3A4B] hover:bg-[#1B3A4B] text-white rounded-xl text-xs font-semibold cursor-pointer"
            >
              Reset Category Filters
            </button>
          </div>
        )}

        {/* Product Grid */}
        <div id="product-grid" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {paginatedProducts.map((p) => {
              const weightSelected = selectedWeights[p.id] || p.availableWeights[0];
              const processingSelected = selectedProcessings[p.id] || p.processingOptions[0] || 'Whole Cleaned';
              const isWishlisted = wishlist.includes(p.id);
              const isFresh = p.isFreshToday;
              const isBest = p.isBestSeller;
              const isFirstAdded = addingToCartId === p.id;
              
              const currentPrice = getAdjustedPrice(p);

              return (
                <motion.div
                  key={p.id}
                  id={`product-card-${p.id}`}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group bg-white rounded-2xl border border-[#FDE68A]/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden relative"
                >
                  
                  {/* Image Container */}
                  <div className="relative aspect-square overflow-hidden bg-[#FFFDF7] select-none cursor-pointer" onClick={() => onSelectProduct(p)}>
                    <ProductImage
                      productId={p.id}
                      src={p.images[0]}
                      alt={p.name}
                      className="w-full h-full object-contain p-2"
                    />

                    {/* Gradient Shadow bottom of image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent z-10" />

                    {/* Left Badges */}
                    <div className="absolute top-3 left-3 z-25 flex flex-col gap-1.5">
                      {isFresh && (
                        <span className="bg-[#14B8A6] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm font-sans">
                          <Clock className="w-3 h-3" />
                          <span>Fresh Today</span>
                        </span>
                      )}
                      {isBest && (
                        <span className="bg-[#FF7F50] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-lg flex items-center shadow-sm font-sans">
                          Best Seller
                        </span>
                      )}
                    </div>

                    {/* Right Wishlist toggle */}
                    <button
                      id={`wishlist-btn-${p.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWishlist(p.id);
                      }}
                      className="absolute top-3 right-3 z-25 p-2 bg-white/70 hover:bg-white backdrop-blur-md text-[#1B3A4B]/80 hover:text-[#FF7F50] rounded-xl transition-all cursor-pointer shadow-sm"
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-[#FF7F50] text-[#FF7F50]' : ''}`} />
                    </button>

                    {/* Location Badge */}
                    <span className="absolute bottom-3 left-3 z-20 text-[10px] font-semibold font-mono tracking-wide text-white bg-black/45 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                      {p.catchLocation}
                    </span>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Sub-label & rating */}
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold tracking-widest text-[#FF7F50] uppercase font-mono">
                          {p.localName}
                        </span>
                        <div className="flex items-center gap-1 font-sans">
                          <span className="text-[#FF7F50] text-xs font-bold">★</span>
                          <span className="text-[11px] font-semibold text-[#1B3A4B]/80">{p.rating}</span>
                        </div>
                      </div>

                      {/* Main Name */}
                      <button
                        id={`product-title-${p.id}`}
                        onClick={() => onSelectProduct(p)}
                        className="font-serif text-base font-bold text-[#1B3A4B] tracking-tight hover:text-[#FF7F50] text-left block w-full truncate focus:outline-none cursor-pointer"
                      >
                        {p.name}
                      </button>

                      {/* Snippet Description */}
                      <p className="text-[11px] text-[#1B3A4B]/70 font-light mt-1.5 leading-relaxed line-clamp-2">
                        {p.description}
                      </p>

                      {/* Weight Selector */}
                      <div className="mt-4 flex items-center justify-between gap-1 group/select">
                        <span className="text-[11px] font-medium text-[#1B3A4B]/50 font-mono">Select Weight:</span>
                        <div className="relative">
                          <select
                            id={`weight-select-${p.id}`}
                            value={weightSelected}
                            onChange={(e) => handleWeightChange(p.id, e.target.value)}
                            className="bg-[#FFFDF7] border border-[#FDE68A] text-[11px] font-bold text-[#1B3A4B]/80 pr-6 pl-2 py-1 rounded-lg appearance-none focus:outline-none cursor-pointer group-hover/select:border-[#FF7F50] transition-colors"
                          >
                            {p.availableWeights.map(w => (
                              <option key={w} value={w}>{w}</option>
                            ))}
                          </select>
                          <ChevronDown className="h-3 w-3 absolute right-1.5 top-1.5 pointer-events-none text-[#1B3A4B]/50" />
                        </div>
                      </div>

                      {/* Processing Selector (if available) */}
                      {p.processingOptions.length > 0 && (
                        <div className="mt-2 flex items-center justify-between gap-1 group/select">
                          <span className="text-[11px] font-medium text-[#1B3A4B]/50 font-mono">Cuts:</span>
                          <div className="relative">
                            <select
                              id={`processing-select-${p.id}`}
                              value={processingSelected}
                              onChange={(e) => handleProcessingChange(p.id, e.target.value)}
                              className="bg-[#FFFDF7] border border-[#FDE68A] text-[11px] font-bold text-[#1B3A4B]/80 pr-6 pl-2 py-1 rounded-lg appearance-none focus:outline-none cursor-pointer group-hover/select:border-[#FF7F50] transition-colors"
                            >
                              {p.processingOptions.map(o => (
                                <option key={o} value={o}>{o}</option>
                              ))}
                            </select>
                            <ChevronDown className="h-3 w-3 absolute right-1.5 top-1.5 pointer-events-none text-[#1B3A4B]/50" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom controls */}
                    <div className="mt-5 pt-3 border-t border-[#FDE68A]/50 flex items-center justify-between">
                      {/* Price column */}
                      <div className="flex flex-col">
                        <div className="flex items-baseline gap-1">
                          <span className="text-sm font-bold text-[#1B3A4B]">₹</span>
                          <span className="text-lg font-bold text-[#1B3A4B]">{currentPrice}</span>
                        </div>
                        <span className="text-[10px] text-[#1B3A4B]/50 tracking-wide font-mono font-medium">/{weightSelected} pack</span>
                      </div>

                      {/* Cart CTA */}
                      <button
                        id={`add-to-cart-btn-${p.id}`}
                        onClick={() => triggerAddToCart(p)}
                        className={`px-4 py-2.5 rounded-xl cursor-pointer text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1.5 shadow-sm ${
                          isFirstAdded
                            ? 'bg-[#14B8A6] text-white shadow-[#14B8A6]/20'
                            : 'bg-gradient-to-r from-[#FF7F50] to-[#14B8A6] text-white hover:from-[#E96D3E] hover:to-[#0D9488] hover:shadow-md shadow-[#14B8A6]/20'
                        }`}
                      >
                        {isFirstAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>Add</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
