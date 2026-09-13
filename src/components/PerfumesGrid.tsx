import React, { useState } from 'react';
import { Perfume } from '../types';
import { ShoppingBag, Eye, Heart, Star, Sparkles, Check, Edit3, Trash2 } from 'lucide-react';

interface PerfumesGridProps {
  perfumes: Perfume[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchTerm?: string;
  onAddToCart: (perfume: Perfume) => void;
  onOpenQuickView: (perfume: Perfume) => void;
  isAdminMode?: boolean;
  onDeletePerfume?: (id: number) => void;
  onOpenAdminModal?: () => void;
}

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
    const matchesCategory =
      selectedCategory === 'الكل' ||
      p.category === selectedCategory ||
      (selectedCategory === 'عروض خاصة' && p.isSpecialOffer);

    const matchesSearch =
      !searchTerm ||
      p.arabicName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.notes.top.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.notes.heart.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.notes.base.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <section id="products" className="py-20 md:py-28 bg-[#070709] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-right space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/25 text-[#d4af37] text-xs font-serif tracking-[0.2em] uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LES PLUS DEMANDÉS • تونس</span>
            </div>
            <h2 id="products-heading" className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-white tracking-tight">
              الأكثر طلباً
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm max-w-xl leading-relaxed">
              روائح أيقونية حازت على ثقة نخبة الحرفاء في تونس؛ تميز وثبات يدوم لأكثر من 24 ساعة مع توصيل إلى كامل ولايات تونس الـ 24.
            </p>
          </div>

