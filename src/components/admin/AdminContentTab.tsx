import React, { useState } from 'react';
import {
  FileText,
  HelpCircle,
  MessageSquare,
  Sparkles,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Edit3,
  Star,
  Quote,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ContentSettings } from '../../types';

interface AdminContentTabProps {
  contentSettings: ContentSettings;
  onSaveContent: (settings: ContentSettings) => void;
}

export const AdminContentTab: React.FC<AdminContentTabProps> = ({
  contentSettings,
  onSaveContent,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'faq' | 'about' | 'reviews' | 'footer'>('faq');
  const [formData, setFormData] = useState<ContentSettings>(contentSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New FAQ Form state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  // New Review Form state
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewCity, setNewReviewCity] = useState('تونس');
  const [newReviewRating, setNewReviewRating] = useState('5');
  const [newReviewText, setNewReviewText] = useState('');

  const handleSave = (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    onSaveContent(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleAddFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newFaqs = [
      ...(formData.faqs || []),
      {
        id: `faq-${Date.now()}`,
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      },
    ];
    const updated = { ...formData, faqs: newFaqs };
    setFormData(updated);
    onSaveContent(updated);
    setNewQuestion('');
    setNewAnswer('');
  };

  const handleDeleteFaq = (id: string) => {
    const updatedFaqs = (formData.faqs || []).filter((f) => f.id !== id);
    const updated = { ...formData, faqs: updatedFaqs };
    setFormData(updated);
    onSaveContent(updated);
  };

  const handleAddReview = () => {
    if (!newReviewName.trim() || !newReviewText.trim()) return;
    const newReviews = [
      ...(formData.reviews || []),
      {
        id: `rev-${Date.now()}`,
        author: newReviewName.trim(),
        rating: Number(newReviewRating) || 5,
        comment: newReviewText.trim(),
        city: newReviewCity.trim(),
        date: new Date().toISOString().split('T')[0],
      },
    ];
    const updated = { ...formData, reviews: newReviews };
    setFormData(updated);
    onSaveContent(updated);
    setNewReviewName('');
    setNewReviewText('');
  };

  const handleDeleteReview = (id: string) => {
    const updatedReviews = (formData.reviews || []).filter((r) => r.id !== id);
    const updated = { ...formData, reviews: updatedReviews };
    setFormData(updated);
    onSaveContent(updated);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div className="text-right">
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#D6B56A]" />
            <span>نظام إدارة المحتوى التفاعلي (Content CMS)</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            التحكم الكامل في الأسئلة الشائعة، قصة البراند، آراء وتقييمات العملاء، ونصوص الفوتر والشروط
          </p>
        </div>

        <button
          onClick={() => handleSave()}
          className="px-6 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-colors shadow flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>حفظ التعديلات</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/60 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs font-bold text-center animate-in fade-in">
          ✓ تم حفظ محتوى الموقع ونشره بنجاح!
        </div>
      )}

      {/* Sub tabs */}
      <div className="flex items-center gap-2 border-b border-[#D8C8B8]/15 pb-2 overflow-x-auto">
        {[
          { id: 'faq', label: 'الأسئلة الشائعة (FAQ)', icon: HelpCircle },
          { id: 'about', label: 'قصة لينا شوب (About Us)', icon: Sparkles },
          { id: 'reviews', label: 'آراء الحرفاء (Testimonials)', icon: Quote },
          { id: 'footer', label: 'نصوص وسياسات الفوتر', icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-[#D6B56A] text-[#241B18] shadow'
                  : 'bg-[#332522] text-[#D8C8B8] hover:text-[#FFF9F1]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. FAQ Tab */}
      {activeSubTab === 'faq' && (
        <div className="space-y-6 text-right">
          
          {/* Add new FAQ card */}
          <div className="bg-[#332522] border border-[#D6B56A]/30 p-5 rounded-2xl space-y-4">
            <span className="text-xs font-serif font-bold text-[#D6B56A] block">
              + إضافة سؤال وجواب جديد للأسئلة الشائعة
            </span>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="اكتب السؤال هنا (مثال: هل العطور تدوم طويلاً؟)"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
              />
              <textarea
                rows={2}
                placeholder="اكتب الإجابة الشافية والدقيقة هنا..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-5 py-2.5 bg-[#722F3F] hover:bg-[#8E3D50] text-[#D6B56A] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة للأسئلة الشائعة</span>
                </button>
              </div>
            </div>
          </div>

          {/* List of FAQs */}
          <div className="space-y-3">
            {(formData.faqs || []).map((faq, idx) => (
              <div
                key={faq.id}
                className="p-4 bg-[#332522] border border-[#D8C8B8]/15 rounded-xl flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="text-xs font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#241B18] text-[#D6B56A] flex items-center justify-center text-[10px] font-mono shrink-0">
                      {idx + 1}
                    </span>
                    <span>{faq.question}</span>
                  </div>
                  <p className="text-xs text-[#D8C8B8] leading-relaxed pr-7">
                    {faq.answer}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteFaq(faq.id)}
                  className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer shrink-0"
                  title="حذف السؤال"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. About Us Tab */}
      {activeSubTab === 'about' && (
        <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-5 text-right">
          <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
            تخصيص قصة وهوية لينا شوب (About Us)
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                عنوان قسم من نحن
              </label>
              <input
                type="text"
                value={formData.about?.title || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, title: e.target.value },
                  })
                }
                placeholder="قصتنا... شغف العطور التونسية الفاخرة"
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                نص القصة الكاملة
              </label>
              <textarea
                rows={5}
                value={formData.about?.story || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, story: e.target.value },
                  })
                }
                placeholder="انطلقت لينا شوب من شغف عميق بفنون العطارة التونسية..."
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                رابط صورة قسم من نحن
              </label>
              <input
                type="text"
                value={formData.about?.image || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    about: { ...formData.about, image: e.target.value },
                  })
                }
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSave()}
                className="px-6 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
              >
                حفظ نص من نحن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Customer Reviews Tab */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-6 text-right">
          
          {/* Add Review card */}
          <div className="bg-[#332522] border border-[#D6B56A]/30 p-5 rounded-2xl space-y-4">
            <span className="text-xs font-serif font-bold text-[#D6B56A] block">
              + إضافة شهادة حريف جديدة (Customer Review)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="اسم العميل (مثال: مروان بن سالم)"
                value={newReviewName}
                onChange={(e) => setNewReviewName(e.target.value)}
                className="px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
              />
              <input
                type="text"
                placeholder="المدينة (مثال: سوسة أو صفاقس)"
                value={newReviewCity}
                onChange={(e) => setNewReviewCity(e.target.value)}
                className="px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
              />
              <select
                value={newReviewRating}
                onChange={(e) => setNewReviewRating(e.target.value)}
                className="px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
              >
                <option value="5">⭐⭐⭐⭐⭐ (5 نجوم - ممتاز)</option>
                <option value="4">⭐⭐⭐⭐ (4 نجوم - جيد جداً)</option>
              </select>
            </div>

            <textarea
              rows={2}
              placeholder="نص الشهادة والتقييم حول الرائحة والثبات والتوصيل..."
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
            />

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleAddReview}
                className="px-5 py-2.5 bg-[#722F3F] hover:bg-[#8E3D50] text-[#D6B56A] font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>إضافة التقييم</span>
              </button>
            </div>
          </div>

          {/* List of reviews */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(formData.reviews || []).map((rev) => (
              <div
                key={rev.id}
                className="p-5 bg-[#332522] border border-[#D8C8B8]/15 rounded-xl space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-serif font-bold text-[#FFF9F1]">
                      {rev.author}
                    </div>
                    <div className="text-[10px] text-[#D8C8B8]">
                      {rev.city} • <span className="text-emerald-400 font-bold">شراء مؤكد ✓</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 text-xs">
                      {'★'.repeat(rev.rating)}
                    </span>
                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-1 text-rose-400 hover:text-rose-300 rounded cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-[#D8C8B8] leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 4. Footer & Policies Tab */}
      {activeSubTab === 'footer' && (
        <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl p-6 space-y-5 text-right">
          <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
            نصوص وسياسات الفوتر
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                نبذة لينا شوب في الفوتر
              </label>
              <textarea
                rows={2}
                value={formData.footerText || ''}
                onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                سياسة الاستبدال والإرجاع
              </label>
              <textarea
                rows={2}
                value={formData.returnPolicy || ''}
                onChange={(e) => setFormData({ ...formData, returnPolicy: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
              />
            </div>

            <div>
              <label className="block text-xs text-[#D8C8B8] mb-1.5 font-medium">
                شروط الخدمة والأصالة
              </label>
              <textarea
                rows={2}
                value={formData.termsAndConditions || ''}
                onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => handleSave()}
                className="px-6 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-all shadow cursor-pointer"
              >
                حفظ سياسات الفوتر
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
