import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Copy,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  MessageCircle,
  Printer,
  Package,
  RefreshCw
} from 'lucide-react';
import { Order, OrderStatus } from '../../types';

interface AdminOrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (trackingNumber: string, status: OrderStatus) => void;
  onDeleteOrder?: (id: string) => void;
  onRefreshOrders?: () => Promise<void> | void;
}

export const AdminOrdersTab: React.FC<AdminOrdersTabProps> = ({
  orders,
  onUpdateOrderStatus,
  onDeleteOrder,
  onRefreshOrders,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRefresh = async () => {
    if (!onRefreshOrders || isRefreshing) return;
    setIsRefreshing(true);
    try {
      await onRefreshOrders();
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTracking(text);
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'delivered':
        return {
          label: 'تم التسليم بنجاح',
          bg: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/40',
          icon: CheckCircle2,
        };
      case 'shipped':
        return {
          label: 'تم الشحن مع الموزع',
          bg: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/40',
          icon: Truck,
        };
      case 'preparing':
      case 'processing':
        return {
          label: 'قيد التجهيز بالمستودع',
          bg: 'bg-blue-950/60 text-blue-300 border-blue-800/40',
          icon: Package,
        };
      case 'pending_verification':
        return {
          label: 'تحقق من تحويل D17',
          bg: 'bg-purple-950/60 text-purple-300 border-purple-800/40',
          icon: Clock,
        };
      case 'cancelled':
        return {
          label: 'ملغى',
          bg: 'bg-rose-950/60 text-rose-300 border-rose-800/40',
          icon: XCircle,
        };
      case 'confirmed':
        return {
          label: 'تم التأكيد هاتفياً',
          bg: 'bg-teal-950/60 text-teal-300 border-teal-800/40',
          icon: CheckCircle2,
        };
      default:
        return {
          label: 'طلب جديد بانتظار الاتصال',
          bg: 'bg-amber-950/60 text-amber-300 border-amber-800/40',
          icon: Clock,
        };
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((ord) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      ord.trackingNumber.toLowerCase().includes(term) ||
      (ord.customerName || '').toLowerCase().includes(term) ||
      (ord.phone || '').includes(term) ||
      (ord.city || '').toLowerCase().includes(term);

    const matchStatus = statusFilter === 'all' || ord.status === statusFilter;
    const matchPayment =
      paymentFilter === 'all' ||
      (paymentFilter === 'd17' && ord.paymentMethod === 'd17') ||
      (paymentFilter === 'cod' && ord.paymentMethod !== 'd17');

    return matchSearch && matchStatus && matchPayment;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div className="text-right">
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#D6B56A]" />
            <span>إدارة الطلبات والشحن التونسي</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            متابعة طلبيات الحرفاء، تحديث الحالة (تجهيز، شحن، تسليم)، وتأكيد تحويلات بطاقة D17
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#D8C8B8]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 rounded-lg text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Supabase مباشر</span>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#241B18] hover:bg-[#3d2c29] text-[#FFF9F1] border border-[#D8C8B8]/20 rounded-xl cursor-pointer transition-colors active:scale-95 disabled:opacity-50"
            title="تحديث قائمة الطلبات من قاعدة البيانات"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#D6B56A] ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'جاري التحديث...' : 'تحديث الطلبات'}</span>
          </button>

          <span className="px-3 py-1.5 bg-[#241B18] rounded-xl border border-[#D8C8B8]/15">
            إجمالي: <strong className="text-[#FFF9F1]">{orders.length}</strong> طلب
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#332522] border border-[#D8C8B8]/20 p-4 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 text-[#D8C8B8] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث برقم التتبع، الاسم، الهاتف..."
            className="w-full pl-3 pr-10 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] placeholder-[#D8C8B8]/60 focus:outline-none focus:border-[#D6B56A]"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
          >
            <option value="all">كل حالات الطلبات</option>
            <option value="pending">طلبات جديدة</option>
            <option value="pending_verification">بانتظار تأكيد D17</option>
            <option value="confirmed">تم التأكيد هاتفياً</option>
            <option value="preparing">قيد التجهيز بالمستودع</option>
            <option value="shipped">تم الشحن مع الموزع</option>
            <option value="delivered">تم التسليم بنجاح</option>
            <option value="cancelled">ملغاة</option>
          </select>
        </div>

        <div>
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
          >
            <option value="all">كل طرق الدفع</option>
            <option value="cod">الدفع عند الاستلام (COD)</option>
            <option value="d17">الدفع الإلكتروني (D17)</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl text-[#D8C8B8] space-y-2">
            <ShoppingBag className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-xs">لا توجد طلبات مطابقة للبحث</p>
          </div>
        ) : (
          filteredOrders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            const badge = getStatusBadge(ord.status);
            const BadgeIcon = badge.icon;
            const cleanPhone = (ord.phone || '').replace(/[^0-9]/g, '');

            return (
              <div
                key={ord.id}
                className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                {/* Summary Row */}
                <div
                  onClick={() => setExpandedOrderId(isExpanded ? null : ord.id)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-[#241B18]/40 transition-colors"
                >
                  {/* Left info */}
                  <div className="flex items-center gap-4 text-right">
                    <div className="w-12 h-12 rounded-xl bg-[#241B18] border border-[#D8C8B8]/20 flex flex-col items-center justify-center shrink-0">
                      <ShoppingBag className="w-5 h-5 text-[#D6B56A]" />
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-sm font-bold text-[#D6B56A]">
                          {ord.trackingNumber}
                        </span>
                        <h4 className="text-sm font-serif font-bold text-[#FFF9F1]">
                          {ord.customerName}
                        </h4>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${badge.bg}`}
                        >
                          <BadgeIcon className="w-3 h-3" />
                          <span>{badge.label}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#D8C8B8]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D6B56A]" />
                          <span>{ord.city} {ord.delegation && `(${ord.delegation})`}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#D6B56A]" />
                          <span dir="ltr">{ord.phone}</span>
                        </span>
                        <span>•</span>
                        <span className="font-mono">{ord.items?.length || 1} منتجات</span>
                      </div>
                    </div>
                  </div>

                  {/* Right summary & actions */}
                  <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-[#D8C8B8]/10">
                    <div className="text-right md:text-left">
                      <div className="text-lg font-bold font-mono text-[#D6B56A]">
                        {ord.total} د.ت
                      </div>
                      <div className="text-[11px] text-[#D8C8B8]">
                        {ord.paymentMethod === 'd17' ? 'بطاقة D17' : 'دفع عند الاستلام'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(ord.trackingNumber);
                        }}
                        className="p-2 bg-[#241B18] border border-[#D8C8B8]/20 hover:border-[#D6B56A] text-[#D8C8B8] hover:text-[#D6B56A] rounded-xl text-xs transition-colors cursor-pointer"
                        title="نسخ رقم التتبع"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedOrderId(isExpanded ? null : ord.id);
                        }}
                        className="p-2 bg-[#241B18] border border-[#D8C8B8]/20 text-[#FFF9F1] rounded-xl cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="p-5 bg-[#241B18] border-t border-[#D8C8B8]/15 space-y-6 text-right animate-in fade-in">
                    
                    {/* Status Changer Bar */}
                    <div className="bg-[#332522] border border-[#D8C8B8]/20 p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-bold text-[#FFF9F1] block">
                          تحديث حالة الطلب وإشعار التوصيل:
                        </span>
                        <span className="text-[11px] text-[#D8C8B8]">
                          اختر الوضعية الحالية لتظهر في صفحة تتبع الطلب الخاصة بالعميل
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {[
                          { key: 'pending', label: 'جديد' },
                          { key: 'confirmed', label: 'مؤكد هاتفياً' },
                          { key: 'preparing', label: 'تجهيز بالمستودع' },
                          { key: 'shipped', label: 'تم الشحن' },
                          { key: 'delivered', label: 'تم التسليم' },
                          { key: 'cancelled', label: 'إلغاء' },
                        ].map((st) => (
                          <button
                            key={st.key}
                            onClick={() => onUpdateOrderStatus(ord.trackingNumber, st.key as OrderStatus)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              ord.status === st.key
                                ? 'bg-[#D6B56A] text-[#241B18] shadow'
                                : 'bg-[#241B18] border border-[#D8C8B8]/20 text-[#D8C8B8] hover:border-[#D6B56A]'
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Customer Info Card */}
                      <div className="p-4 bg-[#332522] rounded-xl border border-[#D8C8B8]/15 space-y-3">
                        <span className="text-xs font-bold text-[#D6B56A] block">
                          معلومات العميل والتسليم
                        </span>

                        <div className="space-y-1.5 text-xs text-[#D8C8B8]">
                          <div><strong className="text-[#FFF9F1]">الاسم:</strong> {ord.customerName}</div>
                          <div><strong className="text-[#FFF9F1]">الهاتف:</strong> <span dir="ltr">{ord.phone}</span></div>
                          <div><strong className="text-[#FFF9F1]">الولاية / المدينة:</strong> {ord.city}</div>
                          {ord.delegation && <div><strong className="text-[#FFF9F1]">المعتمدية:</strong> {ord.delegation}</div>}
                          <div><strong className="text-[#FFF9F1]">العنوان بالتفصيل:</strong> {ord.address}</div>
                          {ord.notes && (
                            <div className="p-2 bg-[#241B18] rounded-lg border border-[#D8C8B8]/15 mt-2">
                              <strong className="text-amber-300">ملاحظات العميل:</strong> {ord.notes}
                            </div>
                          )}
                        </div>

                        {/* WhatsApp Button */}
                        <div className="pt-2">
                          <a
                            href={`https://wa.me/${cleanPhone.startsWith('216') ? cleanPhone : `216${cleanPhone}`}?text=${encodeURIComponent(
                              `مرحباً بك ${ord.customerName} من متجر Lina Shop للعطور.\nبخصوص طلبك رقم (${ord.trackingNumber}) بمبلغ ${ord.total} د.ت.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>مراسلة العميل عبر واتساب</span>
                          </a>
                        </div>
                      </div>

                      {/* Payment & D17 Details */}
                      <div className="p-4 bg-[#332522] rounded-xl border border-[#D8C8B8]/15 space-y-3">
                        <span className="text-xs font-bold text-[#D6B56A] block">
                          طريقة الدفع والتفاصيل المالية
                        </span>

                        <div className="space-y-2 text-xs text-[#D8C8B8]">
                          <div className="flex justify-between">
                            <span>طريقة الدفع:</span>
                            <strong className="text-[#FFF9F1]">
                              {ord.paymentMethod === 'd17' ? 'تحويل بطاقة D17 (البريد التونسي)' : 'الدفع نقداً عند الاستلام'}
                            </strong>
                          </div>

                          {ord.paymentMethod === 'd17' && (
                            <div className="p-3 bg-[#241B18] rounded-lg border border-[#D6B56A]/30 space-y-1">
                              <div className="text-[11px] text-[#D6B56A] font-bold">
                                معرّف التحويل / رقم المعاملة D17:
                              </div>
                              <div className="font-mono text-xs font-bold text-[#FFF9F1]">
                                {ord.d17TransactionId || 'لم يُرفق رقم عملية'}
                              </div>
                            </div>
                          )}

                          <div className="flex justify-between border-t border-[#D8C8B8]/10 pt-2">
                            <span>قيمة العطور:</span>
                            <span className="font-mono text-[#FFF9F1]">{ord.subtotal} د.ت</span>
                          </div>
                          <div className="flex justify-between">
                            <span>كلفة التوصيل:</span>
                            <span className="font-mono text-[#FFF9F1]">{ord.shippingPrice} د.ت</span>
                          </div>
                          <div className="flex justify-between border-t border-[#D8C8B8]/15 pt-2 text-sm font-bold text-[#D6B56A]">
                            <span>المجموع الكلي:</span>
                            <span className="font-mono">{ord.total} د.ت</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Ordered Items Table */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-[#FFF9F1] block">
                        المنتجات المطلوبة ({ord.items?.length || 0}):
                      </span>

                      <div className="divide-y divide-[#D8C8B8]/10 border border-[#D8C8B8]/15 rounded-xl overflow-hidden bg-[#332522]">
                        {(ord.items || []).map((item, idx) => (
                          <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 rounded-lg object-cover border border-[#D8C8B8]/20"
                              />
                              <div>
                                <div className="font-serif font-bold text-[#FFF9F1]">
                                  {item.arabicName || item.name}
                                </div>
                                <div className="text-[11px] text-[#D8C8B8]">
                                  الحجم المختار: <strong className="text-[#D6B56A]">{item.selectedSize || item.volume || '30ml'}</strong>
                                </div>
                              </div>
                            </div>

                            <div className="text-left font-mono">
                              <div className="text-[#D8C8B8]">{item.quantity} × {item.price} د.ت</div>
                              <div className="font-bold text-[#D6B56A]">{(item.price || 0) * (item.quantity || 1)} د.ت</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
