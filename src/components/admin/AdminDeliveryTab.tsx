import React, { useState } from 'react';
import {
  Truck,
  DollarSign,
  Clock,
  MapPin,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { DeliverySettings, GovernorateRate } from '../../types';

interface AdminDeliveryTabProps {
  deliverySettings: DeliverySettings;
  onSaveDelivery: (settings: DeliverySettings) => void;
}

export const AdminDeliveryTab: React.FC<AdminDeliveryTabProps> = ({
  deliverySettings,
  onSaveDelivery,
}) => {
  const [formData, setFormData] = useState<DeliverySettings>(deliverySettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveDelivery(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleUpdateGovRate = (govId: string, price: number) => {
    const updatedRates = (formData.governorates || []).map((g) =>
      g.id === govId ? { ...g, price } : g
    );
    setFormData({ ...formData, governorates: updatedRates });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#D6B56A]" />
            <span>إعدادات التوصيل والشحن (كامل ولايات تونس الـ 24)</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            تحديد تعريفة التوصيل الموحدة أو الخاصة بكل ولاية، وحد التوصيل المجاني، وفترة التسليم
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-colors shadow flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ إعدادات التوصيل</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold text-center animate-in fade-in">
          ✓ تم تحديث وحفظ أسعار وشروط الشحن التونسي بنجاح!
        </div>
      )}

      {/* Global Shipping Rules */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-6 shadow-sm">
        <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
          القواعد العامة للشحن
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              سعر التوصيل القياسي الموحد (د.ت) *
            </label>
            <input
              type="number"
              required
              value={formData.shippingPrice}
              onChange={(e) => setFormData({ ...formData, shippingPrice: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs font-mono font-bold text-[#D6B56A] focus:outline-none focus:border-[#D6B56A]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              الحد الأدنى للتوصيل المجاني (د.ت)
            </label>
            <input
              type="number"
              value={formData.freeShippingThreshold}
              onChange={(e) => setFormData({ ...formData, freeShippingThreshold: Number(e.target.value) })}
              placeholder="150"
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs font-mono font-bold text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
            />
            <span className="text-[10px] text-[#D8C8B8] mt-1 block">
              إذا وصل طلب العميل لهذا المبلغ يصبح التوصيل 0 د.ت مجاناً
            </span>
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              مدة التوصيل المتوقعة
            </label>
            <input
              type="text"
              value={formData.deliveryEstimate}
              onChange={(e) => setFormData({ ...formData, deliveryEstimate: e.target.value })}
              placeholder="خلال 24 إلى 48 ساعة عمل"
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
            تنبيه ومعلومات التوصيل المعروضة للزبون
          </label>
          <textarea
            rows={2}
            value={formData.deliveryNotice}
            onChange={(e) => setFormData({ ...formData, deliveryNotice: e.target.value })}
            placeholder="توصيل سريع ومضمون إلى باب منزلك مع إمكانية المعاينة قبل الدفع..."
            className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
          />
        </div>
      </div>

      {/* 24 Governorates Rates Grid */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D8C8B8]/15 pb-3">
          <span className="text-xs text-[#D8C8B8]">تخصيص التعريفة لولايات معينة</span>
          <h3 className="text-base font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D6B56A]" />
            <span>تعريفة الولايات التونسية الـ 24</span>
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-2">
          {(formData.governorates || []).map((gov) => (
            <div
              key={gov.id}
              className="p-3 bg-[#241B18] border border-[#D8C8B8]/15 rounded-xl flex items-center justify-between gap-2"
            >
              <div className="text-xs font-serif font-bold text-[#FFF9F1]">
                {gov.name}
              </div>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={gov.price}
                  onChange={(e) => handleUpdateGovRate(gov.id, Number(e.target.value))}
                  className="w-14 px-2 py-1 bg-[#332522] border border-[#D8C8B8]/20 rounded text-center text-xs font-mono font-bold text-[#D6B56A]"
                />
                <span className="text-[10px] text-[#D8C8B8]">د.ت</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-all shadow-lg cursor-pointer"
        >
          حفظ إعدادات التوصيل بالكامل
        </button>
      </div>

    </form>
  );
};
