import React from 'react';
import { Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#101014]/40 border-t border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image with Story Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80"
                alt="عن متجر لينا للعطور الفاخرة"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent" />
              <div className="absolute bottom-6 right-6 left-6 p-4 rounded-xl bg-[#08080a]/85 backdrop-blur-md border border-white/10 text-right">
                <span className="text-[#d4af37] text-xs font-semibold">حرفة وصنعة عطرية دقيقة</span>
                <p className="text-sm text-neutral-200 mt-1">
                  ننتقي مكوناتنا من مزارع غراس بفرنسا وغابات العود الكمبودي المعتق بأعلى درجات النقاء.
                </p>
              </div>
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 text-[#d4af37] text-xs tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>قصة دار لينا شوب</span>
            </div>

            <h3 id="about-heading" className="text-3xl sm:text-4xl font-bold font-serif text-white leading-tight">
              شغفٌ يتحوّل إلى توقيعٍ عطريّ يعبّر عن هيبتك وأناقتك
            </h3>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              انطلقت رحلة <strong className="text-[#d4af37]">Lina Shop</strong> من فكرة جوهرية: أن العطر ليس مجرد لمسة تكميلية، بل هو هوية وأصالة تعكس أناقة المرأة والرجل في تونس.
            </p>

            <p className="text-neutral-400 text-sm leading-relaxed">
              نبتكر تشكيلاتنا العطرية الفاخرة وعطور النيش بالتعاون مع أرقى دور العطور العالمية، مع استخدام نوتات أصيلة مثل زهر البرتقال التونسي النقي وأخشاب العود والعنبر الفاخر، مع توفير خدمة التوصيل الاحترافية لكافة الـ 24 ولاية تونسية.
            </p>

            {/* Numerical Stats */}
            <div id="about-stats" className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#d4af37] font-sans">+12,500</p>
                <p className="text-xs text-neutral-400 mt-1">حريف يثق بنا في تونس</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#d4af37] font-sans">24 ولاية</p>
                <p className="text-xs text-neutral-400 mt-1">تغطية شاملة وتوصيل سريع</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#d4af37] font-sans">4.9 / 5</p>
                <p className="text-xs text-neutral-400 mt-1">نسبة رضا الحرفاء</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
