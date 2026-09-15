import React, { useState } from 'react';
import {
  Globe,
  Search,
  Share2,
  Save,
  CheckCircle2,
  ExternalLink,
  Code
} from 'lucide-react';
import { SEOSettings } from '../../types';

interface AdminSEOTabProps {
  seoSettings: SEOSettings;
  onSaveSEO: (settings: SEOSettings) => void;
}

export const AdminSEOTab: React.FC<AdminSEOTabProps> = ({
  seoSettings,
  onSaveSEO,
}) => {
  const [formData, setFormData] = useState<SEOSettings>(seoSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSEO(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <Search className="w-5 h-5 text-[#D6B56A]" />
            <span>تهيئة محركات البحث والتواصل (SEO & Meta Tags)</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            التحكم في ظهور المتجر على Google وبطاقات المشاركة في Facebook وWhatsApp وصورة المعاينة
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-colors shadow flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ إعدادات SEO</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold text-center animate-in fade-in">
          ✓ تم حفظ ونشر إعدادات محركات البحث بنجاح!
        </div>
      )}

      {/* Google Search Preview */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-3 shadow-sm">
        <span className="text-xs font-bold text-[#D6B56A] block">
          معاينة حية: كيف يظهر متجرك في نتائج بحث Google
        </span>

        <div className="p-4 bg-[#1f1f23] rounded-xl border border-white/10 space-y-1.5 text-left font-sans" dir="ltr">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="w-4 h-4 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">G</span>
            <span>https://linashop.tn</span>
          </div>
          <div className="text-sm font-semibold text-blue-400 hover:underline cursor-pointer">
            {formData.title || 'Lina Shop - متجر العطور الفاخرة في تونس'}
          </div>
          <div className="text-xs text-neutral-300 line-clamp-2">
            {formData.description || 'أفضل العطور والزيوت المركزة في تونس بتوصيل سريع إلى كامل الولايات الـ 24 مع الدفع عند الاستلام وبطاقة D17.'}
          </div>
        </div>
      </div>

      {/* Main Meta Fields */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
          العناوين والأوصاف الأساسية
        </h3>

        <div>
          <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
            عنوان الصفحة الرئيسي (Page Title) *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Lina Shop | Haute Parfumerie Tunisie"
            className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
            وصف المتجر (Meta Description) *
          </label>
          <textarea
            rows={3}
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="اكتب وصفاً جذاباً يجلب الزوار من Google..."
            className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
          />
        </div>

        <div>
          <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
            الكلمات الدلالية والمفتاحية (Keywords)
          </label>
          <input
            type="text"
            value={formData.keywords}
            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
            placeholder="عطور تونس, بارفان تونس, D17, زيوت عطرية, عطور نيش..."
            className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
          />
        </div>
      </div>

      {/* Social Media Sharing Card (OG) */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#D6B56A]" />
          <span>بطاقة المشاركة على شبكات التواصل (Open Graph)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              عنوان المشاركة (OG Title)
            </label>
            <input
              type="text"
              value={formData.ogTitle}
              onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
            />
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
              رابط صورة المشاركة (OG Image URL)
            </label>
            <input
              type="text"
              value={formData.ogImage}
              onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
            نص وصف المشاركة (OG Description)
          </label>
          <textarea
            rows={2}
            value={formData.ogDescription}
            onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
            className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-all shadow-lg cursor-pointer"
        >
          حفظ إعدادات SEO ومحركات البحث
        </button>
      </div>

    </form>
  );
};
