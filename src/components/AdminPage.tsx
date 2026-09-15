import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  Search,
  CheckCircle2,
  AlertCircle,
  Package,
  ShoppingBag,
  LogOut,
  Tag,
  Sparkles,
  MapPin,
  Phone,
  Layers,
  Copy,
  CreditCard,
  LayoutDashboard,
  Palette,
  FileText,
  Truck,
  Gift,
  Users,
  Settings,
  Globe,
  Store,
  LayoutTemplate
} from 'lucide-react';
import {
  Perfume,
  Order,
  OrderStatus,
  Category,
  HomepageSettings,
  WebsiteSettings,
  ThemeSettings,
  DeliverySettings,
  ContentSettings,
  SEOSettings,
  Promotion
} from '../types';
import {
  DEFAULT_CATEGORIES,
  DEFAULT_HOMEPAGE_CMS,
  DEFAULT_WEBSITE_SETTINGS,
  DEFAULT_THEME_SETTINGS,
  DEFAULT_SEO_SETTINGS,
  DEFAULT_DELIVERY_SETTINGS,
  DEFAULT_CONTENT_SETTINGS,
  DEFAULT_PROMOTIONS,
} from '../data/defaultSettings';

import { AdminOverviewTab } from './admin/AdminOverviewTab';
import { AdminProductsTab } from './admin/AdminProductsTab';
import { AdminCategoriesTab } from './admin/AdminCategoriesTab';
import { AdminHomepageTab } from './admin/AdminHomepageTab';
import { AdminOrdersTab } from './admin/AdminOrdersTab';
import { AdminCustomersTab } from './admin/AdminCustomersTab';
import { AdminPromotionsTab } from './admin/AdminPromotionsTab';
import { AdminContentTab } from './admin/AdminContentTab';
import { AdminDeliveryTab } from './admin/AdminDeliveryTab';
import { AdminThemeTab } from './admin/AdminThemeTab';
import { AdminSettingsTab } from './admin/AdminSettingsTab';
import { AdminSEOTab } from './admin/AdminSEOTab';

