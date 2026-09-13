import React from 'react';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Perfume } from '../types';

interface BestSellersProps {
  perfumes: Perfume[];
  wishlistIds: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (perfume: Perfume) => void;
  onSelectProduct: (perfume: Perfume) => void;
  onViewAll: () => void;
}

export const BestSellers: React.FC<BestSellersProps> = ({
  perfumes,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onSelectProduct,
  onViewAll,
}) => {
  // Select top bestsellers or featured perfumes
  const bestSellersList = perfumes
    .filter(p => p.isActive !== false)
    .slice(0, 4);

  return (
    <section id="bestsellers" className="py-20 sm:py-28 bg-[#0A0A0A] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div className="text-right space-y-2">
            <span className="font-serif text-[11px] tracking-[0.3em] text-[#C9A227] uppercase block">
              LES PLUS DEMANDÉS
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#E8E1D5] font-bold tracking-tight">
              الأكثر طلباً
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="text-xs font-serif tracking-[0.2em] text-[#E8E1D5] hover:text-[#C9A227] transition-colors uppercase border-b border-white/20 hover:border-[#C9A227] pb-1 self-start sm:self-auto cursor-pointer"
          >
            عرض كل العطور
          </button>
        </div>

        {/* Minimalist Editorial Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {bestSellersList.map((perfume) => {
            const isWishlisted = wishlistIds.includes(perfume.id);
            const discountPercent = perfume.originalPrice && perfume.originalPrice > perfume.price
              ? Math.round(((perfume.originalPrice - perfume.price) / perfume.originalPrice) * 100)
              : null;

            return (
              <div
                key={perfume.id}
                className="group relative flex flex-col bg-[#111111] border border-white/5 hover:border-[#C9A227]/40 transition-all duration-300"
              >
                {/* Product Image Stage */}
                <div
                  onClick={() => onSelectProduct(perfume)}
                  className="relative aspect-[3/4] overflow-hidden bg-[#141414] cursor-pointer"
                >
                  <img
                    src={perfume.image}
                    alt={perfume.arabicName || perfume.name}
                    className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] via-transparent to-transparent opacity-40 group-hover:opacity-20 transition-opacity" />

                  {/* Discount or Special Badge */}
                  {discountPercent && (
                    <div className="absolute top-3 right-3 bg-[#C9A227] text-[#0A0A0A] text-[10px] font-bold px-2 py-0.5 tracking-wider uppercase font-sans">
                      -{discountPercent}%
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(perfume.id);
                    }}
                    className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                      isWishlisted
                        ? 'bg-[#C9A227] text-[#0A0A0A]'
                        : 'bg-[#0A0A0A]/60 text-white hover:text-[#C9A227] hover:bg-[#0A0A0A]'
                    }`}
                    aria-label="إضافة للمفضلة"
                  >
                    <Heart className={`w-3.5 h-3.5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>

                  {/* Quick Action Bar on Hover */}
                  <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(perfume);
                      }}
                      className="flex-1 py-2.5 bg-[#E8E1D5] hover:bg-white text-[#0A0A0A] text-xs font-serif tracking-wider uppercase flex items-center justify-center gap-1.5 cursor-pointer shadow-lg active:scale-95 transition-all"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>إضافة للسلة</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(perfume);
                      }}
                      className="p-2.5 bg-[#0A0A0A]/90 hover:bg-[#0A0A0A] text-[#E8E1D5] hover:text-[#C9A227] border border-white/20 transition-colors cursor-pointer"
                      title="معاينة سريعة"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Minimal Editorial Card Info */}
                <div className="p-4 sm:p-5 flex flex-col flex-1 text-right space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-[#ACA394] font-serif uppercase tracking-wider">
                    <span>{perfume.volume ? perfume.volume.split('-')[0] : '100 ML'}</span>
                    <span className="text-[#C9A227]">{perfume.category}</span>
                  </div>

                  <h3
                    onClick={() => onSelectProduct(perfume)}
                    className="text-base sm:text-lg font-serif font-bold text-[#E8E1D5] group-hover:text-white transition-colors cursor-pointer leading-snug line-clamp-1"
                  >
                    {perfume.arabicName || perfume.name}
                  </h3>

                  <p className="text-xs text-[#ACA394] font-serif tracking-wider uppercase font-light">
                    {perfume.name}
                  </p>

                  <div className="pt-2 mt-auto border-t border-white/5 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base sm:text-lg font-serif font-bold text-[#E8E1D5]">
                        {perfume.price} د.ت
                      </span>
                      {perfume.originalPrice && perfume.originalPrice > perfume.price && (
                        <span className="text-xs text-neutral-500 line-through">
                          {perfume.originalPrice} د.ت
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => onAddToCart(perfume)}
                      className="text-xs text-[#C9A227] hover:text-white font-serif uppercase cursor-pointer"
                    >
                      + أضف
                    </button>
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
