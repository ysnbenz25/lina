/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FeaturesStrip } from './components/FeaturesStrip';
import { PerfumesGrid } from './components/PerfumesGrid';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { PythonScriptModal } from './components/PythonScriptModal';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPage } from './components/AdminPage';
import { Toast } from './components/Toast';
import { PERFUMES_DATA } from './data/perfumes';
import { Perfume, CartItem, Order, OrderStatus } from './types';
import { CheckCircle2, Copy, ArrowLeft } from 'lucide-react';

export default function App() {
  // 1. Perfumes State (LocalStorage backed)
  const [perfumes, setPerfumes] = useState<Perfume[]>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_perfumes_react');
      return saved ? JSON.parse(saved) : PERFUMES_DATA;
    } catch {
      return PERFUMES_DATA;
    }
  });

  // 2. Cart State (LocalStorage backed)
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_cart_react');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 3. Orders State (LocalStorage backed with initial seed)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('lina_shop_orders_react');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'ORD-DEMO-1',
          trackingNumber: 'TN-784291',
          customerName: 'أنيس بن مسعود',
          phone: '+216 98 123 456',
          city: 'تونس (Tunis)',
          delegation: 'المرسى',
          address: 'نهج الهادي نويرة - قمرت',
          items: [{ ...PERFUMES_DATA[0], quantity: 1 }],
          subtotal: 280,
          shippingFee: 0,
          total: 280,
          status: 'shipped',
          paymentMethod: 'cod',
          createdAt: '2026-09-12',
        },
        {
          id: 'ORD-DEMO-2',
          trackingNumber: 'TN-519283',
          customerName: 'سارة الدريدي',
          phone: '+216 55 987 654',
          city: 'سوسة (Sousse)',
          delegation: 'سوسة جوهرة',
          address: 'نهج ابن خلدون، الإقامة الهادئة',
          items: [{ ...PERFUMES_DATA[1], quantity: 1 }],
          subtotal: 220,
          shippingFee: 0,
          total: 220,
          status: 'pending_verification',
          paymentMethod: 'd17',
          d17TransactionId: 'TXN-884210',
          d17RecipientPhone: '+216 55 889 900',
          createdAt: '2026-09-13',
        },
      ];
    } catch {
      return [];
    }
  });

  // 4. Admin Login State (LocalStorage backed)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('lina_shop_admin_react') === 'true';
    } catch {
      return false;
    }
  });

  // Modals and views state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewPerfume, setQuickViewPerfume] = useState<Perfume | null>(null);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [isAdminPageView, setIsAdminPageView] = useState(false);
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);
  const [trackingSearchCode, setTrackingSearchCode] = useState<string>('');

  // Toast
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

  // Synchronize LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('lina_shop_perfumes_react', JSON.stringify(perfumes));
    } catch {
      // ignore
    }
  }, [perfumes]);

  useEffect(() => {
    try {
      localStorage.setItem('lina_shop_cart_react', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('lina_shop_orders_react', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('lina_shop_admin_react', isAdminLoggedIn ? 'true' : 'false');
    } catch {
      // ignore
    }
  }, [isAdminLoggedIn]);

  // Cart operations
  const handleAddToCart = (perfume: Perfume) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === perfume.id);
      if (existing) {
        return prev.map((item) =>
          item.id === perfume.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...perfume, quantity: 1 }];
    });

    showToast('تمت الإضافة بنجاح', `تمت إضافة عطر "${perfume.arabicName}" إلى سلة مشترياتك.`);
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

  // Order placement from Checkout
  const handleOrderConfirmed = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    setLatestOrder(newOrder);

    if (newOrder.paymentMethod === 'd17') {
      showToast(
        'تم تسجيل طلب D17 بنجاح',
        `حالة الطلب: معلق بانتظار التحقق من وصول التحويل (كود التتبع: ${newOrder.trackingNumber})`
      );
    } else {
      showToast('تم تأكيد الطلب بنجاح', `تم توليد كود التتبع: ${newOrder.trackingNumber}`);
    }
  };

  // Product Admin Operations
  const handleAddPerfume = (newPerfume: Perfume) => {
    setPerfumes((prev) => [newPerfume, ...prev]);
    showToast('تمت الإضافة', `تمت إضافة عطر "${newPerfume.arabicName}" للمتجر وقاعدة البيانات.`);
  };

  const handleUpdatePerfume = (updatedPerfume: Perfume) => {
    setPerfumes((prev) =>
      prev.map((p) => (p.id === updatedPerfume.id ? updatedPerfume : p))
    );
    // Also update in cart if already in cart
    setCart((prev) =>
      prev.map((item) =>
        item.id === updatedPerfume.id
          ? { ...updatedPerfume, quantity: item.quantity }
          : item
      )
    );
    showToast('تم تحديث العطر', `تم حفظ بيانات وصورة عطر "${updatedPerfume.arabicName}" بنجاح.`);
  };

  const handleDeletePerfume = (id: number) => {
    setPerfumes((prev) => prev.filter((p) => p.id !== id));
    showToast('تم الحذف', 'تم حذف العطر من المتجر وقاعدة البيانات.');
  };

  const handleResetDefaultPerfumes = () => {
    setPerfumes(PERFUMES_DATA);
    showToast('تمت الاستعادة', 'تمت استعادة العطور الأساسية الأربعة بنجاح.');
  };

  const handleUpdateOrderStatus = (trackingNumber: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.trackingNumber === trackingNumber ? { ...o, status } : o))
    );

    // Sync to backend API if available
    fetch(`/api/orders/${trackingNumber}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminPassword: 'admin123' }),
    }).catch(() => {});

    showToast('تم تحديث الشحنة', `تم تغيير حالة الطلب (${trackingNumber}) بنجاح.`);
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Full Page Admin View
  if (isAdminPageView) {
    return (
      <div className="min-h-screen bg-[#08080a] text-white">
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
        />
        <Toast show={toast.show} title={toast.title} message={toast.message} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-[#f4efe6] font-sans selection:bg-[#d4af37] selection:text-[#08080a] flex flex-col">
      
      {/* 1. Navbar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenScriptModal={() => setIsScriptModalOpen(true)}
        onOpenTracking={() => {
          setTrackingSearchCode('');
          setIsTrackingOpen(true);
        }}
        onOpenAdmin={() => setIsAdminPageView(true)}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero />

        {/* Features Value Strip */}
        <FeaturesStrip />

        {/* 3. Featured Perfumes Grid (Loaded from LocalStorage) */}
        <PerfumesGrid
          perfumes={perfumes}
          onAddToCart={handleAddToCart}
          onOpenQuickView={(perfume) => setQuickViewPerfume(perfume)}
          isAdminMode={isAdminLoggedIn}
          onDeletePerfume={handleDeletePerfume}
          onOpenAdminModal={() => setIsAdminPageView(true)}
        />

        {/* 4. About Us Section */}
        <AboutSection />
      </main>

      {/* 5. Footer & Newsletter */}
      <Footer onShowToast={showToast} />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleTriggerCheckout}
      />

      {/* Checkout Modal (Buyer Data & Random Tracking Generation) */}
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
          className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div className="bg-[#101014] border border-[#d4af37]/50 rounded-2xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-bold text-white font-serif">تم تأكيد طلبك بنجاح!</h3>
            <p className="text-neutral-300 text-xs leading-relaxed">
              شكراً لاختيارك Lina Shop. تم تسجيل طلبك وإرسال بيانات الشحن للمستودع لتجهيز العبوات الفاخرة والعينات المجانية.
            </p>

            <div className="p-4 bg-[#08080a] rounded-xl border border-[#d4af37]/30 text-center space-y-2">
              <span className="text-[11px] text-neutral-400">رقم تتبع شحنتك المخصص:</span>
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-bold text-[#d4af37] font-sans tracking-wider">
                  {latestOrder.trackingNumber}
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(latestOrder.trackingNumber);
                    showToast('تم النسخ', 'تم نسخ رقم التتبع بنجاح.');
                  }}
                  className="p-1.5 bg-[#17171d] hover:bg-[#d4af37] hover:text-[#08080a] text-neutral-300 rounded transition-colors"
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
                className="flex-1 py-3 bg-gradient-to-r from-[#d4af37] to-[#b89428] hover:from-[#e5ca78] hover:to-[#d4af37] text-[#08080a] font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
              >
                <span>تتبع الشحنة فورياً</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setLatestOrder(null)}
                className="flex-1 py-3 bg-[#17171d] hover:bg-[#23232b] text-neutral-300 rounded-xl text-xs transition-colors border border-white/10"
              >
                متابعة التسوق
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => setIsTrackingOpen(false)}
        orders={orders}
        initialTrackingCode={trackingSearchCode}
      />

      {/* Quick View Perfume Modal */}
      <QuickViewModal
        perfume={quickViewPerfume}
        onClose={() => setQuickViewPerfume(null)}
        onAddToCart={handleAddToCart}
      />

      {/* Python Script Modal */}
      <PythonScriptModal
        isOpen={isScriptModalOpen}
        onClose={() => setIsScriptModalOpen(false)}
        onShowToast={showToast}
      />

      {/* Toast Alert */}
      <Toast show={toast.show} title={toast.title} message={toast.message} />

    </div>
  );
}
