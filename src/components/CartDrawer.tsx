import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';

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
  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      {/* Backdrop */}
      <div
        id="cart-drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 transition-opacity duration-300"
      />

      {/* Slide-out Drawer */}
      <aside
        id="cart-drawer-panel"
        className="fixed top-0 bottom-0 left-0 w-full max-w-md bg-[#08080a] border-r border-white/10 z-50 flex flex-col shadow-2xl transition-transform duration-300 animate-in slide-in-from-left"
      >
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-center justify-between bg-[#101014]/90">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
            <h3 className="text-base font-bold text-white font-serif">
              سلة المشتريات ({totalItems})
            </h3>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div id="shipping-progress-bar" className="p-4 bg-[#101014]/40 border-b border-white/5 text-xs text-neutral-300">
          <div className="flex justify-between items-center mb-1.5">
            <span>
              {subtotal >= freeShippingThreshold ? (
                <span className="text-[#d4af37] font-semibold">🎉 تهانينا! لقد حصلت على شحن مجاني لكافة ولايات تونس الـ 24.</span>
              ) : (
                <span>
                  أضف <strong className="text-white">{remainingForFreeShipping} د.ت</strong> إضافية للحصول على شحن مجاني لكافة ولايات تونس الـ 24
                </span>
              )}
            </span>
            <span className="text-[#d4af37] font-bold">{progress}%</span>
          </div>
          <div className="w-full h-1.5 bg-[#17171d] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#b89428] to-[#d4af37] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div id="cart-items-container" className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#101014] border border-white/10 flex items-center justify-center text-neutral-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <p className="text-sm text-neutral-400">سلة التسوق فارغة حالياً</p>
              <button
                onClick={onClose}
                className="text-xs text-[#d4af37] underline hover:text-[#e5ca78]"
              >
                تصفح تشكيلة العطور الفاخرة بتونس
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                id={`cart-item-${item.id}`}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#101014] border border-white/5 text-right"
              >
                <img
                  src={item.image}
                  alt={item.arabicName}
                  className="w-16 h-16 object-cover rounded-lg shrink-0 border border-white/10"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate font-serif">
                    {item.arabicName}
                  </h4>
                  <p className="text-xs text-[#d4af37] font-sans font-bold">
                    {item.price} د.ت
                  </p>

                  {/* Quantity adjustment */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-white/10 rounded-lg bg-[#08080a]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-1 text-neutral-400 hover:text-white transition-colors"
                        aria-label="تقليل"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-white font-sans">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-1 text-neutral-400 hover:text-white transition-colors"
                        aria-label="زيادة"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-neutral-500 hover:text-rose-400 text-xs p-1 transition-colors"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="text-left shrink-0">
                  <span className="text-xs font-bold text-white font-sans">
                    {(item.price * item.quantity).toLocaleString()} د.ت
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer actions */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 bg-[#101014]/90 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-400">المجموع الفرعي:</span>
              <span id="cart-drawer-subtotal" className="text-xl font-bold text-white font-sans">
                {subtotal.toLocaleString()} د.ت
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 text-right">
              توصيل مضمون لكافة ولايات تونس الـ 24 والدفع نقداً عند الاستلام (Paiement à la livraison).
            </p>

            <button
              id="checkout-action-btn"
              onClick={onCheckout}
              className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#08080a] font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2 active:scale-95"
            >
              <span>متابعة الشراء وتحديد الولاية</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
