import React from 'react';
import { Sparkles, Truck, ShieldCheck, CreditCard } from 'lucide-react';

export const FeaturesStrip: React.FC = () => {
  return (
    <section id="features" className="border-y border-white/5 bg-[#101014]/60 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div id="feature-1" className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">عطور نيش نقية 100%</h4>
              <p className="text-xs text-neutral-400 mt-0.5">زيوت فرنسية وشرقية نادرة ومستدامة</p>
            </div>
          </div>

          <div id="feature-2" className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">توصيل لكافة ولايات تونس الـ 24</h4>
              <p className="text-xs text-neutral-400 mt-0.5">شحن سريع وآمن إلى باب منزلك خلال 24 - 48 ساعة</p>
            </div>
          </div>

          <div id="feature-3" className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">ضمان ذهبي وأصالة 100%</h4>
              <p className="text-xs text-neutral-400 mt-0.5">جرّب العينة المرفقة أولاً واطمئن لجودة وفوحان العطر</p>
            </div>
          </div>

          <div id="feature-4" className="flex items-center gap-4 text-right">
            <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">الدفع عند الاستلام بتونس</h4>
              <p className="text-xs text-neutral-400 mt-0.5">خلاص عند التسليم بالدينار التونسي (د.ت) أو بالبطاقة البنكية</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
