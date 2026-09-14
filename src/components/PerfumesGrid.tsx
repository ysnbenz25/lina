import React, { useState } from 'react';
import { Perfume } from '../types';
import { ShoppingBag, Eye, Heart, Star, Sparkles, Check, Edit3, Trash2, Info } from 'lucide-react';

interface PerfumesGridProps {
  perfumes: Perfume[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm?: string;
  onAddToCart: (perfume: Perfume, quantity?: number, selectedSize?: string) => void;
  onOpenQuickView: (perfume: Perfume) => void;
  isAdminMode?: boolean;
  onDeletePerfume?: (id: number) => void;
  onOpenAdminModal?: () => void;
}

export const CATEGORY_TABS = [
  'الكل',
  'عطور نسائية',
  'عطور رجالية',
  'عطور للجنسين',
  'العطور الزيتية',
  'الأكثر مبيعاً',
  'العروض',
  'أحجام صغيرة',
  'أحجام كبيرة',
];

export const PerfumesGrid: React.FC<PerfumesGridProps> = ({
  perfumes,
  selectedCategory,
  onSelectCategory,
  searchTerm = '',
  onAddToCart,
  onOpenQuickView,
  isAdminMode = false,
  onDeletePerfume,
  onOpenAdminModal,
}) => {
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Track currently selected size for each card
  const [cardSelectedSizes, setCardSelectedSizes] = useState<Record<number, string>>({});

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id];
      try {
        localStorage.setItem('lina_shop_favorites', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Filter perfumes based on category and search term
  const filteredPerfumes = perfumes.filter((p) => {
    let matchesCategory = false;

    if (selectedCategory === 'الكل') {
      matchesCategory = true;
    } else if (selectedCategory === 'عطور نسائية') {
      matchesCategory = p.category === 'عطور نسائية' || p.gender === 'women';
    } else if (selectedCategory === 'عطور رجالية') {
      matchesCategory = p.category === 'عطور رجالية' || p.gender === 'men';
    } else if (selectedCategory === 'عطور للجنسين') {
      matchesCategory = p.category === 'عطور للجنسين' || p.gender === 'unisex';
    } else if (selectedCategory === 'العطور الزيتية') {
      matchesCategory = p.category === 'العطور الزيتية' || p.fragranceType?.includes('زيتي');
    } else if (selectedCategory === 'الأكثر مبيعاً') {
      matchesCategory = !!(p.isBestseller || p.isMostDemanded || p.badge?.includes('مبيعاً') || p.badge?.includes('طلباً'));
    } else if (selectedCategory === 'العروض' || selectedCategory === 'عروض خاصة') {
      matchesCategory = !!(p.isSpecialOffer || (p.originalPrice && p.originalPrice > p.price));
    } else if (selectedCategory === 'أحجام صغيرة') {
      const allSizes = p.sizeOptions?.map(s => s.size) || p.sizes || [];
      matchesCategory = allSizes.some(s => s.includes('5') || s.includes('10') || s.includes('15') || s.includes('20'));
    } else if (selectedCategory === 'أحجام كبيرة') {
      const allSizes = p.sizeOptions?.map(s => s.size) || p.sizes || [];
      matchesCategory = allSizes.some(s => s.includes('50') || s.includes('100'));
    } else {
      matchesCategory = p.category === selectedCategory;
    }

    const matchesSearch =
      !searchTerm ||
      p.arabicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.inspiredBy && p.inspiredBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.notes?.top && p.notes.top.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.notes?.heart && p.notes.heart.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.notes?.base && p.notes.base.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-16 md:py-24 bg-[#241B18] border-t border-[#D8C8B8]/15 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div className="text-right space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#722F3F]/20 border border-[#D6B56A]/30 text-[#D6B56A] text-xs font-serif tracking-[0.2em] uppercase font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B56A]" />
              <span>COLLECTION LINA SHOP • تونس</span>
            </div>
            <h2 id="products-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#F7F1E8] tracking-tight">
              العطور والتركيبات المتوفرة
            </h2>
            <p className="text-[#D8C8B8] text-xs sm:text-sm max-w-xl leading-relaxed">
              عطور زيتية مركزة وتركيبات مستوحاة من أشهر الروائح؛ اختر الحجم المناسب لميزانيتك بأسعار رمزية مع توصيل لكافة ولايات تونس الـ 24.
            </p>
          </div>

          {/* Transparency Alert Box */}
          <div className="p-3.5 rounded-xl bg-[#332522] border border-[#D6B56A]/30 flex items-start gap-2.5 max-w-md text-right shadow-sm">
            <Info className="w-4 h-4 text-[#D6B56A] shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#D8C8B8] leading-relaxed">
              <strong className="text-[#FFF9F1] font-medium">ملاحظة الشفافية:</strong> جميع العطور المعروضة هي تركيبات وزيوت عطرية مستوحاة من روائح العطور العالمية، وليست العطور الأصلية التابعة لتلك الشركات.
            </p>
          </div>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORY_TABS.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-serif whitespace-nowrap transition-all cursor-pointer border shrink-0 ${
                  isSelected
                    ? 'bg-[#722F3F] text-[#FFF9F1] font-bold border-[#D6B56A]/60 shadow-md shadow-[#722F3F]/30'
                    : 'bg-[#332522] text-[#D8C8B8] border-[#D8C8B8]/20 hover:border-[#D6B56A]/50 hover:text-[#FFF9F1]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Status */}
        {searchTerm && (
          <div className="mb-8 p-3.5 bg-[#332522] rounded-xl border border-[#D8C8B8]/20 flex items-center justify-between text-xs">
            <span className="text-[#D8C8B8]">
              نتائج البحث عن: <strong className="text-[#D6B56A]">"{searchTerm}"</strong> ({filteredPerfumes.length} عطر)
            </span>
            <button
              onClick={() => onSelectCategory('الكل')}
              className="text-[#C98F91] hover:text-[#FFF9F1] underline cursor-pointer"
            >
              عرض كافة العطور
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-20 bg-[#332522] rounded-2xl border border-[#D8C8B8]/20 space-y-4">
            <p className="text-[#D8C8B8] text-sm font-serif">لم يتم العثور على عطور تطابق اختيارك الحالي.</p>
            <button
              onClick={() => onSelectCategory('الكل')}
              className="px-6 py-2.5 bg-[#722F3F] hover:bg-[#D6B56A] hover:text-[#241B18] text-[#FFF9F1] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-md"
            >
              عرض كافة العطور
            </button>
          </div>
        ) : (
          /* Products Grid: 4 columns on desktop, 3 on tablet, 2 on mobile */
          <div id="perfumes-grid" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredPerfumes.map((perfume) => {
              const isFav = favorites.includes(perfume.id);

              // Available sizes options for dynamic pricing
              const sizeOptions = perfume.sizeOptions && perfume.sizeOptions.length > 0
                ? perfume.sizeOptions
                : (perfume.sizes || ['30ml', '50ml', '100ml']).map((s, idx) => ({
                    size: s,
                    price: idx === 0 ? perfume.price : Math.round(perfume.price * (1 + idx * 0.45)),
                    originalPrice: perfume.originalPrice ? Math.round(perfume.originalPrice * (1 + idx * 0.45)) : undefined
                  }));

              const defaultSize = sizeOptions[0]?.size || '30ml';
              const currentSize = cardSelectedSizes[perfume.id] || defaultSize;
              const currentOption = sizeOptions.find((opt) => opt.size === currentSize) || sizeOptions[0];

              const currentPrice = currentOption ? currentOption.price : perfume.price;
              const currentOriginalPrice = currentOption?.originalPrice || perfume.originalPrice;
              const hasDiscount = currentOriginalPrice && currentOriginalPrice > currentPrice;
              const discountPercent = hasDiscount
                ? Math.round(((currentOriginalPrice - currentPrice) / currentOriginalPrice) * 100)
                : 0;

              return (
                <div
                  key={perfume.id}
                  id={`perfume-card-${perfume.id}`}
                  className="group bg-[#332522]/90 rounded-2xl border border-[#D8C8B8]/20 hover:border-[#D6B56A] p-3 sm:p-4 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#D6B56A]/10 relative backdrop-blur-sm"
                >
                  {/* Admin controls */}
                  {isAdminMode && (
                    <div className="absolute top-2 left-2 z-30 flex items-center gap-1">
                      {onOpenAdminModal && (
                        <button
                          onClick={onOpenAdminModal}
                          className="bg-[#D6B56A] hover:bg-[#ebd59b] text-[#241B18] p-1.5 rounded-lg text-xs font-bold shadow-lg"
                          title="تعديل هذا العطر"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      )}
                      {onDeletePerfume && (
                        <button
                          onClick={() => onDeletePerfume(perfume.id)}
                          className="bg-[#722F3F] hover:bg-rose-700 text-white p-1.5 rounded-lg text-xs shadow-lg"
                          title="حذف هذا العطر"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Top Image Box */}
                  <div
                    className="relative overflow-hidden rounded-xl bg-[#1A1311] aspect-square mb-3 cursor-pointer border border-[#D8C8B8]/10"
                    onClick={() => onOpenQuickView(perfume)}
                  >
                    <img
                      src={perfume.image}
                      alt={perfume.arabicName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#241B18]/90 via-[#241B18]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Badge (Bestseller, New, Offer, etc.) */}
                    {perfume.badge && (
                      <div className="absolute top-2.5 right-2.5 z-20">
                        <span className="px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded-md bg-[#D6B56A] text-[#241B18] font-serif shadow-md whitespace-nowrap">
                          {perfume.badge}
                        </span>
                      </div>
                    )}

                    {/* Discount Pill if on sale */}
                    {hasDiscount && (
                      <div className="absolute bottom-2.5 right-2.5 z-20">
                        <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#722F3F] text-[#FFF9F1] border border-[#D6B56A]/40 font-sans shadow-md">
                          -{discountPercent}%
                        </span>
                      </div>
                    )}

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(perfume.id, e)}
                      className={`absolute top-2.5 left-2.5 z-20 p-1.5 sm:p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                        isFav
                          ? 'bg-[#722F3F] text-white border-[#D6B56A]/50 scale-105 shadow-md'
                          : 'bg-[#241B18]/70 text-[#D8C8B8] border-white/10 hover:text-[#C98F91]'
                      }`}
                      aria-label="إضافة للمفضلة"
                    >
                      <Heart className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isFav ? 'fill-white' : ''}`} />
                    </button>

                    {/* Quick View Button on Hover (Desktop) */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuickView(perfume);
                      }}
                      className="hidden sm:flex absolute inset-x-3 bottom-2.5 py-2 bg-[#241B18]/95 hover:bg-[#D6B56A] hover:text-[#241B18] text-[#F7F1E8] text-[11px] font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 border border-[#D6B56A]/40 items-center justify-center gap-1 backdrop-blur-md cursor-pointer shadow-md"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>تفاصيل العطر</span>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-2 text-right flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta Tags: Fragrance Type & Gender */}
                      <div className="flex items-center justify-between text-[10px] text-[#D8C8B8]">
                        <span className="text-[#D6B56A] font-serif font-medium truncate max-w-[65%]">
                          {perfume.fragranceType || (perfume.category === 'العطور الزيتية' ? 'عطر زيتي مركز' : 'تركيبة مستوحاة')}
                        </span>
                        <div className="flex items-center gap-1 text-[#D6B56A] shrink-0">
                          <Star className="w-3 h-3 fill-[#D6B56A]" />
                          <span className="font-semibold text-[10px] text-[#F7F1E8]">{perfume.rating || 4.9}</span>
                        </div>
                      </div>

                      {/* Perfume Arabic Name */}
                      <h3
                        onClick={() => onOpenQuickView(perfume)}
                        className="text-xs sm:text-sm font-bold text-[#FFF9F1] font-serif mt-1 group-hover:text-[#D6B56A] transition-colors cursor-pointer line-clamp-1"
                      >
                        {perfume.arabicName}
                      </h3>

                      {/* Inspired by subtext in Dusty Rose */}
                      <p className="text-[10px] sm:text-[11px] text-[#C98F91] font-sans truncate font-medium">
                        {perfume.inspiredBy ? `مستوحى من: ${perfume.inspiredBy}` : perfume.name}
                      </p>

                      {/* Size Selector Chips on Card for Dynamic Price */}
                      <div className="mt-2.5 pt-2 border-t border-[#D8C8B8]/15 space-y-1">
                        <span className="text-[9px] text-[#D8C8B8] block font-medium">
                          الأحجام والأسعار:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {sizeOptions.map((opt) => (
                            <button
                              key={opt.size}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardSelectedSizes((prev) => ({ ...prev, [perfume.id]: opt.size }));
                              }}
                              className={`px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold transition-all cursor-pointer border ${
                                currentSize === opt.size
                                  ? 'bg-[#D6B56A] text-[#241B18] border-[#D6B56A] font-bold shadow-sm'
                                  : 'bg-[#241B18] text-[#D8C8B8] border-[#D8C8B8]/20 hover:border-[#D6B56A]/50'
                              }`}
                            >
                              {opt.size}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pricing & CTA Actions */}
                    <div className="pt-2 border-t border-[#D8C8B8]/15 space-y-2 mt-2">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base sm:text-lg font-bold text-[#D6B56A] font-sans">
                            {currentPrice} د.ت
                          </span>
                          {hasDiscount && (
                            <span className="text-[10px] sm:text-xs text-[#D8C8B8]/60 line-through font-sans">
                              {currentOriginalPrice} د.ت
                            </span>
                          )}
                        </div>
                        <span className="text-[9px] text-[#D8C8B8]">
                          لكل {currentSize}
                        </span>
                      </div>

                      {/* Two Action Buttons: Details + Quick Add */}
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenQuickView(perfume)}
                          className="py-1.5 sm:py-2 px-2 bg-transparent hover:bg-white/5 text-[#F7F1E8] rounded-xl text-[11px] font-semibold border border-[#D8C8B8]/30 hover:border-[#D6B56A] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-[#D6B56A]" />
                          <span>تفاصيل</span>
                        </button>

                        <button
                          type="button"
                          id={`add-to-cart-btn-${perfume.id}`}
                          onClick={() => {
                            const customizedPerfume = {
                              ...perfume,
                              price: currentPrice,
                              originalPrice: currentOriginalPrice || perfume.originalPrice,
                              volume: currentSize,
                            };
                            onAddToCart(customizedPerfume, 1, currentSize);
                          }}
                          className="py-1.5 sm:py-2 px-2 bg-[#722F3F] hover:bg-[#D6B56A] hover:text-[#241B18] text-[#FFF9F1] rounded-xl text-[11px] font-bold transition-all shadow-md shadow-[#722F3F]/30 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>أضف</span>
                        </button>
                      </div>

                      {/* Small Disclaimer */}
                      <p className="text-[8px] text-[#D8C8B8]/60 text-center leading-tight">
                        تركيبة مستوحاة — ليست العطر الأصلي
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
};
