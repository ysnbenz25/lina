import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'ما هي طبيعة العطور والتركيبات المتوفرة في LINA SHOP؟',
      a: 'LINA SHOP متجر تونسي متخصص في الزيوت العطرية المركزة والتركيبات المستوحاة بدقة من أشهر الروائح العالمية. نود التأكيد بكل شفافية أننا لا نبيع العطور الأصلية التابعة لتلك الشركات العالمية، بل نقدم بدائل تركيبية وزيوت نقية بأعلى درجات الثبات والفوحان وبأسعار رمزية مناسبة للجميع.'
    },
    {
      q: 'كم تكلفة التوصيل في تونس؟',
      a: 'نوفر التوصيل السريع لكافة الـ 24 ولاية تونسية دون استثناء بتكلفة رمزية وثابتة قدرها 7 دنانير تونسية فقط، مع توصيل مجاني للعروض والباقات الخاصة.'
    },
    {
      q: 'كم يستغرق وصول الطلب إلى باب منزلي؟',
      a: 'يستغرق التوصيل عادة بين 24 إلى 48 ساعة عمل. يتصل بك عون التوصيل هاتفياً قبل الوصول لتأكيد العنوان والوقت المناسب لك.'
    },
    {
      q: 'هل الدفع عند الاستلام متاح؟ وكيف يعمل الدفع عبر D17؟',
      a: 'نعم، الدفع عند الاستلام (Paiement à la livraison) هو الخيار الافتراضي والأساسي. كما نوفر إمكانية الدفع المسبق عبر تطبيق D17 التابع للبريد التونسي لمن يفضل ذلك مع تأكيد فوري للطلب.'
    },
    {
      q: 'كيف يمكنني تتبع حالة طلبي؟',
      a: 'بمجرد تسجيل الطلب، ستتلقى رمز تتبع فوري (مثال: TN-849102). يمكنك استخدام ميزة "تتبع الطلب" في أعلى الصفحة لمعرفة وضعية طردك في أي وقت.'
    },
    {
      q: 'ما هي الأحجام المتوفرة من العطور والزيوت؟',
      a: 'نوفر تشكيلة واسعة من الأحجام تناسب كل الاحتياجات: قوارير الزيت العطري المركز (5 مل و10 مل و15 مل بكرة دوارة Roll-on)، وبخاخات التركيبة العطرية المستوحاة (30 مل و50 مل و100 مل).'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#241B18] border-b border-[#D8C8B8]/15">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="font-serif text-[11px] tracking-[0.35em] text-[#D6B56A] uppercase block font-bold">
            QUESTIONS FRÉQUEMMENT POSÉES • الأسئلة الشائعة
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#FFF9F1] font-bold tracking-tight">
            كل ما تود معرفته عن لينا شوب
          </h2>
          <p className="text-xs sm:text-sm text-[#D8C8B8] font-serif">
            إجابات واضحة وشفافة حول منتجاتنا، التوصيل في تونس، وطرق الدفع
          </p>
        </div>

        {/* Minimal Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#332522] border border-[#D8C8B8]/20 hover:border-[#D6B56A]/50 transition-all rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-5 px-6 text-right flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg text-[#F7F1E8] font-medium">
                    {faq.q}
                  </span>

                  <div className="w-8 h-8 rounded-full bg-[#722F3F] flex items-center justify-center text-[#D6B56A] shrink-0 shadow-sm">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-right border-t border-[#D8C8B8]/15">
                    <p className="text-xs sm:text-sm text-[#D8C8B8] leading-relaxed font-sans font-light">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
