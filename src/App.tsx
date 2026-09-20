/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesStrip } from './components/FeaturesStrip';
import { SpecialOffersSection } from './components/SpecialOffersSection';
import { SizesGuideSection } from './components/SizesGuideSection';
import { CategoriesSection } from './components/CategoriesSection';
import { PerfumesGrid } from './components/PerfumesGrid';
import { PremiumCollectionBanner } from './components/PremiumCollectionBanner';
import { CustomerReviews } from './components/CustomerReviews';
import { AboutSection } from './components/AboutSection';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPage } from './components/AdminPage';
import { Toast } from './components/Toast';
import { DEFAULT_HOMEPAGE_SETTINGS } from './data/perfumes';
import { Perfume, CartItem, Order, OrderStatus, HomepageSettings } from './types';
import { CheckCircle2, Copy, ArrowLeft, Truck } from 'lucide-react';
import {
  fetchProductsFromSupabase,
  saveProductToSupabase,
  deleteProductFromSupabase,
  fetchOrdersFromSupabase,
  insertOrderToSupabase,
  updateOrderStatusInSupabase,
  fetchStoreSettingFromSupabase,
  saveStoreSettingToSupabase,
  seedSupabaseDefaults,
} from './lib/supabaseStore';

export default function App() {
  // 1. Perfumes State (Directly and exclusively sourced from Supabase public.products)
  const [perfumes, setPerfumes] = useState<Perfume[]>([]);
  const [loading, setLoading] = useState(true);

  // 2. Cart State (Transient in-memory session state)
  const [cart, setCart] = useState<CartItem[]>([]);

  // 3. Orders State (Directly sourced from Supabase)
  const [orders, setOrders] = useState<Order[]>([]);

  // 4. Admin Login State (Transient in-memory session state)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // 5. Navigation, Filters & Modal States
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewPerfume, setQuickViewPerfume] = useState<Perfume | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminPageView, setIsAdminPageView] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [trackingSearchCode, setTrackingSearchCode] = useState<string>('');

  // 6. Homepage & Store Settings (Directly sourced from Supabase)
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(
    DEFAULT_HOMEPAGE_SETTINGS as HomepageSettings
  );

  // Toast System
  const [toast, setToast] = useState<{ show: boolean; title: string; message: string }>({
    show: false,
    title: '',
    message: '',
  });

  const showToast = (title: string, message: string) => {
    setToast({ show: true, title, message });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3500);
  };

  // Load store data directly and solely from Supabase on mount
  useEffect(() => {
    let isMounted = true;
    async function initSupabaseData() {
      try {
        setLoading(true);

        // 1. Fetch real products directly and solely from Supabase public.products table
        try {
          const loadedProducts = await fetchProductsFromSupabase();
          if (isMounted) {
            console.info(`[Storefront Data] Successfully received ${loadedProducts.length} products from Supabase.`);
            setPerfumes(loadedProducts);
          }
        } catch (prodErr) {
          console.error('[Storefront Data Error] Failed to fetch products from Supabase:', prodErr);
        }

        // 2. Fetch homepage store settings in parallel
        try {
          const loadedHomepage = await fetchStoreSettingFromSupabase('homepage', DEFAULT_HOMEPAGE_SETTINGS);
          if (isMounted && loadedHomepage) {
            setHomepageSettings(loadedHomepage as HomepageSettings);
          }
        } catch (settingsErr) {
          console.warn('[Storefront Data Notice] Homepage settings fetch notice:', settingsErr);
        }

        // 3. Fetch orders
        try {
          const loadedOrders = await fetchOrdersFromSupabase();
          if (isMounted && loadedOrders && loadedOrders.length > 0) {
            setOrders(loadedOrders);
          }
        } catch (orderErr) {
          console.warn('[Storefront Data Notice] Orders fetch notice:', orderErr);
        }
      } catch (err) {
        console.error('[Storefront Data Critical] Unexpected error in initSupabaseData:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    initSupabaseData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Cart operations
  const handleAddToCart = (perfume: Perfume, quantity = 1, selectedSize?: string) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.id === perfume.id && (!selectedSize || item.selectedSize === selectedSize)
      );
      if (existing) {
        return prev.map((item) =>
          item.id === perfume.id && (!selectedSize || item.selectedSize === selectedSize)
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { ...perfume, quantity, selectedSize: selectedSize || perfume.sizes?.[0] || '100 ml' }];
    });

    showToast('تمت الإضافة بنجاح', `تمت إضافة "${perfume.arabicName}" إلى سلة مشترياتك.`);
  };

  const handleBuyNow = (perfume: Perfume, quantity = 1, selectedSize?: string) => {
    handleAddToCart(perfume, quantity, selectedSize);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
    showToast('تم الحذف', 'تمت إزالة العطر من السلة.');
  };

  const handleTriggerCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  // Order placement from Checkout (Persisted directly to Supabase)
  const handleOrderConfirmed = async (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setLatestOrder(newOrder);

    // Save directly to Supabase
    try {
      await insertOrderToSupabase(newOrder);
    } catch (err) {
      console.error('Failed to save order in Supabase:', err);
    }

    if (newOrder.paymentMethod === 'd17') {
      showToast(
        'تم تسجيل طلب D17 في Supabase',
        `حالة الطلب: معلق بانتظار التحقق من التحويل (كود التتبع: ${newOrder.trackingNumber})`
      );
    } else {
      showToast('تم تأكيد الطلب بنجاح', `تم حفظ الطلب في Supabase. كود التتبع: ${newOrder.trackingNumber}`);
    }
  };

  // Product Admin Operations (Direct Supabase)
  const handleAddPerfume = async (newPerfume: Perfume) => {
    showToast('جاري الحفظ', `جاري حفظ عطر "${newPerfume.arabicName}" في Supabase...`);
    try {
      await saveProductToSupabase(newPerfume);
      setPerfumes((prev) => [newPerfume, ...prev]);
      showToast('تمت الإضافة بنجاح', `تم حفظ عطر "${newPerfume.arabicName}" في جدول public.products.`);
    } catch (err: any) {
      console.error('[App] Error adding perfume to Supabase:', err);
      showToast('خطأ في Supabase', err.message || 'فشل حفظ العطر في قاعدة البيانات');
      throw err;
    }
  };

  const handleUpdatePerfume = async (updatedPerfume: Perfume) => {
    showToast('جاري التحديث', `جاري تحديث عطر "${updatedPerfume.arabicName}" في Supabase...`);
    try {
      await saveProductToSupabase(updatedPerfume);
      setPerfumes((prev) =>
        prev.map((p) => (p.id === updatedPerfume.id ? updatedPerfume : p))
      );
      // Also update in cart
      setCart((prev) =>
        prev.map((item) =>
          item.id === updatedPerfume.id
            ? { ...updatedPerfume, quantity: item.quantity }
            : item
        )
      );
      showToast('تم تحديث العطر', `تم حفظ بيانات عطر "${updatedPerfume.arabicName}" في Supabase.`);
    } catch (err: any) {
      console.error('[App] Error updating perfume in Supabase:', err);
      showToast('خطأ في Supabase', err.message || 'فشل تحديث العطر في قاعدة البيانات');
      throw err;
    }
  };

  const handleDeletePerfume = async (id: number) => {
    try {
      await deleteProductFromSupabase(id);
      setPerfumes((prev) => prev.filter((p) => p.id !== id));
      showToast('تم الحذف', 'تم حذف العطر من قاعدة بيانات Supabase.');
    } catch (err: any) {
      console.error('[App] Error deleting perfume from Supabase:', err);
      showToast('خطأ في Supabase', err.message || 'فشل حذف العطر من Supabase');
      throw err;
    }
  };

  const handleResetDefaultPerfumes = async () => {
    showToast('جاري الاستعادة', 'جاري تهيئة كتالوج العطور في Supabase...');
    try {
      await seedSupabaseDefaults();
      const loaded = await fetchProductsFromSupabase();
      setPerfumes(loaded);
      showToast('تمت الاستعادة', `تم حفظ ${loaded.length} عطر في جدول public.products.`);
    } catch (err: any) {
      console.error('[App] Error resetting perfumes in Supabase:', err);
      showToast('خطأ في Supabase', err.message || 'فشل استعادة العطور في Supabase');
      throw err;
    }
  };

  const handleUpdateOrderStatus = async (trackingNumber: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.trackingNumber === trackingNumber ? { ...o, status } : o))
    );

    try {
      await updateOrderStatusInSupabase(trackingNumber, status);
      showToast('تم تحديث الشحنة', `تم تحديث حالة الطلب (${trackingNumber}) في Supabase.`);
    } catch (err) {
      console.error('Error updating order status in Supabase:', err);
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Smooth scroll helper
  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Full Page Admin View
  if (isAdminPageView) {
    return (
      <div className="min-h-screen bg-[#070709] text-white">
        <AdminPage
          isAdminLoggedIn={isAdminLoggedIn}
          onLogin={() => {
            setIsAdminLoggedIn(true);
            showToast('تم الدخول', 'تم تسجيل الدخول كمسؤول للمتجر بنجاح.');
          }}
          onLogout={() => {
            setIsAdminLoggedIn(false);
            showToast('تم الخروج', 'تم إنهاء جلسة المشرف.');
          }}
          perfumes={perfumes}
          onAddPerfume={handleAddPerfume}
          onUpdatePerfume={handleUpdatePerfume}
          onDeletePerfume={handleDeletePerfume}
          onResetDefaultPerfumes={handleResetDefaultPerfumes}
          orders={orders}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onBackToStore={() => setIsAdminPageView(false)}
          homepageSettings={homepageSettings}
          onUpdateHomepageSettings={(s) => {
            setHomepageSettings(s);
            saveStoreSettingToSupabase('homepage', s);
          }}
        />
        <Toast show={toast.show} title={toast.title} message={toast.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-[#f4efe6] font-sans selection:bg-[#d4af37] selection:text-[#070709] flex flex-col">
      
      {/* 1. Header (Sticky, transparent/dark luxury style, exact links, search & cart) */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenTracking={() => {
          setTrackingSearchCode('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminPageView(true)}
        onNavigateCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToProducts();
        }}
        onSearchChange={(term) => setSearchTerm(term)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      <main className="flex-1">
        {/* 2. Hero Section (Split layout, exact headings & description, CTAs, 3 trust indicators) */}
        {homepageSettings.sections?.hero !== false && (
          <Hero
            onExplore={scrollToProducts}
            onShopNow={scrollToProducts}
            settings={homepageSettings}
          />
        )}

        {/* 3. Trust Section (Why Lina Shop: 5 pillars with elegant line icons) */}
        {homepageSettings.sections?.whyLina !== false && (
          <FeaturesStrip />
        )}

        {/* 3.1 Special Offers Section ("عطور بأسعار رمزية") */}
        {homepageSettings.sections?.specialOffers !== false && (
          <SpecialOffersSection
            perfumes={perfumes}
            onAddToCart={handleAddToCart}
            onOpenQuickView={(perfume) => setQuickViewPerfume(perfume)}
          />
        )}

        {/* 3.2 Sizes Guide Section (دليل الأحجام والاستخدامات) */}
        {homepageSettings.sections?.sizesGuide !== false && (
          <SizesGuideSection
            onSelectSize={() => scrollToProducts()}
          />
        )}

        {/* 4. Categories Section (Visual category cards) */}
        {homepageSettings.sections?.categories !== false && (
          <CategoriesSection
            selectedCategory={selectedCategory}
            onSelectCategory={(catId) => {
              setSelectedCategory(catId);
              scrollToProducts();
            }}
          />
        )}

        {/* 5. Featured Products Section ("الأكثر طلباً" with dynamic sizes, quick add, view product) */}
        <PerfumesGrid
          perfumes={perfumes}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
          searchTerm={searchTerm}
          onAddToCart={handleAddToCart}
          onOpenQuickView={(perfume) => setQuickViewPerfume(perfume)}
          isAdminMode={isAdminLoggedIn}
          onDeletePerfume={handleDeletePerfume}
          onOpenAdminModal={() => setIsAdminPageView(true)}
          isLoading={loading}
        />

        {/* 6. Premium Collection Editorial Section ("مجموعة النخبة" with dark luxury overlay & CTA) */}
        <PremiumCollectionBanner
          onExplore={() => {
            setSelectedCategory('عطور فاخرة');
            scrollToProducts();
          }}
        />

        {/* 7. Customer Reviews Section (3-5 realistic Tunisian testimonials) */}
        {homepageSettings.sections?.testimonials !== false && (
          <CustomerReviews />
        )}

        {/* 8. Brand Heritage Section */}
        <AboutSection />

        {/* 9. FAQ Accordion Section (Common questions on authenticity, delivery, COD, tracking, returns) */}
        {homepageSettings.sections?.faq !== false && (
          <FAQSection />
        )}
      </main>

      {/* 10. Luxury Footer (Brand description, navigation links, service links, delivery info, Tunisia contact, copyright) */}
      <Footer
        onShowToast={showToast}
        onOpenTracking={() => {
          setTrackingSearchCode('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminPageView(true)}
      />

      {/* Cart Drawer (Product image, name, price, quantity, subtotal, shipping, total in TND, "متابعة الطلب") */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleTriggerCheckout}
      />

      {/* Product Details Modal (Gallery, thumbnails, name, rating, sizes, quantity, Add to Cart, Buy Now, fragrance notes pyramid, "التوصيل إلى كامل تونس") */}
      <QuickViewModal
        perfume={quickViewPerfume}
        onClose={() => setQuickViewPerfume(null)}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
      />

      {/* Checkout Modal (Full Name, Tunisian Phone, 24 Governorates, City/Delegation, Address, Notes, COD & D17, validation, order summary, "تأكيد الطلب الآن") */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        onOrderConfirmed={handleOrderConfirmed}
      />

      {/* Order Confirmed Success Popup */}
      {latestOrder && (
        <div
          id="order-confirmed-dialog"
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-[#0e0e14] border border-[#d4af37]/50 rounded-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] uppercase font-serif tracking-widest text-[#d4af37] font-bold">
                COMMANDE VALIDÉE AVEC SUCCÈS
              </span>
              <h3 className="text-2xl font-bold text-white font-serif">تم تأكيد طلبك بنجاح!</h3>
            </div>

            <p className="text-neutral-300 text-xs leading-relaxed">
              شكراً لاختيارك Lina Shop Haute Parfumerie. تم إرسال بيانات طلبك للمستودع لتجهيز العبوة الفاخرة والعينات المجانية المرفقة.
            </p>

            <div className="p-4 bg-[#070709] rounded-xl border border-[#d4af37]/30 text-center space-y-2">
              <span className="text-[11px] text-neutral-400 font-serif">كود التتبع التونسي المخصص لطلبك:</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl sm:text-2xl font-bold text-[#d4af37] font-mono tracking-wider">
                  {latestOrder.trackingNumber}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(latestOrder.trackingNumber);
                    showToast('تم النسخ', 'تم نسخ رقم التتبع بنجاح.');
                  }}
                  className="p-1.5 bg-[#17171d] hover:bg-[#d4af37] hover:text-[#070709] text-neutral-300 rounded-lg transition-colors cursor-pointer"
                  title="نسخ رقم التتبع"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => {
                  setTrackingSearchCode(latestOrder.trackingNumber);
                  setLatestOrder(null);
                  setIsTrackingOpen(true);
                }}
                className="flex-1 py-3.5 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#070709] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                <Truck className="w-4 h-4" />
                <span>تتبع مسار الشحنة فورياً</span>
              </button>

              <button
                onClick={() => setLatestOrder(null)}
                className="flex-1 py-3.5 bg-[#14141c] hover:bg-[#1f1f2a] text-neutral-300 rounded-xl text-xs font-semibold transition-colors border border-white/10 cursor-pointer"
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal (Timeline: تم استلام الطلب، جاري التجهيز، تم الشحن، تم التوصيل) */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        initialTrackingCode={trackingSearchCode}
      />

      {/* Toast Alert */}
      <Toast show={toast.show} title={toast.title} message={toast.message} />

    </div>
  );
}
