import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  AlertCircle,
  X,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { Category } from '../../types';

interface AdminCategoriesTabProps {
  categories: Category[];
  onUpdateCategories: (categories: Category[]) => void;
  productsCountByCategory?: Record<string, number>;
}

export const AdminCategoriesTab: React.FC<AdminCategoriesTabProps> = ({
  categories,
  onUpdateCategories,
  productsCountByCategory = {},
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [deleteCatId, setDeleteCatId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [active, setActive] = useState(true);

  const openAddModal = () => {
    setEditingCatId(null);
    setName('');
    setArabicName('');
    setSlug('');
    setDescription('');
    setImage('https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80');
    setActive(true);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: Category) => {
    setEditingCatId(cat.id);
    setName(cat.name);
    setArabicName(cat.arabicName);
    setSlug(cat.slug);
    setDescription(cat.description);
    setImage(cat.image);
    setActive(cat.active !== false);
    setIsModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!arabicName.trim()) {
      alert('يرجى إدخال اسم التصنيف بالعربية');
      return;
    }

    if (editingCatId) {
      const updated = categories.map((c) =>
        c.id === editingCatId
          ? {
              ...c,
              name: name.trim() || arabicName.trim(),
              arabicName: arabicName.trim(),
              slug: slug.trim() || `cat-${Date.now()}`,
              description: description.trim(),
              image: image.trim(),
              active,
            }
          : c
      );
      onUpdateCategories(updated);
    } else {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: name.trim() || arabicName.trim(),
        arabicName: arabicName.trim(),
        slug: slug.trim() || `cat-${Date.now()}`,
        description: description.trim(),
        image: image.trim(),
        active,
        order: categories.length + 1,
      };
      onUpdateCategories([...categories, newCat]);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCategory = (id: string) => {
    const updated = categories.filter((c) => c.id !== id);
    onUpdateCategories(updated);
    setDeleteCatId(null);
  };

  const handleToggleActive = (id: string) => {
    const updated = categories.map((c) =>
      c.id === id ? { ...c, active: !c.active } : c
    );
    onUpdateCategories(updated);
  };

  const handleMoveOrder = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= categories.length) return;

    const copy = [...categories];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    onUpdateCategories(copy);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div className="text-right">
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <Tag className="w-5 h-5 text-[#D6B56A]" />
            <span>إدارة التصنيفات والمجموعات</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            التحكم في أقسام المتجر، الصور التوضيحية، الترتيب، والإظهار أو الإخفاء في شريط التنقل
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-colors shadow flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>إضافة تصنيف جديد</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {categories.map((cat, idx) => {
          const pCount = productsCountByCategory[cat.arabicName] || 0;
          return (
            <div
              key={cat.id}
              className={`bg-[#332522] border rounded-2xl overflow-hidden shadow-sm transition-all duration-300 ${
                cat.active ? 'border-[#D8C8B8]/20' : 'border-rose-900/30 opacity-70'
              }`}
            >
              {/* Image & Badges */}
              <div className="relative h-36 overflow-hidden bg-[#241B18]">
                <img
                  src={cat.image}
                  alt={cat.arabicName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#241B18] via-transparent to-black/30" />

                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#241B18]/80 text-[#D6B56A] border border-[#D6B56A]/40 backdrop-blur-sm">
                    ترتيب: {idx + 1}
                  </span>
                  {!cat.active && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-950/90 text-rose-300 border border-rose-800/50">
                      مخفي
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 text-right">
                  <h3 className="text-base font-serif font-bold text-[#FFF9F1]">
                    {cat.arabicName}
                  </h3>
                  <span className="text-[10px] font-mono text-[#D8C8B8]">
                    {cat.name}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 space-y-3 text-right">
                <p className="text-xs text-[#D8C8B8] line-clamp-2 leading-relaxed">
                  {cat.description || 'لا يوجد وصف لهذا القسم'}
                </p>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#D8C8B8]/15">
                  <span className="text-[#D8C8B8]">
                    {pCount} منتج مرتبط
                  </span>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {/* Order up/down */}
                    <button
                      disabled={idx === 0}
                      onClick={() => handleMoveOrder(idx, 'up')}
                      className="p-1.5 bg-[#241B18] hover:bg-[#D6B56A] hover:text-[#241B18] text-[#D8C8B8] rounded-lg disabled:opacity-30 cursor-pointer"
                      title="تحريك لأعلى"
                    >
                      ▲
                    </button>
                    <button
                      disabled={idx === categories.length - 1}
                      onClick={() => handleMoveOrder(idx, 'down')}
                      className="p-1.5 bg-[#241B18] hover:bg-[#D6B56A] hover:text-[#241B18] text-[#D8C8B8] rounded-lg disabled:opacity-30 cursor-pointer"
                      title="تحريك لأسفل"
                    >
                      ▼
                    </button>

                    {/* Toggle Active */}
                    <button
                      onClick={() => handleToggleActive(cat.id)}
                      className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                        cat.active
                          ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400'
                          : 'bg-rose-950/40 border-rose-800/50 text-rose-400'
                      }`}
                      title={cat.active ? 'ظاهر (انقر للإخفاء)' : 'مخفي (انقر للإظهار)'}
                    >
                      {cat.active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 bg-[#241B18] border border-[#D8C8B8]/20 hover:border-[#D6B56A] text-[#F7F1E8] hover:text-[#D6B56A] rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteCatId(cat.id)}
                      className="p-1.5 bg-rose-950/30 border border-rose-800/30 hover:bg-rose-900/50 text-rose-300 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Category Modal */}
      {deleteCatId !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#332522] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center mx-auto border border-rose-800/40">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#FFF9F1]">
              تأكيد حذف التصنيف
            </h3>
            <p className="text-xs text-[#D8C8B8] leading-relaxed">
              هل أنت متأكد من حذف هذا التصنيف؟ العطور التابعة له ستبقى موجودة ولكن لن يظهر هذا التبويب في المتجر.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => handleDeleteCategory(deleteCatId)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                تأكيد الحذف
              </button>
              <button
                onClick={() => setDeleteCatId(null)}
                className="flex-1 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 text-[#D8C8B8] hover:text-[#FFF9F1] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#241B18] border border-[#D6B56A]/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 text-right shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-[#D8C8B8]/15 pb-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-[#D8C8B8] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-serif font-bold text-[#FFF9F1]">
                {editingCatId ? 'تعديل بيانات التصنيف' : 'إضافة تصنيف جديد'}
              </h3>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs text-[#D8C8B8] mb-1.5">
                  اسم التصنيف بالعربية *
                </label>
                <input
                  type="text"
                  required
                  value={arabicName}
                  onChange={(e) => setArabicName(e.target.value)}
                  placeholder="مثال: عطور نسائية"
                  className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#D8C8B8] mb-1.5">
                  الاسم باللاتينية (English / French)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: Women's Fragrances"
                  className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#D8C8B8] mb-1.5">
                  رابط صورة التصنيف
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                />
              </div>

              <div>
                <label className="block text-xs text-[#D8C8B8] mb-1.5">
                  وصف التصنيف
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="وصف موجز للمجموعة العطرية..."
                  className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="cat-active-check"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="w-4 h-4 accent-[#D6B56A]"
                />
                <label htmlFor="cat-active-check" className="text-xs text-[#FFF9F1] cursor-pointer">
                  تفعيل وظهور التصنيف للزوار في شريط المتجر
                </label>
              </div>

              <div className="flex gap-3 pt-4 border-t border-[#D8C8B8]/15">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] font-bold text-xs rounded-xl transition-all shadow cursor-pointer"
                >
                  {editingCatId ? 'حفظ التعديلات' : 'إضافة التصنيف'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-[#332522] text-[#D8C8B8] text-xs font-bold rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
