import React, { useState } from 'react';
import { ShoppingBag, Zap, Heart, ShieldCheck, Truck, RefreshCw, Check, ArrowRight, Star } from 'lucide-react';
import { Perfume } from '../types';

interface ProductDetailPageProps {
  perfume: Perfume;
  allPerfumes: Perfume[];
  wishlistIds: number[];
  onToggleWishlist: (id: number) => void;
  onAddToCart: (perfume: Perfume, quantity?: number, selectedSize?: string) => void;
  onBuyNow: (perfume: Perfume, selectedSize?: string) => void;
  onSelectRelated: (perfume: Perfume) => void;
  onBackToShop: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  perfume,
  allPerfumes,
  wishlistIds,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onSelectRelated,
  onBackToShop,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(perfume.image);
  const [selectedSize, setSelectedSize] = useState<string>(
    perfume.sizes && perfume.sizes.length > 0 ? perfume.sizes[0] : '100 ml'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedNotice, setAddedNotice] = useState<boolean>(false);

  const isWishlisted = wishlistIds.includes(perfume.id);
  const sizes = perfume.sizes || ['50 ml', '100 ml'];
  const gallery = perfume.gallery && perfume.gallery.length > 0 ? perfume.gallery : [perfume.image];

  const discountPercent = perfume.originalPrice && perfume.originalPrice > perfume.price
    ? Math.round(((perfume.originalPrice - perfume.price) / perfume.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    onAddToCart(perfume, quantity, selectedSize);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  // Related products from same category or featured
  const related = allPerfumes
    .filter((p) => p.id !== perfume.id && (p.category === perfume.category || p.isFeatured))
    .slice(0, 4);

  return (
    <div className="bg-[#0A0A0A] min-h-screen text-[#E8E1D5] py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between pb-8 mb-8 border-b border-white/10 text-xs text-[#ACA394] font-serif">
          <button
            onClick={onBackToShop}
            className="flex items-center gap-2 hover:text-[#C9A227] transition-colors cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة لكتالوج العطور</span>
          </button>

          <div className="flex items-center gap-2">
            <span>الرئيسية</span>
            <span>/</span>
            <span>{perfume.category}</span>
            <span>/</span>
            <span className="text-[#E8E1D5]">{perfume.arabicName || perfume.name}</span>
          </div>
        </div>

        {/* Product Showcase: Gallery (Left) & Purchasing Engine (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Gallery Column */}
          <div className="lg:col-span-6 space-y-4">
            {/* Main Stage */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111111] border border-white/10">
              <img
                src={selectedImage}
                alt={perfume.arabicName || perfume.name}
                className="w-full h-full object-cover object-center filter contrast-[1.08] transition-all duration-500"
              />

              {discountPercent && (
                <div className="absolute top-4 right-4 bg-[#C9A227] text-[#0A0A0A] text-xs font-bold px-3 py-1 font-sans uppercase">
                  خصم {discountPercent}%
                </div>
              )}

              <button
                onClick={() => onToggleWishlist(perfume.id)}
                className={`absolute top-4 left-4 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer ${
                  isWishlisted ? 'bg-[#C9A227] text-[#0A0A0A]' : 'bg-[#0A0A0A]/70 text-white hover:text-[#C9A227]'
                }`}
                aria-label="المفضلة"
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-20 h-24 shrink-0 overflow-hidden bg-[#141414] border cursor-pointer transition-all ${
                      selectedImage === img ? 'border-[#C9A227]' : 'border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Action Column */}
          <div className="lg:col-span-6 text-right space-y-7">
            
            {/* Classification & Ratings */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-[#ACA394] font-serif">
                <span className="text-[#C9A227] uppercase tracking-widest">{perfume.category}</span>
                <div className="flex items-center gap-1.5 text-[#C9A227]">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-white font-sans text-xs">({perfume.reviewsCount || 1} تقييم)</span>
                </div>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#E8E1D5] tracking-tight">
                {perfume.arabicName || perfume.name}
              </h1>

              <p className="text-sm font-cinzel tracking-widest text-[#ACA394] uppercase">
                {perfume.name}
              </p>
            </div>

            {/* Price Row */}
            <div className="flex items-baseline gap-4 py-2 border-y border-white/5">
              <span className="text-3xl sm:text-4xl font-serif font-bold text-[#E8E1D5]">
                {perfume.price} د.ت
              </span>
              {perfume.originalPrice && perfume.originalPrice > perfume.price && (
                <span className="text-lg text-neutral-500 line-through font-serif">
                  {perfume.originalPrice} د.ت
                </span>
              )}
              <span className="text-xs text-emerald-400 font-serif mr-auto">
                {perfume.inStock !== false ? '• متوفر في المخزن وجاهز للشحن الفوري' : '• نفد من المخزن مؤقتاً'}
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-[#ACA394] leading-relaxed font-sans font-light">
              {perfume.description || 'عطر استثنائي تم تحضيره بعناية فائقة ليعكس شخصية قوية وحضوراً ساحراً يدوم لساعات طويلة.'}
            </p>

            {/* Fragrance Notes Pyramid */}
            {perfume.notes && (
              <div className="p-5 bg-[#111111] border border-white/5 space-y-3">
                <span className="text-[11px] font-serif tracking-[0.25em] text-[#C9A227] uppercase block pb-1 border-b border-white/5">
                  الهرم العطري والمكونات النادرة
                </span>
                <div className="space-y-2 text-xs font-serif">
                  {perfume.notes.top && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400 text-[11px]">قمة العطر (Tête):</span>
                      <span className="text-[#E8E1D5]">{perfume.notes.top}</span>
                    </div>
                  )}
                  {perfume.notes.heart && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400 text-[11px]">قلب العطر (Cœur):</span>
                      <span className="text-[#E8E1D5]">{perfume.notes.heart}</span>
                    </div>
                  )}
                  {perfume.notes.base && (
                    <div className="flex justify-between">
                      <span className="text-neutral-400 text-[11px]">قاعدة العطر (Fond):</span>
                      <span className="text-[#E8E1D5]">{perfume.notes.base}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-2">
              <span className="text-xs font-serif tracking-wider text-[#E8E1D5] uppercase block">
                الحجم المتاح:
              </span>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 text-xs font-serif tracking-wider border cursor-pointer transition-all ${
                      selectedSize === size
                        ? 'bg-[#E8E1D5] text-[#0A0A0A] border-[#E8E1D5] font-bold'
                        : 'bg-[#141414] text-[#E8E1D5] border-white/10 hover:border-[#C9A227]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Controller & CTA Buttons */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs font-serif text-[#ACA394]">الكمية:</span>
                <div className="flex items-center border border-white/15 bg-[#111111]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-sm text-[#E8E1D5] hover:text-[#C9A227] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 text-xs font-serif font-bold text-[#E8E1D5]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-1.5 text-sm text-[#E8E1D5] hover:text-[#C9A227] cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAdd}
                  className="flex-1 py-4 bg-[#E8E1D5] hover:bg-white text-[#0A0A0A] text-xs font-serif tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95"
                >
                  {addedNotice ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>تمت الإضافة بنجاح!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>أضف إلى السلة</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => onBuyNow(perfume, selectedSize)}
                  className="flex-1 py-4 bg-[#C9A227] hover:bg-[#DFC062] text-[#0A0A0A] text-xs font-serif tracking-wider uppercase font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl active:scale-95"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  <span>اشتري الآن (دفع عند الاستلام)</span>
                </button>
              </div>

              {/* Guarantees Strip */}
              <div className="p-4 bg-[#111111] border border-white/5 space-y-2.5 text-xs text-[#ACA394] font-serif">
                <div className="flex items-center justify-end gap-2">
                  <span>توصيل سريع إلى باب دارك في كامل ولايات تونس (24-48 ساعة)</span>
                  <Truck className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span>الدفع نقداً عند الاستلام مع إمكانية التحقق قبل الدفع</span>
                  <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                </div>
                <div className="flex items-center justify-end gap-2">
                  <span>إمكانية الاستبدال أو الإرجاع في غضون 7 أيام</span>
                  <RefreshCw className="w-4 h-4 text-[#C9A227]" />
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Related Products Section */}
        {related.length > 0 && (
          <div className="mt-24 pt-16 border-t border-white/10">
            <div className="text-right mb-10">
              <span className="font-serif text-[11px] tracking-[0.3em] text-[#C9A227] uppercase block">
                COMPLÉTEZ VOTRE SILLAGE
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8E1D5]">
                قد يعجبك أيضاً
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {related.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => onSelectRelated(rel)}
                  className="bg-[#111111] border border-white/5 hover:border-[#C9A227]/40 p-4 transition-all cursor-pointer group"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-[#141414] mb-3">
                    <img
                      src={rel.image}
                      alt={rel.arabicName || rel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <span className="text-[10px] text-[#C9A227] font-serif uppercase block">{rel.category}</span>
                  <h4 className="text-sm font-serif font-bold text-[#E8E1D5] group-hover:text-white line-clamp-1">
                    {rel.arabicName || rel.name}
                  </h4>
                  <span className="text-xs font-serif font-bold text-[#E8E1D5] block mt-1">
                    {rel.price} د.ت
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