export type AdminTabType =
  | 'overview'
  | 'products'
  | 'categories'
  | 'homepage'
  | 'orders'
  | 'customers'
  | 'promotions'
  | 'content'
  | 'delivery'
  | 'theme'
  | 'settings'
  | 'seo';

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
  websiteSettings?: WebsiteSettings;
  onUpdateWebsiteSettings?: (settings: WebsiteSettings) => void;
  themeSettings?: ThemeSettings;
  onUpdateThemeSettings?: (settings: ThemeSettings) => void;
  deliverySettings?: DeliverySettings;
  onUpdateDeliverySettings?: (settings: DeliverySettings) => void;
  contentSettings?: ContentSettings;
  onUpdateContentSettings?: (settings: ContentSettings) => void;
  seoSettings?: SEOSettings;
  onUpdateSEOSettings?: (settings: SEOSettings) => void;
  categories?: Category[];
  onUpdateCategories?: (categories: Category[]) => void;
  promotions?: Promotion[];
  onAddPromotion?: (promo: Promotion) => void;
  onDeletePromotion?: (id: string) => void;
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
  homepageSettings = DEFAULT_HOMEPAGE_CMS,
  onUpdateHomepageSettings,
  websiteSettings = DEFAULT_WEBSITE_SETTINGS,
  onUpdateWebsiteSettings,
  themeSettings = DEFAULT_THEME_SETTINGS,
  onUpdateThemeSettings,
  deliverySettings = DEFAULT_DELIVERY_SETTINGS,
  onUpdateDeliverySettings,
  contentSettings = DEFAULT_CONTENT_SETTINGS,
  onUpdateContentSettings,
  seoSettings = DEFAULT_SEO_SETTINGS,
  onUpdateSEOSettings,
  categories = DEFAULT_CATEGORIES,
  onUpdateCategories,
  promotions = DEFAULT_PROMOTIONS,
  onAddPromotion,
  onDeletePromotion,
}) => {
  // Password Authentication
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTabType>('overview');

  // Local state fallbacks for standalone control
  const [localCategories, setLocalCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_categories');
      return saved ? JSON.parse(saved) : categories;
    } catch {
      return categories;
    }
  });

  const [localPromotions, setLocalPromotions] = useState<Promotion[]>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_promotions');
      return saved ? JSON.parse(saved) : promotions;
    } catch {
      return promotions;
    }
  });

  const [localWebsiteSettings, setLocalWebsiteSettings] = useState<WebsiteSettings>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_website_settings');
      return saved ? JSON.parse(saved) : websiteSettings;
    } catch {
      return websiteSettings;
    }
  });

  const [localThemeSettings, setLocalThemeSettings] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_theme_settings');
      return saved ? JSON.parse(saved) : themeSettings;
    } catch {
      return themeSettings;
    }
  });

  const [localDeliverySettings, setLocalDeliverySettings] = useState<DeliverySettings>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_delivery_settings');
      return saved ? JSON.parse(saved) : deliverySettings;
    } catch {
      return deliverySettings;
    }
  });

  const [localContentSettings, setLocalContentSettings] = useState<ContentSettings>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_content_settings');
      return saved ? JSON.parse(saved) : contentSettings;
    } catch {
      return contentSettings;
    }
  });

  const [localSeoSettings, setLocalSeoSettings] = useState<SEOSettings>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_seo_settings');
      return saved ? JSON.parse(saved) : seoSettings;
    } catch {
      return seoSettings;
    }
  });

  // D17 Admin Phone State
  const [d17AdminPhone, setD17AdminPhone] = useState(() => {
    try {
      return localStorage.getItem('lina_d17_phone') || '+216 55 889 900';
    } catch {
      return '+216 55 889 900';
    }
  });

  // Load server settings on mount
  useEffect(() => {
    // 1. D17
    fetch('/api/settings/d17')
      .then(async (res) => {
        if (res.ok) {
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

    // 2. Categories
    fetch('/api/categories')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.categories && Array.isArray(data.categories)) {
            setLocalCategories(data.categories);
          }
        }
      })
      .catch(() => {});

    // 3. Website Settings
    fetch('/api/settings/website')
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.settings) {
            setLocalWebsiteSettings((prev) => ({ ...prev, ...data.settings }));
          }
        }
      })
      .catch(() => {});

    // 4. Promotions
    fetch('/api/promotions', {
      headers: { 'x-admin-token': 'admin_authenticated_session_token' }
    })
      .then(async (res) => {
        if (res.ok) {
          const data = await res.json();
          if (data.promotions && Array.isArray(data.promotions)) {
            setLocalPromotions(data.promotions);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Save D17 Phone handler
  const handleSaveD17 = async (phone: string) => {
    const clean = phone.trim();
    setD17AdminPhone(clean);
    try {
      localStorage.setItem('lina_d17_phone', clean);
      window.dispatchEvent(new CustomEvent('lina_d17_updated', { detail: clean }));
    } catch {}

    try {
      await fetch('/api/settings/d17', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token',
        },
        body: JSON.stringify({
          recipientPhone: clean,
          adminPassword: 'aymen@2027',
        }),
      });
    } catch {}
  };

  // Save Categories handler
  const handleUpdateCategoriesWrapper = async (cats: Category[]) => {
    setLocalCategories(cats);
    try {
      localStorage.setItem('lina_shop_categories', JSON.stringify(cats));
    } catch {}
    if (onUpdateCategories) onUpdateCategories(cats);

    try {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token',
        },
        body: JSON.stringify({ categories: cats }),
      });
    } catch {}
  };

  // Save Homepage handler
  const handleSaveHomepage = async (settings: HomepageSettings) => {
    if (onUpdateHomepageSettings) onUpdateHomepageSettings(settings);
    try {
      localStorage.setItem('lina_shop_homepage_settings', JSON.stringify(settings));
    } catch {}

    try {
      await fetch('/api/settings/homepage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token',
        },
        body: JSON.stringify(settings),
      });
    } catch {}
  };

  // Save Website handler
  const handleSaveWebsite = async (settings: WebsiteSettings) => {
    setLocalWebsiteSettings(settings);
    if (onUpdateWebsiteSettings) onUpdateWebsiteSettings(settings);
    try {
      localStorage.setItem('lina_shop_website_settings', JSON.stringify(settings));
    } catch {}

    try {
      await fetch('/api/settings/website', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token',
        },
        body: JSON.stringify(settings),
      });
    } catch {}
  };

  // Save Theme handler
  const handleSaveTheme = async (settings: ThemeSettings) => {
    setLocalThemeSettings(settings);
    if (onUpdateThemeSettings) onUpdateThemeSettings(settings);
    try {
      localStorage.setItem('lina_shop_theme_settings', JSON.stringify(settings));
    } catch {}

    try {
      await fetch('/api/settings/theme', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token',
        },
        body: JSON.stringify(settings),
      });
    } catch {}
  };

  // Save Delivery handler
  const handleSaveDelivery = async (settings: DeliverySettings) => {
    setLocalDeliverySettings(settings);
    if (onUpdateDeliverySettings) onUpdateDeliverySettings(settings);
    try {
      localStorage.setItem('lina_shop_delivery_settings', JSON.stringify(settings));
    } catch {}

    try {
      await fetch('/api/settings/delivery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token',
        },
        body: JSON.stringify(settings),
      });
    } catch {}
  };

  // Save Content handler
  const handleSaveContent = async (settings: ContentSettings) => {
    setLocalContentSettings(settings);
    if (onUpdateContentSettings) onUpdateContentSettings(settings);
    try {
      localStorage.setItem('lina_shop_content_settings', JSON.stringify(settings));
    } catch {}

    try {
      await fetch('/api/settings/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token',
        },
        body: JSON.stringify(settings),
      });
    } catch {}
  };

  // Save SEO handler
  const handleSaveSEO = async (settings: SEOSettings) => {
    setLocalSeoSettings(settings);
    if (onUpdateSEOSettings) onUpdateSEOSettings(settings);
    try {
      localStorage.setItem('lina_shop_seo_settings', JSON.stringify(settings));
    } catch {}

    try {
      await fetch('/api/settings/seo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token',
        },
        body: JSON.stringify(settings),
      });
    } catch {}
  };

  // Promotions handlers
  const handleAddPromotionWrapper = (promo: Promotion) => {
    const updated = [...localPromotions, promo];
    setLocalPromotions(updated);
    try {
      localStorage.setItem('lina_shop_promotions', JSON.stringify(updated));
    } catch {}
    if (onAddPromotion) onAddPromotion(promo);

    fetch('/api/promotions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token',
      },
      body: JSON.stringify(promo),
    }).catch(() => {});
  };

  const handleDeletePromotionWrapper = (id: string) => {
    const updated = localPromotions.filter((p) => p.id !== id);
    setLocalPromotions(updated);
    try {
      localStorage.setItem('lina_shop_promotions', JSON.stringify(updated));
    } catch {}
    if (onDeletePromotion) onDeletePromotion(id);

    fetch(`/api/promotions/${id}`, {
      method: 'DELETE',
      headers: {
        'x-admin-token': sessionStorage.getItem('admin_token') || 'admin_authenticated_session_token',
      },
    }).catch(() => {});
  };

  // Password submission for Admin Login
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
    } catch {}

    setAuthError(true);
  };

  // Products count map by category
  const productsCountByCategory: Record<string, number> = {};
  perfumes.forEach((p) => {
    productsCountByCategory[p.category] = (productsCountByCategory[p.category] || 0) + 1;
  });

  // Pending orders count for badge
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'pending_verification'
  ).length;

  // 1. If not logged in, render the secure admin login dialog
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#241B18] flex items-center justify-center p-4 relative overflow-hidden">
        {/* Luxury Background Glow */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#722F3F]/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#D6B56A]/15 blur-3xl" />

        <div className="max-w-md w-full bg-[#332522] border border-[#D6B56A]/40 rounded-3xl p-8 shadow-2xl text-center space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-300">
          
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#722F3F] border border-[#D6B56A]/40 flex items-center justify-center text-[#D6B56A] shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <div className="space-y-1 text-right">
            <span className="text-[10px] uppercase font-serif tracking-widest text-[#D6B56A] font-bold block text-center">
              LINA SHOP • CMS ADMIN CONSOLE
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#FFF9F1] text-center">
              تسجيل الدخول للوحة التحكم
            </h2>
            <p className="text-xs text-[#D8C8B8] text-center leading-relaxed">
              يرجى إدخال كلمة المرور المعتمدة لإدارة المنتجات، العروض، الطلبات، والهوية البصرية للمتجر.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="text-right">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (authError) setAuthError(false);
                }}
                placeholder="أدخل كلمة المرور..."
                className="w-full px-4 py-3 bg-[#241B18] border border-[#D8C8B8]/20 focus:border-[#D6B56A] rounded-xl text-center text-sm font-mono text-[#FFF9F1] placeholder-[#D8C8B8]/50 focus:outline-none transition-colors"
                autoFocus
              />
              {authError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 mt-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>كلمة المرور غير صحيحة، يرجى المحاولة مرة أخرى</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-[#D6B56A] to-[#B89428] hover:from-[#E5CA8A] hover:to-[#D6B56A] text-[#241B18] font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              دخول لوحة التحكم (CMS)
            </button>
          </form>

          <div className="pt-2 border-t border-[#D8C8B8]/10">
            <button
              onClick={onBackToStore}
              className="text-xs text-[#D8C8B8] hover:text-[#D6B56A] transition-colors flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
              <span>العودة إلى واجهة المتجر</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Navigation items for the comprehensive CMS
  const navTabs: { id: AdminTabType; label: string; icon: any; badge?: number }[] = [
    { id: 'overview', label: 'لوحة التحكم', icon: LayoutDashboard },
    { id: 'products', label: 'المنتجات والأحجام', icon: Package, badge: perfumes.length },
    { id: 'categories', label: 'التصنيفات', icon: Tag, badge: localCategories.length },
    { id: 'homepage', label: 'الصفحة الرئيسية', icon: LayoutTemplate },
    { id: 'orders', label: 'الطلبات', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined },
    { id: 'customers', label: 'سجل الحرفاء', icon: Users },
    { id: 'promotions', label: 'كوبونات الخصم', icon: Gift, badge: localPromotions.length },
    { id: 'content', label: 'المحتوى والأسئلة', icon: FileText },
    { id: 'delivery', label: 'الشحن والولايات', icon: Truck },
    { id: 'theme', label: 'المظهر والألوان', icon: Palette },
    { id: 'settings', label: 'إعدادات المتجر وD17', icon: Settings },
    { id: 'seo', label: 'محركات البحث (SEO)', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-[#241B18] text-[#F7F1E8] flex flex-col font-sans" dir="rtl">
      
      {/* Top Navbar */}
      <header className="bg-[#332522] border-b border-[#D8C8B8]/20 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#722F3F] border border-[#D6B56A]/40 flex items-center justify-center text-[#D6B56A]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-right">
              <h1 className="text-base font-serif font-bold text-[#FFF9F1] flex items-center gap-1.5">
                <span>{localWebsiteSettings.storeName || 'LINA SHOP'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#D6B56A] text-[#241B18] font-bold">
                  CMS PRO
                </span>
              </h1>
              <span className="text-[10px] text-[#D8C8B8] font-mono">
                لوحة الإدارة والتحكم الشامل
              </span>
            </div>
          </div>

          {/* Actions Right */}
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToStore}
              className="px-3.5 py-2 bg-[#241B18] border border-[#D8C8B8]/20 hover:border-[#D6B56A] text-[#D8C8B8] hover:text-[#D6B56A] text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Store className="w-4 h-4" />
              <span className="hidden sm:inline">معاينة المتجر للزبائن</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 bg-rose-950/40 border border-rose-800/40 hover:bg-rose-900/60 text-rose-300 rounded-xl transition-colors cursor-pointer"
              title="تسجيل الخروج"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 flex flex-col md:flex-row gap-6">
        
        {/* Left / Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-1 bg-[#332522] border border-[#D8C8B8]/20 p-3 rounded-2xl h-fit">
          <div className="px-3 py-2 text-[11px] font-bold text-[#D6B56A] uppercase tracking-wider font-serif">
            قائمة أقسام الـ CMS
          </div>

          <nav className="space-y-1">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-right cursor-pointer ${
                    isSelected
                      ? 'bg-[#D6B56A] text-[#241B18] shadow-md font-bold'
                      : 'text-[#D8C8B8] hover:bg-[#241B18] hover:text-[#FFF9F1]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>

                  {tab.badge !== undefined && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#241B18] text-[#D6B56A]'
                          : 'bg-[#241B18] text-[#D8C8B8]'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 w-full min-w-0">
          {activeTab === 'overview' && (
            <AdminOverviewTab
              orders={orders}
              perfumes={perfumes}
              onSelectTab={(t) => setActiveTab(t)}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          )}

          {activeTab === 'products' && (
            <AdminProductsTab
              perfumes={perfumes}
              categories={localCategories}
              onAddPerfume={onAddPerfume}
              onUpdatePerfume={onUpdatePerfume}
              onDeletePerfume={onDeletePerfume}
              onResetDefaultPerfumes={onResetDefaultPerfumes}
            />
          )}

          {activeTab === 'categories' && (
            <AdminCategoriesTab
              categories={localCategories}
              onUpdateCategories={handleUpdateCategoriesWrapper}
              productsCountByCategory={productsCountByCategory}
            />
          )}

          {activeTab === 'homepage' && (
            <AdminHomepageTab
              settings={homepageSettings}
              onSaveSettings={handleSaveHomepage}
            />
          )}

          {activeTab === 'orders' && (
            <AdminOrdersTab
              orders={orders}
              onUpdateOrderStatus={onUpdateOrderStatus}
            />
          )}

          {activeTab === 'customers' && (
            <AdminCustomersTab
              orders={orders}
            />
          )}

          {activeTab === 'promotions' && (
            <AdminPromotionsTab
              promotions={localPromotions}
              onAddPromotion={handleAddPromotionWrapper}
              onDeletePromotion={handleDeletePromotionWrapper}
            />
          )}

          {activeTab === 'content' && (
            <AdminContentTab
              contentSettings={localContentSettings}
              onSaveContent={handleSaveContent}
            />
          )}

          {activeTab === 'delivery' && (
            <AdminDeliveryTab
              deliverySettings={localDeliverySettings}
              onSaveDelivery={handleSaveDelivery}
            />
          )}

          {activeTab === 'theme' && (
            <AdminThemeTab
              themeSettings={localThemeSettings}
              onSaveTheme={handleSaveTheme}
            />
          )}

          {activeTab === 'settings' && (
            <AdminSettingsTab
              websiteSettings={localWebsiteSettings}
              onSaveSettings={handleSaveWebsite}
              d17Phone={d17AdminPhone}
              onSaveD17Phone={handleSaveD17}
            />
          )}

          {activeTab === 'seo' && (
            <AdminSEOTab
              seoSettings={localSeoSettings}
              onSaveSEO={handleSaveSEO}
            />
          )}
        </main>

      </div>

    </div>
  );
};
