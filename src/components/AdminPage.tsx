import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
  FlaskConical,
  Package,
  ShoppingBag,
  LogOut,
  RefreshCw,
  Eye,
  Check,
  DollarSign,
  Tag,
  Sparkles,
  Sliders,
  MapPin,
  Phone,
  Calendar,
  Layers,
  ChevronRight,
  Smartphone,
  Laptop,
  Copy,
  Banknote,
  CreditCard
} from 'lucide-react';
import { Perfume, Order, OrderStatus, ProductSizeOption, HomepageSettings } from '../types';
import { DEFAULT_HOMEPAGE_SETTINGS } from '../data/perfumes';

interface AdminPageProps {
  isAdminLoggedIn: boolean;
  onLogin: () => void;
  onLogout: () => void;
  perfumes: Perfume[];
  onAddPerfume: (perfume: Perfume) => void;
  onUpdatePerfume: (perfume: Perfume) => void;
  onDeletePerfume: (id: number) => void;
  onResetDefaultPerfumes: () => void;
  orders: Order[];
  onUpdateOrderStatus: (trackingNumber: string, status: OrderStatus) => void;
  onBackToStore: () => void;
  homepageSettings?: HomepageSettings;
  onUpdateHomepageSettings?: (settings: HomepageSettings) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  isAdminLoggedIn,
  onLogin,
  onLogout,
  perfumes,
  onAddPerfume,
  onUpdatePerfume,
  onDeletePerfume,
  onResetDefaultPerfumes,
  orders,
  onUpdateOrderStatus,
  onBackToStore,
  homepageSettings,
  onUpdateHomepageSettings,
}) => {
  // Password Authentication
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'catalog' | 'editor' | 'inspection' | 'orders' | 'settings'>('catalog');

  // Search in catalog
  const [searchQuery, setSearchQuery] = useState('');

  // Editing state
  const [editingPerfumeId, setEditingPerfumeId] = useState<number | null>(null);

  // Inspection selected perfume
  const [inspectedPerfumeId, setInspectedPerfumeId] = useState<number>(() => {
    return perfumes.length > 0 ? perfumes[0].id : 1;
  });

  // Editor Form States
  const [formArabicName, setFormArabicName] = useState('');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formOriginalPrice, setFormOriginalPrice] = useState('');
  const [formBadge, setFormBadge] = useState('إصدار فاخر بتونس');
  const [formCategory, setFormCategory] = useState('عطور رجالية');
  const [formVolume, setFormVolume] = useState('30 ml (متوفر من 5ml إلى 100ml)');
  const [formFragranceType, setFormFragranceType] = useState('تركيبة عطرية مستوحاة');
  const [formInspiredBy, setFormInspiredBy] = useState('');
  const [formGender, setFormGender] = useState<'men' | 'women' | 'unisex'>('men');
  const [formDescription, setFormDescription] = useState('');
  const [formTopNote, setFormTopNote] = useState('');
  const [formHeartNote, setFormHeartNote] = useState('');
  const [formBaseNote, setFormBaseNote] = useState('');
  const [formInStock, setFormInStock] = useState(true);
  const [formBatchCode, setFormBatchCode] = useState('');

  // Multi-sizes dynamic state in editor
  const [formSizes, setFormSizes] = useState<ProductSizeOption[]>([
    { size: '5ml', price: 5, originalPrice: 7 },
    { size: '10ml', price: 8, originalPrice: 12 },
    { size: '20ml', price: 12, originalPrice: 16 },
    { size: '30ml', price: 16, originalPrice: 22 },
    { size: '50ml', price: 22, originalPrice: 30 },
    { size: '100ml', price: 35, originalPrice: 48 },
  ]);
  const [newSizeName, setNewSizeName] = useState('');
  const [newSizePrice, setNewSizePrice] = useState('');
  const [newSizeOriginalPrice, setNewSizeOriginalPrice] = useState('');

  // Homepage Settings Local State
  const [siteSettings, setSiteSettings] = useState<HomepageSettings>(() => {
    if (homepageSettings) return homepageSettings;
    try {
      const stored = localStorage.getItem('lina_homepage_settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return DEFAULT_HOMEPAGE_SETTINGS as HomepageSettings;
  });
  const [settingsSavedSuccess, setSettingsSavedSuccess] = useState(false);

  // Image upload options: 'file' | 'url'
  const [imageInputMode, setImageInputMode] = useState<'file' | 'url'>('url');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [imageUploadStatus, setImageUploadStatus] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // D17 Store Settings State (Persistent via LocalStorage + Server sync)
  const [d17AdminPhone, setD17AdminPhone] = useState(() => {
    try {
      return localStorage.getItem('lina_d17_phone') || '+216 55 889 900';
    } catch {
      return '+216 55 889 900';
    }
  });
  const [isUpdatingD17, setIsUpdatingD17] = useState(false);
  const [d17SuccessMsg, setD17SuccessMsg] = useState<string | null>(null);
  const [copiedTxId, setCopiedTxId] = useState<string | null>(null);

  // Fetch initial D17 settings from server if available
  React.useEffect(() => {
    fetch('/api/settings/d17')
      .then(async (res) => {
        const contentType = res.headers.get('content-type') || '';
        if (res.ok && contentType.includes('application/json')) {
          const data = await res.json();
          if (data.d17Settings?.recipientPhone) {
            setD17AdminPhone(data.d17Settings.recipientPhone);
            try {
              localStorage.setItem('lina_d17_phone', data.d17Settings.recipientPhone);
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveD17Phone = async (e?: React.FormEvent, customPhone?: string) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    setIsUpdatingD17(true);
    setD17SuccessMsg(null);
    const cleanPhone = (customPhone !== undefined ? customPhone : d17AdminPhone).trim();

    // 1. Immediately persist to localStorage so it works everywhere (Vercel, offline, etc.)
    try {
      localStorage.setItem('lina_d17_phone', cleanPhone);
      window.dispatchEvent(new CustomEvent('lina_d17_updated', { detail: cleanPhone }));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }

    // 2. Attempt server sync if backend API is available
    try {
      const adminToken = sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token';
      const res = await fetch('/api/settings/d17', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({
          recipientPhone: cleanPhone,
          adminPassword: 'aymen@2027',
        }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.d17Settings?.recipientPhone) {
          setD17AdminPhone(data.d17Settings.recipientPhone);
          try {
            localStorage.setItem('lina_d17_phone', data.d17Settings.recipientPhone);
          } catch {}
        }
      }
    } catch (err) {
      console.log('Server sync bypassed, saved in localStorage:', err);
    } finally {
      setIsUpdatingD17(false);
      setD17SuccessMsg('تم حفظ وتحديث رقم هاتف D17 للاستلام بنجاح!');
      setTimeout(() => setD17SuccessMsg(null), 4000);
    }
  };

  const handleCopyTx = (txId: string) => {
    navigator.clipboard.writeText(txId);
    setCopiedTxId(txId);
    setTimeout(() => setCopiedTxId(null), 2500);
  };

  // Password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPwd = password.trim();
    if (cleanPwd === 'aymen@2027') {
      setAuthError(false);
      setPassword('');
      sessionStorage.setItem('admin_token', 'admin_authenticated_session_token');
      onLogin();
      return;
    }

    // Also support checking via backend API
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: cleanPwd }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthError(false);
        setPassword('');
        sessionStorage.setItem('admin_token', data.token || 'admin_authenticated_session_token');
        onLogin();
        return;
      }
    } catch {
      // Fallback
    }

    setAuthError(true);
  };

  // Switch to Add New Perfume
  const handleStartAdd = () => {
    setEditingPerfumeId(null);
    setFormArabicName('');
    setFormName('');
    setFormPrice('16');
    setFormOriginalPrice('22');
    setFormBadge('الأكثر طلباً');
    setFormCategory('عطور رجالية');
    setFormVolume('30 ml (متوفر من 5ml إلى 100ml)');
    setFormFragranceType('تركيبة عطرية مستوحاة');
    setFormInspiredBy('');
    setFormGender('men');
    setFormDescription('تركيبة مستوحاة بدقة فائقة من الرائحة العالمية الشهيرة مع ثبات عالي وفوحان استثنائي.');
    setFormTopNote('برغموت إيطالي منعش، زهر الليمون');
    setFormHeartNote('أزهار ناعمة، خشب الأرز، بهارات خفيفة');
    setFormBaseNote('مسك أبيض فاخر، عنبر دافئ');
    setFormInStock(true);
    setFormBatchCode(`TN-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormSizes([
      { size: '5ml', price: 5, originalPrice: 7 },
      { size: '10ml', price: 8, originalPrice: 12 },
      { size: '20ml', price: 12, originalPrice: 16 },
      { size: '30ml', price: 16, originalPrice: 22 },
      { size: '50ml', price: 22, originalPrice: 30 },
      { size: '100ml', price: 35, originalPrice: 48 },
    ]);
    setFormImageUrl('');
    setImagePreview('');
    setImageInputMode('url');
    setImageUploadStatus('');
    setActiveTab('editor');
  };

  // Switch to Edit Existing Perfume
  const handleStartEdit = (perfume: Perfume) => {
    setEditingPerfumeId(perfume.id);
    setFormArabicName(perfume.arabicName);
    setFormName(perfume.name);
    setFormPrice(perfume.price.toString());
    setFormOriginalPrice(perfume.originalPrice ? perfume.originalPrice.toString() : '');
    setFormBadge(perfume.badge || 'الأكثر طلباً');
    setFormCategory(perfume.category || 'عطور رجالية');
    setFormVolume(perfume.volume || '30 ml (متوفر من 5ml إلى 100ml)');
    setFormFragranceType(perfume.fragranceType || 'تركيبة عطرية مستوحاة');
    setFormInspiredBy(perfume.inspiredBy || '');
    setFormGender((perfume.gender as any) || 'unisex');
    setFormDescription(perfume.description || '');
    setFormTopNote(perfume.notes?.top || '');
    setFormHeartNote(perfume.notes?.heart || '');
    setFormBaseNote(perfume.notes?.base || '');
    setFormInStock(perfume.inStock !== false);
    setFormBatchCode(perfume.batchCode || `TN-${Math.floor(1000 + Math.random() * 9000)}`);
    if (perfume.sizeOptions && perfume.sizeOptions.length > 0) {
      setFormSizes([...perfume.sizeOptions]);
    } else {
      setFormSizes([
        { size: '5ml', price: 5, originalPrice: 7 },
        { size: '10ml', price: 8, originalPrice: 12 },
        { size: '20ml', price: 12, originalPrice: 16 },
        { size: '30ml', price: perfume.price, originalPrice: perfume.originalPrice || perfume.price + 6 },
        { size: '50ml', price: 22, originalPrice: 30 },
        { size: '100ml', price: 35, originalPrice: 48 },
      ]);
    }
    setFormImageUrl(perfume.image || '');
    setImagePreview(perfume.image || '');
    setImageInputMode(perfume.image?.startsWith('data:') ? 'file' : 'url');
    setImageUploadStatus('');
    setActiveTab('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Local File Upload from PC or Phone
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPG, PNG, WEBP)');
      return;
    }

    setIsProcessingImage(true);
    setImageUploadStatus('جاري معالجة وتحسين الصورة...');

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize and optimize through Canvas to protect localStorage
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 900;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setFormImageUrl(compressedDataUrl);
          setImagePreview(compressedDataUrl);
          setImageUploadStatus(`تم تحميل الصورة بنجاح من جهازك (${file.name})`);
        } else {
          setFormImageUrl(event.target?.result as string);
          setImagePreview(event.target?.result as string);
          setImageUploadStatus('تم تحميل الصورة');
        }
        setIsProcessingImage(false);
      };
      img.onerror = () => {
        setIsProcessingImage(false);
        setImageUploadStatus('تعذر قراءة ملف الصورة');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Save Perfume (Add or Edit)
  const handleSavePerfume = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(formPrice);
    if (!formArabicName.trim() || isNaN(priceNum) || !formImageUrl.trim()) {
      alert('يرجى التأكد من ملء الاسم باللغة العربية، والسعر بالدينار التونسي، وتحديد صورة للعطر.');
      return;
    }

    const origPriceNum = formOriginalPrice ? parseFloat(formOriginalPrice) : priceNum + 40;

    if (editingPerfumeId !== null) {
      // Update Existing Perfume
      const existing = perfumes.find((p) => p.id === editingPerfumeId);
      const updated: Perfume = {
        id: editingPerfumeId,
        name: formName.trim() || existing?.name || 'Lina Luxury Scent',
        arabicName: formArabicName.trim(),
        badge: formBadge.trim() || 'الأكثر طلباً',
        category: formCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        volume: formVolume.trim() || '30 ml (متوفر من 5ml إلى 100ml)',
        rating: existing?.rating || 4.9,
        reviewsCount: existing?.reviewsCount || 10,
        image: formImageUrl.trim(),
        description: formDescription.trim() || 'تركيبة عطرية مستوحاة بدقة فائقة من أشهر الروائح مع ثبات يدوم طويلاً.',
        notes: {
          top: formTopNote.trim() || 'نوتات منعشة',
          heart: formHeartNote.trim() || 'أزهار نقية',
          base: formBaseNote.trim() || 'خشب ومسك',
        },
        inStock: formInStock,
        batchCode: formBatchCode.trim() || `TN-${Math.floor(1000 + Math.random() * 9000)}`,
        sizes: formSizes.map((s) => s.size),
        sizeOptions: formSizes,
        fragranceType: formFragranceType,
        inspiredBy: formInspiredBy.trim() || undefined,
        gender: formGender,
      };

      onUpdatePerfume(updated);
      setInspectedPerfumeId(updated.id);
      setActiveTab('catalog');
    } else {
      // Add New Perfume
      const newPerfume: Perfume = {
        id: Date.now(),
        name: formName.trim() || 'Lina Fragrance Edition',
        arabicName: formArabicName.trim(),
        badge: formBadge.trim() || 'جديد',
        category: formCategory,
        price: priceNum,
        originalPrice: origPriceNum,
        volume: formVolume.trim() || '30 ml (متوفر من 5ml إلى 100ml)',
        rating: 5.0,
        reviewsCount: 1,
        image: formImageUrl.trim(),
        description: formDescription.trim() || 'تركيبة عطرية مستوحاة بدقة فائقة من أشهر الروائح مع ثبات يدوم طويلاً.',
        notes: {
          top: formTopNote.trim() || 'برغموت منعش، زهر الليمون',
          heart: formHeartNote.trim() || 'أزهار نقية، خشب الأرز',
          base: formBaseNote.trim() || 'عنبر ملكي، مسك أبيض خالص',
        },
        inStock: formInStock,
        batchCode: formBatchCode.trim() || `TN-${Math.floor(1000 + Math.random() * 9000)}`,
        sizes: formSizes.map((s) => s.size),
        sizeOptions: formSizes,
        fragranceType: formFragranceType,
        inspiredBy: formInspiredBy.trim() || undefined,
        gender: formGender,
      };

      onAddPerfume(newPerfume);
      setInspectedPerfumeId(newPerfume.id);
      setActiveTab('catalog');
    }
  };

  // Filtered perfumes for catalog list
  const filteredPerfumes = perfumes.filter(
    (p) =>
      p.arabicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Active inspected perfume object
  const activeInspectedPerfume = perfumes.find((p) => p.id === inspectedPerfumeId) || perfumes[0];

  // -------------------------------------------------------------
  // 1. IF NOT LOGGED IN: Full-Page Security Gate
  // -------------------------------------------------------------
  if (!isAdminLoggedIn) {
    return (
      <div id="admin-login-page" className="min-h-screen bg-[#08080a] text-white flex flex-col justify-center items-center px-4 py-12">
        <div className="max-w-md w-full bg-[#101014] border border-[#d4af37]/40 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6 text-center">
          
          <button
            onClick={onBackToStore}
            className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-[#d4af37] transition-colors mb-2"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة إلى واجهة المتجر</span>
          </button>

          <div className="w-20 h-20 mx-auto rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] shadow-lg shadow-[#d4af37]/10">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs text-[#d4af37] font-semibold tracking-widest uppercase">
              Lina Shop Admin Portal
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white">
              لوحة تحكم المشرف الكاملة
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              يرجى تسجيل الدخول للوصول الكامل إلى تعديل العطور، رفع الصور من الجهاز، فحص الجودة والمخزون، ومتابعة طلبيات تونس.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2">
            <div className="text-right">
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                كلمة مرور المشرف:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError(false);
                }}
                placeholder="أدخل كلمة مرور المشرف السرية"
                className="w-full px-4 py-3 rounded-xl bg-[#08080a] border border-white/10 text-white placeholder-neutral-500 text-sm focus:border-[#d4af37] focus:outline-none transition-colors text-center"
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs flex items-center justify-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>كلمة المرور غير صحيحة. يرجى التأكد وإعادة المحاولة.</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#08080a] font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#d4af37]/20 active:scale-98"
            >
              تسجيل الدخول إلى لوحة التحكم
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // 2. LOGGED IN: Full-Page Admin Dashboard
  // -------------------------------------------------------------
  return (
    <div id="admin-full-page" className="min-h-screen bg-[#08080a] text-white flex flex-col selection:bg-[#d4af37] selection:text-[#08080a]">
      
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-[#101014]/95 backdrop-blur-md border-b border-[#d4af37]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
          
          {/* Brand & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="p-2 bg-[#17171d] hover:bg-[#d4af37] hover:text-[#08080a] rounded-xl border border-white/10 text-neutral-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="الرجوع إلى المتجر"
            >
              <ArrowRight className="w-4 h-4" />
              <span className="hidden sm:inline">العودة للمتجر</span>
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-bold text-white font-serif">
                    لوحة المشرف - Lina Shop تونس
                  </h1>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    نشط
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 hidden sm:block">
                  إدارة العطور، رفع الصور محلياً ومن الروابط، وفحص العطور وطلبيات الـ 24 ولاية
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleStartAdd}
              className="px-3.5 py-2 bg-[#d4af37] hover:bg-[#e5ca78] text-[#08080a] font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#d4af37]/20"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة عطر جديد</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl text-xs transition-colors flex items-center gap-1.5"
              title="تسجيل الخروج من لوحة التحكم"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">خروج</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-white/5 flex items-center overflow-x-auto gap-1 py-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'catalog'
                ? 'bg-[#d4af37] text-[#08080a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>قائمة العطور والمخزون ({perfumes.length})</span>
          </button>

          <button
            onClick={() => {
              if (editingPerfumeId === null) handleStartAdd();
              else setActiveTab('editor');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'editor'
                ? 'bg-[#d4af37] text-[#08080a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>{editingPerfumeId ? 'تعديل بيانات العطر' : 'إضافة عطر جديد'}</span>
          </button>

          <button
            onClick={() => setActiveTab('inspection')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'inspection'
                ? 'bg-[#d4af37] text-[#08080a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FlaskConical className="w-4 h-4" />
            <span>مختبر فحص العطور والجودة</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#d4af37] text-[#08080a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>طلبيات تونس ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#d4af37] text-[#08080a] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>إعدادات المتجر ونصوص الموقع</span>
          </button>
        </div>
      </header>

      {/* Main Admin Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ========================================================= */}
        {/* TAB 1: Perfumes Catalog List & Management                */}
        {/* ========================================================= */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            
            {/* Top Stat Overview Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-[#101014] border border-white/5 rounded-2xl p-4">
                <span className="text-xs text-neutral-400 block">إجمالي العطور</span>
                <span className="text-2xl sm:text-3xl font-bold text-white font-serif mt-1 block">
                  {perfumes.length}
                </span>
                <span className="text-[11px] text-[#d4af37] mt-1 block">في قاعدة البيانات</span>
              </div>

              <div className="bg-[#101014] border border-white/5 rounded-2xl p-4">
                <span className="text-xs text-neutral-400 block">حالة التوفر</span>
                <span className="text-2xl sm:text-3xl font-bold text-emerald-400 font-serif mt-1 block">
                  {perfumes.filter((p) => p.inStock !== false).length}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1 block">جاهز للشحن الفوري</span>
              </div>

              <div className="bg-[#101014] border border-white/5 rounded-2xl p-4">
                <span className="text-xs text-neutral-400 block">متوسط السعر</span>
                <span className="text-2xl sm:text-3xl font-bold text-[#d4af37] font-sans mt-1 block">
                  {perfumes.length > 0
                    ? Math.round(perfumes.reduce((acc, p) => acc + p.price, 0) / perfumes.length)
                    : 0}{' '}
                  <span className="text-sm font-normal text-neutral-400">د.ت</span>
                </span>
                <span className="text-[11px] text-neutral-500 mt-1 block">بالدينار التونسي</span>
              </div>

              <div className="bg-[#101014] border border-white/5 rounded-2xl p-4">
                <span className="text-xs text-neutral-400 block">الطلبات المسجلة</span>
                <span className="text-2xl sm:text-3xl font-bold text-white font-serif mt-1 block">
                  {orders.length}
                </span>
                <span className="text-[11px] text-neutral-500 mt-1 block">في ولايات تونس الـ 24</span>
              </div>
            </div>

            {/* Catalog Control Bar */}
            <div className="bg-[#101014] border border-white/10 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ابحث بالاسم العربي أو الإنجليزي أو الصنف..."
                  className="w-full pr-10 pl-4 py-2 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                <button
                  onClick={handleStartAdd}
                  className="px-4 py-2 bg-[#d4af37] hover:bg-[#e5ca78] text-[#08080a] font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-[#d4af37]/20"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة عطر جديد</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('هل أنت متأكد من استعادة العطور الأساسية الأربعة الافتراضية؟')) {
                      onResetDefaultPerfumes();
                    }
                  }}
                  className="px-3 py-2 bg-[#17171d] hover:bg-white/10 text-neutral-400 hover:text-white rounded-xl text-xs border border-white/10 transition-colors flex items-center gap-1.5"
                  title="استعادة العطور الافتراضية"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>استعادة الافتراضي</span>
                </button>
              </div>
            </div>

            {/* Perfumes Table / Cards */}
            <div className="space-y-3">
              {filteredPerfumes.length === 0 ? (
                <div className="text-center py-16 bg-[#101014] rounded-2xl border border-white/5 space-y-3">
                  <Package className="w-10 h-10 text-neutral-500 mx-auto" />
                  <p className="text-neutral-300 text-sm">لم يتم العثور على أي عطور مطابقة للبحث.</p>
                  <button
                    onClick={handleStartAdd}
                    className="px-4 py-2 bg-[#d4af37] text-[#08080a] font-bold rounded-xl text-xs inline-flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>إضافة أول عطر الآن</span>
                  </button>
                </div>
              ) : (
                filteredPerfumes.map((perfume) => (
                  <div
                    key={perfume.id}
                    className="bg-[#101014] border border-white/10 hover:border-[#d4af37]/40 rounded-2xl p-4 sm:p-5 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    {/* Left: Thumbnail & Info */}
                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-[#08080a] border border-white/10 shrink-0">
                        <img
                          src={perfume.image}
                          alt={perfume.arabicName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute(
                              'src',
                              'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600'
                            );
                          }}
                        />
                        {perfume.badge && (
                          <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] text-[#d4af37] font-semibold">
                            {perfume.badge}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-base font-bold text-white font-serif">
                            {perfume.arabicName}
                          </h3>
                          <span className="text-xs text-neutral-400 font-sans">
                            ({perfume.name})
                          </span>
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-neutral-300 text-[10px] rounded-full">
                            {perfume.category}
                          </span>
                        </div>

                        <p className="text-xs text-neutral-400 line-clamp-1 max-w-xl">
                          {perfume.description}
                        </p>

                        <div className="flex items-center gap-3 text-xs pt-1">
                          <span className="text-[#d4af37] font-bold font-sans">
                            {perfume.price} د.ت
                          </span>
                          {perfume.originalPrice > perfume.price && (
                            <span className="text-neutral-500 line-through font-sans">
                              {perfume.originalPrice} د.ت
                            </span>
                          )}
                          <span className="text-neutral-500">•</span>
                          <span className="text-neutral-400 text-[11px] font-sans">
                            {perfume.volume}
                          </span>
                          <span className="text-neutral-500">•</span>
                          <span className={`text-[11px] ${perfume.inStock !== false ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {perfume.inStock !== false ? '● متوفر بالمخزن' : '○ غير متوفر'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-white/5">
                      <button
                        onClick={() => {
                          setInspectedPerfumeId(perfume.id);
                          setActiveTab('inspection');
                        }}
                        className="px-3 py-2 bg-[#17171d] hover:bg-[#23232b] text-neutral-300 hover:text-[#d4af37] rounded-xl text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5"
                        title="فحص العطر وهرم النوتات"
                      >
                        <FlaskConical className="w-3.5 h-3.5 text-[#d4af37]" />
                        <span>فحص العطر</span>
                      </button>

                      <button
                        onClick={() => handleStartEdit(perfume)}
                        className="px-3 py-2 bg-[#d4af37]/10 hover:bg-[#d4af37] text-[#d4af37] hover:text-[#08080a] rounded-xl text-xs font-bold border border-[#d4af37]/30 transition-all flex items-center gap-1.5"
                        title="تعديل صورة واسم وسعر العطر"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>تعديل العطر</span>
                      </button>

                      <button
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف عطر "${perfume.arabicName}" نهائياً من المتجر؟`)) {
                            onDeletePerfume(perfume.id);
                          }
                        }}
                        className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-colors"
                        title="حذف العطر"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: Advanced Perfume Editor (Edit Name, Image, etc.)   */}
        {/* ========================================================= */}
        {activeTab === 'editor' && (
          <div className="bg-[#101014] border border-[#d4af37]/30 rounded-3xl p-6 sm:p-8 space-y-8 shadow-2xl">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-[#d4af37] tracking-wider uppercase">
                  {editingPerfumeId ? 'محرر العطور الفاخرة' : 'إضافة عطر جديد'}
                </span>
                <h2 className="text-2xl font-bold font-serif text-white mt-1">
                  {editingPerfumeId
                    ? `تعديل عطر: ${formArabicName || 'العطر المحدد'}`
                    : 'إضافة عطر فاخر جديد إلى المتجر'}
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  يمكنك تغيير صورة العطر (من رابط أو محلياً من هاتفك/كمبيوترك)، وتعديل الاسم باللغتين، والأسعار والنوتات.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 bg-[#17171d] hover:bg-white/10 text-neutral-300 rounded-xl text-xs border border-white/10 transition-colors"
                >
                  إلغاء والرجوع للقائمة
                </button>
              </div>
            </div>

            <form onSubmit={handleSavePerfume} className="space-y-8">
              
              {/* 1. Image Upload & Selection Section */}
              <div className="space-y-4 p-5 rounded-2xl bg-[#08080a] border border-white/10">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-[#d4af37]" />
                    <h3 className="text-sm font-bold text-white">
                      صورة العطر (من الهاتف أو الكمبيوتر أو رابط ويب) *
                    </h3>
                  </div>

                  {/* Mode switcher tabs */}
                  <div className="flex items-center gap-1 bg-[#17171d] p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setImageInputMode('file')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        imageInputMode === 'file'
                          ? 'bg-[#d4af37] text-[#08080a]'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>رفع من الجهاز (هاتف/كمبيوتر)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageInputMode('url')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                        imageInputMode === 'url'
                          ? 'bg-[#d4af37] text-[#08080a]'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>رابط ويب مباشر (URL)</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                  
                  {/* Left (or Right in RTL): Upload Inputs */}
                  <div className="md:col-span-2 space-y-4">
                    {imageInputMode === 'file' ? (
                      <div className="space-y-3">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                          id="perfume-image-file-input"
                        />
                        
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-[#d4af37]/40 hover:border-[#d4af37] bg-[#101014] hover:bg-[#15151c] rounded-2xl p-6 text-center cursor-pointer transition-all space-y-3"
                        >
                          <div className="w-14 h-14 mx-auto rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37]">
                            <Upload className="w-7 h-7" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">
                              انقر هنا لاختيار صورة من هاتفك أو جهاز الكمبيوتر
                            </p>
                            <p className="text-xs text-neutral-400 mt-1">
                              يدعم ملفات JPG, PNG, WEBP من ألبوم الصور أو الكاميرا مباشرة
                            </p>
                          </div>
                          <div className="inline-flex items-center gap-3 text-[11px] text-neutral-400 pt-1">
                            <span className="flex items-center gap-1">
                              <Smartphone className="w-3.5 h-3.5 text-[#d4af37]" /> هاتف ذكي
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Laptop className="w-3.5 h-3.5 text-[#d4af37]" /> كمبيوتر محمول
                            </span>
                          </div>
                        </div>

                        {imageUploadStatus && (
                          <p className="text-xs text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span>{imageUploadStatus}</span>
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-semibold text-neutral-300 mb-1">
                            أدخل رابط الصورة المباشر (Image URL):
                          </label>
                          <div className="relative">
                            <input
                              type="url"
                              value={formImageUrl}
                              onChange={(e) => {
                                setFormImageUrl(e.target.value);
                                setImagePreview(e.target.value);
                              }}
                              placeholder="https://images.unsplash.com/photo-..."
                              dir="ltr"
                              className="w-full px-4 py-2.5 rounded-xl bg-[#101014] border border-white/10 text-white text-xs font-mono focus:border-[#d4af37] focus:outline-none transition-colors text-left"
                            />
                          </div>
                        </div>

                        {/* Quick Presets for high-end perfume images */}
                        <div>
                          <span className="text-[11px] text-neutral-400 block mb-1.5">
                            أو اختر من صور العطور الفاخرة المقترحة:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {[
                              { label: 'عود أسود نيش', url: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800' },
                              { label: 'عنبر ذهبي ناصع', url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&q=80&w=800' },
                              { label: 'مسك نقي كريستالي', url: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=800' },
                              { label: 'روز مخملي ملكي', url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&q=80&w=800' }
                            ].map((preset, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => {
                                  setFormImageUrl(preset.url);
                                  setImagePreview(preset.url);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-[#101014] hover:bg-[#d4af37] hover:text-[#08080a] text-neutral-300 text-[11px] border border-white/10 transition-colors"
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Image Preview Box */}
                  <div className="bg-[#101014] border border-white/10 rounded-2xl p-3 text-center space-y-2">
                    <span className="text-[11px] text-neutral-400 block">معاينة صورة العطر:</span>
                    <div className="w-full h-44 rounded-xl bg-[#08080a] border border-white/5 overflow-hidden flex items-center justify-center relative">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="معاينة العطر"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLElement).setAttribute(
                              'src',
                              'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600'
                            );
                          }}
                        />
                      ) : (
                        <div className="text-neutral-500 text-xs space-y-1">
                          <ImageIcon className="w-8 h-8 mx-auto opacity-40" />
                          <p>لا توجد صورة محددة</p>
                        </div>
                      )}

                      {isProcessingImage && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                          <RefreshCw className="w-6 h-6 text-[#d4af37] animate-spin" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Names & Categorization */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#d4af37] flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>اسم العطر وتصنيفه وشارات العرض</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      اسم العطر بالعربية *
                    </label>
                    <input
                      type="text"
                      required
                      value={formArabicName}
                      onChange={(e) => setFormArabicName(e.target.value)}
                      placeholder="مثال: عود قرطاج الفاخر"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      الاسم باللغة الإنجليزية / اللاتينية
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="مثال: Carthage Royal Oud"
                      dir="ltr"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors text-left"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      التصنيف *
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="عطور رجالية" className="bg-[#101014]">عطور رجالية</option>
                      <option value="عطور نسائية" className="bg-[#101014]">عطور نسائية</option>
                      <option value="عطور للجنسين" className="bg-[#101014]">عطور للجنسين</option>
                      <option value="العطور الزيتية" className="bg-[#101014]">العطور الزيتية</option>
                      <option value="عطور النيش" className="bg-[#101014]">عطور النيش</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      الجنس المستهدف
                    </label>
                    <select
                      value={formGender}
                      onChange={(e) => setFormGender(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="men" className="bg-[#101014]">رجالي (Men)</option>
                      <option value="women" className="bg-[#101014]">نسائي (Women)</option>
                      <option value="unisex" className="bg-[#101014]">للجنسين (Unisex)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      نوع المستحضر العطري
                    </label>
                    <select
                      value={formFragranceType}
                      onChange={(e) => setFormFragranceType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors cursor-pointer"
                    >
                      <option value="تركيبة عطرية مستوحاة" className="bg-[#101014]">تركيبة عطرية مستوحاة</option>
                      <option value="عطر زيتي مركز" className="bg-[#101014]">عطر زيتي مركز</option>
                      <option value="مسك مركز نقي" className="bg-[#101014]">مسك مركز نقي</option>
                      <option value="عطر بخاخ مخفف" className="bg-[#101014]">عطر بخاخ مخفف</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      شارة العطر (Badge)
                    </label>
                    <input
                      type="text"
                      value={formBadge}
                      onChange={(e) => setFormBadge(e.target.value)}
                      placeholder="مثال: الأكثر طلباً، عرض خاص، جديد"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      الرائحة المستوحاة (الشفافية للمشتري)
                    </label>
                    <input
                      type="text"
                      value={formInspiredBy}
                      onChange={(e) => setFormInspiredBy(e.target.value)}
                      placeholder="مثال: رائحة مستوحاة من Sauvage الشهير أو Baccarat Rouge"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      * يرجى استخدام صياغات شفافة مثل: "تركيبة مستوحاة من..." أو "رائحة مستوحاة من..."
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      نص السعة المعروض
                    </label>
                    <input
                      type="text"
                      value={formVolume}
                      onChange={(e) => setFormVolume(e.target.value)}
                      placeholder="30 ml (متوفر من 5ml إلى 100ml)"
                      dir="rtl"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Pricing in TND */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#d4af37] flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>السعر الافتراضي وحالة المخزون</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      سعر البيع الافتراضي (د.ت) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        step="0.1"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="16"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors font-sans"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                        د.ت
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      السعر الأصلي قبل الخصم (د.ت)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.1"
                        value={formOriginalPrice}
                        onChange={(e) => setFormOriginalPrice(e.target.value)}
                        placeholder="22"
                        className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-sm focus:border-[#d4af37] focus:outline-none transition-colors font-sans"
                      />
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                        د.ت
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      حالة التوفر في المخزن
                    </label>
                    <button
                      type="button"
                      onClick={() => setFormInStock(!formInStock)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                        formInStock
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}
                    >
                      <span className={`w-2 h-2 rounded-full ${formInStock ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                      <span>{formInStock ? 'متوفر للطلب المباشر' : 'غير متوفر (نفد مؤقتاً)'}</span>
                    </button>
                  </div>
                </div>

                {/* 3.1 Dynamic Multiple Sizes & Prices Section */}
                <div className="p-4 rounded-2xl bg-[#0c0c10] border border-white/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#d4af37]" />
                        <span>إدارة الأحجام المتعددة والأسعار لهذا العطر ({formSizes.length} أحجام)</span>
                      </h4>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        يتيح للزبون التونسي اختيار الحجم المناسب (من 5ml إلى 100ml) وسيتغير السعر تلقائياً
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setFormSizes([
                          { size: '5ml', price: 5, originalPrice: 7 },
                          { size: '10ml', price: 8, originalPrice: 12 },
                          { size: '20ml', price: 12, originalPrice: 16 },
                          { size: '30ml', price: parseFloat(formPrice) || 16, originalPrice: parseFloat(formOriginalPrice) || 22 },
                          { size: '50ml', price: 22, originalPrice: 30 },
                          { size: '100ml', price: 35, originalPrice: 48 },
                        ]);
                      }}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#d4af37]/15 text-[#d4af37] hover:bg-[#d4af37] hover:text-black font-semibold transition-colors border border-[#d4af37]/30 self-start sm:self-auto cursor-pointer"
                    >
                      تعبئة الأحجام القياسية (5, 10, 20, 30, 50, 100ml)
                    </button>
                  </div>

                  {/* Size List */}
                  <div className="space-y-2">
                    {formSizes.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-2.5 rounded-xl bg-[#14141c] border border-white/5"
                      >
                        <span className="w-16 px-2 py-1 rounded bg-[#d4af37]/20 text-[#d4af37] text-xs font-bold text-center">
                          {s.size}
                        </span>

                        <div className="flex items-center gap-2 flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-neutral-400">السعر:</span>
                            <input
                              type="number"
                              step="0.5"
                              value={s.price}
                              onChange={(e) => {
                                const newPrice = parseFloat(e.target.value) || 0;
                                setFormSizes((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, price: newPrice } : item))
                                );
                              }}
                              className="w-20 px-2 py-1 rounded bg-[#08080a] border border-white/10 text-white text-xs font-mono text-center"
                            />
                            <span className="text-[10px] text-neutral-400">د.ت</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <span className="text-[10px] text-neutral-400">السعر القديم:</span>
                            <input
                              type="number"
                              step="0.5"
                              value={s.originalPrice || ''}
                              placeholder="اختياري"
                              onChange={(e) => {
                                const newOrig = e.target.value ? parseFloat(e.target.value) : undefined;
                                setFormSizes((prev) =>
                                  prev.map((item, i) => (i === idx ? { ...item, originalPrice: newOrig } : item))
                                );
                              }}
                              className="w-20 px-2 py-1 rounded bg-[#08080a] border border-white/10 text-white text-xs font-mono text-center"
                            />
                            <span className="text-[10px] text-neutral-400">د.ت</span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setFormSizes((prev) => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
                          title="حذف هذا الحجم"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add New Size Custom Row */}
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5">
                    <input
                      type="text"
                      placeholder="اسم الحجم (مثال: 15ml)"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                      className="w-32 px-3 py-1.5 rounded-lg bg-[#08080a] border border-white/10 text-white text-xs"
                    />
                    <input
                      type="number"
                      step="0.5"
                      placeholder="السعر (د.ت)"
                      value={newSizePrice}
                      onChange={(e) => setNewSizePrice(e.target.value)}
                      className="w-24 px-3 py-1.5 rounded-lg bg-[#08080a] border border-white/10 text-white text-xs"
                    />
                    <input
                      type="number"
                      step="0.5"
                      placeholder="السعر القديم (د.ت)"
                      value={newSizeOriginalPrice}
                      onChange={(e) => setNewSizeOriginalPrice(e.target.value)}
                      className="w-28 px-3 py-1.5 rounded-lg bg-[#08080a] border border-white/10 text-white text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSizeName.trim() || !newSizePrice) return;
                        setFormSizes((prev) => [
                          ...prev,
                          {
                            size: newSizeName.trim(),
                            price: parseFloat(newSizePrice),
                            originalPrice: newSizeOriginalPrice ? parseFloat(newSizeOriginalPrice) : undefined,
                          },
                        ]);
                        setNewSizeName('');
                        setNewSizePrice('');
                        setNewSizeOriginalPrice('');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#d4af37] text-black font-bold text-xs hover:bg-[#e5ca78] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>إضافة الحجم</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 4. Fragrance Pyramid & Description */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-[#d4af37] flex items-center gap-2">
                  <Layers className="w-4 h-4" />
                  <span>الهرم العطري والوصف التفصيلي</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      نوتات القمة (Top Notes)
                    </label>
                    <input
                      type="text"
                      value={formTopNote}
                      onChange={(e) => setFormTopNote(e.target.value)}
                      placeholder="زهر البرتقال التونسي، برغموت ناصع..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      نوتات القلب (Heart Notes)
                    </label>
                    <input
                      type="text"
                      value={formHeartNote}
                      onChange={(e) => setFormHeartNote(e.target.value)}
                      placeholder="ياسمين سامباك، سوسن..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      نوتات القاعدة (Base Notes)
                    </label>
                    <input
                      type="text"
                      value={formBaseNote}
                      onChange={(e) => setFormBaseNote(e.target.value)}
                      placeholder="مسك أبيض ملكي، عنبر، خشب الصندل..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    الوصف الترويجي للعطر
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="تركيبة عطرية نادرة تم ابتكارها لتمنحك حضوراً آسراً في كافة المناسبات..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#08080a] font-bold rounded-xl text-sm transition-all shadow-lg shadow-[#d4af37]/20 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPerfumeId ? 'حفظ كافة التعديلات على العطر' : 'إضافة العطر للمتجر فورياً'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('catalog')}
                  className="w-full sm:w-auto px-6 py-3.5 bg-[#17171d] hover:bg-white/10 text-neutral-300 rounded-xl text-xs transition-colors border border-white/10"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: Perfume Inspection & Quality Lab                   */}
        {/* ========================================================= */}
        {activeTab === 'inspection' && (
          <div className="space-y-6">
            
            {/* Header & Perfume Selector */}
            <div className="bg-[#101014] border border-white/10 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-[#d4af37]" />
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                    مختبر فحص العطور والجودة (Perfume Inspection Lab)
                  </h2>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  أداة المشرف لفحص مكونات الهرم العطري، دقة صورة الزجاجة، شهادات الدفعات، وهوامش الربح بالدينار التونسي.
                </p>
              </div>

              {/* Select perfume to inspect */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-xs text-neutral-400 shrink-0">اختر عطر للفحص:</span>
                <select
                  value={inspectedPerfumeId}
                  onChange={(e) => setInspectedPerfumeId(Number(e.target.value))}
                  className="w-full md:w-64 px-3 py-2 rounded-xl bg-[#08080a] border border-[#d4af37]/40 text-white text-xs focus:border-[#d4af37] focus:outline-none transition-colors cursor-pointer"
                >
                  {perfumes.map((p) => (
                    <option key={p.id} value={p.id} className="bg-[#101014]">
                      {p.arabicName} ({p.price} د.ت)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Inspection Details View */}
            {activeInspectedPerfume && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Visual & Bottle Check */}
                <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                      فحص المظهر والصورة
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      مطابق للمواصفات
                    </span>
                  </div>

                  <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-[#08080a] border border-white/10 group">
                    <img
                      src={activeInspectedPerfume.image}
                      alt={activeInspectedPerfume.arabicName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                      <div className="text-right">
                        <span className="text-xs font-bold text-white font-serif block">
                          {activeInspectedPerfume.arabicName}
                        </span>
                        <span className="text-[11px] text-neutral-300 font-sans">
                          {activeInspectedPerfume.volume}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-neutral-400">رمز الدفعة (Batch Code):</span>
                      <span className="text-[#d4af37] font-mono font-bold">
                        {activeInspectedPerfume.batchCode || 'TN-BATCH-2026'}
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-neutral-400">نوع التركيز:</span>
                      <span className="text-white font-semibold">Extrait de Parfum (28%)</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-neutral-400">الثبات المقدر:</span>
                      <span className="text-emerald-400 font-semibold">14 - 18 ساعة على الملابس</span>
                    </div>

                    <div className="flex justify-between py-2 border-b border-white/5">
                      <span className="text-neutral-400">الفوحان (Sillage):</span>
                      <span className="text-white font-semibold">قوي وجذاب (2 متر)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStartEdit(activeInspectedPerfume)}
                    className="w-full py-2.5 bg-[#17171d] hover:bg-[#d4af37] hover:text-[#08080a] text-neutral-300 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 border border-white/10"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>تعديل هذا العطر وصورته</span>
                  </button>
                </div>

                {/* Center Column: Olfactory Scent Pyramid */}
                <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                      فحص الهرم العطري والنوتات
                    </span>
                    <span className="text-xs text-neutral-400">3 طبقات عطرية</span>
                  </div>

                  {/* Visual Pyramid */}
                  <div className="space-y-4 pt-2">
                    
                    {/* Top Note */}
                    <div className="p-4 rounded-2xl bg-[#08080a] border border-[#d4af37]/30 space-y-1.5 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#d4af37] uppercase">
                          1. نوتات القمة (Top Notes)
                        </span>
                        <span className="text-[10px] text-neutral-400">أول 30 دقيقة</span>
                      </div>
                      <p className="text-xs text-white leading-relaxed">
                        {activeInspectedPerfume.notes?.top || 'برغموت ناصع ونفحات زهر البرتقال'}
                      </p>
                    </div>

                    {/* Heart Note */}
                    <div className="p-4 rounded-2xl bg-[#08080a] border border-white/15 space-y-1.5 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-amber-300 uppercase">
                          2. قلب العطر (Heart Notes)
                        </span>
                        <span className="text-[10px] text-neutral-400">ساعتان إلى 6 ساعات</span>
                      </div>
                      <p className="text-xs text-white leading-relaxed">
                        {activeInspectedPerfume.notes?.heart || 'ياسمين، سوسن، خشب الصندل'}
                      </p>
                    </div>

                    {/* Base Note */}
                    <div className="p-4 rounded-2xl bg-[#08080a] border border-white/15 space-y-1.5 relative overflow-hidden">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-orange-300 uppercase">
                          3. قاعدة العطر (Base Notes)
                        </span>
                        <span className="text-[10px] text-neutral-400">حتى 18 ساعة</span>
                      </div>
                      <p className="text-xs text-white leading-relaxed">
                        {activeInspectedPerfume.notes?.base || 'مسك ملكي، عنبر نقي، خشب الأرز'}
                      </p>
                    </div>
                  </div>

                  {/* Description Box */}
                  <div className="p-4 rounded-2xl bg-[#08080a] border border-white/5 space-y-1 text-xs">
                    <span className="text-[11px] font-semibold text-neutral-400 block">
                      الوصف المعروض في المتجر:
                    </span>
                    <p className="text-neutral-300 leading-relaxed">
                      {activeInspectedPerfume.description}
                    </p>
                  </div>
                </div>

                {/* Right Column: Pricing, Profit & Customer Live Preview */}
                <div className="bg-[#101014] border border-white/10 rounded-3xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#d4af37] uppercase tracking-wider">
                      التسعير والعرض للحريف
                    </span>
                    <span className="text-xs text-neutral-400 font-sans">تونس (TND)</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#08080a] border border-white/5 space-y-3">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-neutral-400">سعر البيع النهائي:</span>
                      <span className="text-xl font-bold text-[#d4af37] font-sans">
                        {activeInspectedPerfume.price} د.ت
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline">
                      <span className="text-xs text-neutral-400">السعر قبل الخصم:</span>
                      <span className="text-sm text-neutral-500 line-through font-sans">
                        {activeInspectedPerfume.originalPrice} د.ت
                      </span>
                    </div>

                    <div className="flex justify-between items-baseline pt-2 border-t border-white/5">
                      <span className="text-xs text-neutral-400">نسبة الخصم المعروضة:</span>
                      <span className="text-xs text-emerald-400 font-bold">
                        وفر {activeInspectedPerfume.originalPrice - activeInspectedPerfume.price} د.ت (
                        {Math.round(
                          ((activeInspectedPerfume.originalPrice - activeInspectedPerfume.price) /
                            activeInspectedPerfume.originalPrice) *
                            100
                        )}
                        %)
                      </span>
                    </div>
                  </div>

                  {/* Customer Card Simulation */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-neutral-400 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-[#d4af37]" />
                      <span>محاكاة مظهر البطاقة في المتجر:</span>
                    </span>

                    <div className="p-4 rounded-2xl bg-[#08080a] border border-[#d4af37]/30 space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-black shrink-0 border border-white/10">
                          <img
                            src={activeInspectedPerfume.image}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white font-serif">
                            {activeInspectedPerfume.arabicName}
                          </h4>
                          <span className="text-[11px] text-[#d4af37] font-sans font-bold">
                            {activeInspectedPerfume.price} د.ت
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] text-neutral-400 bg-white/5 px-2 py-0.5 rounded">
                          توصيل لكافة الـ 24 ولاية
                        </span>
                        <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                          دفع عند الاستلام
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={onBackToStore}
                    className="w-full py-3 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#08080a] font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <span>معاينة في المتجر الآن</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: Tunisia Orders & Delivery Management               */}
        {/* ========================================================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            {/* Top Orders Header */}
            <div className="bg-[#101014] border border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#d4af37]" />
                  <h2 className="text-lg sm:text-xl font-bold font-serif text-white">
                    إدارة طلبيات تونس وتحديث الشحنات ({orders.length})
                  </h2>
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  متابعة وتحديث حالات بوليصات الشحن التونسية، المعتمديات، والتسليم مع الدفع عند الاستلام وتطبيق D17.
                </p>
              </div>

              <div className="text-xs text-neutral-400 bg-[#08080a] px-3 py-2 rounded-xl border border-white/5">
                <span>إجمالي مبيعات الطلبات: </span>
                <strong className="text-[#d4af37] font-sans">
                  {orders.reduce((acc, o) => acc + o.total, 0).toLocaleString()} د.ت
                </strong>
              </div>
            </div>

            {/* D17 Recipient Phone Configuration Card (Configurable Variable) */}
            <div className="bg-[#101014] border border-[#d4af37]/30 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/5 pb-3">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span>إعدادات رقم هاتف استقبال أموال D17 (البريد التونسي)</span>
                    <p className="text-[11px] text-neutral-400 font-normal">
                      هذا الرقم يظهر للحرفاء عند اختيار الدفع عبر تطبيق D17 لإرسال الأموال عليه
                    </p>
                  </div>
                </div>

                {d17SuccessMsg && (
                  <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1 rounded-lg">
                    {d17SuccessMsg}
                  </span>
                )}
              </div>

              <form onSubmit={handleSaveD17Phone} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <div className="relative flex-1">
                  <label className="block text-[11px] text-neutral-400 mb-1">
                    رقم هاتف متجر لينا لاستقبال تحويلات D17 (متغير قابل للتعديل):
                  </label>
                  <input
                    type="text"
                    required
                    value={d17AdminPhone}
                    onChange={(e) => setD17AdminPhone(e.target.value)}
                    placeholder="+216 XX XXX XXX"
                    dir="ltr"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/15 text-white font-mono text-sm focus:border-[#d4af37] focus:outline-none transition-colors text-left"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isUpdatingD17}
                  className="sm:self-end px-5 py-2.5 bg-[#d4af37] hover:bg-[#e5ca78] disabled:opacity-50 text-[#08080a] font-bold text-xs rounded-xl transition-all shadow-md active:scale-95"
                >
                  {isUpdatingD17 ? 'جاري الحفظ...' : 'حفظ رقم D17 الجديد'}
                </button>
              </form>
            </div>

            {/* Orders List */}
            {orders.length === 0 ? (
              <div className="text-center py-16 bg-[#101014] rounded-2xl border border-white/5 space-y-3">
                <ShoppingBag className="w-10 h-10 text-neutral-500 mx-auto" />
                <p className="text-neutral-300 text-sm">لا توجد طلبيات مسجلة حالياً.</p>
                <p className="text-neutral-500 text-xs">ستظهر الطلبيات هنا فور قيام أي حريف بإتمام الشراء.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const isD17Order = order.paymentMethod === 'd17';
                  const isPending = order.status === 'pending_verification';

                  return (
                    <div
                      key={order.id}
                      className={`bg-[#101014] border rounded-2xl p-5 space-y-4 transition-colors ${
                        isPending ? 'border-amber-500/50 shadow-lg shadow-amber-500/5' : 'border-white/10'
                      }`}
                    >
                      {/* Top Order Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded-lg bg-[#d4af37]/10 text-[#d4af37] font-mono font-bold text-xs border border-[#d4af37]/30">
                            {order.trackingNumber}
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-white">
                              {order.customerName}
                            </h4>
                            <span className="text-[11px] text-neutral-400 font-mono">
                              {order.phone}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          {/* Payment Method Badge */}
                          <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${
                            isD17Order
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                              : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                          }`}>
                            {isD17Order ? <Smartphone className="w-3.5 h-3.5" /> : <Banknote className="w-3.5 h-3.5" />}
                            <span className="font-bold">
                              {isD17Order ? 'تطبيق D17' : 'الدفع عند الاستلام (COD)'}
                            </span>
                          </div>

                          <div className="text-left">
                            <span className="text-base font-bold text-[#d4af37] font-sans block">
                              {order.total.toLocaleString()} د.ت
                            </span>
                            <span className="text-[11px] text-neutral-500">
                              {order.createdAt}
                            </span>
                          </div>

                          {/* Status selector */}
                          <select
                            value={order.status}
                            onChange={(e) =>
                              onUpdateOrderStatus(order.trackingNumber, e.target.value as OrderStatus)
                            }
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border focus:outline-none cursor-pointer ${
                              isPending
                                ? 'bg-amber-950/60 border-amber-500 text-amber-300'
                                : 'bg-[#08080a] border-white/10 text-white focus:border-[#d4af37]'
                            }`}
                          >
                            <option value="pending_verification" className="bg-[#101014] text-amber-300">
                              ⏳ معلق / بانتظار التحقق من D17
                            </option>
                            <option value="processing" className="bg-[#101014] text-white">
                              ⚙️ قيد المعالجة بالمستودع
                            </option>
                            <option value="shipped" className="bg-[#101014] text-white">
                              🚚 تم الشحن للموزع
                            </option>
                            <option value="delivered" className="bg-[#101014] text-white">
                              ✅ تم التسليم بنجاح
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* D17 Pending Verification Banner & Action */}
                      {isD17Order && (
                        <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs ${
                          isPending
                            ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                            : 'bg-[#08080a] border-white/5 text-neutral-300'
                        }`}>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 font-bold">
                              <Smartphone className="w-4 h-4 text-[#d4af37]" />
                              <span>رقم عملية D17 المسجل من الحريف:</span>
                              <span className="font-mono bg-[#101014] px-2.5 py-0.5 rounded border border-white/10 text-[#d4af37]" dir="ltr">
                                {order.d17TransactionId || 'غير متوفر'}
                              </span>
                              {order.d17TransactionId && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyTx(order.d17TransactionId!)}
                                  className="p-1 hover:text-white transition-colors"
                                  title="نسخ رقم العملية"
                                >
                                  {copiedTxId === order.d17TransactionId ? (
                                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-400">
                              {isPending
                                ? 'يرجى فتح تطبيق D17 والتأكد من استلام المبلغ برقم العملية أعلاه قبل الموافقة على تجهيز الشحنة.'
                                : 'تم التحقق من تحويل D17 بنجاح وتأكيد وصول المبلغ.'}
                            </p>
                          </div>

                          {isPending && (
                            <button
                              type="button"
                              onClick={() => onUpdateOrderStatus(order.trackingNumber, 'processing')}
                              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-xs rounded-xl transition-all shadow-md shrink-0 active:scale-95 flex items-center gap-1.5"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>تأكيد استلام تحويل D17 وتفعيل الطلب</span>
                            </button>
                          )}
                        </div>
                      )}

                      {/* Middle: Address & Governorate in Tunisia */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-[#08080a] p-3 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#d4af37] shrink-0" />
                          <div>
                            <span className="text-neutral-400">الولاية والمعتمدية: </span>
                            <strong className="text-white font-medium">
                              {order.city} {order.delegation ? ` - ${order.delegation}` : ''}
                            </strong>
                          </div>
                        </div>

                        <div>
                          <span className="text-neutral-400">العنوان بالتفصيل: </span>
                          <span className="text-neutral-200">{order.address}</span>
                        </div>
                      </div>

                      {/* Bottom: Items in this order */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {order.items.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#17171d] border border-white/5 text-xs"
                          >
                            <span className="text-white font-serif">{item.arabicName}</span>
                            <span className="text-neutral-400">×{item.quantity}</span>
                            <span className="text-[#d4af37] font-sans font-bold">
                              {(item.price * item.quantity).toLocaleString()} د.ت
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: Store & Homepage Settings (نصوص وإعدادات المتجر) */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-[#101014] border border-white/10">
              <div>
                <h2 className="text-xl font-bold font-serif text-white flex items-center gap-2.5">
                  <Sliders className="w-5 h-5 text-[#d4af37]" />
                  <span>إعدادات المتجر ونصوص الواجهة الرئيسية</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  تحكم كامل في إظهار أو إخفاء أقسام الموقع، وتعديل النصوص الترويجية، وضبط أرقام التواصل ودفع D17.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem('lina_homepage_settings', JSON.stringify(siteSettings));
                    onUpdateHomepageSettings?.(siteSettings);
                    setSettingsSavedSuccess(true);
                    setTimeout(() => setSettingsSavedSuccess(false), 3500);
                  } catch {
                    alert('تعذر حفظ الإعدادات');
                  }
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-black font-bold text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>حفظ كافة التغييرات</span>
              </button>
            </div>

            {settingsSavedSuccess && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4" />
                <span>تم حفظ إعدادات الصفحة الرئيسية ونصوص المتجر بنجاح وتطبيقها على الفور!</span>
              </div>
            )}

            {/* 1. Sections Visibility */}
            <div className="p-6 rounded-2xl bg-[#101014] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-[#d4af37] flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>التحكم في ظهور أقسام الصفحة الرئيسية</span>
              </h3>
              <p className="text-xs text-neutral-400">
                يمكنك تفعيل أو تعطيل أي قسم من واجهة المتجر بنقرة واحدة:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
                {[
                  { key: 'hero', label: 'الواجهة الافتتاحية (Hero Banner)' },
                  { key: 'specialOffers', label: 'قسم العروض الخاصة والأسعار الرمزية' },
                  { key: 'sizesGuide', label: 'دليل الأحجام والاستخدامات' },
                  { key: 'whyLina', label: 'مميزات لينا شوب والضمانات (Features)' },
                  { key: 'categories', label: 'شريط تصنيفات العطور' },
                  { key: 'testimonials', label: 'آراء وتقييمات الحرفاء' },
                  { key: 'faq', label: 'الأسئلة المتكررة (FAQ)' },
                ].map((sec) => {
                  const isEnabled = (siteSettings.sections as any)?.[sec.key] !== false;
                  return (
                    <button
                      key={sec.key}
                      type="button"
                      onClick={() => {
                        setSiteSettings((prev) => ({
                          ...prev,
                          sections: {
                            ...prev.sections,
                            [sec.key]: !isEnabled,
                          },
                        }));
                      }}
                      className={`p-3.5 rounded-xl border text-right transition-all flex items-center justify-between ${
                        isEnabled
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                          : 'bg-white/[0.02] border-white/5 text-neutral-500'
                      }`}
                    >
                      <span className="text-xs font-semibold">{sec.label}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          isEnabled ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/10 text-neutral-400'
                        }`}
                      >
                        {isEnabled ? 'مفعّل' : 'معطّل'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Hero Section Texts */}
            <div className="p-6 rounded-2xl bg-[#101014] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-[#d4af37] flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                <span>نصوص الواجهة الرئيسية (Hero Section)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    العنوان الرئيسي للواجهة
                  </label>
                  <input
                    type="text"
                    value={siteSettings.heroTitle || ''}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroTitle: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    placeholder="عطورك المفضلة... بأسعار تحبها"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    العنوان الفرعي
                  </label>
                  <input
                    type="text"
                    value={siteSettings.heroSubtitle || ''}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroSubtitle: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    placeholder="عطور زيتية وتركيبات مستوحاة من أشهر الروائح"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  النص الوصفي الترويجي
                </label>
                <textarea
                  rows={2}
                  value={siteSettings.heroDescription || ''}
                  onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroDescription: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                  placeholder="عطور زيتية وتركيبات مستوحاة من أشهر الروائح بأحجام مختلفة وأسعار رمزية تناسب الجميع في تونس..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    الشارة العلوية (Badge)
                  </label>
                  <input
                    type="text"
                    value={siteSettings.heroBadge || ''}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroBadge: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none"
                    placeholder="عطور زيتية وتركيبات مستوحاة • من 5ml إلى 100ml"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    رابط صورة البانر الرئيسي
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={siteSettings.heroImage || ''}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, heroImage: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none font-mono"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment & Support Contact */}
            <div className="p-6 rounded-2xl bg-[#101014] border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-[#d4af37] flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                <span>إعدادات الدفع ورقم D17 والتواصل</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-neutral-300">
                      رقم هاتف تحويل D17 المعتمد
                    </label>
                    {d17SuccessMsg && (
                      <span className="text-[10px] text-emerald-400 font-semibold animate-pulse">
                        ✓ {d17SuccessMsg}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      dir="ltr"
                      value={d17AdminPhone}
                      onChange={(e) => {
                        const val = e.target.value;
                        setD17AdminPhone(val);
                        try {
                          localStorage.setItem('lina_d17_phone', val);
                        } catch {}
                      }}
                      placeholder="+216 55 889 900"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveD17Phone()}
                      disabled={isUpdatingD17}
                      className="px-3.5 py-2.5 bg-[#d4af37] hover:bg-[#e5ca78] text-black font-bold text-xs rounded-xl transition-all shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {isUpdatingD17 ? 'جاري...' : 'حفظ الرقم'}
                    </button>
                  </div>
                  <span className="text-[10px] text-neutral-400 mt-1 block">
                    يظهر تلقائياً للحرفاء في صفحة إتمام الطلب عند اختيار طريقة الدفع D17.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    رقم هاتف المتجر الرسمي / الواتساب
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={siteSettings.contactPhone || '+216 55 889 900'}
                    onChange={(e) => setSiteSettings((prev) => ({ ...prev, contactPhone: e.target.value }))}
                    placeholder="+216 55 889 900"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#08080a] border border-white/10 text-white text-xs focus:border-[#d4af37] focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Save Action */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  try {
                    localStorage.setItem('lina_homepage_settings', JSON.stringify(siteSettings));
                    onUpdateHomepageSettings?.(siteSettings);
                    handleSaveD17Phone();
                    setSettingsSavedSuccess(true);
                    setTimeout(() => setSettingsSavedSuccess(false), 3500);
                  } catch {
                    alert('تعذر حفظ الإعدادات');
                  }
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-black font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>حفظ وتطبيق إعدادات الموقع بالكامل</span>
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
