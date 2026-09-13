#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Lina Shop - Haute Parfumerie Full E-Commerce Platform Generator
Creates:
1. lina-shop/ directory
2. lina-shop/index.html (HTML5 + Tailwind CSS + Vanilla JS SPA with Cart, Checkout, Order Tracking, Admin Panel & LocalStorage)
3. lina-shop/vercel.json (Vercel deployment configuration)
4. lina-shop.zip (Compressed archive ready for direct Vercel deployment)
"""

import os
import zipfile

PROJECT_DIR = "lina-shop"
ZIP_NAME = "lina-shop.zip"

HTML_CONTENT = """<!DOCTYPE html>
<html lang="ar" dir="rtl" class="scroll-smooth">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Lina Shop | لينا شوب - عطور فاخرة وعطور النيش</title>
  <meta name="description" content="متجر لينا شوب للعطور الفاخرة وعطور النيش. شحن سريع لكافة مناطق المملكة مع إمكانية التتبع المباشر وإدارة الطلبات." />
  <meta property="og:title" content="Lina Shop - متجر لينا للعطور الفاخرة" />
  <meta property="og:description" content="تسوق أفخم عطور النيش والعطور اليومية مع تجربة شراء متكاملة وتتبع فوري." />
  <meta property="og:type" content="website" />

  <!-- Fonts: Amiri & Tajawal & Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;700;800&display=swap" rel="stylesheet">

  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            gold: {
              300: '#f7e7b4',
              400: '#e5ca78',
              500: '#d4af37',
              600: '#b89428',
              700: '#94731a'
            },
            noir: {
              950: '#050507',
              900: '#08080a',
              800: '#101014',
              700: '#17171d',
              600: '#23232b',
              500: '#2f2f3a'
            }
          },
          fontFamily: {
            sans: ['Tajawal', 'sans-serif'],
            serif: ['Amiri', 'serif'],
            en: ['Plus Jakarta Sans', 'sans-serif']
          }
        }
      }
    }
  </script>

  <style>
    body {
      background-color: #08080a;
      color: #f4efe6;
      font-family: 'Tajawal', sans-serif;
    }
    .font-serif-luxury {
      font-family: 'Amiri', serif;
    }
    ::-webkit-scrollbar {
      width: 7px;
    }
    ::-webkit-scrollbar-track {
      background: #08080a;
    }
    ::-webkit-scrollbar-thumb {
      background: #23232b;
      border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
      background: #d4af37;
    }
  </style>