          {/* Categories Tab Selector */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-end">
            {['الكل', 'عطور فاخرة', 'عطور نسائية', 'عطور رجالية', 'عطور للجنسين', 'عروض خاصة'].map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-serif transition-all cursor-pointer border ${
                  selectedCategory === cat
                    ? 'bg-[#d4af37] text-[#070709] font-bold border-[#d4af37] shadow-md shadow-[#d4af37]/15'
                    : 'bg-[#101015] text-neutral-300 border-white/10 hover:border-[#d4af37]/40 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Search status if searching */}
        {searchTerm && (
          <div className="mb-8 p-4 bg-[#101015] rounded-xl border border-white/10 flex items-center justify-between text-xs">
            <span className="text-neutral-300">
              نتائج البحث عن: <strong className="text-[#d4af37]">"{searchTerm}"</strong> ({filteredPerfumes.length} عطر)
            </span>
            <button
              onClick={() => onSelectCategory('الكل')}
              className="text-neutral-400 hover:text-white underline cursor-pointer"
            >
              عرض كافة العطور
            </button>
          </div>
        )}

        {/* Empty State */}
        {filteredPerfumes.length === 0 ? (
          <div className="text-center py-20 bg-[#0d0d12] rounded-2xl border border-white/10 space-y-4">
            <p className="text-neutral-300 text-sm font-serif">لم يتم العثور على عطور تطابق اختيارك الحالي.</p>
            <button
              onClick={() => onSelectCategory('الكل')}
              className="px-6 py-2.5 bg-[#d4af37] text-[#070709] font-bold text-xs rounded-xl hover:bg-[#e5ca78] transition-colors cursor-pointer"
            >
              إعادة تعيين التصنيف
            </button>
          </div>
        ) : (
          /* Products Grid: 4 columns on large desktop, 2 on tablet, 1 on small mobile */
          <div id="perfumes-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7">
            {filteredPerfumes.map((perfume) => {
              const isFav = favorites.includes(perfume.id);
              const discountAmount = perfume.originalPrice - perfume.price;
              const discountPercent = Math.round((discountAmount / perfume.originalPrice) * 100);

              return (
                <div
                  key={perfume.id}
                  id={`perfume-card-${perfume.id}`}
                  className="group bg-[#0e0e13] rounded-2xl border border-white/10 hover:border-[#d4af37]/45 p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#d4af37]/8 relative"
                >
                  {/* Admin controls if admin active */}
                  {isAdminMode && (
                    <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5">
                      {onOpenAdminModal && (
                        <button
                          onClick={onOpenAdminModal}
                          className="bg-[#d4af37] hover:bg-[#e5ca78] text-[#070709] p-1.5 rounded-lg text-xs font-bold shadow-lg transition-transform active:scale-95"
                          title="تعديل هذا العطر"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDeletePerfume && (
                        <button
                          onClick={() => onDeletePerfume(perfume.id)}
                          className="bg-rose-600 hover:bg-rose-700 text-white p-1.5 rounded-lg text-xs shadow-lg transition-transform active:scale-95"
                          title="حذف هذا العطر"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Top Image Box */}
                  <div className="relative overflow-hidden rounded-xl bg-[#070709] aspect-square mb-4 cursor-pointer" onClick={() => onOpenQuickView(perfume)}>
                    <img
                      src={perfume.image}
                      alt={perfume.arabicName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 filter contrast-105"
                      loading="lazy"
                    />

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070709]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                    {/* Discount Badge */}
                    {discountAmount > 0 && (
                      <div className="absolute top-3 right-3 z-20">
                        <span className="px-2.5 py-1 text-[10px] font-bold rounded-md bg-[#d4af37] text-[#070709] font-sans shadow-md">
                          -{discountPercent}%
                        </span>
                      </div>
                    )}

                    {/* Favorite Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => toggleFavorite(perfume.id, e)}
                      className={`absolute top-3 left-3 z-20 p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                        isFav
                          ? 'bg-rose-600/90 text-white border-rose-500 scale-110'
                          : 'bg-[#070709]/70 text-neutral-300 border-white/10 hover:text-rose-400 hover:border-rose-400/40'
                      }`}
                      aria-label="إضافة للمفضلة"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                    </button>

                    {/* Hover Buttons: Quick View Button overlay */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenQuickView(perfume);
                      }}
                      className="absolute inset-x-4 bottom-3 py-2.5 bg-[#070709]/95 hover:bg-[#d4af37] hover:text-[#070709] text-white text-xs font-semibold rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 border border-[#d4af37]/30 text-center flex items-center justify-center gap-1.5 backdrop-blur-md shadow-lg cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>عرض تفاصيل العطر</span>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-2 text-right flex-1 flex flex-col justify-between">
                    <div>
                      {/* Meta details & Rating */}
                      <div className="flex items-center justify-between text-[11px] text-neutral-400">
                        <span className="text-[10px] text-[#d4af37] font-serif tracking-wider uppercase font-semibold">
                          {perfume.volume}
                        </span>
                        <div className="flex items-center gap-1 text-[#d4af37]">
                          <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                          <span className="font-semibold">{perfume.rating}</span>
                          <span className="text-neutral-500 text-[10px]">({perfume.reviewsCount})</span>
                        </div>
                      </div>

                      {/* Arabic and French Names */}
                      <h3
                        onClick={() => onOpenQuickView(perfume)}
                        className="text-base sm:text-lg font-bold text-white font-serif mt-1 group-hover:text-[#d4af37] transition-colors cursor-pointer line-clamp-1"
                      >
                        {perfume.arabicName}
                      </h3>
                      <p className="text-xs text-neutral-400 tracking-wider font-sans font-medium">
                        {perfume.name}
                      </p>

                      {/* Short description */}
                      <p className="text-[11px] sm:text-xs text-neutral-300 mt-2 line-clamp-2 leading-relaxed">
                        {perfume.description}
                      </p>
                    </div>

                    {/* Pricing & Actions */}
                    <div className="pt-4 border-t border-white/5 space-y-3 mt-4">
                      <div className="flex items-baseline justify-between">
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg sm:text-xl font-bold text-[#d4af37] font-sans">
                            {perfume.price} د.ت
                          </span>
                          {perfume.originalPrice > perfume.price && (
                            <span className="text-xs text-neutral-500 line-through font-sans">
                              {perfume.originalPrice} د.ت
                            </span>
                          )}
                        </div>
                        {discountAmount > 0 && (
                          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-medium">
                            وفر {discountAmount} د.ت
                          </span>
                        )}
                      </div>

                      {/* Two CTA Buttons: View Product + Quick Add */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => onOpenQuickView(perfume)}
                          className="py-2.5 px-3 bg-[#13131a] hover:bg-[#1a1a24] text-neutral-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                          <span>تفاصيل</span>
                        </button>

                        <button
                          type="button"
                          id={`add-to-cart-btn-${perfume.id}`}
                          onClick={() => onAddToCart(perfume)}
                          className="py-2.5 px-3 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#070709] rounded-xl text-xs font-bold transition-all shadow-md shadow-[#d4af37]/15 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>إضافة سريعة</span>
                        </button>
                      </div>
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
