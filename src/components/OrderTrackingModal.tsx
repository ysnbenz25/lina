import React, { useState } from 'react';
import { X, Search, Truck, CheckCircle2, Clock, AlertCircle, Smartphone, Banknote, ShieldAlert } from 'lucide-react';
import { Order } from '../types';

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  initialTrackingCode?: string;
}

export const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({
  isOpen,
  onClose,
  orders,
  initialTrackingCode = '',
}) => {
  const [searchCode, setSearchCode] = useState(initialTrackingCode);
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    if (initialTrackingCode) {
      return orders.find((o) => o.trackingNumber.toUpperCase() === initialTrackingCode.toUpperCase()) || null;
    }
    return orders.length > 0 ? orders[0] : null;
  });
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = searchCode.trim().toUpperCase();
    const found = orders.find((o) => o.trackingNumber.toUpperCase() === cleanCode);
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const isD17 = searchedOrder?.paymentMethod === 'd17';

  return (
    <div
      id="tracking-modal-backdrop"
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div
        id="tracking-modal"
        className="bg-[#101014] border border-[#d4af37]/40 rounded-2xl max-w-xl w-full p-5 sm:p-8 relative shadow-2xl my-auto text-right animate-in zoom-in-95 duration-200"
      >
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-serif">نظام تتبع الشحنات والدفع المباشر</h3>
            <p className="text-xs text-neutral-400">تتبع مسار طلبك وحالة التحقق من الدفع لحظة بلحظة</p>
          </div>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-5">
          <input
            type="text"
            required
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            placeholder="أدخل كود التتبع (مثال: TN-784291)"
            dir="ltr"
            className="flex-1 px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-[#d4af37] font-sans uppercase text-left transition-colors"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#e5ca78] text-[#08080a] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 active:scale-95"
          >
            <Search className="w-4 h-4" />
            <span>بحث وتتبع</span>
          </button>
        </form>

        {/* Result Container */}
        {searchedOrder ? (
          <div className="p-4 sm:p-5 bg-[#08080a] rounded-xl border border-[#d4af37]/30 space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[11px] text-neutral-400 block">رقم بوليصة التتبع:</span>
                <span className="text-lg font-bold text-[#d4af37] font-sans">
                  {searchedOrder.trackingNumber}
                </span>
              </div>
              <div className="text-left">
                <span className="text-[11px] text-neutral-400 block">تاريخ التسجيل:</span>
                <span className="text-xs text-white font-sans">{searchedOrder.createdAt}</span>
              </div>
            </div>

            {/* Payment Method Badge & Warning */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#101014] rounded-xl border border-white/5 text-xs">
              <div className="flex items-center gap-2">
                {isD17 ? (
                  <Smartphone className="w-4 h-4 text-[#d4af37]" />
                ) : (
                  <Banknote className="w-4 h-4 text-[#d4af37]" />
                )}
                <div>
                  <span className="text-neutral-400">طريقة الدفع: </span>
                  <strong className="text-white">
                    {isD17 ? 'تطبيق D17 (البريد التونسي)' : 'الدفع نقداً عند الاستلام (COD)'}
                  </strong>
                </div>
              </div>

              {isD17 && searchedOrder.d17TransactionId && (
                <div className="text-xs bg-[#08080a] px-2.5 py-1 rounded-lg border border-white/10 font-mono text-[#d4af37]" dir="ltr">
                  TX: {searchedOrder.d17TransactionId}
                </div>
              )}
            </div>

            {/* Status Highlight Banner for D17 Pending */}
            {searchedOrder.status === 'pending_verification' && (
              <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl flex items-start gap-2 text-xs text-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold block text-amber-300">الطلب معلق بانتظار التحقق من التحويل:</strong>
                  <span>
                    تم استلام رقم العملية ({searchedOrder.d17TransactionId}). يقوم المشرف بمطابقة كشف حساب D17 وسيبدأ تجهيز شحنتك فور التأكيد.
                  </span>
                </div>
              </div>
            )}

            {/* Recipient Details */}
            <div className="p-3 bg-[#101014] rounded-lg border border-white/5 text-xs text-neutral-300 space-y-1">
              <p>
                <strong className="text-white">المستلم:</strong> {searchedOrder.customerName} (
                <span dir="ltr" className="font-mono">{searchedOrder.phone}</span>)
              </p>
              <p>
                <strong className="text-white">العنوان:</strong> {searchedOrder.city} {searchedOrder.delegation ? `- ${searchedOrder.delegation}` : ''} - {searchedOrder.address}
              </p>
            </div>

            {/* Timeline */}
            <div className="space-y-3 pt-1">
              <h5 className="text-xs font-bold text-white">مراحل الشحنة:</h5>

              <div className="space-y-2.5">
                {/* D17 Verification Step (if D17) */}
                {isD17 && (
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        searchedOrder.status === 'pending_verification'
                          ? 'bg-amber-500 text-black animate-pulse'
                          : 'bg-emerald-500 text-black'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h6
                        className={`text-xs font-bold ${
                          searchedOrder.status === 'pending_verification' ? 'text-amber-400 text-sm' : 'text-emerald-400'
                        }`}
                      >
                        {searchedOrder.status === 'pending_verification'
                          ? '1. بانتظار تأكيد تحويل تطبيق D17'
                          : '1. تم التحقق من تحويل D17 بنجاح'}
                      </h6>
                      <p className="text-[11px] text-neutral-400">
                        {searchedOrder.status === 'pending_verification'
                          ? 'جاري مطابقة رقم المعاملة مع البريد التونسي'
                          : 'تم تأكيد وصول المبلغ وبدء التجهيز'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Step: Processing */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      searchedOrder.status === 'processing'
                        ? 'bg-[#d4af37] text-[#08080a]'
                        : searchedOrder.status === 'shipped' || searchedOrder.status === 'delivered'
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#1a1a24] text-neutral-500'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h6
                      className={`text-xs font-bold ${
                        searchedOrder.status === 'processing' ? 'text-[#d4af37] text-sm' : searchedOrder.status === 'shipped' || searchedOrder.status === 'delivered' ? 'text-white' : 'text-neutral-500'
                      }`}
                    >
                      {isD17 ? '2. التجهيز والتغليف بدار لينا للعطور' : '1. قيد التجهيز في دار لينا للعطور'}
                    </h6>
                    <p className="text-[11px] text-neutral-400">
                      تجهيز العطور الفاخرة والعينات المجانية وتغليف الصناديق الملكية
                    </p>
                  </div>
                </div>

                {/* Step: Shipped */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      searchedOrder.status === 'shipped'
                        ? 'bg-[#d4af37] text-[#08080a]'
                        : searchedOrder.status === 'delivered'
                        ? 'bg-emerald-500 text-black'
                        : 'bg-[#1a1a24] text-neutral-500'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h6
                      className={`text-xs font-bold ${
                        searchedOrder.status === 'shipped' ? 'text-[#d4af37] text-sm' : searchedOrder.status === 'delivered' ? 'text-white' : 'text-neutral-500'
                      }`}
                    >
                      {isD17 ? '3. تم الشحن للموزع' : '2. تم الشحن والتسليم للمندوب'}
                    </h6>
                    <p className="text-[11px] text-neutral-400">
                      الشحنة في طريقها للتسليم إلى عنوانك في ولاية {searchedOrder.city}
                    </p>
                  </div>
                </div>

                {/* Step: Delivered */}
                <div className="flex items-start gap-3">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                      searchedOrder.status === 'delivered'
                        ? 'bg-green-500 text-[#08080a]'
                        : 'bg-[#1a1a24] text-neutral-500'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h6
                      className={`text-xs font-bold ${
                        searchedOrder.status === 'delivered' ? 'text-green-400 text-sm' : 'text-neutral-500'
                      }`}
                    >
                      {isD17 ? '4. تم التسليم بنجاح' : '3. تم التوصيل بنجاح'}
                    </h6>
                    <p className="text-[11px] text-neutral-400">
                      تم تسليم العطر للحريف وتأكيد وصول الشحنة بسلامة تامة
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Summary */}
            <div className="border-t border-white/10 pt-3 space-y-2">
              <span className="text-xs font-bold text-white block">
                محتويات الطلب ({searchedOrder.items.length}):
              </span>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {searchedOrder.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center text-xs text-neutral-300 bg-[#101014] p-2 rounded-lg"
                  >
                    <span>
                      {item.arabicName} × {item.quantity}
                    </span>
                    <span className="text-[#d4af37] font-sans font-bold">
                      {(item.price * item.quantity).toLocaleString()} د.ت
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-white/5 font-bold">
                <span className="text-white">المبلغ الإجمالي:</span>
                <span className="text-[#d4af37] font-sans text-sm">
                  {searchedOrder.total.toLocaleString()} د.ت
                </span>
              </div>
            </div>
          </div>
        ) : hasSearched ? (
          <div className="p-8 text-center bg-[#08080a] rounded-xl border border-red-500/30 space-y-2">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
            <h4 className="text-sm font-bold text-red-400">لم يتم العثور على طلب بهذا الرمز</h4>
            <p className="text-xs text-neutral-400">
              يرجى التأكد من كتابة الرمز بشكل دقيق (مثال: TN-784291)
            </p>
          </div>
        ) : (
          <div className="p-8 text-center text-neutral-500 text-xs bg-[#08080a] rounded-xl border border-white/5">
            أدخل رقم التتبع الخاص بك واضغط على &quot;بحث وتتبع&quot; للاطلاع على حالة الشحنة والتحقق من دفع D17.
          </div>
        )}
      </div>
    </div>
  );
};
