import React from 'react';
import { Perfume } from '../types';
import { ShoppingBag, Eye, Star, Trash2, Plus, Edit3 } from 'lucide-react';

interface PerfumesGridProps {
  perfumes: Perfume[];
  onAddToCart: (perfume: Perfume) => void;
  onOpenQuickView: (perfume: Perfume) => void;
  isAdminMode?: boolean;
  onDeletePerfume?: (id: number) => void;
  onOpenAdminModal?: () => void;
}

export const PerfumesGrid: React.FC<PerfumesGridProps> = ({
  perfumes,
  onAddToCart,
  onOpenQuickView,
  isAdminMode = false,
  onDeletePerfume,
  onOpenAdminModal,
}) => {
  return (
    <section id="products" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="text-right space-y-2">
            <p className="text-[#d4af37] text-xs tracking-widest uppercase font-serif font-bold">
              THE EXCLUSIVE COLLECTION • TUNISIE
            </p>
            <h2 id="products-heading" className="text-3xl sm:text-4xl font-bold font-serif text-white">
              تشكيلة العطور الفاخرة بتونس
            </h2>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-xl">
              عطور النيش الفاخرة مع توصيل سريع لكافة ولايات الجمهورية التونسية الـ 24 والدفع نقداً عند الاستلام.
            </p>
          </div>

          {onOpenAdminModal && (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAdminModal}
                className="px-4 py-2.5 rounded-xl bg-[#17171d] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#08080a] border border-[#d4af37]/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة عطر جديد (الأدمن)</span>
              </button>
            </div>
          )}
        </div>

        {/* Perfumes Grid */}
        {perfumes.length === 0 ? (
          <div className="text-center py-16 bg-[#101014] rounded-2xl border border-white/5 space-y-3">
            <p className="text-neutral-400 text-sm">لا توجد عطور مخزنة في الوقت الحالي.</p>
            {onOpenAdminModal && (
              <button
                onClick={onOpenAdminModal}
                className="px-4 py-2 bg-[#d4af37] text-[#08080a] text-xs font-bold rounded-xl"
              >
                فتح لوحة الأدمن لإضافة عطور
              </button>
            )}
          </div>
        ) : (
          <div id="perfumes-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {perfumes.map((perfume) => (
              <div
                key={perfume.id}
                id={`perfume-card-${perfume.id}`}
                className="group bg-[#101014]/90 rounded-2xl border border-white/10 hover:border-[#d4af37]/50 p-4 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#d4af37]/10 relative"
              >
                {/* Admin Action Buttons if in Admin Mode */}
                {isAdminMode && (
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-1.5">
                    {onOpenAdminModal && (
                      <button
                        onClick={onOpenAdminModal}
                        className="bg-[#d4af37] hover:bg-[#e5ca78] text-[#08080a] p-2 rounded-xl text-xs font-bold shadow-xl flex items-center gap-1 transition-transform active:scale-95"
                        title="تعديل هذا العطر وصورته في لوحة المشرف"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل</span>
                      </button>
                    )}
                    {onDeletePerfume && (
                      <button
                        onClick={() => onDeletePerfume(perfume.id)}
                        className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-xl text-xs shadow-xl flex items-center gap-1 transition-transform active:scale-95"
                        title="حذف هذا العطر من المتجر"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* Image Container with Badges */}
                <div className="relative overflow-hidden rounded-xl bg-[#08080a] aspect-square mb-4">
                  <img
                    src={perfume.image}
                    alt={perfume.arabicName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#08080a]/90 text-[#d4af37] border border-[#d4af37]/30 backdrop-blur-sm">
                      {perfume.badge}
                    </span>
                  </div>

                  {/* Quick View Hover Trigger */}
                  <button
                    id={`quick-view-btn-${perfume.id}`}
                    onClick={() => onOpenQuickView(perfume)}
                    className="absolute inset-x-4 bottom-3 py-2 bg-[#08080a]/95 hover:bg-[#d4af37] hover:text-[#08080a] text-white text-xs font-semibold rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 border border-white/15 text-center flex items-center justify-center gap-1.5 backdrop-blur-md"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>نظرة سريعة</span>
                  </button>
                </div>

                {/* Product Info */}
                <div className="space-y-2 text-right flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{perfume.volume}</span>
                      <div className="flex items-center gap-1 text-[#d4af37]">
                        <Star className="w-3.5 h-3.5 fill-[#d4af37]" />
                        <span className="font-semibold">{perfume.rating}</span>
                        <span className="text-neutral-500">({perfume.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white font-serif mt-1 group-hover:text-[#d4af37] transition-colors">
                      {perfume.arabicName}
                    </h3>
                    <p className="text-xs text-neutral-400 tracking-wider font-sans">{perfume.name}</p>
                    <p className="text-[11px] text-neutral-400 mt-1 line-clamp-2">{perfume.description}</p>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="pt-3 border-t border-white/5 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-[#d4af37]">{perfume.price} د.ت</span>
                        {perfume.originalPrice > perfume.price && (
                          <span className="text-xs text-neutral-500 line-through">{perfume.originalPrice} د.ت</span>
                        )}
                      </div>
                      {perfume.originalPrice > perfume.price && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                          وفر {perfume.originalPrice - perfume.price} د.ت
                        </span>
                      )}
                    </div>

                    <button
                      id={`add-to-cart-btn-${perfume.id}`}
                      onClick={() => onAddToCart(perfume)}
                      className="w-full py-2.5 bg-[#17171d] hover:bg-[#d4af37] text-neutral-200 hover:text-[#08080a] border border-white/10 hover:border-[#d4af37] rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 group/btn active:scale-95 shadow-sm"
                    >
                      <ShoppingBag className="w-4 h-4 text-[#d4af37] group-hover/btn:text-[#08080a] transition-colors" />
                      <span>أضف إلى السلة</span>
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
