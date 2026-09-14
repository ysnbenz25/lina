import React from 'react';
import { Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-[#241B18] border-t border-[#D8C8B8]/15 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image with Story Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-[#D8C8B8]/20 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80"
                alt="عن متجر لينا للعطور والزيوت"
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#241B18] via-transparent to-transparent" />
              <div className="absolute bottom-6 right-6 left-6 p-4 rounded-xl bg-[#332522]/90 backdrop-blur-md border border-[#D6B56A]/30 text-right shadow-lg">
                <span className="text-[#D6B56A] text-xs font-semibold">زيوت عطرية نقية وتركيبات مركزة</span>
                <p className="text-sm text-[#F7F1E8] mt-1">
                  ننتقي خلاصات الزيوت العطرية بعناية فائقة لنقدم لكم عطوراً تدوم طويلاً بأسعار رمزية ومناسبة للجميع في تونس.
                </p>
              </div>
            </div>
          </div>

          {/* Story Text */}
          <div className="lg:col-span-7 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#722F3F]/30 border border-[#D6B56A]/30 text-[#D6B56A] text-xs font-serif tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D6B56A]" />
              <span>قصة LINA SHOP تونس</span>
            </div>

            <h3 id="about-heading" className="text-3xl sm:text-4xl font-bold font-serif text-[#FFF9F1] leading-tight">
              العطر الفاخر أصبح في متناول الجميع
            </h3>

            <p className="text-[#F7F1E8] text-sm sm:text-base leading-relaxed">
              انطلقت رحلة <strong className="text-[#D6B56A]">LINA SHOP</strong> من رؤية واضحة وشفافة: أن يستمتع كل شخص في تونس بأروع الروائح العالمية دون الحاجة لدفع مبالغ باهظة.
            </p>

            <p className="text-[#D8C8B8] text-sm leading-relaxed">
              نحن متخصصون في الزيوت العطرية المركزة والتركيبات المستوحاة بدقة من روائح أشهر الماركات العالمية، مع ثبات يدوم طويلاً وجودة ممتازة، وتوصيل سريع لباب منزلك في كافة ولايات تونس الـ 24.
            </p>

            {/* Factual Value Indicators */}
            <div id="about-stats" className="grid grid-cols-3 gap-6 pt-6 border-t border-[#D8C8B8]/20">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#D6B56A] font-sans">24 ولاية</p>
                <p className="text-xs text-[#D8C8B8] mt-1">توصيل سريع لباب دارك والدفع عند الاستلام</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#D6B56A] font-sans">100%</p>
                <p className="text-xs text-[#D8C8B8] mt-1">زيوت مركزة وتركيبات فائقة الثبات</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-[#D6B56A] font-sans">24 - 48h</p>
                <p className="text-xs text-[#D8C8B8] mt-1">متوسط زمن الشحن لجميع الولايات</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
