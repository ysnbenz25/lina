import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "هل العطور أصلية؟",
    answer: "نعم، جميع عطور دار لينا شوب (Lina Shop) أصلية 100%، مصممة بأعلى تركيزات النيش (Extrait de Parfum & Eau de Parfum) باستخدام أجود الزيوت العطرية النقية المستوردة من غراس بفرنسا وأعرق مصادر الشرق، ومصنعة وفقاً لأدق المعايير العالمية لصناعة العطور الفاخرة."
  },
  {
    question: "كم تكلفة التوصيل؟",
    answer: "التوصيل مجاني بالكامل لكافة ولايات الجمهورية التونسية الـ 24 عند الشراء بقيمة 150 د.ت أو أكثر. بالنسبة للطلبات الأقل من 150 د.ت، تبلغ رسوم الشحن الثابتة 7 دنانير تونسية فقط إلى باب منزلك أو مقر عملك."
  },
  {
    question: "كم يستغرق التوصيل؟",
    answer: "يتم تجهيز الشحنات وتسليمها لشركائنا في التوصيل فور تأكيد الطلب. يستغرق التوصيل عادةً بين 24 إلى 48 ساعة كحد أقصى لكافة ولايات تونس (تونس الكبرى، الساحل، صفاقس، الشمال، والجنوب التونسي)."
  },
  {
    question: "هل الدفع عند الاستلام متوفر؟",
    answer: "نعم بكل تأكيد، نوفر خيار الدفع نقداً عند الاستلام (Paiement à la livraison) في كافة ولايات تونس، حيث يمكنك معاينة وتفقد الطرد ودفع المبلغ لمندوب التوصيل بالدينار التونسي (د.ت). كما نوفر خيار الدفع الرقمي السريع عبر تطبيق D17 التابع للبريد التونسي."
  },
  {
    question: "كيف يمكنني تتبع طلبي؟",
    answer: "فور إتمامك للطلب، يظهر لك مباشرة 'كود التتبع التونسي' الخاص بك (مثال: TN-784291). يمكنك في أي وقت النقر على زر 'تتبع طلبي' في أعلى الموقع وإدخال كود التتبع أو رقم هاتفك لمعرفة المرحلة الدقيقة التي وصلتها شحنتك لحظة بلحظة."
  },
  {
    question: "هل يمكنني إرجاع الطلب؟",
    answer: "نعم، نطبق في Lina Shop سياسة 'الضمان الذهبي'. نرفق مع كل عبوة عطر رئيسية عينة تجربة مجانية صغيرة (Tester) من نفس العطر؛ يمكنك تجربة العينة أولاً، وفي حال لم يناسبك العطر يمكنك إرجاع العبوة الرئيسية غير مفتوحة ومغلفة بسولوفانها الأصلي خلال 7 أيام واسترداد أموالك كاملة."
  }
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#070709] border-t border-white/5 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 text-[#d4af37] text-xs font-serif tracking-widest uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>QUESTIONS FRÉQUEMMENT POSÉES</span>
          </div>
          <h2 id="faq-heading" className="text-3xl sm:text-4xl font-bold font-serif text-white">
            الأسئلة الشائعة
          </h2>
          <p className="text-neutral-400 text-sm max-w-xl mx-auto leading-relaxed">
            كل ما تود معرفته حول أصالة عطورنا، أوقات التوصيل لكافة ولايات تونس، وطرق الخلاص المتاحة.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                id={`faq-item-${idx}`}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#101014] border-[#d4af37]/40 shadow-lg shadow-[#d4af37]/5'
                    : 'bg-[#0b0b0e] border-white/10 hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-5 py-4 sm:py-5 flex items-center justify-between text-right gap-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#d4af37]"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${idx}`}
                >
                  <span className="font-serif text-base sm:text-lg font-bold text-white tracking-wide">
                    {item.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[#d4af37] text-[#070709] rotate-180'
                        : 'bg-white/5 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`faq-answer-${idx}`}
                    className="px-5 pb-5 pt-1 text-sm text-neutral-300 leading-relaxed border-t border-white/5 animate-in fade-in duration-200"
                  >
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Support Note */}
        <div className="mt-12 text-center p-6 rounded-2xl bg-[#101014] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-right">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">لديك استفسار آخر خاص؟</p>
              <p className="text-xs text-neutral-400">فريق خدمة الحرفاء متواجد طوال أيام الأسبوع للإجابة عليك</p>
            </div>
          </div>
          <a
            href="https://wa.me/21698123456"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl bg-[#17171d] hover:bg-[#d4af37] text-neutral-200 hover:text-[#070709] border border-white/10 hover:border-[#d4af37] text-xs font-bold transition-colors whitespace-nowrap"
          >
            تحدث مع خبير العطور عبر واتساب 💬
          </a>
        </div>

      </div>
    </section>
  );
};
