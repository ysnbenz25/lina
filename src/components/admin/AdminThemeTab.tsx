import React, { useState } from 'react';
import {
  Palette,
  Sparkles,
  Save,
  CheckCircle2,
  RotateCcw,
  Type
} from 'lucide-react';
import { ThemeSettings } from '../../types';

interface AdminThemeTabProps {
  themeSettings: ThemeSettings;
  onSaveTheme: (settings: ThemeSettings) => void;
}

export const AdminThemeTab: React.FC<AdminThemeTabProps> = ({
  themeSettings,
  onSaveTheme,
}) => {
  const [formData, setFormData] = useState<ThemeSettings>(themeSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTheme(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const presetThemes = [
    {
      name: 'Lina Royal Burgundy (الملكي الأصلي)',
      primary: '#722F3F',
      accent: '#D6B56A',
      background: '#241B18',
      text: '#F7F1E8',
      cardBg: '#332522',
    },
    {
      name: 'Noir & Gold (الأسود والذهب)',
      primary: '#121212',
      accent: '#E5C07B',
      background: '#0D0D0D',
      text: '#EDEAE4',
      cardBg: '#1A1A1A',
    },
    {
      name: 'Emerald Luxury (الزمردي الفاخر)',
      primary: '#1A382B',
      accent: '#D4AF37',
      background: '#0F231A',
      text: '#E8F1EC',
      cardBg: '#162C22',
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-right animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#D6B56A]" />
            <span>تخصيص المظهر والألوان والهوية البصرية</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            التحكم في لوحة ألوان المتجر الفاخرة، درجات الذهبي والعنابي، نمط الأزرار، والخطوط
          </p>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-colors shadow flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ المظهر</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold text-center animate-in fade-in">
          ✓ تم تطبيق إعدادات المظهر بنجاح!
        </div>
      )}

      {/* Preset Palettes */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
          باليتات ألوان جاهزة بضغطة واحدة
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {presetThemes.map((p, idx) => (
            <div
              key={idx}
              onClick={() => {
                setFormData({
                  ...formData,
                  primaryColor: p.primary,
                  accentColor: p.accent,
                  backgroundColor: p.background,
                  textColor: p.text,
                });
              }}
              className="p-4 bg-[#241B18] border border-[#D8C8B8]/15 hover:border-[#D6B56A] rounded-xl cursor-pointer space-y-3 transition-all group"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: p.primary }} />
                <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: p.accent }} />
                <div className="w-6 h-6 rounded-full border border-white/20" style={{ backgroundColor: p.background }} />
              </div>
              <div className="text-xs font-serif font-bold text-[#FFF9F1] group-hover:text-[#D6B56A] transition-colors">
                {p.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Inputs */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-6 shadow-sm">
        <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
          تخصيص الألوان يدوياً
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">اللون الأساسي (Primary)</label>
            <div className="flex items-center gap-2 bg-[#241B18] p-2 rounded-xl border border-[#D8C8B8]/20">
              <input
                type="color"
                value={formData.primaryColor || '#722F3F'}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={formData.primaryColor || '#722F3F'}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="flex-1 bg-transparent text-xs font-mono text-[#FFF9F1] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">لون التمييز (Accent Gold)</label>
            <div className="flex items-center gap-2 bg-[#241B18] p-2 rounded-xl border border-[#D8C8B8]/20">
              <input
                type="color"
                value={formData.accentColor || '#D6B56A'}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={formData.accentColor || '#D6B56A'}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="flex-1 bg-transparent text-xs font-mono text-[#FFF9F1] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">لون الخلفية (Background)</label>
            <div className="flex items-center gap-2 bg-[#241B18] p-2 rounded-xl border border-[#D8C8B8]/20">
              <input
                type="color"
                value={formData.backgroundColor || '#241B18'}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={formData.backgroundColor || '#241B18'}
                onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                className="flex-1 bg-transparent text-xs font-mono text-[#FFF9F1] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">لون النصوص (Text)</label>
            <div className="flex items-center gap-2 bg-[#241B18] p-2 rounded-xl border border-[#D8C8B8]/20">
              <input
                type="color"
                value={formData.textColor || '#F7F1E8'}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <input
                type="text"
                value={formData.textColor || '#F7F1E8'}
                onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                className="flex-1 bg-transparent text-xs font-mono text-[#FFF9F1] focus:outline-none"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Button & Corner Radius */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-4 shadow-sm">
        <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
          نمط الأزرار واستدارة الحواف
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'none', label: 'حادة (مستطيلة)' },
            { id: 'sm', label: 'انحناء بسيط (6px)' },
            { id: 'md', label: 'انحناء متناسق (12px)' },
            { id: 'full', label: 'دائرية كاملة (Pill)' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setFormData({ ...formData, buttonRadius: r.id })}
              className={`p-3 border rounded-xl text-xs font-bold transition-all cursor-pointer ${
                formData.buttonRadius === r.id
                  ? 'bg-[#D6B56A] text-[#241B18] border-[#D6B56A]'
                  : 'bg-[#241B18] border-[#D8C8B8]/20 text-[#D8C8B8]'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-8 py-3 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-all shadow-lg cursor-pointer"
        >
          تطبيق المظهر على كامل المتجر
        </button>
      </div>

    </form>
  );
};
