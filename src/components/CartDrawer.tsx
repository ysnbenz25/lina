import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, ShieldCheck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingThreshold = 150;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 7;
  const grandTotal = subtotal + shippingFee;
  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div
        id="cart-drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 transition-opacity duration-300"
      />

      {/* Slide-out Drawer */}
      <aside
        id="cart-drawer-panel"
        className="fixed top-0 bottom-0 left-0 w-full max-w-md bg-[#09090d] border-r border-[#d4af37]/30 z-50 flex flex-col shadow-2xl transition-transform duration-300 animate-in slide-in-from-left text-right"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#111117]/90">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif">
                سلة التسوق
              </h3>
              <p className="text-[11px] text-neutral-400">
                {totalItems} {totalItems === 1 ? 'عطر في السلة' : 'عطور في السلة'}
              </p>
            </div>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
            aria-label="إغلاق السلة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div id="shipping-progress-bar" className="p-4 bg-[#111117]/50 border-b border-white/5 text-xs text-neutral-300">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[11px]">
              {subtotal >= freeShippingThreshold ? (
                <span className="text-[#d4af37] font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>تهانينا! حصلت على توصيل مجاني لكافة ولايات تونس الـ 24 🇹🇳</span>
                </span>
              ) : (
                <span>
                  أضف <strong className="text-white font-sans">{remainingForFreeShipping} د.ت</strong> للحصول على شحن مجاني
                </span>
              )}
            </span>
            <span className="text-[#d4af37] font-bold font-sans">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#b89428] to-[#d4af37] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div id="cart-items-container" className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#121218] border border-white/10 flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-7 h-7 text-[#d4af37]/60" />
              </div>
              <p className="text-sm text-neutral-300 font-serif">سلة التسوق فارغة حالياً</p>
              <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                اكتشف تشكيلتنا الفاخرة من عطور النيش التونسية الأصلية واختر عطرك المفضل.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 bg-[#14141c] hover:bg-[#d4af37] text-[#d4af37] hover:text-[#070709] border border-[#d4af37]/30 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                تصفح العطور الآن
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#101016] border border-white/5 hover:border-[#d4af37]/30 transition-colors"
              >
                {/* Image */}
                <img
                  src={item.image}
                  alt={item.arabicName}
                  className="w-16 h-16 object-cover rounded-lg shrink-0 border border-white/10"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate font-serif">
                    {item.arabicName}
                  </h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-[#d4af37] font-sans font-bold">
                      {item.price} د.ت
                    </span>
                    {item.selectedSize && (
                      <span className="text-[10px] text-neutral-400 bg-white/5 px-1.5 py-0.2 rounded">
                        {item.selectedSize}
                      </span>
                    )}
                  </div>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-white/15 rounded-lg bg-[#070709]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="تقليل الكمية"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-white font-sans">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                        aria-label="زيادة الكمية"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-neutral-500 hover:text-rose-400 text-xs p-1 transition-colors cursor-pointer"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Item Subtotal */}
                <div className="text-left shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-white font-sans">
                    {(item.price * item.quantity).toLocaleString()} د.ت
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions with breakdown: Subtotal, Shipping, Total */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#111117]/95 space-y-4">
            
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-neutral-300">
                <span>المجموع الفرعي (Subtotal):</span>
                <span className="font-bold text-white font-sans text-sm">
                  {subtotal.toLocaleString()} د.ت
                </span>
              </div>

              <div className="flex items-center justify-between text-neutral-300">
                <span>تكلفة الشحن (Livraison):</span>
                {shippingFee === 0 ? (
                  <span className="text-emerald-400 font-bold text-xs">
                    مجاني (Gratuit) 🎉
                  </span>
                ) : (
                  <span className="font-bold text-white font-sans text-sm">
                    {shippingFee} د.ت
                  </span>
                )}
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-sm">
                <span className="font-bold text-white font-serif">المجموع الإجمالي (Total):</span>
                <span id="cart-drawer-total" className="text-xl font-bold text-[#d4af37] font-sans">
                  {grandTotal.toLocaleString()} د.ت
                </span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-[#070709] border border-white/5 text-[11px] text-neutral-400 text-center flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>الدفع نقداً عند الاستلام أو بتطبيق D17 في كامل تونس</span>
            </div>

            <button
              id="checkout-action-btn"
              onClick={onCheckout}
              className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#070709] font-bold rounded-xl text-sm transition-all shadow-xl shadow-[#d4af37]/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
            >
              <span>متابعة الطلب</span>
              <ArrowLeft className="w-4 h-4" />
            </button>

          </div>
        )}
      </aside>
    </>
  );
};
