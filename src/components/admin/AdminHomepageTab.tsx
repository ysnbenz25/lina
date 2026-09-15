import React, { useState } from 'react';
import {
  LayoutTemplate,
  Sliders,
  Image as ImageIcon,
  Check,
  Eye,
  EyeOff,
  Sparkles,
  Save,
  ArrowUpDown,
  RotateCcw,
  Type
} from 'lucide-react';
import { HomepageSettings } from '../../types';

interface AdminHomepageTabProps {
  settings: HomepageSettings;
  onSaveSettings: (settings: HomepageSettings) => void;
}

export const AdminHomepageTab: React.FC<AdminHomepageTabProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [formData, setFormData] = useState<HomepageSettings>(settings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof HomepageSettings, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSectionToggle = (sectionKey: string, value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-300">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div className="text-right">
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-[#D6B56A]" />
            <span>التحكم في محتوى الصفحة الرئيسية (Homepage CMS)</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            تخصيص البانر الرئيسي (Hero)، العناوين، صور الخلفية، وإظهار أو إخفاء أي قسم بضغطة واحدة
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-colors shadow flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التعديلات فورياً</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold text-center animate-in fade-in">
          ✓ تم حفظ ونشر إعدادات الصفحة الرئيسية بنجاح في كامل المتجر!
        </div>
      )}

      {/* 1. Hero Section Settings */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-6 text-right shadow-sm">
        <div className="flex items-center justify-between border-b border-[#D8C8B8]/15 pb-4">
          <span className="text-xs text-[#D8C8B8]">الواجهة الأولى التي يراها الزائر عند فتح الموقع</span>
          <h3 className="text-base font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D6B56A]" />
            <span>1. قسم البانر الرئيسي (Hero Section)</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                العنوان الرئيسي (Hero Title)
              </label>
              <input
                type="text"
                value={formData.heroTitle || ''}
                onChange={(e) => handleChange('heroTitle', e.target.value)}
                placeholder="عطرك... بصمتك"
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                العنوان الفرعي (Hero Subtitle)
              </label>
              <input
                type="text"
                value={formData.heroSubtitle || ''}
                onChange={(e) => handleChange('heroSubtitle', e.target.value)}
                placeholder="فخامة تُرى قبل أن تُشم"
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                شارة الهيرو العلوية (Hero Badge)
              </label>
              <input
                type="text"
                value={formData.heroBadge || ''}
                onChange={(e) => handleChange('heroBadge', e.target.value)}
                placeholder="LINA SIGNATURE • EAU DE PARFUM"
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                نص الوصف الترويجي (Hero Description)
              </label>
              <textarea
                rows={3}
                value={formData.heroDescription || ''}
                onChange={(e) => handleChange('heroDescription', e.target.value)}
                placeholder="إبداعات عطرية تونسية بمستخلصات نيش فاخرة..."
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                رابط صورة البانر الرئيسي (Hero Image URL)
              </label>
              <input
                type="text"
                value={formData.heroImage || ''}
                onChange={(e) => handleChange('heroImage', e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
              />
            </div>

            {formData.heroImage && (
              <div className="relative h-40 rounded-xl overflow-hidden border border-[#D8C8B8]/20 bg-[#241B18]">
                <img
                  src={formData.heroImage}
                  alt="معاينة الهيرو"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-xs text-[#FFF9F1] font-bold bg-[#241B18]/80 px-3 py-1.5 rounded-lg border border-[#D6B56A]/40">
                    معاينة حية لصورة الغلاف
                  </span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                  نص الزر الأساسي (Primary CTA)
                </label>
                <input
                  type="text"
                  value={formData.heroPrimaryBtnText || 'اكتشف العطور'}
                  onChange={(e) => handleChange('heroPrimaryBtnText', e.target.value)}
                  className="w-full px-3 py-2 bg-[#241B18] border border-[#D8C8B8]/20 rounded-lg text-xs text-[#FFF9F1]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                  نص الزر الثانوي (Secondary CTA)
                </label>
                <input
                  type="text"
                  value={formData.heroSecondaryBtnText || 'تسوق الآن'}
                  onChange={(e) => handleChange('heroSecondaryBtnText', e.target.value)}
                  className="w-full px-3 py-2 bg-[#241B18] border border-[#D8C8B8]/20 rounded-lg text-xs text-[#FFF9F1]"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Brand Quote & Statement */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-4 text-right shadow-sm">
        <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
          2. العبارة الافتتاحية للماركة (Brand Statement)
        </h3>
        <div>
          <label className="block text-xs text-[#D8C8B8] mb-1.5">
            العبارة الفلسفية المعروضة تحت الهيرو
          </label>
          <input
            type="text"
            value={formData.brandStatement || ''}
            onChange={(e) => handleChange('brandStatement', e.target.value)}
            placeholder="العطر ليس مجرد رائحة. إنه حضور."
            className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
          />
        </div>
      </div>

      {/* 3. Sections Visibility Matrix */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-6 text-right shadow-sm">
        <div className="border-b border-[#D8C8B8]/15 pb-4">
          <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
            3. تفعيل وإخفاء أقسام المتجر (Sections Visibility)
          </h3>
          <p className="text-xs text-[#D8C8B8] mt-1">
            يمكنك تعطيل أو تشغيل أي قسم من أقسام الصفحة الرئيسية بحسب العروض الموسمية والحملات الإعلانية
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {[
            { id: 'hero', name: 'البانر الترحيبي الرئيسي (Hero)', desc: 'الغلاف والعناوين وزر التسوق' },
            { id: 'brandStatement', name: 'اقتباس وهوية الماركة', desc: 'عبارة الحضور والفخامة' },
            { id: 'specialOffers', name: 'قسم العروض الخاصة (أسعار رمزية)', desc: 'البطاقات الذهبية السريعة' },
            { id: 'whyLina', name: 'لماذا لينا شوب؟ (المميزات الـ 5)', desc: 'الثبات، التوصيل، الدفع عند الاستلام' },
            { id: 'sizesGuide', name: 'دليل الأحجام والاستخدامات', desc: 'الأحجام من 5ml إلى 100ml' },
            { id: 'categories', name: 'مجموعات العطور (Categories)', desc: 'رجالي، نسائي، للجنسين، فاخرة' },
            { id: 'featuredCollection', name: 'عطور مميزة والأكثر طلباً', desc: 'شبكة المنتجات مع الأحجام' },
            { id: 'bestSellers', name: 'شريط الأكثر مبيعاً', desc: 'تسليط الضوء على الأكثر إقبالاً' },
            { id: 'featuredProduct', name: 'بانر العطر المميز التحريري', desc: 'مجموعة النخبة الخاصة' },
            { id: 'testimonials', name: 'آراء وتقييمات الحرفاء (Testimonials)', desc: 'تجارب حقيقية من تونس' },
            { id: 'about', name: 'قصة لينا شوب التونسية', desc: 'تاريخ وعراقة البراند' },
            { id: 'faq', name: 'الأسئلة الشائعة (FAQ)', desc: 'إجابات الدفع والشحن والاستبدال' },
          ].map((sec) => {
            const isEnabled = formData.sections?.[sec.id] !== false;
            return (
              <div
                key={sec.id}
                onClick={() => handleSectionToggle(sec.id, !isEnabled)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isEnabled
                    ? 'bg-[#241B18] border-[#D6B56A]/40'
                    : 'bg-[#241B18]/40 border-[#D8C8B8]/10 opacity-60'
                }`}
              >
                <div>
                  <div className="text-xs font-serif font-bold text-[#FFF9F1]">
                    {sec.name}
                  </div>
                  <div className="text-[10px] text-[#D8C8B8] mt-0.5">
                    {sec.desc}
                  </div>
                </div>

                <div
                  className={`w-10 h-6 rounded-full p-0.5 transition-colors ${
                    isEnabled ? 'bg-[#D6B56A]' : 'bg-[#332522]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-[#241B18] transition-transform ${
                      isEnabled ? 'translate-x-0' : '-translate-x-4'
                    }`}
                  />
                </div>
              </div>
            );
          })}

        </div>
      </div>

      {/* Save bar */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ جميع تغييرات الصفحة الرئيسية</span>
        </button>
      </div>

    </form>
  );
};
