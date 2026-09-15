import React, { useState } from 'react';
import {
  Users,
  Search,
  Phone,
  MapPin,
  ShoppingBag,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Order } from '../../types';

interface AdminCustomersTabProps {
  orders: Order[];
  onSelectOrder?: (trackingNumber: string) => void;
}

interface AggregatedCustomer {
  phone: string;
  name: string;
  city: string;
  delegation?: string;
  address?: string;
  orders: Order[];
  totalSpend: number;
  lastOrderDate?: string;
}

export const AdminCustomersTab: React.FC<AdminCustomersTabProps> = ({
  orders,
  onSelectOrder,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'repeat' | 'single'>('all');
  const [expandedCustomerPhone, setExpandedCustomerPhone] = useState<string | null>(null);

  // Aggregate customers by phone number
  const customersMap: Record<string, AggregatedCustomer> = {};
  orders.forEach((ord) => {
    const rawPhone = (ord.phone || '').trim();
    const phoneKey = rawPhone || `unknown-${ord.id}`;
    if (!customersMap[phoneKey]) {
      customersMap[phoneKey] = {
        phone: rawPhone,
        name: ord.customerName || 'عميل بدون اسم',
        city: ord.city || 'تونس',
        delegation: ord.delegation,
        address: ord.address,
        orders: [],
        totalSpend: 0,
        lastOrderDate: ord.createdAt,
      };
    }
    customersMap[phoneKey].orders.push(ord);
    if (ord.status !== 'cancelled') {
      customersMap[phoneKey].totalSpend += Number(ord.total) || 0;
    }
  });

  const customersList = Object.values(customersMap);

  const filteredCustomers = customersList.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchSearch =
      c.name.toLowerCase().includes(term) ||
      c.phone.includes(term) ||
      c.city.toLowerCase().includes(term);

    const matchType =
      filterType === 'all' ||
      (filterType === 'repeat' && c.orders.length > 1) ||
      (filterType === 'single' && c.orders.length === 1);

    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div className="text-right">
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#D6B56A]" />
            <span>سجل الحرفاء وقاعدة العملاء</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            عرض بيانات العملاء، سجل مشترياتهم السابقة، العملاء المميزين (VIP)، ومراسلتهم مباشرة عبر واتساب
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#D8C8B8]">
          <span className="px-3 py-1.5 bg-[#241B18] rounded-xl border border-[#D8C8B8]/15">
            إجمالي الحرفاء: <strong className="text-[#FFF9F1]">{customersList.length}</strong>
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#332522] border border-[#D8C8B8]/20 p-4 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 text-[#D8C8B8] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث باسم الحريف، الهاتف، أو المدينة..."
            className="w-full pl-3 pr-10 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] placeholder-[#D8C8B8]/60 focus:outline-none focus:border-[#D6B56A]"
          />
        </div>

        <div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
          >
            <option value="all">كل الحرفاء ({customersList.length})</option>
            <option value="repeat">عملاء متكررون (أكثر من طلب واحد)</option>
            <option value="single">عملاء جدد (طلب واحد)</option>
          </select>
        </div>
      </div>

      {/* Customer List */}
      <div className="space-y-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-16 bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl text-[#D8C8B8] space-y-2">
            <Users className="w-10 h-10 mx-auto opacity-30" />
            <p className="text-xs">لا يوجد حرفاء مطابقون لمعايير البحث</p>
          </div>
        ) : (
          filteredCustomers.map((cust, idx) => {
            const isExpanded = expandedCustomerPhone === cust.phone;
            const cleanPhone = cust.phone.replace(/[^0-9]/g, '');
            const isVip = cust.orders.length > 1;

            return (
              <div
                key={idx}
                className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl overflow-hidden shadow-sm transition-all"
              >
                {/* Customer Row */}
                <div
                  onClick={() => setExpandedCustomerPhone(isExpanded ? null : cust.phone)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-[#241B18]/40 transition-colors"
                >
                  <div className="flex items-center gap-4 text-right">
                    <div className="w-12 h-12 rounded-xl bg-[#241B18] border border-[#D8C8B8]/20 flex items-center justify-center shrink-0">
                      <span className="text-base font-serif font-bold text-[#D6B56A]">
                        {cust.name.charAt(0) || 'ع'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-serif font-bold text-[#FFF9F1]">
                          {cust.name}
                        </h4>
                        {isVip && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#722F3F] text-[#D6B56A] border border-[#D6B56A]/30 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            <span>حريف دائم ({cust.orders.length} طلبات)</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#D8C8B8]">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#D6B56A]" />
                          <span>{cust.city} {cust.delegation && `(${cust.delegation})`}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3.5 h-3.5 text-[#D6B56A]" />
                          <span dir="ltr">{cust.phone}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions and Total spend */}
                  <div className="flex items-center justify-between md:justify-end gap-5 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-[#D8C8B8]/10">
                    <div className="text-right md:text-left">
                      <div className="text-lg font-bold font-mono text-[#D6B56A]">
                        {cust.totalSpend} د.ت
                      </div>
                      <div className="text-[11px] text-[#D8C8B8]">
                        إجمالي الإنفاق ({cust.orders.length} طلبات)
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`https://wa.me/${cleanPhone.startsWith('216') ? cleanPhone : `216${cleanPhone}`}?text=${encodeURIComponent(
                          `مرحباً بك ${cust.name} من متجر Lina Shop للعطور الفاخرة بتونس.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-emerald-950/60 border border-emerald-700/50 hover:bg-emerald-900/60 text-emerald-400 rounded-xl text-xs transition-colors cursor-pointer"
                        title="مراسلة عبر واتساب"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setExpandedCustomerPhone(isExpanded ? null : cust.phone);
                        }}
                        className="p-2 bg-[#241B18] border border-[#D8C8B8]/20 text-[#FFF9F1] rounded-xl cursor-pointer"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded Orders History */}
                {isExpanded && (
                  <div className="p-5 bg-[#241B18] border-t border-[#D8C8B8]/15 space-y-3 text-right animate-in fade-in">
                    <span className="text-xs font-bold text-[#D6B56A] block">
                      سجل طلبيات الحريف السابقة ({cust.orders.length} طلب):
                    </span>

                    <div className="divide-y divide-[#D8C8B8]/10 bg-[#332522] rounded-xl border border-[#D8C8B8]/15 overflow-hidden">
                      {cust.orders.map((ord) => (
                        <div key={ord.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[#D6B56A] font-bold">{ord.trackingNumber}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#241B18] text-[#D8C8B8] border border-[#D8C8B8]/10">
                                {ord.status === 'delivered' ? 'مكتمل' : ord.status === 'preparing' ? 'تجهيز' : 'جديد'}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#D8C8B8] mt-0.5">
                              {(ord.items || []).map(i => `${i.arabicName || i.name} (${i.quantity})`).join(', ')}
                            </div>
                          </div>

                          <div className="font-mono font-bold text-[#FFF9F1]">
                            {ord.total} د.ت
                          </div>
                        </div>
                      ))}
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