</head>
<body class="bg-noir-900 text-[#f4efe6] antialiased selection:bg-gold-500 selection:text-black min-h-screen flex flex-col">

  <!-- Top Announcement Bar -->
  <div class="bg-gradient-to-r from-noir-800 via-noir-700 to-noir-800 border-b border-gold-500/20 py-2 px-4 text-center text-xs tracking-wider text-gold-400">
    <div class="max-w-7xl mx-auto flex items-center justify-center gap-2">
      <span class="inline-block w-1.5 h-1.5 rounded-full bg-gold-400 animate-ping"></span>
      <span>شحن مجاني للطلبات فوق 350 ر.س + عيّنتان فاخرتان مجاناً مع كل طلب</span>
    </div>
  </div>

  <!-- Admin Mode Banner (Conditional) -->
  <div id="adminModeBanner" class="hidden bg-gold-500 text-noir-950 px-4 py-1.5 text-xs font-bold text-center flex items-center justify-center gap-4">
    <span>🛡️ وضع المشرف (الأدمن) مفعّل: يمكنك الآن حذف المنتجات مباشرة أو إضافة عطور جديدة.</span>
    <button onclick="logoutAdmin()" class="underline text-black hover:text-white transition-colors">تسجيل الخروج</button>
  </div>

  <!-- 1. NAVBAR -->
  <header class="sticky top-0 z-40 bg-noir-900/90 backdrop-blur-md border-b border-white/5 transition-all">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
      
      <!-- Mobile menu trigger -->
      <button id="mobileMenuBtn" class="md:hidden p-2 text-neutral-400 hover:text-white" aria-label="القائمة">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>

      <!-- Store Logo -->
      <a href="#" class="flex items-center gap-3 group">
        <div class="w-10 h-10 rounded-full border border-gold-500/40 flex items-center justify-center bg-noir-800 text-gold-400 font-serif-luxury text-xl font-bold group-hover:border-gold-400 transition-colors shadow-lg shadow-gold-500/10">
          L
        </div>
        <div class="flex flex-col text-right">
          <span class="font-en text-xl font-bold tracking-[0.2em] text-white group-hover:text-gold-400 transition-colors uppercase">Lina Shop</span>
          <span class="text-[10px] tracking-widest text-gold-400/80 -mt-1 font-serif-luxury">HAUTE PARFUMERIE</span>
        </div>
      </a>

      <!-- Desktop Links -->
      <nav class="hidden md:flex items-center gap-7 text-sm font-medium text-neutral-300">
        <a href="#hero" class="hover:text-gold-400 transition-colors py-1">الرئيسية</a>
        <a href="#products" class="hover:text-gold-400 transition-colors py-1">العطور الفاخرة</a>
        <a href="#about" class="hover:text-gold-400 transition-colors py-1">عن المتجر</a>
        <a href="#contact" class="hover:text-gold-400 transition-colors py-1">تواصل معنا</a>
      </nav>

      <!-- Action Buttons: Track Order + Admin Panel + Cart -->
      <div class="flex items-center gap-3">
        
        <!-- Track Order Button -->
        <button 
          onclick="openTrackingModal()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-noir-800 border border-white/10 hover:border-gold-500/50 text-xs text-neutral-200 hover:text-gold-400 transition-all active:scale-95"
          title="تتبع مسار طلبي"
        >
          <svg class="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span class="hidden sm:inline">تتبع طلبي</span>
        </button>

        <!-- Admin Panel Button -->
        <button 
          onclick="openAdminModal()"
          class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-noir-800 border border-white/10 hover:border-gold-500/50 text-xs text-neutral-200 hover:text-gold-400 transition-all active:scale-95"
          title="لوحة تحكم الأدمن"
        >
          <svg class="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
          <span class="hidden sm:inline">لوحة الأدمن</span>
        </button>

        <!-- Cart Button with Dynamic Badge -->
        <button 
          onclick="openCart()"
          id="cartBtn" 
          class="relative p-2.5 rounded-full bg-noir-800 border border-white/10 hover:border-gold-500/50 transition-all text-white hover:text-gold-400 flex items-center justify-center active:scale-95 group" 
          aria-label="سلة التسوق"
        >
          <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          <span id="cartCountBadge" class="absolute -top-1.5 -right-1.5 bg-gold-500 text-noir-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center scale-0 transition-transform duration-200">
            0
          </span>
        </button>
      </div>

    </div>

    <!-- Mobile Nav Drawer -->
    <div id="mobileNav" class="hidden md:hidden bg-noir-800 border-b border-white/10 px-6 py-4 space-y-3">
      <a href="#hero" class="block py-2 text-neutral-300 hover:text-gold-400 border-b border-white/5">الرئيسية</a>
      <a href="#products" class="block py-2 text-neutral-300 hover:text-gold-400 border-b border-white/5">العطور الفاخرة</a>
      <a href="#about" class="block py-2 text-neutral-300 hover:text-gold-400 border-b border-white/5">عن المتجر</a>
      <a href="#contact" class="block py-2 text-neutral-300 hover:text-gold-400 border-b border-white/5">تواصل معنا</a>
      <div class="pt-2 flex gap-3">
        <button onclick="openTrackingModal(); mobileNav.classList.add('hidden');" class="flex-1 py-2 text-xs bg-noir-700 text-gold-400 rounded-lg text-center">تتبع طلبي</button>
        <button onclick="openAdminModal(); mobileNav.classList.add('hidden');" class="flex-1 py-2 text-xs bg-noir-700 text-neutral-300 rounded-lg text-center">لوحة الأدمن</button>
      </div>
    </div>
  </header>

  <!-- 2. HERO SECTION -->
  <section id="hero" class="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
    <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold-500/10 rounded-full blur-[140px] pointer-events-none"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <!-- Text -->
        <div class="lg:col-span-7 text-right space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs tracking-wider">
            <span class="text-gold-400 font-serif">✦</span>
            <span>مجموعة نيش الحصرية لعام 2026 • توصيل فوري بالمملكة</span>
          </div>

          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold font-serif-luxury tracking-tight leading-[1.25] text-white">
            عبيرٌ يأسر الحواس..<br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600">
              وفخامةٌ تليق بمقامك الرفيع
            </span>
          </h1>

          <p class="text-base sm:text-lg text-neutral-400 max-w-2xl leading-relaxed">
            في <strong class="text-white">Lina Shop</strong> نصنع اللحظات الخالدة من خلال تركيبات عطرية نادرة، تمزج بين عراقة الشرق وسحر العطور الباريسية الفاخرة مع نظام تتبع مباشر لكافة مراحل طلبك.
          </p>

          <div class="pt-4 flex flex-wrap items-center gap-4">
            <a href="#products" class="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-noir-900 font-bold rounded-xl transition-all transform hover:-translate-y-0.5 shadow-lg shadow-gold-500/20 text-sm tracking-wide flex items-center gap-2">
              <span>تسوق المجموعة الآن</span>
              <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>

            <button onclick="openTrackingModal()" class="px-8 py-4 bg-noir-800 hover:bg-noir-700 text-neutral-200 hover:text-white border border-white/10 rounded-xl transition-colors text-sm font-medium flex items-center gap-2">
              <span>تتبع شحنتك الحالية</span>
            </button>
          </div>

          <!-- Trust points -->
          <div class="pt-6 border-t border-white/5 grid grid-cols-3 gap-4 text-xs text-neutral-400">
            <div class="flex items-center gap-2">
              <span class="text-gold-400">✦</span>
              <span>عطور أصلية 100%</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gold-400">✦</span>
              <span>ثبات وفوحان +24 ساعة</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-gold-400">✦</span>
              <span>تتبع فوري ومباشر</span>
            </div>
          </div>
        </div>

        <!-- Visual Hero Image -->
        <div class="lg:col-span-5 relative flex justify-center">
          <div class="relative w-full max-w-md">
            <div class="absolute inset-0 bg-gradient-to-tr from-gold-500/20 via-transparent to-white/5 rounded-3xl transform rotate-3 scale-95 filter blur-sm"></div>
            
            <div class="relative bg-noir-800/80 border border-white/10 rounded-3xl p-4 overflow-hidden backdrop-blur-sm shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80" 
                alt="Lina Shop Masterpiece" 
                class="w-full h-96 sm:h-[440px] object-cover rounded-2xl hover:scale-105 transition-transform duration-700"
              />
              <div class="absolute bottom-6 right-6 left-6 p-4 rounded-xl bg-noir-900/90 border border-white/10 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p class="text-xs text-gold-400 tracking-wider">العطر الأكثر طلباً</p>
                  <h4 class="text-base font-bold text-white font-serif-luxury">Lina Royal Musk • مسك لينا الملكي</h4>
                </div>
                <span class="text-gold-400 font-bold font-en text-lg">490 ر.س</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- 3. FEATURED PERFUMES GRID -->
  <section id="products" class="py-20 relative bg-noir-950/40 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
        <div class="text-right space-y-2">
          <p class="text-gold-400 text-xs tracking-widest uppercase font-serif-luxury font-bold">THE EXCLUSIVE COLLECTION</p>
          <h2 class="text-3xl sm:text-4xl font-bold font-serif-luxury text-white">
            تشكيلة العطور المخزنة
          </h2>
          <p class="text-neutral-400 text-sm">
            تم انتقاؤها بعناية، متصلة ديناميكياً مع قاعدة البيانات المحلية LocalStorage.
          </p>
        </div>

        <div class="flex items-center gap-3 self-start md:self-auto">
          <button onclick="openAdminModal()" class="px-4 py-2 rounded-xl bg-noir-800 border border-gold-500/30 text-gold-400 hover:bg-gold-500 hover:text-noir-900 text-xs font-semibold transition-all">
            + إضافة عطر جديد (الأدمن)
          </button>
        </div>
      </div>

      <!-- Perfumes Container Grid -->
      <div id="perfumesContainer" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        <!-- Rendered dynamically -->
      </div>

    </div>
  </section>

  <!-- 4. ABOUT US SECTION -->
  <section id="about" class="py-20 bg-noir-800/40 border-t border-white/5">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div class="lg:col-span-5 relative">
          <div class="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1000&q=80" 
              alt="دار لينا للعطور" 
              class="w-full h-[400px] object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-noir-900 via-transparent to-transparent"></div>
            <div class="absolute bottom-6 right-6 left-6 p-4 rounded-xl bg-noir-900/80 backdrop-blur-md border border-white/10">
              <span class="text-gold-400 text-xs font-semibold">حرفة وصنعة عطرية دقيقة</span>
              <p class="text-sm text-neutral-200 mt-1">ننتقي خلاصاتنا من مزارع غراس الفرنسية وغابات العود الكمبودي المعتق.</p>
            </div>
          </div>
        </div>

        <div class="lg:col-span-7 space-y-6 text-right">
          <span class="text-gold-400 text-xs tracking-widest uppercase">✦ قصة دار لينا شوب</span>
          <h3 class="text-3xl sm:text-4xl font-bold font-serif-luxury text-white leading-tight">
            شغفٌ يتحوّل إلى توقيعٍ عطريّ يعبّر عن هيبتك وأناقتك
          </h3>
          <p class="text-neutral-300 text-sm sm:text-base leading-relaxed">
            انطلقت دار <strong class="text-gold-400">Lina Shop</strong> لتقديم أرقى عطور النيش والعطور اليومية، المصممة خصيصاً للذوق الخليجي الأصيل مع لمسات باريسية كلاسيكية بتركيز Extrait و Eau de Parfum يدوم طويلاً.
          </p>

          <div class="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div>
              <p class="text-2xl sm:text-3xl font-bold text-gold-400 font-en">+18,500</p>
              <p class="text-xs text-neutral-400 mt-1">عميل راضٍ</p>
            </div>
            <div>
              <p class="text-2xl sm:text-3xl font-bold text-gold-400 font-en">100%</p>
              <p class="text-xs text-neutral-400 mt-1">زيوت نقية معتمدة</p>
            </div>
            <div>
              <p class="text-2xl sm:text-3xl font-bold text-gold-400 font-en">4.9 / 5</p>
              <p class="text-xs text-neutral-400 mt-1">تقييم العملاء</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>

  <!-- 5. FOOTER -->
  <footer id="contact" class="bg-noir-900 border-t border-white/10 pt-16 pb-10 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/5 text-right">
        
        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-full border border-gold-500/40 flex items-center justify-center bg-noir-800 text-gold-400 font-serif-luxury text-lg font-bold">
              L
            </div>
            <span class="font-en text-lg font-bold tracking-[0.2em] text-white uppercase">Lina Shop</span>
          </div>
          <p class="text-neutral-400 text-xs sm:text-sm leading-relaxed">
            المتجر الرائد للعطور الفاخرة وعطور النيش، بخيارات شراء ميسرة وتتبع فوري للشحنات حتى باب منزلك.
          </p>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-bold text-white font-serif-luxury">روابط سريعة</h4>
          <ul class="space-y-2 text-xs text-neutral-400">
            <li><a href="#hero" class="hover:text-gold-400 transition-colors">الصفحة الرئيسية</a></li>
            <li><a href="#products" class="hover:text-gold-400 transition-colors">مجموعة العطور</a></li>
            <li><button onclick="openTrackingModal()" class="hover:text-gold-400 transition-colors text-right">تتبع حالة الشحنة</button></li>
            <li><button onclick="openAdminModal()" class="hover:text-gold-400 transition-colors text-right">بوابة الإدارة (Admin)</button></li>
          </ul>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-bold text-white font-serif-luxury">خدمة العملاء</h4>
          <div class="text-xs text-neutral-400 space-y-1.5">
            <p>📍 المقر: الرياض - المملكة العربية السعودية</p>
            <p>✉️ البريد: care@linashop.com</p>
            <p>📞 الهاتف: +966 800 123 4567</p>
            <p>⏰ أوقات العمل: يومياً 9 ص - 11 م</p>
          </div>
        </div>

        <div class="space-y-3">
          <h4 class="text-sm font-bold text-white font-serif-luxury">طرق الدفع والتوصيل</h4>
          <div class="flex flex-wrap gap-2 text-xs font-en text-neutral-300">
            <span class="px-2.5 py-1 bg-noir-800 rounded border border-white/10">Mada</span>
            <span class="px-2.5 py-1 bg-noir-800 rounded border border-white/10">Apple Pay</span>
            <span class="px-2.5 py-1 bg-noir-800 rounded border border-white/10">Visa</span>
            <span class="px-2.5 py-1 bg-noir-800 rounded border border-white/10">Tamara</span>
          </div>
        </div>

      </div>

      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
        <p>© 2026 Lina Shop. جميع الحقوق محفوظة لمتجر لينا للعطور الفاخرة.</p>
        <p>تصميم وتطوير بأعلى معايير الويب الحديثة (SPA + LocalStorage)</p>
      </div>

    </div>
  </footer>

  <!-- ==================== MODALS ==================== -->

  <!-- A. CART DRAWER -->
  <div id="cartBackdrop" onclick="closeCart()" class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300"></div>
  <aside id="cartDrawer" class="fixed top-0 bottom-0 left-0 w-full max-w-md bg-noir-900 border-r border-white/10 z-50 transform -translate-x-full transition-transform duration-300 flex flex-col shadow-2xl">
    <div class="p-5 border-b border-white/10 flex items-center justify-between bg-noir-800/80">
      <div class="flex items-center gap-2">
        <svg class="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
        </svg>
        <h3 class="text-base font-bold text-white font-serif-luxury">سلة المشتريات (<span id="drawerCount">0</span>)</h3>
      </div>
      <button onclick="closeCart()" class="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5" aria-label="إغلاق">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>
    </div>

    <!-- Items list in cart -->
    <div id="cartItemsContainer" class="flex-1 overflow-y-auto p-5 space-y-4"></div>

    <div class="p-5 border-t border-white/10 bg-noir-800/80 space-y-4">
      <div class="flex items-center justify-between text-sm">
        <span class="text-neutral-400">المجموع الفرعي:</span>
        <span id="cartSubtotal" class="text-lg font-bold text-white font-en">0 ر.س</span>
      </div>
      
      <!-- Checkout Button triggers Checkout Modal -->
      <button 
        id="triggerCheckoutBtn" 
        onclick="openCheckoutModal()" 
        class="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-noir-900 font-bold rounded-xl text-sm transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <span>إتمام الشراء وإدخال بيانات الشحن</span>
        <svg class="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
        </svg>
      </button>
    </div>
  </aside>

  <!-- B. CHECKOUT MODAL (إدخال بيانات المشتري وتوليد رقم التتبع) -->
  <div id="checkoutModalBackdrop" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-4">
    <div id="checkoutModal" class="bg-noir-900 border border-gold-500/40 rounded-2xl max-w-lg w-full p-6 sm:p-8 relative shadow-2xl scale-95 transition-transform duration-300 max-h-[92vh] overflow-y-auto text-right">
      <button onclick="closeCheckoutModal()" class="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5" aria-label="إغلاق">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">✓</div>
        <div>
          <h3 class="text-xl font-bold text-white font-serif-luxury">إتمام الشراء وبيانات التوصيل</h3>
          <p class="text-xs text-neutral-400">يرجى إدخال بياناتك بدقة لتوليد بوليصة الشحن ورقم التتبع</p>
        </div>
      </div>

      <div class="bg-noir-800 p-3 rounded-xl border border-white/5 mb-5 flex justify-between items-center text-xs">
        <span class="text-neutral-400">إجمالي المشتريات:</span>
        <span id="checkoutOrderTotal" class="text-gold-400 font-bold font-en text-sm">0 ر.س</span>
      </div>

      <form id="checkoutForm" onsubmit="handleConfirmOrder(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-semibold text-neutral-300 mb-1">الاسم الكامل *</label>
          <input type="text" id="custName" required placeholder="مثال: محمد بن سعد القحطاني" class="w-full px-4 py-2.5 rounded-xl bg-noir-800 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none" />
        </div>

        <div>
          <label class="block text-xs font-semibold text-neutral-300 mb-1">رقم الهاتف الجوال *</label>
          <input type="tel" id="custPhone" required placeholder="مثال: 05XXXXXXXX" class="w-full px-4 py-2.5 rounded-xl bg-noir-800 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none text-left" dir="ltr" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-semibold text-neutral-300 mb-1">المدينة *</label>
            <input type="text" id="custCity" required placeholder="مثال: الرياض" class="w-full px-4 py-2.5 rounded-xl bg-noir-800 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-neutral-300 mb-1">الحي / المنطقة *</label>
            <input type="text" id="custDistrict" required placeholder="مثال: النرجس" class="w-full px-4 py-2.5 rounded-xl bg-noir-800 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-neutral-300 mb-1">العنوان بالتفصيل (اسم الشارع ورقم المبنى) *</label>
          <textarea id="custAddress" required rows="2" placeholder="شارع عثمان بن عفان، فيلا رقم..." class="w-full px-4 py-2.5 rounded-xl bg-noir-800 border border-white/10 text-white text-sm focus:border-gold-500 focus:outline-none"></textarea>
        </div>

        <button type="submit" class="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-noir-900 font-bold rounded-xl text-sm transition-all shadow-lg shadow-gold-500/20 mt-4">
          تأكيد الطلب وتوليد رقم التتبع الآن
        </button>
      </form>
    </div>
  </div>

  <!-- C. ORDER CONFIRMED SUCCESS POPUP -->
  <div id="orderSuccessBackdrop" class="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-4">
    <div id="orderSuccessModal" class="bg-noir-900 border border-gold-500/50 rounded-2xl max-w-md w-full p-6 sm:p-8 relative shadow-2xl scale-95 transition-transform duration-300 text-center space-y-4">
      <div class="w-16 h-16 mx-auto rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 text-2xl font-bold">
        ✓
      </div>
      
      <h3 class="text-2xl font-bold text-white font-serif-luxury">تم تأكيد طلبك بنجاح!</h3>
      <p class="text-xs text-neutral-300">
        شكراً لتسوقك من Lina Shop. تم تسجيل طلبك وتجهيزه بعناية. إليك رقم التتبع الخاص بك:
      </p>

      <div class="p-4 bg-noir-800 rounded-xl border border-gold-500/30 text-center space-y-2">
        <span class="text-[11px] text-neutral-400">رقم تتبع الشحنة المخصص لك:</span>
        <div class="flex items-center justify-center gap-2">
          <span id="generatedTrackingNum" class="text-xl font-bold text-gold-400 font-en tracking-wider">LINA-000000</span>
          <button onclick="copyGeneratedTracking()" class="p-1.5 bg-noir-700 hover:bg-gold-500 hover:text-black rounded text-neutral-300 transition-colors" title="نسخ">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"></path></svg>
          </button>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-3 pt-2">
        <button onclick="viewTrackingDirectly()" class="flex-1 py-3 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-noir-900 font-bold rounded-xl text-xs transition-all">
          تتبع طلبي الآن
        </button>
        <button onclick="closeOrderSuccessModal()" class="flex-1 py-3 bg-noir-800 hover:bg-noir-700 text-neutral-300 rounded-xl text-xs transition-all border border-white/10">
          متابعة التسوق
        </button>
      </div>
    </div>
  </div>

  <!-- D. ORDER TRACKING MODAL (قسم تتبع الطلب) -->
  <div id="trackingModalBackdrop" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-4">
    <div id="trackingModal" class="bg-noir-900 border border-gold-500/40 rounded-2xl max-w-xl w-full p-6 sm:p-8 relative shadow-2xl scale-95 transition-transform duration-300 max-h-[92vh] overflow-y-auto text-right">
      <button onclick="closeTrackingModal()" class="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5" aria-label="إغلاق">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <div class="flex items-center gap-2 mb-4">
        <div class="w-8 h-8 rounded-lg bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"></path></svg>
        </div>
        <div>
          <h3 class="text-xl font-bold text-white font-serif-luxury">نظام تتبع الشحنات المباشر</h3>
          <p class="text-xs text-neutral-400">أدخل رقم التتبع الخاص بك للاطلاع على الحالة وموقع الشحنة</p>
        </div>
      </div>

      <!-- Search Input -->
      <form onsubmit="handleSearchOrder(event)" class="flex gap-2 mb-6">
        <input 
          type="text" 
          id="trackingInput" 
          required 
          placeholder="مثال: LINA-749201" 
          class="flex-1 px-4 py-3 rounded-xl bg-noir-800 border border-white/15 text-white placeholder-neutral-500 text-sm focus:outline-none focus:border-gold-500 font-en uppercase text-left" 
          dir="ltr"
        />
        <button type="submit" class="px-6 py-3 bg-gold-500 hover:bg-gold-400 text-noir-900 font-bold text-xs rounded-xl transition-all shrink-0">
          بحث وتتبع
        </button>
      </form>

      <!-- Tracking Results Box -->
      <div id="trackingResultContainer" class="space-y-4">
        <div class="p-8 text-center text-neutral-500 text-xs bg-noir-800/40 rounded-xl border border-white/5">
          أدخل رقم التتبع واضغط على زر "بحث وتتبع" لعرض تفاصيل مسار الطلب.
        </div>
      </div>
    </div>
  </div>

  <!-- E. ADMIN PANEL MODAL (لوحة إدارة المنتجات المحمية بكلمة سر) -->
  <div id="adminModalBackdrop" class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 opacity-0 pointer-events-none transition-opacity duration-300 flex items-center justify-center p-4">
    <div id="adminModal" class="bg-noir-900 border border-gold-500/40 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl scale-95 transition-transform duration-300 max-h-[92vh] overflow-y-auto text-right">
      <button onclick="closeAdminModal()" class="absolute top-4 left-4 p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5" aria-label="إغلاق">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
      </button>

      <!-- Login View if not authenticated -->
      <div id="adminAuthSection" class="py-6 text-center space-y-4 max-w-sm mx-auto">
        <div class="w-12 h-12 mx-auto rounded-full bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold">
          🛡️
        </div>
        <h3 class="text-xl font-bold text-white font-serif-luxury">تسجيل دخول لوحة الأدمن</h3>
        <p class="text-xs text-neutral-400">أدخل كلمة مرور المشرف للوصول إلى إدارة العطور والطلبات (كلمة المرور الافتراضية: <code class="text-gold-400">admin123</code>)</p>
        
        <form onsubmit="handleAdminLogin(event)" class="space-y-3">
          <input 
            type="password" 
            id="adminPasswordInput" 
            required 
            placeholder="كلمة المرور..." 
            class="w-full px-4 py-3 rounded-xl bg-noir-800 border border-white/15 text-white text-sm focus:outline-none focus:border-gold-500 text-center" 
          />
          <button type="submit" class="w-full py-3 bg-gold-500 hover:bg-gold-400 text-noir-900 font-bold text-xs rounded-xl transition-all">
            دخول للوحة التحكم
          </button>
        </form>
      </div>

      <!-- Dashboard View if authenticated -->
      <div id="adminDashboardSection" class="hidden space-y-6">
        
        <div class="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h3 class="text-xl font-bold text-white font-serif-luxury">لوحة المشرف (Lina Admin)</h3>
            <p class="text-xs text-neutral-400">إدارة المنتجات، إضافة عطور جديدة، ومتابعة الطلبات وتحديث حالتها</p>
          </div>
          <button onclick="logoutAdmin()" class="px-3 py-1.5 bg-noir-800 hover:bg-red-500/20 text-red-400 rounded-lg text-xs border border-red-500/30 transition-colors">
            خروج
          </button>
        </div>

        <!-- Admin Tabs -->
        <div class="flex border-b border-white/10 gap-4 text-xs font-bold">
          <button onclick="switchAdminTab('products')" id="tabBtnProducts" class="py-2 border-b-2 border-gold-500 text-gold-400">
            العطور المخزنة وإضافة منتج
          </button>
          <button onclick="switchAdminTab('orders')" id="tabBtnOrders" class="py-2 border-b-2 border-transparent text-neutral-400 hover:text-white">
            طلبات الشراء (<span id="adminOrdersCount">0</span>)
          </button>
        </div>

        <!-- Tab 1: Products Management -->
        <div id="adminTabProducts" class="space-y-6">
          <!-- Add New Product Form -->
          <div class="p-5 rounded-xl bg-noir-800 border border-white/10 space-y-4">
            <h4 class="text-sm font-bold text-gold-400 flex items-center gap-1.5">
              <span>+ إضافة عطر فاخر جديد إلى المتجر</span>
            </h4>
            
            <form id="addProductForm" onsubmit="handleAddProduct(event)" class="space-y-3 text-xs">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-neutral-300 mb-1">اسم العطر بالعربية *</label>
                  <input type="text" id="newPerfumeArabicName" required placeholder="مثال: ياسمين نوار أوتار" class="w-full px-3 py-2 rounded-lg bg-noir-900 border border-white/10 text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-neutral-300 mb-1">الاسم بالإنجليزية *</label>
                  <input type="text" id="newPerfumeName" required placeholder="مثال: Jasmine Noir Accord" class="w-full px-3 py-2 rounded-lg bg-noir-900 border border-white/10 text-white focus:border-gold-500 focus:outline-none text-left" dir="ltr" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label class="block text-neutral-300 mb-1">السعر (ر.س) *</label>
                  <input type="number" id="newPerfumePrice" required min="1" placeholder="590" class="w-full px-3 py-2 rounded-lg bg-noir-900 border border-white/10 text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-neutral-300 mb-1">السعر قبل الخصم (ر.س)</label>
                  <input type="number" id="newPerfumeOriginalPrice" placeholder="690" class="w-full px-3 py-2 rounded-lg bg-noir-900 border border-white/10 text-white focus:border-gold-500 focus:outline-none" />
                </div>
                <div>
                  <label class="block text-neutral-300 mb-1">التصنيف / الشارة</label>
                  <input type="text" id="newPerfumeBadge" placeholder="نيش حصري" class="w-full px-3 py-2 rounded-lg bg-noir-900 border border-white/10 text-white focus:border-gold-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label class="block text-neutral-300 mb-1">رابط صورة العطر (Image URL) *</label>
                <input type="url" id="newPerfumeImage" required placeholder="https://images.unsplash.com/..." class="w-full px-3 py-2 rounded-lg bg-noir-900 border border-white/10 text-white focus:border-gold-500 focus:outline-none text-left" dir="ltr" />
              </div>

              <div>
                <label class="block text-neutral-300 mb-1">وصف العطر ونوتاته *</label>
                <textarea id="newPerfumeDesc" required rows="2" placeholder="تركيبة فريدة بنفحات الورد والمسك مع ثبات يدوم 24 ساعة..." class="w-full px-3 py-2 rounded-lg bg-noir-900 border border-white/10 text-white focus:border-gold-500 focus:outline-none"></textarea>
              </div>

              <button type="submit" class="w-full py-2.5 bg-gold-500 hover:bg-gold-400 text-noir-900 font-bold rounded-lg transition-all text-xs">
                حفظ العطر وإضافته فورياً للمتجر
              </button>
            </form>
          </div>

          <!-- Current Products List with Delete button -->
          <div class="space-y-3">
            <h4 class="text-sm font-bold text-white">قائمة العطور الحالية في المتجر:</h4>
            <div id="adminProductsList" class="space-y-2"></div>
          </div>
        </div>

        <!-- Tab 2: Orders Management -->
        <div id="adminTabOrders" class="hidden space-y-4">
          <h4 class="text-sm font-bold text-white">سجل الطلبات الواردة وتحديث مسار الشحن:</h4>
          <div id="adminOrdersList" class="space-y-3"></div>
        </div>

      </div>

    </div>
  </div>

  <!-- F. TOAST NOTIFICATION -->
  <div id="toastNotification" class="fixed bottom-6 left-6 z-50 bg-noir-800 border border-gold-500/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 transform translate-y-20 opacity-0 transition-all duration-300 pointer-events-none">
    <div class="w-7 h-7 rounded-full bg-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-sm">✓</div>
    <div>
      <h5 id="toastTitle" class="text-xs font-bold text-white">تنبيه</h5>
      <p id="toastMessage" class="text-[11px] text-neutral-300">الرسالة هنا</p>
    </div>
  </div>

  <!-- JAVASCRIPT APPLICATION CORE (SPA with LocalStorage) -->
  <script>
    // Initial Fallback Perfumes Data
    const DEFAULT_PERFUMES = [
      {
        id: 1,
        name: "Imperial Oud Noir",
        arabicName: "عود إمبريال نوار",
        badge: "الأكثر مبيعاً",
        category: "عطور النيش",
        price: 850,
        originalPrice: 980,
        volume: "100 ml - Extrait de Parfum",
        rating: 4.9,
        reviewsCount: 142,
        image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80",
        description: "تحفة نيش ملكية تجمع بين فخامة العود الكمبودي المعتق، ونفحات الزعفران الملكي، مع قاعدة عنبرية دافئة تمنحك هيبة آسرة."
      },
      {
        id: 2,
        name: "Velvet Rose & Tonka",
        arabicName: "مخمل الورد والتونكا",
        badge: "إصدار محدود",
        category: "العطور الفاخرة",
        price: 620,
        originalPrice: 750,
        volume: "100 ml - Eau de Parfum",
        rating: 4.8,
        reviewsCount: 98,
        image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
        description: "مزيج ساحر مفعم بالأنوثة والجاذبية يفتتح بعبير الورد الجوري النقي وتستقر على لمسات دافئة من حبوب التونكا وفانيليا مدغشقر."
      },
      {
        id: 3,
        name: "Smoky Amber & Cedar",
        arabicName: "العنبر المدخن والأرز",
        badge: "نيش مميز",
        category: "عطور النيش",
        price: 740,
        originalPrice: 890,
        volume: "100 ml - Extrait de Parfum",
        rating: 4.9,
        reviewsCount: 114,
        image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80",
        description: "عطر مفعم بالغموض والجاذبية للباحثين عن التميز؛ نغمات خشب الأرز الأطلسي مع بخور اللبان العماني وجاذبية العنبر الرمادي."
      },
      {
        id: 4,
        name: "Lina Royal Musk",
        arabicName: "مسك لينا الملكي",
        badge: "عطر يومي أيقوني",
        category: "العطور اليومية الراقية",
        price: 490,
        originalPrice: 590,
        volume: "100 ml - Eau de Parfum",
        rating: 5.0,
        reviewsCount: 230,
        image: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
        description: "الأيقونة الأكثر طلباً في متجرنا؛ نقاء المسك الأبيض الملكي مع انتعاش زهر البرتقال والياسمين ليكون توقيعك اليومي الذي لا يقاوم."
      }
    ];

    // State Variables
    let perfumes = [];
    let cart = [];
    let orders = [];
    let isAdminLoggedIn = false;
    let latestTrackingNumber = '';

    // 1. Initial Storage Load
    function initData() {
      // Perfumes
      try {
        const storedPerfumes = localStorage.getItem('lina_perfumes');
        if (storedPerfumes) {
          perfumes = JSON.parse(storedPerfumes);
        } else {
          perfumes = [...DEFAULT_PERFUMES];
          localStorage.setItem('lina_perfumes', JSON.stringify(perfumes));
        }
      } catch (e) {
        perfumes = [...DEFAULT_PERFUMES];
      }

      // Cart
      try {
        const storedCart = localStorage.getItem('lina_cart');
        if (storedCart) cart = JSON.parse(storedCart);
      } catch (e) { cart = []; }

      // Orders
      try {
        const storedOrders = localStorage.getItem('lina_orders');
        if (storedOrders) {
          orders = JSON.parse(storedOrders);
        } else {
          // Pre-seed a demo order for user testing
          orders = [
            {
              id: "ORD-1",
              trackingNumber: "LINA-784291",
              customerName: "سارة العتيبي",
              phone: "0551234567",
              city: "الرياض",
              district: "حطين",
              address: "طريق تركي الأول، فيلا 12",
              items: [{ id: 1, name: "Imperial Oud Noir", arabicName: "عود إمبريال نوار", price: 850, quantity: 1, image: DEFAULT_PERFUMES[0].image }],
              total: 850,
              status: "shipped", // processing, shipped, delivered
              date: "2026-09-12"
            }
          ];
          localStorage.setItem('lina_orders', JSON.stringify(orders));
        }
      } catch (e) { orders = []; }

      // Admin state
      isAdminLoggedIn = localStorage.getItem('lina_admin_logged') === 'true';
      updateAdminBanner();

      renderProductsGrid();
      updateCartUI();
    }

    function savePerfumes() {
      try { localStorage.setItem('lina_perfumes', JSON.stringify(perfumes)); } catch (e) {}
    }

    function saveOrders() {
      try { localStorage.setItem('lina_orders', JSON.stringify(orders)); } catch (e) {}
    }

    function saveCart() {
      try { localStorage.setItem('lina_cart', JSON.stringify(cart)); } catch (e) {}
    }

    // 2. Render Products in Store
    function renderProductsGrid() {
      const container = document.getElementById('perfumesContainer');
      if (!container) return;

      if (perfumes.length === 0) {
        container.innerHTML = `
          <div class="col-span-full text-center py-16 bg-noir-800/40 rounded-2xl border border-white/5">
            <p class="text-neutral-400 text-sm">لا توجد عطور متوفرة حالياً.</p>
            <button onclick="resetDefaultPerfumes()" class="mt-3 px-4 py-2 bg-gold-500 text-black font-bold text-xs rounded-lg">استعادة عطور العرض الافتراضية</button>
          </div>
        `;
        return;
      }

      container.innerHTML = perfumes.map(item => `
        <div class="group bg-noir-800/80 rounded-2xl border border-white/10 hover:border-gold-500/50 p-4 transition-all duration-300 flex flex-col justify-between hover:shadow-2xl hover:shadow-gold-500/10 relative">
          
          <!-- Delete button if Admin logged in -->
          ${isAdminLoggedIn ? `
            <button 
              onclick="deleteProduct(${item.id})" 
              class="absolute top-2 left-2 z-10 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg text-xs shadow-lg flex items-center gap-1"
              title="حذف هذا العطر من المتجر"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              <span>حذف</span>
            </button>
          ` : ''}

          <div class="relative overflow-hidden rounded-xl bg-noir-900 aspect-square mb-4">
            <img 
              src="${item.image}" 
              alt="${item.arabicName}" 
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute top-3 right-3">
              <span class="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-noir-900/90 text-gold-400 border border-gold-500/30 backdrop-blur-sm">
                ${item.badge || 'عطر فاخر'}
              </span>
            </div>
          </div>

          <div class="space-y-2 text-right flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between text-[11px] text-neutral-400">
                <span>${item.volume || '100 ml'}</span>
                <span class="text-gold-400 font-bold">★ ${item.rating || '4.9'}</span>
              </div>
              <h3 class="text-base font-bold text-white font-serif-luxury mt-1 group-hover:text-gold-400 transition-colors">
                ${item.arabicName}
              </h3>
              <p class="text-xs text-neutral-400 font-en">${item.name || ''}</p>
              <p class="text-[11px] text-neutral-400 mt-1 line-clamp-2">${item.description || ''}</p>
            </div>

            <div class="pt-3 border-t border-white/5 space-y-3">
              <div class="flex items-baseline justify-between">
                <div class="flex items-baseline gap-2">
                  <span class="text-lg font-bold text-gold-400 font-en">${item.price} ر.س</span>
                  ${item.originalPrice ? `<span class="text-xs text-neutral-500 line-through font-en">${item.originalPrice} ر.س</span>` : ''}
                </div>
              </div>

              <button 
                onclick="addToCart(${item.id})" 
                class="w-full py-2.5 bg-noir-700 hover:bg-gold-500 text-neutral-200 hover:text-noir-900 border border-white/10 hover:border-gold-500 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 group/btn active:scale-95"
              >
                <svg class="w-4 h-4 text-gold-400 group-hover/btn:text-noir-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
                <span>أضف إلى السلة</span>
              </button>
            </div>
          </div>

        </div>
      `).join('');
    }

    // 3. Cart Management
    function addToCart(id) {
      const product = perfumes.find(p => p.id === id);
      if (!product) return;

      const existing = cart.find(i => i.id === id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      saveCart();
      updateCartUI();
      showToast('تمت الإضافة للسلة', `تمت إضافة ${product.arabicName} بنجاح.`);
    }

    function updateQuantity(id, delta) {
      const item = cart.find(i => i.id === id);
      if (!item) return;
      item.quantity += delta;
      if (item.quantity <= 0) {
        cart = cart.filter(i => i.id !== id);
      }
      saveCart();
      updateCartUI();
    }

    function removeFromCart(id) {
      cart = cart.filter(i => i.id !== id);
      saveCart();
      updateCartUI();
    }

    function updateCartUI() {
      const countBadge = document.getElementById('cartCountBadge');
      const drawerCount = document.getElementById('drawerCount');
      const container = document.getElementById('cartItemsContainer');
      const subtotalEl = document.getElementById('cartSubtotal');
      const checkoutBtn = document.getElementById('triggerCheckoutBtn');

      const totalItems = cart.reduce((sum, i) => sum + i.quantity, 0);
      const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

      if (totalItems > 0) {
        countBadge.textContent = totalItems;
        countBadge.classList.remove('scale-0');
        countBadge.classList.add('scale-100');
      } else {
        countBadge.classList.remove('scale-100');
        countBadge.classList.add('scale-0');
      }

      if (drawerCount) drawerCount.textContent = totalItems;
      if (subtotalEl) subtotalEl.textContent = subtotal.toLocaleString() + ' ر.س';

      if (cart.length === 0) {
        if (checkoutBtn) checkoutBtn.disabled = true;
        if (container) {
          container.innerHTML = `
            <div class="text-center py-20 space-y-3">
              <p class="text-sm text-neutral-400">سلة التسوق فارغة حالياً</p>
              <button onclick="closeCart(); location.href='#products'" class="text-xs text-gold-400 underline">استكشف العطور الآن</button>
            </div>
          `;
        }
      } else {
        if (checkoutBtn) checkoutBtn.disabled = false;
        if (container) {
          container.innerHTML = cart.map(item => `
            <div class="flex items-center gap-3 p-3 rounded-xl bg-noir-800 border border-white/5 text-right">
              <img src="${item.image}" alt="${item.arabicName}" class="w-16 h-16 object-cover rounded-lg shrink-0 border border-white/10" />
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-bold text-white truncate font-serif-luxury">${item.arabicName}</h4>
                <p class="text-xs text-gold-400 font-en font-bold">${item.price} ر.س</p>
                <div class="flex items-center gap-2 mt-2">
                  <div class="flex items-center border border-white/10 rounded-lg bg-noir-900">
                    <button onclick="updateQuantity(${item.id}, -1)" class="px-2 py-0.5 text-neutral-400 hover:text-white text-xs">-</button>
                    <span class="px-2 text-xs font-bold text-white font-en">${item.quantity}</span>
                    <button onclick="updateQuantity(${item.id}, 1)" class="px-2 py-0.5 text-neutral-400 hover:text-white text-xs">+</button>
                  </div>
                  <button onclick="removeFromCart(${item.id})" class="text-neutral-500 hover:text-red-400 text-xs p-1" title="حذف">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
              <div class="text-left">
                <span class="text-xs font-bold text-white font-en">${(item.price * item.quantity).toLocaleString()} ر.س</span>
              </div>
            </div>
          `).join('');
        }
      }
    }

    function openCart() {
      document.getElementById('cartBackdrop').classList.remove('opacity-0', 'pointer-events-none');
      document.getElementById('cartDrawer').classList.remove('-translate-x-full');
      document.body.classList.add('overflow-hidden');
    }

    function closeCart() {
      document.getElementById('cartBackdrop').classList.add('opacity-0', 'pointer-events-none');
      document.getElementById('cartDrawer').classList.add('-translate-x-full');
      document.body.classList.remove('overflow-hidden');
    }

    // 4. CHECKOUT LOGIC & TRACKING NUMBER GENERATION
    function openCheckoutModal() {
      closeCart();
      const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      document.getElementById('checkoutOrderTotal').textContent = subtotal.toLocaleString() + ' ر.س';

      const backdrop = document.getElementById('checkoutModalBackdrop');
      const modal = document.getElementById('checkoutModal');
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.remove('scale-95');
      modal.classList.add('scale-100');
      document.body.classList.add('overflow-hidden');
    }

    function closeCheckoutModal() {
      const backdrop = document.getElementById('checkoutModalBackdrop');
      const modal = document.getElementById('checkoutModal');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      modal.classList.remove('scale-100');
      modal.classList.add('scale-95');
      document.body.classList.remove('overflow-hidden');
    }

    function generateTrackingCode() {
      // Random 6 digit number
      const randDigits = Math.floor(100000 + Math.random() * 900000);
      return `LINA-${randDigits}`;
    }

    function handleConfirmOrder(e) {
      e.preventDefault();
      const name = document.getElementById('custName').value.trim();
      const phone = document.getElementById('custPhone').value.trim();
      const city = document.getElementById('custCity').value.trim();
      const district = document.getElementById('custDistrict').value.trim();
      const address = document.getElementById('custAddress').value.trim();

      if (!name || !phone || !city) return;

      const subtotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const trackingCode = generateTrackingCode();
      latestTrackingNumber = trackingCode;

      const newOrder = {
        id: `ORD-${Date.now()}`,
        trackingNumber: trackingCode,
        customerName: name,
        phone: phone,
        city: city,
        district: district,
        address: address,
        items: [...cart],
        total: subtotal,
        status: "processing", // initial status
        date: new Date().toISOString().split('T')[0]
      };

      orders.unshift(newOrder);
      saveOrders();

      // Clear cart
      cart = [];
      saveCart();
      updateCartUI();

      closeCheckoutModal();
      document.getElementById('checkoutForm').reset();

      // Open Success Popup with Tracking Code
      document.getElementById('generatedTrackingNum').textContent = trackingCode;
      const successBackdrop = document.getElementById('orderSuccessBackdrop');
      const successModal = document.getElementById('orderSuccessModal');
      successBackdrop.classList.remove('opacity-0', 'pointer-events-none');
      successModal.classList.remove('scale-95');
      successModal.classList.add('scale-100');

      showToast('تم تأكيد الطلب!', `رقم التتبع: ${trackingCode}`);
    }

    function closeOrderSuccessModal() {
      const successBackdrop = document.getElementById('orderSuccessBackdrop');
      const successModal = document.getElementById('orderSuccessModal');
      successBackdrop.classList.add('opacity-0', 'pointer-events-none');
      successModal.classList.remove('scale-100');
      successModal.classList.add('scale-95');
      document.body.classList.remove('overflow-hidden');
    }

    function copyGeneratedTracking() {
      navigator.clipboard.writeText(latestTrackingNumber);
      showToast('تم النسخ', 'تم نسخ رقم التتبع إلى الحافظة.');
    }

    function viewTrackingDirectly() {
      closeOrderSuccessModal();
      openTrackingModal();
      document.getElementById('trackingInput').value = latestTrackingNumber;
      executeTrackingSearch(latestTrackingNumber);
    }

    // 5. ORDER TRACKING SECTION (قسم تتبع الطلب)
    function openTrackingModal() {
      const backdrop = document.getElementById('trackingModalBackdrop');
      const modal = document.getElementById('trackingModal');
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.remove('scale-95');
      modal.classList.add('scale-100');
      document.body.classList.add('overflow-hidden');
    }

    function closeTrackingModal() {
      const backdrop = document.getElementById('trackingModalBackdrop');
      const modal = document.getElementById('trackingModal');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      modal.classList.remove('scale-100');
      modal.classList.add('scale-95');
      document.body.classList.remove('overflow-hidden');
    }

    function handleSearchOrder(e) {
      e.preventDefault();
      const code = document.getElementById('trackingInput').value.trim().toUpperCase();
      executeTrackingSearch(code);
    }

    function executeTrackingSearch(code) {
      const container = document.getElementById('trackingResultContainer');
      const order = orders.find(o => o.trackingNumber.toUpperCase() === code);

      if (!order) {
        container.innerHTML = `
          <div class="p-6 text-center bg-noir-800 rounded-xl border border-red-500/30 space-y-2">
            <span class="text-2xl">⚠️</span>
            <h4 class="text-sm font-bold text-red-400">لم يتم العثور على شحنة بهذا الرقم</h4>
            <p class="text-xs text-neutral-400">يرجى التأكد من كتابة الرمز بشكل صحيح مثل: <code class="text-gold-400">LINA-XXXXXX</code> أو الطلب من الأدمن التحقق من مسار الطلب.</p>
          </div>
        `;
        return;
      }

      // Status translation & timeline
      const statuses = [
        { key: 'processing', label: 'قيد التجهيز في دار لينا', desc: 'يتم الآن تعبئة العطر وتجهيز العينات الفاخرة' },
        { key: 'shipped', label: 'تم الشحن مع المندوب', desc: 'الشحنة في طريقها إلى عنوانك' },
        { key: 'delivered', label: 'تم التوصيل بنجاح', desc: 'تم استلام الشحنة وتأكيد التسليم' }
      ];

      const currentIdx = order.status === 'delivered' ? 2 : (order.status === 'shipped' ? 1 : 0);

      container.innerHTML = `
        <div class="p-5 bg-noir-800 rounded-xl border border-gold-500/30 space-y-5 text-right">
          
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <span class="text-[11px] text-neutral-400 block">رقم التتبع:</span>
              <span class="text-lg font-bold text-gold-400 font-en">${order.trackingNumber}</span>
            </div>
            <div class="text-left">
              <span class="text-[11px] text-neutral-400 block">تاريخ الطلب:</span>
              <span class="text-xs text-white font-en">${order.date || 'اليوم'}</span>
            </div>
          </div>

          <!-- Customer details -->
          <div class="text-xs text-neutral-300 space-y-1 bg-noir-900/60 p-3 rounded-lg border border-white/5">
            <p><strong class="text-white">المستلم:</strong> ${order.customerName} (${order.phone})</p>
            <p><strong class="text-white">العنوان:</strong> ${order.city} - ${order.district || ''} - ${order.address || ''}</p>
          </div>

          <!-- Visual Timeline -->
          <div class="py-2 space-y-4">
            <h5 class="text-xs font-bold text-white">مسار الشحنة:</h5>
            <div class="space-y-3">
              ${statuses.map((st, idx) => {
                const isPassed = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return `
                  <div class="flex items-start gap-3">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isPassed ? 'bg-gold-500 text-black' : 'bg-noir-700 text-neutral-500'}">
                      ${isPassed ? '✓' : (idx + 1)}
                    </div>
                    <div>
                      <h6 class="text-xs font-bold ${isCurrent ? 'text-gold-400 font-serif-luxury text-sm' : (isPassed ? 'text-white' : 'text-neutral-500')}">${st.label}</h6>
                      <p class="text-[11px] text-neutral-400">${st.desc}</p>
                    </div>
                  </div>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Items Ordered list -->
          <div class="border-t border-white/10 pt-3 space-y-2">
            <span class="text-xs font-bold text-white block">العطور المطلوبة (${order.items.length}):</span>
            <div class="space-y-1.5 max-h-36 overflow-y-auto">
              ${order.items.map(i => `
                <div class="flex justify-between items-center text-xs text-neutral-300 bg-noir-900/40 p-2 rounded">
                  <span>${i.arabicName} × ${i.quantity}</span>
                  <span class="text-gold-400 font-en font-bold">${(i.price * i.quantity)} ر.س</span>
                </div>
              `).join('')}
            </div>
            <div class="flex justify-between items-center text-xs pt-2 border-t border-white/5 font-bold">
              <span class="text-white">الإجمالي النهائي:</span>
              <span class="text-gold-400 font-en text-sm">${order.total} ر.س</span>
            </div>
          </div>

        </div>
      `;
    }

    // 6. ADMIN PANEL LOGIC (إدارة المنتجات، حذف، إضافة، كلمة سر)
    function openAdminModal() {
      const backdrop = document.getElementById('adminModalBackdrop');
      const modal = document.getElementById('adminModal');
      backdrop.classList.remove('opacity-0', 'pointer-events-none');
      modal.classList.remove('scale-95');
      modal.classList.add('scale-100');
      document.body.classList.add('overflow-hidden');

      if (isAdminLoggedIn) {
        document.getElementById('adminAuthSection').classList.add('hidden');
        document.getElementById('adminDashboardSection').classList.remove('hidden');
        renderAdminProductsList();
        renderAdminOrdersList();
      } else {
        document.getElementById('adminAuthSection').classList.remove('hidden');
        document.getElementById('adminDashboardSection').classList.add('hidden');
      }
    }

    function closeAdminModal() {
      const backdrop = document.getElementById('adminModalBackdrop');
      const modal = document.getElementById('adminModal');
      backdrop.classList.add('opacity-0', 'pointer-events-none');
      modal.classList.remove('scale-100');
      modal.classList.add('scale-95');
      document.body.classList.remove('overflow-hidden');
    }

    function handleAdminLogin(e) {
      e.preventDefault();
      const pass = document.getElementById('adminPasswordInput').value;
      if (pass === 'admin123') {
        isAdminLoggedIn = true;
        localStorage.setItem('lina_admin_logged', 'true');
        updateAdminBanner();
        document.getElementById('adminAuthSection').classList.add('hidden');
        document.getElementById('adminDashboardSection').classList.remove('hidden');
        renderAdminProductsList();
        renderAdminOrdersList();
        renderProductsGrid();
        showToast('مرحباً بك', 'تم تسجيل دخول الأدمن بنجاح.');
      } else {
        showToast('خطأ', 'كلمة المرور غير صحيحة! جرب: admin123');
      }
    }

    function logoutAdmin() {
      isAdminLoggedIn = false;
      localStorage.setItem('lina_admin_logged', 'false');
      updateAdminBanner();
      renderProductsGrid();
      closeAdminModal();
      showToast('تم الخروج', 'تم إنهاء جلسة الأدمن بنجاح.');
    }

    function updateAdminBanner() {
      const banner = document.getElementById('adminModeBanner');
      if (banner) {
        if (isAdminLoggedIn) banner.classList.remove('hidden');
        else banner.classList.add('hidden');
      }
    }

    function switchAdminTab(tab) {
      const pTab = document.getElementById('adminTabProducts');
      const oTab = document.getElementById('adminTabOrders');
      const pBtn = document.getElementById('tabBtnProducts');
      const oBtn = document.getElementById('tabBtnOrders');

      if (tab === 'products') {
        pTab.classList.remove('hidden');
        oTab.classList.add('hidden');
        pBtn.classList.add('border-gold-500', 'text-gold-400');
        pBtn.classList.remove('border-transparent', 'text-neutral-400');
        oBtn.classList.remove('border-gold-500', 'text-gold-400');
        oBtn.classList.add('border-transparent', 'text-neutral-400');
      } else {
        pTab.classList.add('hidden');
        oTab.classList.remove('hidden');
        oBtn.classList.add('border-gold-500', 'text-gold-400');
        oBtn.classList.remove('border-transparent', 'text-neutral-400');
        pBtn.classList.remove('border-gold-500', 'text-gold-400');
        pBtn.classList.add('border-transparent', 'text-neutral-400');
      }
    }

    function handleAddProduct(e) {
      e.preventDefault();
      const arabicName = document.getElementById('newPerfumeArabicName').value.trim();
      const name = document.getElementById('newPerfumeName').value.trim();
      const price = parseFloat(document.getElementById('newPerfumePrice').value);
      const originalPrice = parseFloat(document.getElementById('newPerfumeOriginalPrice').value) || price;
      const badge = document.getElementById('newPerfumeBadge').value.trim() || 'عطر نيش جديد';
      const image = document.getElementById('newPerfumeImage').value.trim();
      const description = document.getElementById('newPerfumeDesc').value.trim();

      const newPerfume = {
        id: Date.now(),
        name,
        arabicName,
        price,
        originalPrice,
        badge,
        category: "عطور فاخرة",
        volume: "100 ml - Eau de Parfum",
        rating: 5.0,
        reviewsCount: 1,
        image,
        description
      };

      perfumes.unshift(newPerfume);
      savePerfumes();
      renderProductsGrid();
      renderAdminProductsList();
      document.getElementById('addProductForm').reset();
      showToast('تمت الإضافة', `تمت إضافة عطر "${arabicName}" للمتجر بنجاح.`);
    }

    function deleteProduct(id) {
      if (!confirm('هل أنت متأكد من رغبتك في حذف هذا العطر من المتجر؟')) return;
      perfumes = perfumes.filter(p => p.id !== id);
      savePerfumes();
      renderProductsGrid();
      renderAdminProductsList();
      showToast('تم الحذف', 'تم حذف المنتج من قاعدة البيانات المحلية.');
    }

    function resetDefaultPerfumes() {
      perfumes = [...DEFAULT_PERFUMES];
      savePerfumes();
      renderProductsGrid();
      renderAdminProductsList();
      showToast('تم الاسترجاع', 'تم استرجاع قائمة العطور الأساسية.');
    }

    function renderAdminProductsList() {
      const container = document.getElementById('adminProductsList');
      if (!container) return;

      if (perfumes.length === 0) {
        container.innerHTML = '<p class="text-xs text-neutral-500">لا توجد عطور مخزنة.</p>';
        return;
      }

      container.innerHTML = perfumes.map(p => `
        <div class="flex items-center justify-between p-3 rounded-xl bg-noir-800 border border-white/5 text-right">
          <div class="flex items-center gap-3">
            <img src="${p.image}" alt="${p.arabicName}" class="w-12 h-12 object-cover rounded-lg border border-white/10" />
            <div>
              <h5 class="text-xs font-bold text-white font-serif-luxury">${p.arabicName}</h5>
              <p class="text-[10px] text-neutral-400 font-en">${p.name} • ${p.price} ر.س</p>
            </div>
          </div>
          <button onclick="deleteProduct(${p.id})" class="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg text-xs transition-colors">
            حذف
          </button>
        </div>
      `).join('');
    }

    function renderAdminOrdersList() {
      const container = document.getElementById('adminOrdersList');
      const countBadge = document.getElementById('adminOrdersCount');
      if (countBadge) countBadge.textContent = orders.length;
      if (!container) return;

      if (orders.length === 0) {
        container.innerHTML = '<p class="text-xs text-neutral-500 text-center py-6">لا توجد طلبات مسجلة حتى الآن.</p>';
        return;
      }

      container.innerHTML = orders.map(o => `
        <div class="p-4 rounded-xl bg-noir-800 border border-white/10 space-y-2.5 text-right text-xs">
          <div class="flex justify-between items-center">
            <div>
              <span class="text-gold-400 font-en font-bold text-sm">${o.trackingNumber}</span>
              <span class="text-neutral-400 text-[10px] block">المشتري: ${o.customerName} (${o.phone})</span>
            </div>
            <div class="text-left">
              <span class="text-white font-en font-bold text-sm">${o.total} ر.س</span>
              <span class="text-neutral-500 text-[10px] block">${o.date || ''}</span>
            </div>
          </div>

          <p class="text-neutral-300 text-[11px]">العنوان: ${o.city} - ${o.address || ''}</p>

          <!-- Update Status Controls -->
          <div class="flex items-center justify-between pt-2 border-t border-white/5">
            <span class="text-neutral-400">تحديث حالة الشحن:</span>
            <select onchange="updateOrderStatus('${o.trackingNumber}', this.value)" class="bg-noir-900 border border-white/15 text-gold-400 rounded-lg px-2 py-1 text-xs focus:outline-none">
              <option value="processing" ${o.status === 'processing' ? 'selected' : ''}>قيد التجهيز</option>
              <option value="shipped" ${o.status === 'shipped' ? 'selected' : ''}>تم الشحن</option>
              <option value="delivered" ${o.status === 'delivered' ? 'selected' : ''}>تم التوصيل</option>
            </select>
          </div>
        </div>
      `).join('');
    }

    function updateOrderStatus(trackingCode, newStatus) {
      const order = orders.find(o => o.trackingNumber === trackingCode);
      if (order) {
        order.status = newStatus;
        saveOrders();
        showToast('تم تحديث الطلب', `تم تغيير حالة الشحنة (${trackingCode}) إلى: ${newStatus}`);
      }
    }

    // 7. Toast Alerts
    let toastTimer = null;
    function showToast(title, message) {
      const toast = document.getElementById('toastNotification');
      document.getElementById('toastTitle').textContent = title;
      document.getElementById('toastMessage').textContent = message;

      toast.classList.remove('translate-y-20', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');

      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.classList.remove('translate-y-0', 'opacity-100');
        toast.classList.add('translate-y-20', 'opacity-0');
      }, 3500);
    }

    // 8. Mobile Menu
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (mobileBtn && mobileNav) {
      mobileBtn.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
      });
    }

    // Boot
    document.addEventListener('DOMContentLoaded', () => {
      initData();
    });
  </script>

</body>
</html>
"""

VERCEL_CONFIG = """{
  "version": 2,
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
"""

def create_lina_shop_project():
    print("=" * 65)
    print("  Lina Shop - Haute Parfumerie E-Commerce Generator")
    print("=" * 65)

    # 1. Create project folder
    print(f"[*] 1. إنشاء مجلد المشروع: '{PROJECT_DIR}'...")
    os.makedirs(PROJECT_DIR, exist_ok=True)

    # 2. Create index.html
    index_path = os.path.join(PROJECT_DIR, "index.html")
    print(f"[*] 2. إنشاء ملف الواجهة الكاملة مع JavaScript و Tailwind: '{index_path}'...")
    with open(index_path, "w", encoding="utf-8") as f:
        f.write(HTML_CONTENT)

    # 3. Create vercel.json
    vercel_path = os.path.join(PROJECT_DIR, "vercel.json")
    print(f"[*] 3. إنشاء ملف إعدادات النشر على Vercel: '{vercel_path}'...")
    with open(vercel_path, "w", encoding="utf-8") as f:
        f.write(VERCEL_CONFIG)

    # 4. Zip into lina-shop.zip
    print(f"[*] 4. ضغط مجلد المشروع آلياً إلى: '{ZIP_NAME}'...")
    with zipfile.ZipFile(ZIP_NAME, "w", zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(PROJECT_DIR):
            for file in files:
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, start=os.path.dirname(PROJECT_DIR) or ".")
                zipf.write(file_path, arcname)

    print("-" * 65)
    print(f"[✓] تم توليد المشروع بالكامل بنجاح!")
    print(f"    - المسار: {os.path.abspath(PROJECT_DIR)}")
    print(f"    - الملف المضغوط الجاهز للنشر: {os.path.abspath(ZIP_NAME)}")
    print("=" * 65)

if __name__ == "__main__":
    create_lina_shop_project()
