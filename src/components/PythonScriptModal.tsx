import React, { useState } from 'react';
import { X, Copy, Check, Download, Terminal, FolderCheck, Sparkles } from 'lucide-react';

interface PythonScriptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (title: string, message: string) => void;
}

export const PythonScriptModal: React.FC<PythonScriptModalProps> = ({
  isOpen,
  onClose,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const terminalCommand = `python3 generate_lina_shop.py`;

  const handleCopyCode = async () => {
    try {
      const res = await fetch('/generate_lina_shop.py');
      let scriptCode = '';
      if (res.ok) {
        scriptCode = await res.text();
      }
      if (!scriptCode) {
        scriptCode = `# يرجى مراجعة ملف generate_lina_shop.py المنشأ في الخادم`;
      }
      await navigator.clipboard.writeText(scriptCode);
      setCopied(true);
      onShowToast('تم نسخ الكود!', 'تم نسخ كود بايثون بالكامل إلى الحافظة بنجاح.');
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      onShowToast('تنبيه', 'يمكنك نسخ الكود مباشرة من النافذة أو استخدام أمر التشغيل.');
    }
  };

  return (
    <div
      id="python-script-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <div
        id="python-script-modal"
        className="bg-[#08080a] border border-[#d4af37]/40 rounded-2xl max-w-3xl w-full p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col text-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37]">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-serif">
                مشروع Lina Shop لنظام Linux (كود بايثون والملف المضغوط)
              </h3>
              <p className="text-xs text-neutral-400">
                سكربت بايثون مستقل ينشئ المجلد، ملف HTML الكامل، vercel.json، والملف المضغوط lina-shop.zip
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-5 space-y-6">
          
          {/* Quick Actions Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Download Generated Zip */}
            <a
              href="/lina-shop.zip"
              download="lina-shop.zip"
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#17171d] to-[#101014] border border-[#d4af37]/40 hover:border-[#d4af37] transition-all group shadow-md"
            >
              <div className="text-right">
                <span className="text-xs text-[#d4af37] font-semibold block">تم التوليد بنجاح جاهز للتحميل</span>
                <span className="text-sm font-bold text-white">تحميل ملف lina-shop.zip مباشرة</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#d4af37] text-[#08080a] flex items-center justify-center group-hover:scale-105 transition-transform">
                <Download className="w-5 h-5" />
              </div>
            </a>

            {/* Copy Python script */}
            <button
              onClick={handleCopyCode}
              className="flex items-center justify-between p-4 rounded-xl bg-[#101014] border border-white/10 hover:border-[#d4af37]/60 transition-all text-right group"
            >
              <div>
                <span className="text-xs text-neutral-400 block">ملف Python مستقل 100%</span>
                <span className="text-sm font-bold text-white">نسخ كود البايثون بالكامل</span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-[#17171d] text-[#d4af37] flex items-center justify-center group-hover:bg-[#d4af37] group-hover:text-[#08080a] transition-all">
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </div>
            </button>

          </div>

          {/* Terminal Execution Steps */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>خطوات التشغيل السريع في تيرمينال Linux:</span>
            </h4>
            
            <div className="p-4 rounded-xl bg-[#0d0d12] border border-white/10 font-mono text-xs text-neutral-300 space-y-2 text-left" dir="ltr">
              <p className="text-neutral-500"># 1. احفظ الكود في ملف باسم generate_lina_shop.py ثم نفّذ:</p>
              <div className="p-2.5 rounded-lg bg-[#17171d] text-[#d4af37] flex items-center justify-between font-bold">
                <span>python3 generate_lina_shop.py</span>
              </div>
              <p className="text-neutral-500"># 2. السكربت سينتج فورياً:</p>
              <div className="text-emerald-400 pl-2">
                ✓ مجلد lina-shop/<br />
                ✓ ملف lina-shop/index.html (HTML5 + Tailwind CSS + Interactive JS)<br />
                ✓ ملف lina-shop/vercel.json (إعدادات التوجيه والنشر)<br />
                ✓ ملف lina-shop.zip (جاهز للنشر المباشر عبر Vercel CLI أو السحب والإفلات)
              </div>
            </div>
          </div>

          {/* Project Details Checklist */}
          <div className="p-4 rounded-xl bg-[#101014] border border-white/5 space-y-2 text-xs text-neutral-300">
            <p className="font-bold text-white mb-2">مواصفات الملف المضمن داخل السكربت:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-neutral-400">
              <div className="flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-[#d4af37]" />
                <span>شريط تنقل مع سلة تفاعلية وعداد ديناميكي</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-[#d4af37]" />
                <span>قسم رئيسي (Hero) بعبارات تسويقية ملكية</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-[#d4af37]" />
                <span>شبكة 4 عطور ببطاقات تفاعلية وأسعار وهرم عطري</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-[#d4af37]" />
                <span>قسم عن المتجر (About Us) بقصة وتفاصيل نيش</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-[#d4af37]" />
                <span>تذييل مع نشرة بريدية وروابط تواصل ووسائل دفع</span>
              </div>
              <div className="flex items-center gap-2">
                <FolderCheck className="w-4 h-4 text-[#d4af37]" />
                <span>متجاوب 100% مع كافة شاشات الهواتف والكمبيوتر</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-xs text-neutral-400 font-sans">
            الملف: <code className="text-[#d4af37]">generate_lina_shop.py</code>
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-[#17171d] hover:bg-[#23232b] text-neutral-200 text-xs font-semibold transition-colors"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
