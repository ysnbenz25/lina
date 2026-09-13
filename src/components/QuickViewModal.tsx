import React from 'react';
import { Perfume } from '../types';
import { X, ShoppingBag, Star, Sparkles } from 'lucide-react';

interface QuickViewModalProps {
  perfume: Perfume | null;
  onClose: () => void;
  onAddToCart: (perfume: Perfume) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  perfume,
  onClose,
  onAddToCart,
}) => {
  if (!perfume) return null;

  return (
    <div
      id="quick-view-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        id="quick-view-card"
        className="bg-[#08080a] border border-[#d4af37]/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
      >
        <button
          id="close-quick-view"
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Image */}
          <div className="rounded-xl overflow-hidden bg-[#101014] border border-white/10 aspect-square">
            <img
              src={perfume.image}
              alt={perfume.arabicName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="space-y-4 text-right">
            <div>
              <span className="text-xs text-[#d4af37] font-bold bg-[#d4af37]/10 px-2.5 py-1 rounded-full border border-[#d4af37]/20 inline-block">
                {perfume.badge}
              </span>
              <h3 className="text-2xl font-bold text-white font-serif mt-2">
                {perfume.arabicName}
              </h3>
              <p className="text-xs text-neutral-400 tracking-wider">
                {perfume.name} • {perfume.volume}
              </p>
            </div>

            <div className="flex items-center gap-1 text-[#d4af37] text-xs">
              <Star className="w-4 h-4 fill-[#d4af37]" />
              <span className="font-bold">{perfume.rating}</span>
              <span className="text-neutral-500">({perfume.reviewsCount} تقييم موثق)</span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-2xl font-bold text-[#d4af37] font-sans">
                {perfume.price} د.ت
              </span>
              <span className="text-sm text-neutral-500 line-through font-sans">
                {perfume.originalPrice} د.ت
              </span>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              {perfume.description}
            </p>

            {/* Olfactory Pyramid (الهرم العطري) */}
            <div className="space-y-1.5 p-3 rounded-xl bg-[#101014] border border-white/5 text-xs">
              <p className="text-[#d4af37] font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>الهرم العطري والمكونات النادرة:</span>
              </p>
              <p className="text-neutral-400">
                <strong className="text-neutral-300">افتتاحية العطر:</strong> {perfume.notes.top}
              </p>
              <p className="text-neutral-400">
                <strong className="text-neutral-300">قلب العطر:</strong> {perfume.notes.heart}
              </p>
              <p className="text-neutral-400">
                <strong className="text-neutral-300">قاعدة العطر:</strong> {perfume.notes.base}
              </p>
            </div>

            <button
              onClick={() => {
                onAddToCart(perfume);
                onClose();
              }}
              className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#08080a] font-bold text-sm rounded-xl transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>أضف إلى السلة واستكمل الطلب</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
