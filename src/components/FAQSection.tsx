import React, { useState } from 'react';
import { ChevronDown, Plus, Minus } from 'lucide-react';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'هل العطور أصلية ومضمونة؟',
      a: 'نعم، جميع عطور لينا شوب أصلية 100%، مستخلصة من خامات وزيوت عطرية نقية معتمدة وفق أعلى معايير العطور العالمية (Haute Parfumerie). نلتزم بنقاء التركيبة ونسب تركيز عالية (Extrait de Parfum / Eau de Parfum) تضمن ثباتاً يدوم طويلاً.'
    },
    {
      q: 'كم تكلفة التوصيل في تونس؟',
      a: 'التوصيل مجاني تماماً لجميع الطلبات التي تتجاوز قيمتها 150 د.ت. أما بالنسبة للطلبات الأقل، فتكلفة التوصيل رمزية وثابتة قدرها 7 دنانير تونسية فقط لجميع الولايات الـ 24 دون استثناء.'
    },
    {
      q: 'كم يستغرق وصول الطلب؟',
      a: 'يستغرق التوصيل عادة بين 24 إلى 48 ساعة عمل كحد أقصى، حيث يتواصل معك موزع التوصيل مسبقاً عبر الهاتف لتنسيق الموعد والمكان المناسب لاستلام طردك.'
    },
    {
      q: 'هل الدفع عند الاستلام متوفر؟',
      a: 'نعم، الدفع عند الاستلام (Paiement à la livraison) هو وسيلتنا الأساسية، حيث يمكنك معاينة الطرد قبل الدفع لعون التوصيل. كما نوفر خيار الدفع الإلكتروني السريع عبر خدمة D17 التابعة للبريد التونسي لمن يرغب.'
    },
    {
      q: 'كيف يمكنني تتبع طلبي؟',
      a: 'بمجرد تأكيد طلبك، ستحصل على رمز تتبع خاص بشحنتك (مثال: TN-849102). يمكنك الضغط على زر "تتبع الطلب" في أعلى الموقع وإدخال الرمز لمشاهدة الحالة اللحظية لطردك من التجهيز وحتى التسليم.'
    },
    {
      q: 'هل يمكنني استبدال أو إرجاع الطلب؟',
      a: 'نعم بالتأكيد، يحق لك استبدال أو إرجاع أي منتج في غضون 7 أيام من تاريخ الاستلام في حال كان المنتج بحالته الأصلية غير مفتوح أو في حال وجود أي عيب مصنعي في البخاخ أو الزجاجة. فريق خدمة العملاء جاهز لخدمتك فوراً.'
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 sm:py-32 bg-[#0A0A0A] border-b border-white/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <span className="font-serif text-[11px] tracking-[0.35em] text-[#C9A227] uppercase block">
            QUESTIONS FRÉQUEMMENT POSÉES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#E8E1D5] font-bold tracking-tight">
            الأسئلة الشائعة
          </h2>
          <p className="text-xs sm:text-sm text-[#ACA394] font-serif">
            كل ما تحتاج لمعرفته حول الشراء، التوصيل والضمان في لينا شوب
          </p>
        </div>

        {/* Minimal Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-[#111111] border border-white/5 hover:border-white/10 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full py-5 px-6 text-right flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif text-base sm:text-lg text-[#E8E1D5] font-medium">
                    {faq.q}
                  </span>

                  <div className="w-7 h-7 rounded-full bg-[#181818] flex items-center justify-center text-[#C9A227] shrink-0">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-right border-t border-white/5">
                    <p className="text-xs sm:text-sm text-[#ACA394] leading-relaxed font-sans font-light">
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
