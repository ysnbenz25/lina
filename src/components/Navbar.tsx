import React from 'react';
import { ShoppingBag, Menu, X, Code2, Truck, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenScriptModal: () => void;
  onOpenTracking: () => void;
  onOpenAdmin: () => void;
  isAdminLoggedIn: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenScriptModal,
  onOpenTracking,
  onOpenAdmin,
  isAdminLoggedIn,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <>
      {/* Admin Mode Badge if Active */}
      {isAdminLoggedIn && (
        <div id="admin-active-strip" className="bg-[#d4af37] text-[#08080a] py-1 px-4 text-center text-xs font-bold flex items-center justify-center gap-2">
          <ShieldCheck className="w-4 h-4" />
          <span>وضع الأدمن مفعّل: يمكنك إدارة وتعديل كافة العطور والصور والأسعار من صفحة المشرف الكاملة.</span>
          <button 
            onClick={onOpenAdmin}
            className="underline hover:text-black mr-2 font-black cursor-pointer"
          >
            فتح لوحة التحكم الكاملة
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <header id="main-navbar" className="sticky top-0 z-40 bg-[#08080a]/90 backdrop-blur-md border-b border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile Menu Trigger */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-neutral-400 hover:text-white transition-colors"
            aria-label="القائمة"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <a href="#" id="brand-logo" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full border border-[#d4af37]/40 flex items-center justify-center bg-[#101014] text-[#d4af37] font-serif text-xl font-bold group-hover:border-[#d4af37] transition-colors shadow-lg shadow-[#d4af37]/10">
              L
            </div>
            <div className="flex flex-col text-right">
              <span className="font-sans text-xl font-bold tracking-[0.2em] text-white group-hover:text-[#d4af37] transition-colors uppercase">
                Lina Shop
              </span>
              <span className="text-[10px] tracking-widest text-[#d4af37]/80 -mt-1 font-serif">
                HAUTE PARFUMERIE
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav id="desktop-nav-links" className="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
            <a href="#hero" className="hover:text-[#d4af37] transition-colors py-1">الرئيسية</a>
            <a href="#products" className="hover:text-[#d4af37] transition-colors py-1">العطور الفاخرة</a>
            <a href="#about" className="hover:text-[#d4af37] transition-colors py-1">عن المتجر</a>
            <a href="#contact" className="hover:text-[#d4af37] transition-colors py-1">تواصل معنا</a>
          </nav>

          {/* Right Action Icons: Track Order + Admin Panel + Python Script + Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Track Order Button */}
            <button
              id="nav-track-order-btn"
              onClick={onOpenTracking}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#101014] hover:bg-[#17171d] text-neutral-200 hover:text-[#d4af37] border border-white/10 hover:border-[#d4af37]/40 text-xs font-semibold transition-all active:scale-95"
              title="تتبع مسار طلبي المباشر"
            >
              <Truck className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">تتبع طلبي</span>
            </button>

            {/* Admin Panel Button */}
            <button
              id="nav-admin-panel-btn"
              onClick={onOpenAdmin}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 border ${
                isAdminLoggedIn
                  ? 'bg-[#d4af37]/20 border-[#d4af37] text-[#d4af37]'
                  : 'bg-[#101014] hover:bg-[#17171d] text-neutral-200 hover:text-[#d4af37] border-white/10 hover:border-[#d4af37]/40'
              }`}
              title="لوحة تحكم المشرف (Admin)"
            >
              <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
              <span className="hidden sm:inline">لوحة الأدمن</span>
            </button>

            {/* Python Script Tool */}
            <button
              id="view-python-script-btn"
              onClick={onOpenScriptModal}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17171d] hover:bg-[#23232b] text-[#d4af37] border border-[#d4af37]/30 text-xs font-semibold transition-colors"
              title="عرض كود بايثون وحزمة lina-shop.zip"
            >
              <Code2 className="w-4 h-4" />
              <span>كود Python و ZIP</span>
            </button>

            {/* Shopping Cart Button */}
            <button
              id="cart-drawer-trigger"
              onClick={onOpenCart}
              className="relative p-2.5 rounded-full bg-[#101014] border border-white/10 hover:border-[#d4af37]/50 transition-all text-white hover:text-[#d4af37] flex items-center justify-center group active:scale-95"
              aria-label="سلة التسوق"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              {cartCount > 0 && (
                <span id="cart-counter-badge" className="absolute -top-1.5 -right-1.5 bg-[#d4af37] text-[#08080a] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Mobile Nav Links Dropdown */}
        {mobileMenuOpen && (
          <div id="mobile-nav-menu" className="md:hidden bg-[#101014] border-b border-white/10 px-6 py-4 space-y-3 text-right">
            <a href="#hero" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-neutral-300 hover:text-[#d4af37] border-b border-white/5">الرئيسية</a>
            <a href="#products" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-neutral-300 hover:text-[#d4af37] border-b border-white/5">العطور الفاخرة</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-neutral-300 hover:text-[#d4af37] border-b border-white/5">عن المتجر</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-neutral-300 hover:text-[#d4af37] border-b border-white/5">تواصل معنا</a>
            
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTracking();
                }}
                className="w-full py-2.5 bg-[#17171d] text-gold-400 text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4 text-[#d4af37]" />
                <span>تتبع طلبي</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAdmin();
                }}
                className="w-full py-2.5 bg-[#17171d] text-neutral-200 text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#d4af37]" />
                <span>لوحة تحكم الأدمن</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenScriptModal();
                }}
                className="w-full py-2.5 bg-[#17171d] text-[#d4af37] text-xs font-semibold rounded-lg flex items-center justify-center gap-2"
              >
                <Code2 className="w-4 h-4" />
                <span>تحميل كود Python و ZIP</span>
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
