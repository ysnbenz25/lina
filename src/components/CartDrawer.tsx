import React, { useState } from 'react';
import { CartItem } from '../types';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, ShieldCheck, Tag, Check } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: number, delta: number) => void;
  onRemoveItem: (id: number) => void;
  onCheckout: () => void;
  freeShippingThreshold?: number;
  standardShippingFee?: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  freeShippingThreshold = 150,
  standardShippingFee = 7,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  if (!isOpen) return null;

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : standardShippingFee;
  const grandTotal = Math.max(0, subtotal - discountAmount) + shippingFee;
  const progress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFree = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    setCouponError('');

    try {
      const res = await fetch('/api/promotions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, subtotal })
      });
      const data = await res.json();
      if (data.success) {
        setDiscountAmount(data.discountAmount);
        setCouponApplied(true);
      } else {
        setCouponError(data.message || 'رمز الخصم غير صالح');
      }
    } catch {
      // Fallback local check for common coupons
      if (couponCode.toUpperCase() === 'LINA10') {
        const disc = Math.round(subtotal * 0.1);
        setDiscountAmount(disc);
        setCouponApplied(true);
      } else {
        setCouponError('تعذر التحقق من رمز الخصم حالياً');
      }
    } finally {
      setValidatingCoupon(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        id="cart-drawer-backdrop"
        onClick={onClose}
        className="fixed inset-0 bg-[#0A0A0A]/85 backdrop-blur-sm z-50 transition-opacity"
      />

      {/* Slide-out Drawer from Left (Desktop) or Right depending on preference */}
      <aside
        id="cart-drawer-panel"
        className="fixed top-0 bottom-0 left-0 w-full max-w-md bg-[#0A0A0A] border-r border-white/10 z-50 flex flex-col shadow-2xl text-right animate-in slide-in-from-left duration-300"
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#111111]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#181818] border border-white/10 flex items-center justify-center text-[#C9A227]">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-serif font-bold text-[#E8E1D5]">
                سلة المشتريات
              </h3>
              <p className="text-[11px] text-[#ACA394] font-serif">
                {totalItems} {totalItems === 1 ? 'عطر في السلة' : 'عطور مختارة'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white cursor-pointer"
            aria-label="إغلاق السلة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="p-4 bg-[#111111]/70 border-b border-white/5 text-xs text-[#ACA394] font-serif">
          <div className="flex justify-between items-center mb-2">
            <span>
              {subtotal >= freeShippingThreshold ? (
                <span className="text-[#C9A227] font-semibold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>تهانينا! حصلت على توصيل مجاني لكامل تونس</span>
                </span>
              ) : (
                <span>
                  أضف <strong className="text-[#E8E1D5] font-sans">{remainingForFree} د.ت</strong> للاستفادة من التوصيل المجاني
                </span>
              )}
            </span>
            <span className="text-[#C9A227] font-sans font-bold">{progress}%</span>
          </div>

          <div className="w-full h-1 bg-[#1A1A1A] overflow-hidden">
            <div
              className="h-full bg-[#C9A227] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#111111] border border-white/5 flex items-center justify-center text-neutral-600">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-base text-[#E8E1D5]">سلتك فارغة حالياً</h4>
              <p className="text-xs text-[#ACA394] font-serif max-w-xs mx-auto">
                اكتشف تشكيلاتنا العطرية الفاخرة وأضف عطرك المفضل الآن.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-[#E8E1D5] text-[#0A0A0A] font-serif text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                تصفح العطور
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 bg-[#111111] border border-white/5 relative group"
              >
                {/* Thumbnail */}
                <div className="w-16 h-20 bg-[#161616] shrink-0 overflow-hidden border border-white/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 text-right space-y-1">
                  <h4 className="text-xs sm:text-sm font-serif font-bold text-[#E8E1D5] truncate">
                    {item.arabicName || item.name}
                  </h4>
                  <p className="text-[10px] text-[#ACA394] font-serif">
                    {item.volume || '100 ml'}
                  </p>
                  <span className="text-xs font-serif font-bold text-[#C9A227] block">
                    {item.price} د.ت
                  </span>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex items-center border border-white/10 bg-[#161616]">
                      <button
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-2 py-0.5 text-xs text-[#E8E1D5] hover:text-[#C9A227] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-serif text-[#E8E1D5]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="px-2 py-0.5 text-xs text-[#E8E1D5] hover:text-[#C9A227] cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1 text-neutral-500 hover:text-red-400 cursor-pointer mr-auto"
                      title="حذف من السلة"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Total per line */}
                <div className="text-left shrink-0 pl-1">
                  <span className="text-xs font-serif font-bold text-[#E8E1D5]">
                    {item.price * item.quantity} د.ت
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area with Coupon, Calculations & Checkout */}
        {items.length > 0 && (
          <div className="p-5 bg-[#111111] border-t border-white/10 space-y-4">
            
            {/* Coupon input form */}
            {!couponApplied ? (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="رمز قسيمة الخصم (مثال: LINA10)"
                  className="flex-1 px-3 py-2 bg-[#161616] border border-white/10 text-xs text-[#E8E1D5] placeholder-neutral-500 focus:outline-none focus:border-[#C9A227] text-right uppercase"
                />
                <button
                  type="submit"
                  disabled={validatingCoupon}
                  className="px-4 py-2 bg-[#1C1C1C] hover:bg-white/10 text-[#E8E1D5] border border-white/15 text-xs font-serif uppercase cursor-pointer"
                >
                  {validatingCoupon ? '...' : 'تطبيق'}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-between p-2.5 bg-[#C9A227]/10 border border-[#C9A227]/30 text-xs text-[#C9A227] font-serif">
                <div className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>تم تطبيق كود الخصم: {couponCode.toUpperCase()}</span>
                </div>
                <button
                  onClick={() => {
                    setCouponApplied(false);
                    setDiscountAmount(0);
                    setCouponCode('');
                  }}
                  className="text-neutral-400 hover:text-white underline text-[10px]"
                >
                  إلغاء
                </button>
              </div>
            )}

            {couponError && (
              <p className="text-[11px] text-red-400 font-serif text-right">{couponError}</p>
            )}

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs font-serif text-[#ACA394] border-t border-white/5 pt-3">
              <div className="flex justify-between">
                <span className="text-[#E8E1D5] font-sans">{subtotal} د.ت</span>
                <span>المجموع الفرعي:</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-[#C9A227]">
                  <span className="font-sans">-{discountAmount} د.ت</span>
                  <span>الخصم المطبق:</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-[#E8E1D5] font-sans">
                  {shippingFee === 0 ? (
                    <span className="text-emerald-400 font-bold">مجاني</span>
                  ) : (
                    `${shippingFee} د.ت`
                  )}
                </span>
                <span>رسوم التوصيل:</span>
              </div>

              <div className="flex justify-between text-base font-bold text-[#E8E1D5] pt-2 border-t border-white/5">
                <span className="font-serif text-[#C9A227]">{grandTotal} د.ت</span>
                <span>المجموع الإجمالي:</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-4 bg-[#E8E1D5] hover:bg-white text-[#0A0A0A] font-serif text-xs uppercase font-bold tracking-widest transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer shadow-xl active:scale-95"
            >
              <span>متابعة إتمام الطلب (الدفع عند الاستلام)</span>
              <ArrowLeft className="w-4 h-4 text-[#0A0A0A]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[10px] text-[#ACA394] font-serif text-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>دفع آمن عند الاستلام • التوصيل لكامل تراب الجمهورية</span>
            </div>

          </div>
        )}
      </aside>
    </>
  );
};
