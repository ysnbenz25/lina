import React from 'react';
import { ShieldCheck, Clock, Truck, Banknote } from 'lucide-react';

export const WhyLinaShop: React.FC = () => {
  const pillars = [
    {
      stat: '100%',
      title: 'عطور أصلية',
      french: 'AUTHENTICITÉ GARANTIE',
      description: 'زيوت عطرية نقية ومكونات عالمية فاخرة دون أي مساومة على الجودة.',
      icon: ShieldCheck,
    },
    {
      stat: '24/7',
      title: 'دعم سريع وخبير',
      french: 'SERVICE CLIENT VIP',
      description: 'فريق متخصص لمساعدتك في اختيار العطر المناسب ومتابعة طلبك خطوة بخطوة.',
      icon: Clock,
    },
    {
      stat: '24 ولاية',
      title: 'توصيل لكامل تونس',
      french: 'LIVRAISON NATIONALE',
      description: 'شحن سريع ومحمي إلى باب منزلك في كافة ولايات الجمهورية التونسية.',
      icon: Truck,
    },
    {
      stat: 'COD',
      title: 'الدفع عند الاستلام',
      french: 'PAIEMENT À LA LIVRAISON',
      description: 'راحة وأمان تام: عاين طردك وادفع نقداً لعون التوصيل بكل ثقة.',
      icon: Banknote,
    },
  ];

  return (
    <section id="why-lina" className="py-24 sm:py-32 bg-[#0A0A0A] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Moniker */}
        <div className="text-center mb-16 space-y-3">
          <span className="font-serif text-[11px] tracking-[0.35em] text-[#C9A227] uppercase block">
            LES ENGAGEMENTS LINA
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#E8E1D5] font-bold tracking-tight">
            لماذا يختار عملاؤنا لينا شوب؟
          </h2>
        </div>

        {/* 4 Pillars Grid with Generous Spacing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {pillars.map((pillar, idx) => {
            const IconComponent = pillar.icon;
            return (
              <div
                key={idx}
                className="p-8 bg-[#111111] border border-white/5 hover:border-[#C9A227]/40 transition-all duration-300 text-right flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Bar with Big Stat & Minimal Icon */}
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-2xl sm:text-3xl font-bold text-[#C9A227]">
                      {pillar.stat}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-[#161616] border border-white/10 flex items-center justify-center text-[#E8E1D5] group-hover:text-[#C9A227] group-hover:border-[#C9A227]/40 transition-colors">
                      <IconComponent className="w-4 h-4" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[9px] font-cinzel tracking-[0.25em] text-[#ACA394] uppercase block">
                      {pillar.french}
                    </span>
                    <h3 className="text-lg font-serif font-bold text-[#E8E1D5]">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#ACA394] leading-relaxed font-sans font-light">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] text-[#C9A227] font-serif uppercase">
                  <span>معتمد ومضمون</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
