import React, { useState, useEffect } from 'react';
import { Perfume, CartItem } from '../types';
import { X, ShoppingBag, Zap, Star, Sparkles, Truck, ShieldCheck, Check, Plus, Minus } from 'lucide-react';

interface QuickViewModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume, quantity?: number, selectedSize?: string) => void;
  onBuyNow: (perfume: Perfume, quantity?: number, selectedSize?: string) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
  onBuyNow,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedSize, setSelectedSize] = useState<string>('100 ml');

  // Reset state when perfume changes
  useEffect(() => {
    if (perfume) {
      setSelectedImage(perfume.image);
      setQuantity(1);
      setSelectedSize(perfume.sizes && perfume.sizes.length > 0 ? perfume.sizes[perfume.sizes.length - 1] : '100 ml');
    }
  }, [perfume]);

  if (!perfume) return null;

  const galleryImages = perfume.gallery && perfume.gallery.length > 0
    ? perfume.gallery
    : [perfume.image];

  const availableSizes = perfume.sizes && perfume.sizes.length > 0
    ? perfume.sizes
    : ['50 ml', '100 ml'];

  const discountAmount = perfume.originalPrice - perfume.price;
  const discountPercent = Math.round((discountAmount / perfume.originalPrice) * 100);

  return (
    <div
      id="quick-view-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="quick-view-card"
        className="bg-[#0c0c11] border border-[#d4af37]/40 rounded-2xl max-w-4xl w-full p-5 sm:p-8 relative shadow-2xl my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
      >
        {/* Close Button */}
        <button
          id="close-quick-view"
          onClick={onClose}
          className="absolute top-4 left-4 z-30 p-2 text-neutral-400 hover:text-white rounded-full bg-[#14141c]/80 hover:bg-[#1f1f2a] border border-white/10 transition-colors cursor-pointer"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Gallery Section (Left in RTL, 6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            
            {/* Main Featured Image */}
            <div className="relative rounded-2xl overflow-hidden bg-[#070709] border border-white/10 aspect-square shadow-xl">
              <img
                src={selectedImage || perfume.image}
                alt={perfume.arabicName}
                className="w-full h-full object-cover object-center filter contrast-105"
              />
              {discountAmount > 0 && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-[#d4af37] text-[#070709] font-sans shadow-md">
                    وفر {discountAmount} د.ت (-{discountPercent}%)
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails list */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      (selectedImage === img || (!selectedImage && idx === 0))
                        ? 'border-[#d4af37] ring-2 ring-[#d4af37]/30 scale-105'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Delivery Guarantee Notice */}
            <div className="p-3.5 rounded-xl bg-[#121218] border border-white/5 flex items-center gap-3 text-right">
              <div className="w-10 h-10 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-white">التوصيل إلى كامل تونس (24 - 48 ساعة)</p>
                <p className="text-neutral-400 mt-0.5">توصيل مجاني عند الشراء بـ 150 د.ت أو أكثر مع الدفع عند الاستلام</p>
              </div>
            </div>

          </div>

          {/* Details Section (Right in RTL, 6 Cols) */}
          <div className="lg:col-span-6 space-y-5 text-right">
            
            {/* Badges & Titles */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#d4af37] bg-[#d4af37]/10 px-3 py-1 rounded-full border border-[#d4af37]/30 font-serif">
                  {perfume.badge}
                </span>
                <span className="text-xs text-neutral-400 font-serif">
                  {perfume.category}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-white font-serif tracking-tight mt-1">
                {perfume.arabicName}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-400 tracking-wider font-sans font-medium">
                {perfume.name} • {perfume.volume}
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1 text-[#d4af37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#d4af37]" />
                ))}
              </div>
              <span className="font-bold text-white font-sans">{perfume.rating}</span>
              <span className="text-neutral-500 font-sans">({perfume.reviewsCount} تقييم موثق من حرفاء تونس)</span>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-[#121218] border border-white/5 flex items-baseline justify-between">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-bold text-[#d4af37] font-sans">
                  {perfume.price} د.ت
                </span>
                {perfume.originalPrice > perfume.price && (
                  <span className="text-sm sm:text-base text-neutral-500 line-through font-sans">
                    {perfume.originalPrice} د.ت
                  </span>
                )}
              </div>
              <span className="text-xs text-emerald-400 font-medium">
                متوفر بالمستودع بتونس
              </span>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {perfume.description}
            </p>

            {/* Fragrance Notes (الهرم العطري الكامل) */}
            <div className="space-y-2.5 p-4 rounded-xl bg-[#0f0f15] border border-[#d4af37]/25 text-xs text-right">
              <div className="flex items-center gap-1.5 text-[#d4af37] font-serif font-bold">
                <Sparkles className="w-4 h-4" />
                <span>الهرم العطري والنوتات (Pyramide Olfactive):</span>
              </div>
              
              <div className="grid grid-cols-1 gap-2 pt-1 border-t border-white/5">
                <div className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#d4af37] shrink-0 mt-1" />
                  <p className="text-neutral-300">
                    <strong className="text-white font-semibold">افتتاحية العطر (Top Notes):</strong> {perfume.notes.top}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#b89428] shrink-0 mt-1" />
                  <p className="text-neutral-300">
                    <strong className="text-white font-semibold">قلب العطر (Heart Notes):</strong> {perfume.notes.heart}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8c6d1a] shrink-0 mt-1" />
                  <p className="text-neutral-300">
                    <strong className="text-white font-semibold">قاعدة العطر (Base Notes):</strong> {perfume.notes.base}
                  </p>
                </div>
              </div>
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-300 block">
                الحجم المتوفر:
              </label>
              <div className="flex items-center gap-2">
                {availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#d4af37] text-[#070709] border-[#d4af37] font-bold shadow-md'
                        : 'bg-[#121218] text-neutral-300 border-white/10 hover:border-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 pt-1">
              <span className="text-xs font-semibold text-neutral-300">الكمية:</span>
              <div className="flex items-center border border-white/15 rounded-xl bg-[#121218] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="إنقاص"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-bold text-white font-sans">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="زيادة"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-xs text-neutral-400 font-sans">
                المجموع: <strong className="text-[#d4af37]">{(perfume.price * quantity).toLocaleString()} د.ت</strong>
              </span>
            </div>

            {/* Action Buttons: Add to Cart + Buy Now */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  onAddToCart(perfume, quantity, selectedSize);
                  onClose();
                }}
                className="w-full py-3.5 bg-[#171722] hover:bg-[#20202e] text-neutral-100 hover:text-white border border-[#d4af37]/40 rounded-xl font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95"
              >
                <ShoppingBag className="w-4 h-4 text-[#d4af37]" />
                <span>أضف إلى السلة</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onBuyNow(perfume, quantity, selectedSize);
                  onClose();
                }}
                className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#070709] rounded-xl font-bold text-xs transition-all shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Zap className="w-4 h-4" />
                <span>شراء الآن والدفع عند الاستلام</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
