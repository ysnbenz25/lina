import React, { useState } from 'react';
import { Perfume } from '../types';
import { Flame, ShoppingBag, Eye, Sparkles, Tag, ArrowLeft, ShieldAlert } from 'lucide-react';

interface SpecialOffersSectionProps {
  perfumes: Perfume[];
  onAddToCart: (perfume: Perfume, quantity?: number, selectedSize?: string) => void;
  onOpenQuickView: (perfume: Perfume) => void;
}

export const SpecialOffersSection: React.FC<SpecialOffersSectionProps> = ({
  perfumes,
  onAddToCart,
  onOpenQuickView,
}) => {
  // Select perfumes that are either flagged as special offer or have discount
  const offerPerfumes = perfumes.filter((p) => p.isSpecialOffer || (p.originalPrice && p.originalPrice > p.price)).slice(0, 4);

  // Local state for selected size per perfume ID
  const [selectedSizes, setSelectedSizes] = useState<Record<number, string>>({});

  if (offerPerfumes.length === 0) return null;

  return (
    <section id="special-offers" className="py-16 md:py-24 bg-gradient-to-b from-[#4A1D28] via-[#521E2B] to-[#3B151F] border-y border-[#722F3F]/50 relative overflow-hidden text-[#F7F1E8]">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D6B56A]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C98F91]/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="text-right space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#722F3F]/70 border border-[#D6B56A]/35 text-[#D6B56A] text-xs font-serif tracking-[0.2em] uppercase font-bold shadow-sm">
              <Flame className="w-3.5 h-3.5 text-[#D6B56A]" />
              <span>OFFRES EXCLUSIVES • عروض خاصة</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-serif text-[#FFF9F1] tracking-tight">
              عروض تخليك تختار أكثر
            </h2>

            <p className="text-[#D6B56A] text-base sm:text-lg font-serif italic">
              اختار رائحتك المفضلة بالحجم الذي يناسبك وبأفضل سعر في تونس.
            </p>

            <p className="text-[#D8C8B8] text-xs sm:text-sm max-w-xl leading-relaxed">
              تخفيضات خاصة على باقة مختارة من أشهر التركيبات والعطور الزيتية الأكثر طلباً، مع حرية تجربة الأحجام المتعددة.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-end">
            <span className="px-4 py-2 rounded-xl bg-[#241B18]/70 border border-[#D6B56A]/40 text-[#D6B56A] text-xs font-serif font-bold shadow-md">
              توفير يصل حتى 35%
            </span>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {offerPerfumes.map((perfume) => {
            const currentSize = selectedSizes[perfume.id] || (perfume.sizeOptions && perfume.sizeOptions.length > 0 ? perfume.sizeOptions[0].size : '30ml');
            const matchingOption = perfume.sizeOptions?.find((opt) => opt.size === currentSize);
            const displayPrice = matchingOption ? matchingOption.price : perfume.price;
            const displayOriginalPrice = matchingOption?.originalPrice || perfume.originalPrice || Math.round(displayPrice * 1.35);
            const discountAmount = displayOriginalPrice - displayPrice;
            const discountPercent = Math.round((discountAmount / displayOriginalPrice) * 100);

            return (
              <div
                key={perfume.id}
                id={`offer-card-${perfume.id}`}
                className="group bg-[#241B18]/90 rounded-2xl border border-[#D8C8B8]/20 hover:border-[#D6B56A] p-4 sm:p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-[#D6B56A]/10 relative backdrop-blur-sm"
              >
                {/* Top Discount Tag */}
                <div className="absolute top-3 right-3 z-20">
                  <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#722F3F] text-[#FFF9F1] border border-[#D6B56A]/40 font-sans shadow-md">
                    -{discountPercent}%
                  </span>
                </div>

                {/* Fragrance Type Tag */}
                <div className="absolute top-3 left-3 z-20">
                  <span className="px-2.5 py-0.5 text-[10px] font-medium rounded-md bg-[#1A1311]/90 backdrop-blur-md text-[#D8C8B8] border border-[#D8C8B8]/20">
                    {perfume.fragranceType || "تركيبة مستوحاة"}
                  </span>
                </div>

                {/* Product Image */}
                <div
                  className="relative overflow-hidden rounded-xl bg-[#1A1311] aspect-square mb-4 cursor-pointer mt-5 border border-[#D8C8B8]/10"
                  onClick={() => onOpenQuickView(perfume)}
                >
                  <img
                    src={perfume.image}
                    alt={perfume.arabicName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>

                {/* Details */}
                <div className="space-y-2 text-right flex-1 flex flex-col justify-between">
                  <div>
                    {/* Inspired by subtext */}
                    {perfume.inspiredBy && (
                      <p className="text-[11px] text-[#D6B56A] font-serif font-medium line-clamp-1">
                        {perfume.inspiredBy}
                      </p>
                    )}

                    <h3
                      onClick={() => onOpenQuickView(perfume)}
                      className="text-base font-bold text-[#F7F1E8] font-serif mt-1 group-hover:text-[#D6B56A] transition-colors cursor-pointer line-clamp-1"
                    >
                      {perfume.arabicName}
                    </h3>

                    {/* Size Selector Chips on Card */}
                    {perfume.sizeOptions && perfume.sizeOptions.length > 0 && (
                      <div className="mt-3 space-y-1">
                        <span className="text-[10px] text-[#D8C8B8] block font-medium">
                          اختر الحجم:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {perfume.sizeOptions.map((opt) => (
                            <button
                              key={opt.size}
                              type="button"
                              onClick={() => setSelectedSizes((prev) => ({ ...prev, [perfume.id]: opt.size }))}
                              className={`px-2 py-1 rounded-md text-[10px] font-semibold transition-all cursor-pointer border ${
                                currentSize === opt.size
                                  ? 'bg-[#D6B56A] text-[#241B18] border-[#D6B56A] font-bold shadow-sm'
                                  : 'bg-[#332522] text-[#D8C8B8] border-[#D8C8B8]/20 hover:border-[#D6B56A]/50'
                              }`}
                            >
                              {opt.size} ({opt.price} د.ت)
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Pricing and Actions */}
                  <div className="pt-3 border-t border-[#D8C8B8]/15 space-y-3 mt-3">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-[#D6B56A] font-sans">
                          {displayPrice} د.ت
                        </span>
                        <span className="text-xs text-[#D8C8B8]/60 line-through font-sans">
                          {displayOriginalPrice} د.ت
                        </span>
                      </div>
                      <span className="text-[10px] text-[#D6B56A] bg-[#D6B56A]/15 px-2 py-0.5 rounded border border-[#D6B56A]/30 font-medium">
                        وفر {discountAmount} د.ت
                      </span>
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => onOpenQuickView(perfume)}
                        className="py-2.5 px-2 bg-transparent hover:bg-white/5 text-[#F7F1E8] rounded-xl text-xs font-semibold border border-[#D8C8B8]/30 hover:border-[#D6B56A] transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#D6B56A]" />
                        <span>تفاصيل</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          const sizePerfume = {
                            ...perfume,
                            price: displayPrice,
                            originalPrice: displayOriginalPrice,
                            volume: currentSize,
                          };
                          onAddToCart(sizePerfume, 1, currentSize);
                        }}
                        className="py-2.5 px-2 bg-[#722F3F] hover:bg-[#D6B56A] hover:text-[#241B18] text-[#FFF9F1] rounded-xl text-xs font-bold transition-all shadow-md shadow-[#722F3F]/30 flex items-center justify-center gap-1 active:scale-95 cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>أضف للسلة</span>
                      </button>
                    </div>

                    {/* Subtle Transparency Note */}
                    <p className="text-[9px] text-[#D8C8B8]/70 text-center leading-tight">
                      تركيبة مستوحاة — ليست العطر الأصلي للشركة
                    </p>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
