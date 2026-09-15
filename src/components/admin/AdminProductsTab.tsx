import React, { useState, useRef } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Check,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  Sparkles,
  Layers,
  AlertCircle,
  Tag,
  DollarSign,
  X,
  Package,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Perfume, ProductSizeOption, Category } from '../../types';

interface AdminProductsTabProps {
  perfumes: Perfume[];
  categories: Category[];
  onAddPerfume: (perfume: Perfume) => void;
  onUpdatePerfume: (perfume: Perfume) => void;
  onDeletePerfume: (id: number) => void;
  onResetDefaultPerfumes: () => void;
}

export const AdminProductsTab: React.FC<AdminProductsTabProps> = ({
  perfumes,
  categories,
  onAddPerfume,
  onUpdatePerfume,
  onDeletePerfume,
  onResetDefaultPerfumes,
}) => {
  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCatFilter, setSelectedCatFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'instock' | 'outstock'>('all');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [arabicName, setArabicName] = useState('');
  const [category, setCategory] = useState('عطور رجالية');
  const [gender, setGender] = useState<'men' | 'women' | 'unisex'>('men');
  const [badge, setBadge] = useState('الأكثر طلباً');
  const [fragranceType, setFragranceType] = useState('تركيبة عطرية مستوحاة');
  const [inspiredBy, setInspiredBy] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('16');
  const [originalPrice, setOriginalPrice] = useState('22');
  const [volume, setVolume] = useState('30 ml (متوفر من 5ml إلى 100ml)');
  const [imageUrl, setImageUrl] = useState('');
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [inStock, setInStock] = useState(true);
  const [isActive, setIsActive] = useState(true);
  const [isBestseller, setIsBestseller] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [isSpecialOffer, setIsSpecialOffer] = useState(false);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isMostDemanded, setIsMostDemanded] = useState(false);

  // Fragrance notes
  const [topNotes, setTopNotes] = useState('');
  const [heartNotes, setHeartNotes] = useState('');
  const [baseNotes, setBaseNotes] = useState('');

  // Multi-sizes options
  const [sizeOptions, setSizeOptions] = useState<ProductSizeOption[]>([
    { size: '5ml', price: 5, originalPrice: 7 },
    { size: '10ml', price: 8, originalPrice: 12 },
    { size: '20ml', price: 12, originalPrice: 16 },
    { size: '30ml', price: 16, originalPrice: 22 },
    { size: '50ml', price: 22, originalPrice: 30 },
    { size: '100ml', price: 35, originalPrice: 48 },
  ]);
  const [newSizeLabel, setNewSizeLabel] = useState('');
  const [newSizePrice, setNewSizePrice] = useState('');
  const [newSizeOriginal, setNewSizeOriginal] = useState('');

  // Image Upload helper
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WebP)');
      return;
    }

    setUploadStatus('جاري معالجة الصورة...');
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImageUrl(base64);
      setUploadStatus('تم تحميل الصورة بنجاح!');
      setTimeout(() => setUploadStatus(''), 3000);
    };
    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingId(null);
    setName('');
    setArabicName('');
    setCategory(categories[0]?.arabicName || 'عطور رجالية');
    setGender('men');
    setBadge('إصدار فاخر بتونس');
    setFragranceType('تركيبة عطرية مستوحاة');
    setInspiredBy('');
    setDescription('');
    setPrice('16');
    setOriginalPrice('22');
    setVolume('30 ml (متوفر من 5ml إلى 100ml)');
    setImageUrl('https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80');
    setGalleryUrls([]);
    setInStock(true);
    setIsActive(true);
    setIsBestseller(false);
    setIsNew(true);
    setIsSpecialOffer(false);
    setIsFeatured(true);
    setIsMostDemanded(false);
    setTopNotes('برغموت، حمضيات منعشة');
    setHeartNotes('خزامى، ياسمين، توابل دافئة');
    setBaseNotes('أخشاب الأرز، عنبر، مسك أبيض');
    setSizeOptions([
      { size: '5ml', price: 5, originalPrice: 7 },
      { size: '10ml', price: 8, originalPrice: 12 },
      { size: '20ml', price: 12, originalPrice: 16 },
      { size: '30ml', price: 16, originalPrice: 22 },
      { size: '50ml', price: 22, originalPrice: 30 },
      { size: '100ml', price: 35, originalPrice: 48 },
    ]);
    setIsModalOpen(true);
  };

  const openEditModal = (p: Perfume) => {
    setEditingId(p.id);
    setName(p.name);
    setArabicName(p.arabicName);
    setCategory(p.category);
    setGender(p.gender || 'unisex');
    setBadge(p.badge || 'الأكثر طلباً');
    setFragranceType(p.fragranceType || 'تركيبة عطرية مستوحاة');
    setInspiredBy(p.inspiredBy || '');
    setDescription(p.description);
    setPrice(String(p.price));
    setOriginalPrice(String(p.originalPrice));
    setVolume(p.volume);
    setImageUrl(p.image);
    setGalleryUrls(p.gallery || [p.image]);
    setInStock(p.inStock !== false);
    setIsActive(p.isActive !== false);
    setIsBestseller(!!p.isBestseller);
    setIsNew(!!p.isNew);
    setIsSpecialOffer(!!p.isSpecialOffer);
    setIsFeatured(!!p.isFeatured);
    setIsMostDemanded(!!p.isMostDemanded);
    setTopNotes(p.notes?.top || '');
    setHeartNotes(p.notes?.heart || '');
    setBaseNotes(p.notes?.base || '');
    setSizeOptions(p.sizeOptions && p.sizeOptions.length > 0 ? p.sizeOptions : [
      { size: '5ml', price: 5, originalPrice: 7 },
      { size: '10ml', price: 8, originalPrice: 12 },
      { size: '20ml', price: 12, originalPrice: 16 },
      { size: '30ml', price: Number(p.price) || 16, originalPrice: Number(p.originalPrice) || 22 },
      { size: '50ml', price: 25, originalPrice: 35 },
      { size: '100ml', price: 38, originalPrice: 50 },
    ]);
    setIsModalOpen(true);
  };

  const handleAddSize = () => {
    if (!newSizeLabel.trim() || !newSizePrice) return;
    const newOpt: ProductSizeOption = {
      size: newSizeLabel.trim(),
      price: Number(newSizePrice),
      originalPrice: newSizeOriginal ? Number(newSizeOriginal) : undefined,
    };
    setSizeOptions([...sizeOptions, newOpt]);
    setNewSizeLabel('');
    setNewSizePrice('');
    setNewSizeOriginal('');
  };

  const handleRemoveSize = (index: number) => {
    if (sizeOptions.length <= 1) {
      alert('يجب أن يحتوي المنتج على حجم وسعر واحد على الأقل.');
      return;
    }
    setSizeOptions(sizeOptions.filter((_, i) => i !== index));
  };

  const handleAddGalleryImage = () => {
    if (!newGalleryInput.trim()) return;
    setGalleryUrls([...galleryUrls, newGalleryInput.trim()]);
    setNewGalleryInput('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGalleryUrls(galleryUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!arabicName.trim() && !name.trim()) {
      alert('يرجى إدخال اسم العطر بالعربية أو الفرنسية');
      return;
    }

    const defaultPrice = sizeOptions[0]?.price || Number(price) || 16;
    const defaultOriginal = sizeOptions[0]?.originalPrice || Number(originalPrice) || 22;

    const perfumePayload: Perfume = {
      id: editingId || Date.now(),
      name: name.trim() || arabicName.trim(),
      arabicName: arabicName.trim() || name.trim(),
      category,
      gender,
      badge,
      fragranceType,
      inspiredBy,
      price: defaultPrice,
      originalPrice: defaultOriginal,
      volume,
      sizes: sizeOptions.map(s => s.size),
      sizeOptions,
      rating: editingId ? (perfumes.find(p => p.id === editingId)?.rating || 4.9) : 5.0,
      reviewsCount: editingId ? (perfumes.find(p => p.id === editingId)?.reviewsCount || 12) : 1,
      image: imageUrl || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
      gallery: galleryUrls.length > 0 ? galleryUrls : [imageUrl],
      description,
      notes: {
        top: topNotes,
        heart: heartNotes,
        base: baseNotes,
      },
      inStock,
      isActive,
      isBestseller,
      isNew,
      isSpecialOffer,
      isFeatured,
      isMostDemanded,
    };

    if (editingId) {
      onUpdatePerfume(perfumePayload);
    } else {
      onAddPerfume(perfumePayload);
    }

    setIsModalOpen(false);
  };

  // Filtered perfumes
  const filteredPerfumes = perfumes.filter(p => {
    const matchSearch =
      (p.arabicName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.inspiredBy || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchCategory =
      selectedCatFilter === 'all' ||
      p.category === selectedCatFilter;

    const matchStock =
      stockFilter === 'all' ||
      (stockFilter === 'instock' && p.inStock !== false && p.isActive !== false) ||
      (stockFilter === 'outstock' && (p.inStock === false || p.isActive === false));

    return matchSearch && matchCategory && matchStock;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#332522] border border-[#D8C8B8]/20 p-5 rounded-2xl shadow-sm">
        <div className="text-right">
          <h2 className="text-xl font-serif font-bold text-[#FFF9F1] flex items-center gap-2">
            <Package className="w-5 h-5 text-[#D6B56A]" />
            <span>إدارة المنتجات والأحجام والأسعار</span>
          </h2>
          <p className="text-xs text-[#D8C8B8] mt-1">
            إضافة وتعديل العطور والزيوت، ضبط الأسعار لكل حجم ديناميكياً، وتحديد شارات الأكثر طلباً والعروض
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={openAddModal}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] text-xs font-bold rounded-xl transition-colors shadow flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة عطر جديد</span>
          </button>

          <button
            onClick={onResetDefaultPerfumes}
            title="استعادة العطور التونسية الافتراضية"
            className="p-2.5 bg-[#241B18] border border-[#D8C8B8]/20 hover:border-[#D6B56A] text-[#D8C8B8] hover:text-[#D6B56A] rounded-xl transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#332522] border border-[#D8C8B8]/20 p-4 rounded-2xl">
        <div className="relative">
          <Search className="w-4 h-4 text-[#D8C8B8] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="بحث بالاسم أو الماركة المستوحاة..."
            className="w-full pl-3 pr-10 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] placeholder-[#D8C8B8]/60 focus:outline-none focus:border-[#D6B56A]"
          />
        </div>

        <div>
          <select
            value={selectedCatFilter}
            onChange={(e) => setSelectedCatFilter(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
          >
            <option value="all">كل التصنيفات ({perfumes.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.arabicName}>
                {c.arabicName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
          >
            <option value="all">كل الحالات</option>
            <option value="instock">متوفر للبيع فقط</option>
            <option value="outstock">غير متوفر / مخفي</option>
          </select>
        </div>
      </div>

      {/* Products Table / Cards */}
      <div className="bg-[#332522] border border-[#D8C8B8]/20 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#D8C8B8]/15 flex items-center justify-between text-xs text-[#D8C8B8]">
          <span>عدد المنتجات المعروضة: {filteredPerfumes.length} عطر وزيت</span>
          <span>العملة: دينار تونسي (د.ت)</span>
        </div>

        <div className="divide-y divide-[#D8C8B8]/10">
          {filteredPerfumes.length === 0 ? (
            <div className="text-center py-16 text-[#D8C8B8] space-y-2">
              <Package className="w-10 h-10 mx-auto opacity-40" />
              <p className="text-xs">لا توجد عطور مطابقة لمعايير البحث</p>
            </div>
          ) : (
            filteredPerfumes.map((perfume) => (
              <div
                key={perfume.id}
                className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-[#241B18]/50 transition-colors"
              >
                {/* Info Left */}
                <div className="flex items-center gap-4 text-right">
                  <div className="relative shrink-0">
                    <img
                      src={perfume.image}
                      alt={perfume.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-[#D8C8B8]/20"
                    />
                    {perfume.inStock === false && (
                      <span className="absolute inset-0 bg-black/70 rounded-xl flex items-center justify-center text-[10px] text-rose-300 font-bold">
                        نفد المخزون
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm sm:text-base font-serif font-bold text-[#FFF9F1]">
                        {perfume.arabicName}
                      </h4>
                      {perfume.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#722F3F] text-[#D6B56A] border border-[#D6B56A]/30 font-bold">
                          {perfume.badge}
                        </span>
                      )}
                      {perfume.isSpecialOffer && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-900/60 text-amber-300 font-bold">
                          عرض خاص
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#D8C8B8] font-mono">
                      {perfume.name} {perfume.inspiredBy && `• ${perfume.inspiredBy}`}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#D8C8B8]/80 pt-1">
                      <span className="px-2 py-0.5 rounded bg-[#241B18] border border-[#D8C8B8]/15">
                        {perfume.category}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#241B18] border border-[#D8C8B8]/15">
                        {perfume.gender === 'women' ? 'نسائي' : perfume.gender === 'men' ? 'رجالي' : 'للجنسين'}
                      </span>
                      <span className="text-[#D6B56A] font-bold">
                        {perfume.sizeOptions?.length || perfume.sizes?.length || 1} أحجام متوفرة
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price & Actions Right */}
                <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0 border-[#D8C8B8]/10">
                  <div className="text-right md:text-left">
                    <div className="text-xs text-[#D8C8B8]">يبدأ من:</div>
                    <div className="text-lg font-bold font-mono text-[#D6B56A]">
                      {perfume.sizeOptions?.[0]?.price || perfume.price} د.ت
                    </div>
                    {(perfume.sizeOptions?.[0]?.originalPrice || perfume.originalPrice) && (
                      <div className="text-[11px] font-mono text-[#D8C8B8]/60 line-through">
                        {perfume.sizeOptions?.[0]?.originalPrice || perfume.originalPrice} د.ت
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Toggle Stock / Active */}
                    <button
                      onClick={() => {
                        onUpdatePerfume({
                          ...perfume,
                          inStock: perfume.inStock === false ? true : false,
                        });
                      }}
                      className={`p-2.5 rounded-xl border transition-colors cursor-pointer ${
                        perfume.inStock !== false
                          ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-400 hover:bg-emerald-900/50'
                          : 'bg-rose-950/40 border-rose-800/50 text-rose-400 hover:bg-rose-900/50'
                      }`}
                      title={perfume.inStock !== false ? 'متوفر (انقر للتعطيل)' : 'غير متوفر (انقر للتفعيل)'}
                    >
                      {perfume.inStock !== false ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(perfume)}
                      className="p-2.5 bg-[#241B18] border border-[#D8C8B8]/20 hover:border-[#D6B56A] text-[#F7F1E8] hover:text-[#D6B56A] rounded-xl transition-colors cursor-pointer"
                      title="تعديل العطر والأحجام"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => setDeleteConfirmId(perfume.id)}
                      className="p-2.5 bg-rose-950/30 border border-rose-800/30 hover:bg-rose-900/50 text-rose-300 rounded-xl transition-colors cursor-pointer"
                      title="حذف المنتج"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#332522] border border-rose-500/40 rounded-2xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-950 text-rose-400 flex items-center justify-center mx-auto border border-rose-800/40">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-serif font-bold text-[#FFF9F1]">
              تأكيد حذف العطر
            </h3>
            <p className="text-xs text-[#D8C8B8] leading-relaxed">
              هل أنت متأكد من رغبتك في حذف هذا العطر نهائياً؟ يمكنك بدلاً من ذلك إخفاءه من المتجر بجعله "غير متوفر".
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  onDeletePerfume(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                تأكيد الحذف
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 bg-[#241B18] border border-[#D8C8B8]/20 text-[#D8C8B8] hover:text-[#FFF9F1] text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#241B18] border border-[#D6B56A]/40 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 text-right shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-[#D8C8B8]/15 pb-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-[#D8C8B8] hover:text-white hover:bg-[#332522] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-lg font-serif font-bold text-[#FFF9F1]">
                {editingId ? 'تعديل تفاصيل العطر والأحجام' : 'إضافة عطر أو زيت جديد'}
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Section 1: Basic Info */}
              <div className="space-y-4">
                <span className="text-xs font-serif font-bold text-[#D6B56A] uppercase tracking-wider block">
                  1. المعلومات الأساسية والتصنيف
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-[#D8C8B8] mb-1.5">
                      اسم العطر بالعربية *
                    </label>
                    <input
                      type="text"
                      required
                      value={arabicName}
                      onChange={(e) => setArabicName(e.target.value)}
                      placeholder="مثال: تركيبة مستوحاة من Sauvage"
                      className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-[#D8C8B8] mb-1.5">
                      الاسم باللاتينية / الفرنسية
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: Sauvage Tribute Accord"
                      className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-[#D8C8B8] mb-1.5">التصنيف</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.arabicName}>
                          {c.arabicName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#D8C8B8] mb-1.5">الجنس المستهدف</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                    >
                      <option value="men">رجالي (Men)</option>
                      <option value="women">نسائي (Women)</option>
                      <option value="unisex">للجنسين (Unisex)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-[#D8C8B8] mb-1.5">نوع العطر</label>
                    <input
                      type="text"
                      value={fragranceType}
                      onChange={(e) => setFragranceType(e.target.value)}
                      placeholder="مثال: تركيبة مستوحاة أو زيت مركز"
                      className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#D8C8B8] mb-1.5">
                    الرائحة المستوحاة (Inspired By)
                  </label>
                  <input
                    type="text"
                    value={inspiredBy}
                    onChange={(e) => setInspiredBy(e.target.value)}
                    placeholder="مثال: رائحة مستوحاة من Sauvage الأيقوني"
                    className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                  />
                </div>

                <div>
                  <label className="block text-xs text-[#D8C8B8] mb-1.5">الوصف والتفاصيل</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="اكتب وصفاً جذاباً لمكونات العطر وفوحانه وثباته..."
                    className="w-full px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                  />
                </div>
              </div>

              {/* Section 2: Dynamic Sizes & Pricing */}
              <div className="space-y-4 pt-4 border-t border-[#D8C8B8]/15">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-[#D6B56A] uppercase tracking-wider block">
                    2. جدول الأحجام والأسعار الديناميكية (Multi-Sizes)
                  </span>
                  <span className="text-[11px] text-[#D8C8B8]">
                    العميل سيتمكن من اختيار أي حجم ويتغير السعر تلقائياً
                  </span>
                </div>

                {/* Sizes List */}
                <div className="space-y-2">
                  {sizeOptions.map((opt, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-[#332522] border border-[#D8C8B8]/15 rounded-xl gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-1 bg-[#241B18] border border-[#D8C8B8]/20 rounded-lg font-mono text-xs text-[#D6B56A] font-bold">
                          {opt.size}
                        </span>
                        <div className="text-xs">
                          <span className="font-mono text-[#FFF9F1] font-bold">{opt.price} د.ت</span>
                          {opt.originalPrice && (
                            <span className="font-mono text-[#D8C8B8]/60 line-through mr-2">
                              {opt.originalPrice} د.ت
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveSize(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg cursor-pointer"
                        title="حذف هذا الحجم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new size row */}
                <div className="p-3 bg-[#332522]/60 border border-dashed border-[#D6B56A]/40 rounded-xl space-y-2">
                  <span className="text-[11px] font-bold text-[#FFF9F1] block">
                    + إضافة حجم وسعر جديد لهذا العطر
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                    <input
                      type="text"
                      placeholder="الحجم (مثال: 15ml)"
                      value={newSizeLabel}
                      onChange={(e) => setNewSizeLabel(e.target.value)}
                      className="px-3 py-2 bg-[#241B18] border border-[#D8C8B8]/20 rounded-lg text-xs text-[#FFF9F1]"
                    />
                    <input
                      type="number"
                      placeholder="السعر بالدينار (د.ت)"
                      value={newSizePrice}
                      onChange={(e) => setNewSizePrice(e.target.value)}
                      className="px-3 py-2 bg-[#241B18] border border-[#D8C8B8]/20 rounded-lg text-xs text-[#FFF9F1]"
                    />
                    <input
                      type="number"
                      placeholder="السعر القديم (اختياري)"
                      value={newSizeOriginal}
                      onChange={(e) => setNewSizeOriginal(e.target.value)}
                      className="px-3 py-2 bg-[#241B18] border border-[#D8C8B8]/20 rounded-lg text-xs text-[#FFF9F1]"
                    />
                    <button
                      type="button"
                      onClick={handleAddSize}
                      className="py-2 bg-[#722F3F] hover:bg-[#8E3D50] text-[#D6B56A] font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة الحجم</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Section 3: Images & Gallery */}
              <div className="space-y-4 pt-4 border-t border-[#D8C8B8]/15">
                <span className="text-xs font-serif font-bold text-[#D6B56A] uppercase tracking-wider block">
                  3. الصور ومعرض الصور (Gallery)
                </span>

                <div>
                  <label className="block text-xs text-[#D8C8B8] mb-1.5">
                    رابط الصورة الرئيسية (أو ارفع ملف من جهازك) *
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="flex-1 px-3.5 py-2.5 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1] focus:outline-none focus:border-[#D6B56A]"
                    />
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-[#332522] border border-[#D6B56A]/40 hover:bg-[#D6B56A] hover:text-[#241B18] text-[#D6B56A] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Upload className="w-4 h-4" />
                      <span>رفع صورة</span>
                    </button>
                  </div>
                  {uploadStatus && (
                    <div className="text-[11px] text-[#D6B56A] mt-1">{uploadStatus}</div>
                  )}
                </div>

                {/* Primary Preview */}
                {imageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-[#332522] rounded-xl border border-[#D8C8B8]/15 w-fit">
                    <img
                      src={imageUrl}
                      alt="معاينة"
                      className="w-16 h-16 rounded-lg object-cover border border-[#D8C8B8]/20"
                    />
                    <span className="text-xs text-[#D8C8B8]">معاينة الصورة الرئيسية</span>
                  </div>
                )}

                {/* Gallery Images */}
                <div className="space-y-2">
                  <label className="block text-xs text-[#D8C8B8]">
                    صور إضافية لمعرض المنتج (Gallery)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newGalleryInput}
                      onChange={(e) => setNewGalleryInput(e.target.value)}
                      placeholder="أدخل رابط صورة إضافية..."
                      className="flex-1 px-3.5 py-2 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryImage}
                      className="px-4 py-2 bg-[#722F3F] text-[#D6B56A] font-bold text-xs rounded-xl cursor-pointer"
                    >
                      إضافة للمعرض
                    </button>
                  </div>

                  {galleryUrls.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {galleryUrls.map((url, idx) => (
                        <div key={idx} className="relative group">
                          <img
                            src={url}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover border border-[#D8C8B8]/20"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-[10px] cursor-pointer shadow"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Fragrance Pyramid Notes */}
              <div className="space-y-4 pt-4 border-t border-[#D8C8B8]/15">
                <span className="text-xs font-serif font-bold text-[#D6B56A] uppercase tracking-wider block">
                  4. هرم النوتات العطرية (Notes)
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-[#D8C8B8] mb-1">القمة (Top Notes)</label>
                    <input
                      type="text"
                      value={topNotes}
                      onChange={(e) => setTopNotes(e.target.value)}
                      placeholder="برغموت، فلفل وردي..."
                      className="w-full px-3 py-2 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#D8C8B8] mb-1">القلب (Heart Notes)</label>
                    <input
                      type="text"
                      value={heartNotes}
                      onChange={(e) => setHeartNotes(e.target.value)}
                      placeholder="خزامى، ياسمين، قرفة..."
                      className="w-full px-3 py-2 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#D8C8B8] mb-1">القاعدة (Base Notes)</label>
                    <input
                      type="text"
                      value={baseNotes}
                      onChange={(e) => setBaseNotes(e.target.value)}
                      placeholder="أمبروكسان، أرز، مسك..."
                      className="w-full px-3 py-2 bg-[#332522] border border-[#D8C8B8]/20 rounded-xl text-xs text-[#FFF9F1]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Badges & Status Switches */}
              <div className="space-y-4 pt-4 border-t border-[#D8C8B8]/15">
                <span className="text-xs font-serif font-bold text-[#D6B56A] uppercase tracking-wider block">
                  5. الشارات والحالة والظهور
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <label className="flex items-center gap-2 p-3 bg-[#332522] border border-[#D8C8B8]/15 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inStock}
                      onChange={(e) => setInStock(e.target.checked)}
                      className="w-4 h-4 accent-[#D6B56A]"
                    />
                    <span className="text-xs text-[#FFF9F1]">متوفر في المخزون</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-[#332522] border border-[#D8C8B8]/15 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isBestseller}
                      onChange={(e) => setIsBestseller(e.target.checked)}
                      className="w-4 h-4 accent-[#D6B56A]"
                    />
                    <span className="text-xs text-[#FFF9F1]">الأكثر مبيعاً</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-[#332522] border border-[#D8C8B8]/15 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSpecialOffer}
                      onChange={(e) => setIsSpecialOffer(e.target.checked)}
                      className="w-4 h-4 accent-[#D6B56A]"
                    />
                    <span className="text-xs text-[#FFF9F1]">عرض خاص</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 bg-[#332522] border border-[#D8C8B8]/15 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isNew}
                      onChange={(e) => setIsNew(e.target.checked)}
                      className="w-4 h-4 accent-[#D6B56A]"
                    />
                    <span className="text-xs text-[#FFF9F1]">إصدار جديد</span>
                  </label>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-6 border-t border-[#D8C8B8]/20">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#D6B56A] hover:bg-[#E5CA8A] text-[#241B18] font-bold text-xs rounded-xl transition-all shadow-lg cursor-pointer"
                >
                  {editingId ? 'حفظ التعديلات' : 'إضافة العطر للمتجر فورياً'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-[#332522] border border-[#D8C8B8]/20 hover:border-[#D8C8B8]/40 text-[#D8C8B8] text-xs font-bold rounded-xl transition-colors cursor-pointer"
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
