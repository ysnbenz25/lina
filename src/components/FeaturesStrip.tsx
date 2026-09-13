import React from 'react';
import { ShieldCheck, Truck, Banknote, Award, Headphones } from 'lucide-react';

export const FeaturesStrip: React.FC = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: "عطور أصلية 100%",
      french: "Authenticité Garantie",
      desc: "تركيزات نيش نقية وزيوت عطرية مستوردة من غراس بفرنسا والشرق"
    },
    {
      icon: Truck,
      title: "توصيل سريع إلى كامل تونس",
      french: "Livraison 24-48h",
      desc: "شحن مؤمّن وسريع لكافة الـ 24 ولاية تونسية إلى باب منزلك"
    },
    {
      icon: Banknote,
      title: "الدفع عند الاستلام",
      french: "Paiement à la Livraison",
      desc: "خلاص نقداً عند التسليم بالدينار التونسي (د.ت) أو بتطبيق D17"
    },
    {
      icon: Award,
      title: "ضمان الجودة والفوحان",
      french: "Garantie Haute Tenue",
      desc: "عينة تجربة مجانية مرفقة مع كل عطر لتجربته بكل اطمئنان"
    },
    {
      icon: Headphones,
      title: "خدمة عملاء سريعة",
      french: "Service Client Dédié",
      desc: "فريق استشاري عطري متواجد طوال أيام الأسبوع لمساعدتك فورياً"
    }
  ];

  return (
    <section id="why-lina" className="border-y border-white/10 bg-[#0c0c10] py-14 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-10 space-y-2">
          <p className="text-[#d4af37] text-xs font-serif tracking-[0.2em] uppercase font-bold">
            POURQUOI CHOISIR LINA SHOP
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold font-serif text-white">
            لماذا يختار النخبة دار Lina Shop؟
          </h3>
        </div>

        {/* 5 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                id={`feature-${idx + 1}`}
                className="p-5 rounded-2xl bg-[#101015] border border-white/10 hover:border-[#d4af37]/40 transition-all duration-300 text-right group hover:-translate-y-1 hover:shadow-xl hover:shadow-[#d4af37]/5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/25 flex items-center justify-center text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-[#070709] transition-colors shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-serif group-hover:text-[#d4af37] transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#d4af37]/80 block font-serif tracking-wider">
                      {item.french}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-neutral-400 mt-3 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
