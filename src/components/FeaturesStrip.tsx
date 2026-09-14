import React from 'react';
import { Tag, Layers, Droplets, Truck, SlidersHorizontal, Headphones } from 'lucide-react';

export const FeaturesStrip: React.FC = () => {
  const features = [
    {
      icon: Tag,
      title: "أسعار مناسبة ورمزية",
      subtitle: "Prix Abordables",
      desc: "عطور فاخرة بأسعار في متناول الجميع تبدأ من 5 د.ت دون التضحية بالثبات والفوحان."
    },
    {
      icon: Layers,
      title: "أحجام متعددة",
      subtitle: "Multiples Formats",
      desc: "خيارات واسعة من 5ml للتجربة إلى 100ml للتوفير الأكبر لتلائم كل الاحتياجات."
    },
    {
      icon: Droplets,
      title: "عطور زيتية وتركيبات",
      subtitle: "Huiles & Extraits",
      desc: "زيوت عطرية نقية خالية من الكحول وتركيبات بخاخ مستوحاة بحرفية من أشهر الروائح."
    },
    {
      icon: Truck,
      title: "توصيل لكامل تونس",
      subtitle: "Livraison 24h-48h",
      desc: "شحن سريع ومؤمن إلى كافة الـ 24 ولاية مع الدفع عند الاستلام أو عبر D17."
    },
    {
      icon: SlidersHorizontal,
      title: "حرية اختيار الحجم",
      subtitle: "Choix Personnalisé",
      desc: "حدد حجم الزجاجة وسعرها المناسب لميزانيتك بنقرة زر واحدة لكل عطر."
    },
    {
      icon: Headphones,
      title: "خدمة عملاء ومتابعة",
      subtitle: "Service Client Dédié",
      desc: "فريق تونسي متواجد عبر الهاتف والواتساب لمساعدتك ومتابعة طلبك خطوة بخطوة."
    }
  ];

  return (
    <section id="why-lina" className="border-y border-[#D8C8B8]/40 bg-[#F7F1E8] text-[#241B18] py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center mb-12 space-y-2.5">
          <p className="text-[#722F3F] text-xs font-serif tracking-[0.25em] uppercase font-bold">
            POURQUOI CHOISIR LINA SHOP
          </p>
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-[#241B18]">
            لماذا يفضل التونسيون الشراء من Lina Shop؟
          </h3>
          <p className="text-[#57413C] text-xs sm:text-sm max-w-xl mx-auto">
            تجربة تسوق عطرية ذكية ومريحة؛ جودة وثبات، شفافية تامة، وأسعار رمزية مدروسة لكافة الحرفاء.
          </p>
        </div>

        {/* 6 Columns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                id={`feature-${idx + 1}`}
                className="p-5 rounded-2xl bg-[#FFF9F1] border border-[#D8C8B8]/60 hover:border-[#722F3F]/40 transition-all duration-300 text-right group hover:-translate-y-1 hover:shadow-xl hover:shadow-[#722F3F]/5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-[#722F3F]/10 border border-[#722F3F]/20 flex items-center justify-center text-[#722F3F] group-hover:bg-[#722F3F] group-hover:text-[#FFF9F1] transition-colors shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-[#241B18] font-serif group-hover:text-[#722F3F] transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-[#A86B6D] font-sans tracking-wide block font-medium">
                      {item.subtitle}
                    </span>
                  </div>
                  <p className="text-xs text-[#57413C] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
