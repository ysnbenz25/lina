import React, { useState } from 'react';
import { ShoppingBag, Zap, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Perfume } from '../types';

interface FeaturedProductCampaignProps {
  perfume?: Perfume;
  onAddToCart: (perfume: Perfume, quantity?: number, selectedSize?: string) => void;
  onBuyNow: (perfume: Perfume, selectedSize?: string) => void;
}

export const FeaturedProductCampaign: React.FC<FeaturedProductCampaignProps> = ({
  perfume,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('100 ml');
  const [quantity, setQuantity] = useState<number>(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Fallback signature product if not passed
  const target: Perfume = perfume || {
    id: 1,
    name: 'Oud Impérial',
    arabicName: 'عود إمبريال',
    badge: 'الإصدار الملكي',
    category: 'عطور فاخرة',
    price: 185,
    originalPrice: 240,
    volume: '100 ml - Extrait de Parfum',
    rating: 5.0,
    reviewsCount: 38,
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
    sizes: ['50 ml', '100 ml'],
    gender: 'unisex',
    isFeatured: true,
    description: 'تحفة عطرية نادرة تمزج عبق العود الكمبودي المعتق بأريج الورد الجوري ودفء العنبر الرمادي والزعفران الملكي.',
    notes: {
      top: 'زعفران ملكي، هيل نقي، برغموت صقلي',
      heart: 'ورد دمشقي معتق، بخور شرقي، ياسمين',
      base: 'عود كمبودي عتيق، جلد إيطالي، خشب الصندل'
    },
    inStock: true
  };

  const sizes = target.sizes || ['50 ml', '100 ml'];

  const handleAddToCart = () => {
    onAddToCart(target, quantity, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  return (
    <section id="campaign-product" className="py-24 sm:py-32 bg-[#0A0A0A] relative overflow-hidden border-b border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#C9A227]/5 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Campaign Banner Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] font-serif uppercase tracking-[0.35em] text-[#C9A227]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CAMPAGNE EXCLUSIVE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif text-[#E8E1D5] font-bold tracking-tight">
            العطر الأيقوني المميّز
          </h2>
        </div>

        {/* 2-Column Campaign Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Column 1: Cinematic Product Image Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111111] border border-white/10 shadow-2xl">
              <img
                src={target.image}
                alt={target.arabicName || target.name}
                className="w-full h-full object-cover object-center filter contrast-[1.08] hover:scale-105 transition-transform duration-700 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-60" />

              {/* Top Badge */}
              <div className="absolute top-6 right-6 px-3.5 py-1.5 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/15 text-[10px] tracking-[0.25em] font-serif uppercase text-[#C9A227]">
                {target.badge || 'SIGNATURE'}
              </div>

              {/* Bottom Concentration Watermark */}
              <div className="absolute bottom-6 left-6 right-6 text-right">
                <span className="text-[10px] tracking-[0.3em] font-cinzel text-white/50 uppercase block">
                  CONCENTRATION
                </span>
                <span className="text-sm font-serif text-[#E8E1D5]">
                  EXTRAIT DE PARFUM (30% HUILE PURE)
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Editorial Details & Purchasing Engine */}
          <div className="lg:col-span-6 text-right space-y-8">
            
            {/* Title & Classification */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-serif tracking-[0.25em] text-[#C9A227] uppercase">
                  {target.category}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/30" />
                <span className="text-xs text-[#ACA394] font-serif">
                  {target.volume}
                </span>
              </div>

              <h3 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#E8E1D5] tracking-tight">
                {target.arabicName}
              </h3>
              <p className="text-sm sm:text-base font-cinzel tracking-widest text-[#ACA394] uppercase">
                {target.name}
              </p>
            </div>

            {/* Price Box */}
            <div className="flex items-baseline gap-4 py-2">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#E8E1D5]">
                {target.price} د.ت
              </span>
              {target.originalPrice && target.originalPrice > target.price && (
                <span className="text-lg text-neutral-500 line-through font-serif">
                  {target.originalPrice} د.ت
                </span>
              )}
              <span className="px-2.5 py-1 bg-[#C9A227]/15 text-[#C9A227] border border-[#C9A227]/30 text-xs font-serif font-semibold">
                وفر {target.originalPrice ? target.originalPrice - target.price : 0} د.ت
              </span>
            </div>

            {/* Editorial Description */}
            <p className="text-sm sm:text-base text-[#ACA394] leading-relaxed font-sans font-light">
              {target.description}
            </p>

            {/* Fragrance Notes Pyramid */}
            {target.notes && (
              <div className="p-5 bg-[#111111] border border-white/5 space-y-3">
                <div className="text-[11px] font-serif tracking-[0.25em] text-[#C9A227] uppercase pb-1 border-b border-white/5">
                  الهرم العطري (PYRAMIDE OLFACTIVE)
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-serif">قمة العطر (Tête)</span>
                    <span className="text-[#E8E1D5] font-serif">{target.notes.top}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-serif">قلب العطر (Cœur)</span>
                    <span className="text-[#E8E1D5] font-serif">{target.notes.heart}</span>
                  </div>
                  <div>
                    <span className="text-neutral-400 block text-[10px] uppercase font-serif">قاعدة العطر (Fond)</span>
                    <span className="text-[#E8E1D5] font-serif">{target.notes.base}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-3">
              <span className="text-xs font-serif tracking-wider text-[#E8E1D5] uppercase block">
                اختر الحجم (VOLUME):
              </span>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 text-xs font-serif tracking-wider transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#E8E1D5] text-[#0A0A0A] font-bold border border-[#E8E1D5]'
                        : 'bg-[#141414] text-[#E8E1D5] border border-white/10 hover:border-[#C9A227]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* CTA Buttons Row */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 bg-[#E8E1D5] hover:bg-white text-[#0A0A0A] text-xs font-serif tracking-wider uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95"
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>تمت الإضافة للسلة!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>أضف إلى السلة</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onBuyNow(target, selectedSize)}
                  className="flex-1 py-4 bg-[#C9A227] hover:bg-[#DFC062] text-[#0A0A0A] text-xs font-serif tracking-wider uppercase font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>اشتري الآن (دفع عند الاستلام)</span>
                </button>
              </div>

              {/* Guarantees micro-strip */}
              <div className="pt-4 flex items-center justify-between text-[11px] text-[#ACA394] font-serif border-t border-white/5">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>عطر أصلي 100% مضمون</span>
                </span>
                <span>توصيل سريع 24-48 ساعة لجميع ولايات تونس</span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
