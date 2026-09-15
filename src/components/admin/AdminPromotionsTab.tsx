import React, { useState } from 'react';
import {
  Gift,
  Plus,
  Trash2,
  Check,
  Calendar,
  Percent,
  DollarSign,
  Copy,
  CheckCircle2,
  Tag,
  AlertCircle,
  X
} from 'lucide-react';
import { Promotion } from '../../types';

interface AdminPromotionsTabProps {
  promotions: Promotion[];
  onAddPromotion: (promo: Promotion) => void;
  onDeletePromotion: (id: string) => void;
}

export const AdminPromotionsTab: React.FC<AdminPromotionsTabProps> = ({
  promotions,
  onAddPromotion,
  onDeletePromotion,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [type, setType] = useState<'percentage' | 'fixed'>('percentage');
  const [value, setValue] = useState('10');
  const [minOrder, setMinOrder] = useState('100');
  const [expiresAt, setExpiresAt] = useState('2026-12-31');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (c: string) => {
    navigator.clipboard.writeText(c);
    setCopiedCode(c);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert('يرجى كتابة رمز الكوبون');
      return;
    }

    const newPromo: Promotion = {
      id: `promo-${Date.now()}`,
      code: code.trim().toUpperCase(),
      type,
      value: Number(value) || 10,
      minOrder: Number(minOrder) || 0,
      expiresAt,
      active: true,
      usageCount: 0,
    };

    onAddPromotion(newPromo);
    setIsModalOpen(false);
    setCode('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div className="text-right">
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <Gift className="w-5 h-5 text-[#D6B56A]" />
            <span>كوبونات الخصم والعروض الترويجية</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            إنشاء أكواد تخفيض مئوية أو ثابتة بالدينار التونسي، وتحديد الحد الأدنى للطلب وتواريخ الصلاحية
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-colors shadow flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إنشاء كود خصم جديد</span>
        </button>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promo) => (
          <div
            key={promo.id}
            className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-5 space-y-4 shadow-sm relative overflow-hidden"
          >
            {/* Top row */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#722F3F] text-[#D6B56A] border border-[#D6B56A]/30">
                {promo.type === 'percentage' ? `خصم ${promo.value}%` : `خصم ${promo.value} د.ت`}
              </span>

              <button
                onClick={() => onDeletePromotion(promo.id)}
                className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer"
                title="حذف الكود"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Code Box */}
            <div className="p-3 bg-[#241B18] border border-dashed border-[#D6B56A]/40 rounded-xl flex items-center justify-between">
              <div className="font-mono text-base font-bold text-[#D6B56A] tracking-wider">
                {promo.code}
              </div>

              <button
                onClick={() => handleCopy(promo.code)}
                className="p-1.5 bg-[#332522] hover:bg-[#D6B56A] hover:text-[#241B18] text-[#D8C8B8] rounded-lg transition-colors cursor-pointer"
                title="نسخ الكود"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Info */}
            <div className="space-y-1.5 text-xs text-[#D8C8B8] text-right">
              <div className="flex justify-between">
                <span>الحد الأدنى للطلب:</span>
                <strong className="text-[#FFF9F1] font-mono">{promo.minOrder} د.ت</strong>
              </div>
              <div className="flex justify-between">
                <span>تاريخ الانتهاء:</span>
                <span className="font-mono">{promo.expiresAt}</span>
              </div>
              <div className="flex justify-between border-t border-[#D8C8B8]/10 pt-1.5">
                <span>مرات الاستخدام:</span>
                <strong className="text-[#D6B56A] font-mono">{promo.usageCount || 0} مرة</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#241B18] border border-[#D6B56A]/40 rounded-2xl max-w-md w-full p-6 sm:p-8 space-y-5 text-right shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-[#D8C8B8]/15 pb-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#D8C8B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-serif font-bold text-[#FFF9F1]">
                إنشاء كود خصم ترويجي جديد
              </h3>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs text-[#D8C8B8] mb-1.5">
                  رمز الكود (بالأحرف اللاتينية الكبيرة) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="مثال: LINA20 أو RAMADAN"
                  className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs font-mono font-bold text-[#D6B56A] focus:outline-none focus:border-[#D6B56A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#D8C8B8] mb-1.5">نوع الخصم</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
                  >
                    <option value="percentage">نسبة مئوية (%)</option>
                    <option value="fixed">مبلغ ثابت (د.ت)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-[#D8C8B8] mb-1.5">قيمة الخصم</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="10"
                    className="w-full px-3 py-2 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#D8C8B8] mb-1.5">الحد الأدنى للطلب (د.ت)</label>
                  <input
                    type="number"
                    value={minOrder}
                    onChange={(e) => setMinOrder(e.target.value)}
                    placeholder="100"
                    className="w-full px-3 py-2 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D8C8B8] mb-1.5">تاريخ الانتهاء</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#D8C8B8]/15">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] font-bold text-xs rounded-xl transition-all shadow cursor-pointer"
                >
                  حفظ وتفعيل الكود
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-[#332522] text-[#D8C8B8] text-xs font-bold rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
