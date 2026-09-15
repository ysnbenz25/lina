import React, { useState } from 'react';
import {
  Settings,
  Store,
  Phone,
  Mail,
  MapPin,
  Globe,
  Share2,
  Save,
  CreditCard,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WebsiteSettings } from '../../types';

interface AdminSettingsTabProps {
  websiteSettings: WebsiteSettings;
  onSaveSettings: (settings: WebsiteSettings) => void;
  d17Phone: string;
  onSaveD17Phone: (phone: string) => void;
}

export const AdminSettingsTab: React.FC<AdminSettingsTabProps> = ({
  websiteSettings,
  onSaveSettings,
  d17Phone,
  onSaveD17Phone,
}) => {
  const [formData, setFormData] = useState<WebsiteSettings>(websiteSettings);
  const [d17Input, setD17Input] = useState(d17Phone);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    onSaveD17Phone(d17Input);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#D6B56A]" />
            <span>إعدادات المتجر وبيانات التواصل التونسية</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            التحكم في اسم المتجر، الشعار، أرقام الهاتف والواتساب، روابط السوشيال ميديا، ورقم تحويل D17
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-colors shadow flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ الإعدادات</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold text-center animate-in fade-in">
          ✓ تم حفظ إعدادات المتجر والتواصل بنجاح!
        </div>
      )}

      {/* D17 Card Priority */}
      <div className="bg-[#241B18] border-2 border-[#D6B56A]/50 rounded-2xl p-6 space-y-4 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#722F3F] text-[#D6B56A] flex items-center justify-center border border-[#D6B56A]/40">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
              رقم هاتف استلام تحويلات D17 (البريد التونسي)
            </h3>
            <p className="text-xs text-[#D8C8B8]">
              هذا الرقم هو الذي سيظهر للعميل في نافذة إتمام الطلب ليقوم بتحويل المبلغ عليه عبر تطبيق D17
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              رقم هاتف D17 التونسي الرسمي *
            </label>
            <input
              type="text"
              required
              value={d17Input}
              onChange={(e) => setD17Input(e.target.value)}
              placeholder="+216 55 889 900"
              className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D6B56A]/40 rounded-xl text-sm font-mono font-bold text-[#D6B56A] focus:outline-none focus:border-[#D6B56A]"
            />
          </div>

          <div className="flex items-end">
            <div className="p-3 bg-[#332522] rounded-xl border border-[#D8C8B8]/15 text-xs text-[#D8C8B8] w-full">
              ✓ مرتبط مباشرة بقاعدة بيانات الخادم والموقع لضمان استلام المبالغ فورياً
            </div>
          </div>
        </div>
      </div>

      {/* Brand Identity */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
          <Store className="w-4 h-4 text-[#D6B56A]" />
          <span>هوية المتجر والشعار</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              اسم المتجر *
            </label>
            <input
              type="text"
              required
              value={formData.storeName || 'LINA SHOP'}
              onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              الشعار اللفظي الفرعي
            </label>
            <input
              type="text"
              value={formData.subtitle || 'HAUTE PARFUMERIE'}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
            />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
          <Phone className="w-4 h-4 text-[#D6B56A]" />
          <span>بيانات التواصل وخدمة العملاء</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              رقم الهاتف للاتصال المباشر
            </label>
            <input
              type="text"
              value={formData.phone || '+216 55 889 900'}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              رقم الواتساب (WhatsApp)
            </label>
            <input
              type="text"
              value={formData.whatsapp || '+216 55 889 900'}
              onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              البريد الإلكتروني الرسمي
            </label>
            <input
              type="email"
              value={formData.email || 'contact@linashop.tn'}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
            عنوان المقر في تونس
          </label>
          <input
            type="text"
            value={formData.address || 'شارع الحبيب بورقيبة، تونس العاصمة'}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
          />
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#D6B56A]" />
          <span>روابط صفحات التواصل الاجتماعي</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">Instagram</label>
            <input
              type="text"
              value={formData.instagram || ''}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              placeholder="https://instagram.com/..."
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">Facebook</label>
            <input
              type="text"
              value={formData.facebook || ''}
              onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
              placeholder="https://facebook.com/..."
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">TikTok</label>
            <input
              type="text"
              value={formData.tiktok || ''}
              onChange={(e) => setFormData({ ...formData, tiktok: e.target.value })}
              placeholder="https://tiktok.com/@..."
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-all shadow-lg cursor-pointer"
        >
          حفظ جميع إعدادات المتجر
        </button>
      </div>

    </form>
  );
};
