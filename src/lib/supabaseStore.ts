import { supabase } from './supabaseClient';
import {
  Perfume,
  Order,
  Customer,
  Category,
  HomepageSettings,
  WebsiteSettings,
  ThemeSettings,
  DeliverySettings,
  ContentSettings,
  SEOSettings,
  Promotion,
  OrderStatus,
} from '../types';
import { PERFUMES_DATA } from '../data/perfumes';

// =========================================================================
// 1. PRODUCTS MANAGEMENT (Direct Supabase CRUD)
// =========================================================================

export async function fetchProductsFromSupabase(): Promise<Perfume[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Supabase products fetch error:', error);
      return PERFUMES_DATA;
    }

    if (data && data.length > 0) {
      return data.map((row: any) => ({
        id: Number(row.id) || row.id,
        name: row.name,
        arabicName: row.arabic_name,
        badge: row.badge || '',
        category: row.category,
        price: Number(row.price),
        originalPrice: Number(row.original_price || row.price),
        volume: row.volume || '100 ml',
        rating: Number(row.rating || 5.0),
        reviewsCount: Number(row.reviews_count || 1),
        image: row.image,
        gallery: [row.image],
        sizes: ['30 ml', '50 ml', '100 ml'],
        sizeOptions: [
          { size: '30 ml', price: Math.round(Number(row.price) * 0.4), originalPrice: Math.round(Number(row.original_price || row.price) * 0.4) },
          { size: '50 ml', price: Math.round(Number(row.price) * 0.65), originalPrice: Math.round(Number(row.original_price || row.price) * 0.65) },
          { size: row.volume || '100 ml', price: Number(row.price), originalPrice: Number(row.original_price || row.price) },
        ],
        fragranceType: 'Eau de Parfum',
        inspiredBy: '',
        gender: 'unisex',
        isSpecialOffer: Boolean(row.badge && row.badge.includes('عرض')),
        isFeatured: true,
        isBestseller: Boolean(row.badge && row.badge.includes('الأكثر مبيعاً')),
        isNew: Boolean(row.badge && row.badge.includes('جديد')),
        isMostDemanded: false,
        isActive: true,
        stock: 25,
        sku: `LINA-${row.id}`,
        description: row.description || '',
        notes: {
          top: row.top_note || 'حمضيات منعشة',
          heart: row.heart_note || 'زهور نادرة وتوابل',
          base: row.base_note || 'أخشاب وعنبر ومسك',
        },
        longevity: row.longevity || 'يدوم أكثر من 18 ساعة',
        sillage: row.sillage || 'قوي ونفاذ جداً',
        season: row.season || 'جميع الفصول / مناسبات خاصة',
        inStock: row.in_stock !== false,
      }));
    }

    return [];
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return [];
  }
}

export async function saveProductToSupabase(perfume: Perfume): Promise<Perfume> {
  // Map strictly to existing columns in public.products
  const row = {
    id: String(perfume.id),
    name: perfume.name?.trim() || perfume.arabicName?.trim() || 'عطر فاخر',
    arabic_name: perfume.arabicName?.trim() || perfume.name?.trim() || 'عطر فاخر',
    price: Number(perfume.price) || 16,
    original_price: perfume.originalPrice ? Number(perfume.originalPrice) : null,
    category: perfume.category || 'عطور شرقية وفخمة',
    image: perfume.image || 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&q=80&w=600',
    description: perfume.description || null,
    in_stock: perfume.inStock !== false,
    volume: perfume.volume || '100 ml',
    badge: perfume.badge || null,
    top_note: perfume.notes?.top || null,
    heart_note: perfume.notes?.heart || null,
    base_note: perfume.notes?.base || null,
    longevity: perfume.longevity || 'يدوم أكثر من 18 ساعة',
    sillage: perfume.sillage || 'قوي ونفاذ جداً',
    season: perfume.season || 'جميع الفصول / مناسبات خاصة',
    rating: perfume.rating ? Number(perfume.rating) : 5.0,
    reviews_count: perfume.reviewsCount ? Number(perfume.reviewsCount) : 1,
  };

  console.log('[Supabase] Inserting/Upserting product to public.products:', row);

  const { data, error } = await supabase
    .from('products')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.error('[Supabase Error] Products INSERT/UPDATE failed:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    });
    throw new Error(`خطأ Supabase (${error.code}): ${error.message}${error.details ? ` - ${error.details}` : ''}`);
  }

  console.log('[Supabase] Product saved successfully in public.products:', data);
  return perfume;
}

export async function deleteProductFromSupabase(id: number | string): Promise<boolean> {
  console.log('[Supabase] Deleting product from public.products with id:', id);
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', String(id));

  if (error) {
    console.error('[Supabase Error] Products DELETE failed:', error);
    throw new Error(`خطأ Supabase عند الحذف (${error.code}): ${error.message}`);
  }

  console.log('[Supabase] Product deleted successfully from public.products');
  return true;
}

// Seed initial perfume items into Supabase with exact public.products columns
export async function seedInitialProductsToSupabase(): Promise<void> {
  const rows = PERFUMES_DATA.map((p) => ({
    id: String(p.id),
    name: p.name?.trim() || p.arabicName?.trim() || 'عطر فاخر',
    arabic_name: p.arabicName?.trim() || p.name?.trim() || 'عطر فاخر',
    price: Number(p.price) || 16,
    original_price: p.originalPrice ? Number(p.originalPrice) : null,
    category: p.category || 'عطور شرقية وفخمة',
    image: p.image,
    description: p.description || null,
    in_stock: p.inStock !== false,
    volume: p.volume || '100 ml',
    badge: p.badge || null,
    top_note: p.notes?.top || null,
    heart_note: p.notes?.heart || null,
    base_note: p.notes?.base || null,
    longevity: p.longevity || 'يدوم أكثر من 18 ساعة',
    sillage: p.sillage || 'قوي ونفاذ جداً',
    season: p.season || 'جميع الفصول / مناسبات خاصة',
    rating: p.rating ? Number(p.rating) : 5.0,
    reviews_count: p.reviewsCount ? Number(p.reviewsCount) : 1,
  }));

  console.log('[Supabase] Seeding default products to public.products count:', rows.length);
  const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
  if (error) {
    console.error('[Supabase Error] Seeding products failed:', error);
    throw new Error(`فشل استعادة العطور في Supabase: ${error.message}`);
  }
  console.log('[Supabase] Products successfully seeded into public.products');
}

export const seedSupabaseDefaults = seedInitialProductsToSupabase;

// =========================================================================
// 2. SUPABASE STORAGE (Product Images Upload)
// =========================================================================

export async function uploadProductImageToSupabase(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'jpg';
  const cleanName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
  const filePath = `products/${cleanName}`;

  try {
    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Storage bucket upload note:', uploadError.message);
      // Fallback: create base64 preview URL if bucket is not yet active in dashboard
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }

    const { data: publicUrlData } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.error('Error uploading image to Supabase Storage:', err);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });
  }
}

// =========================================================================
// 3. ORDERS MANAGEMENT (Direct Supabase CRUD)
// =========================================================================

export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase orders fetch error:', error.message);
      // Fallback to server API
      const res = await fetch('/api/orders');
      if (res.ok) {
        const json = await res.json();
        return json.orders || [];
      }
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map((row: any) => {
      let parsedItems = [];
      try {
        parsedItems = typeof row.items === 'string' ? JSON.parse(row.items) : (row.items || []);
      } catch {
        parsedItems = [];
      }

      if (parsedItems.length === 0 && row.perfume_name) {
        parsedItems = [{
          id: Number(row.perfume_id) || 1,
          name: row.perfume_name,
          arabicName: row.perfume_arabic_name || row.perfume_name,
          price: Number(row.total) / (Number(row.quantity) || 1),
          quantity: Number(row.quantity) || 1,
          image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
          volume: '30 ml',
          category: 'عطور فاخرة',
          badge: 'طلب مؤكد',
          originalPrice: Number(row.total),
          rating: 5,
          reviewsCount: 1,
          description: '',
          notes: { top: '', heart: '', base: '' },
        }];
      }

      return {
        id: String(row.id),
        trackingNumber: row.tracking_number,
        customerName: row.customer_name,
        phone: row.phone,
        address: row.address,
        city: row.city,
        delegation: row.delegation || '',
        items: parsedItems,
        subtotal: Number(row.subtotal || row.total),
        shippingFee: Number(row.shipping_fee || 0),
        total: Number(row.total),
        status: (row.status || 'pending') as OrderStatus,
        paymentMethod: (row.payment_method || 'cod') as 'cod' | 'd17',
        d17TransactionId: row.d17_tx_id || undefined,
        d17RecipientPhone: row.d17_recipient_phone || undefined,
        orderNotes: row.order_notes || undefined,
        createdAt: row.created_at,
      };
    });
  } catch (err) {
    console.error('Error fetching orders from Supabase:', err);
    return [];
  }
}

export async function insertOrderToSupabase(order: Order): Promise<boolean> {
  try {
    const primaryItem = order.items[0];
    const row = {
      tracking_number: order.trackingNumber,
      customer_name: order.customerName,
      phone: order.phone,
      city: order.city,
      delegation: order.delegation || '',
      address: order.address,
      order_notes: order.orderNotes || null,
      perfume_id: String(primaryItem?.id || '1'),
      perfume_name: primaryItem?.name || 'Lina Perfume',
      perfume_arabic_name: primaryItem?.arabicName || primaryItem?.name || '',
      quantity: order.items.reduce((sum, item) => sum + item.quantity, 0) || 1,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee,
      total: order.total,
      payment_method: order.paymentMethod,
      d17_tx_id: order.d17TransactionId || null,
      d17_recipient_phone: order.d17RecipientPhone || null,
      status: order.status || 'pending',
      items: order.items,
    };

    const { error } = await supabase.from('orders').insert(row);
    if (error) {
      console.warn('Supabase direct order insert warning:', error.message);
    }
    return !error;
  } catch (err) {
    console.error('Error inserting order into Supabase:', err);
    return false;
  }
}

export async function updateOrderStatusInSupabase(
  trackingNumber: string,
  status: OrderStatus
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('tracking_number', trackingNumber);

    if (error) {
      console.warn('Supabase order update warning:', error.message);
      // Fallback via server API
      await fetch(`/api/orders/${trackingNumber}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    }
    return true;
  } catch (err) {
    console.error('Error updating order status in Supabase:', err);
    return false;
  }
}

// =========================================================================
// 4. CATEGORIES MANAGEMENT (Direct Supabase CRUD)
// =========================================================================

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    name: "Men's Perfumes",
    arabicName: 'عطور رجالية',
    slug: 'men',
    description: 'تشكيلة العطور الرجالية الفاخرة ذات الثبات العالي والجاذبية الشرقية',
    image: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 1,
  },
  {
    id: 'cat-2',
    name: "Women's Perfumes",
    arabicName: 'عطور نسائية',
    slug: 'women',
    description: 'عطور أنثوية ساحرة تجمع بين نفحات الزهور والفواكه والأخشاب الناعمة',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 2,
  },
  {
    id: 'cat-3',
    name: 'Unisex Perfumes',
    arabicName: 'عطور للجنسين',
    slug: 'unisex',
    description: 'توليفات نيش راقية تناسب عشاق العطور الاستثنائية والفريدة',
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 3,
  },
  {
    id: 'cat-4',
    name: 'Special Offers',
    arabicName: 'العروض الخاصة',
    slug: 'offers',
    description: 'تخفيضات حصرية وباقات عطرية مميزة بأفضل الأسعار في تونس',
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80',
    active: true,
    order: 4,
  },
];

export async function fetchCategoriesFromSupabase(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('settings_data')
      .eq('settings_key', 'categories')
      .single();

    if (!error && data?.settings_data && Array.isArray(data.settings_data)) {
      return data.settings_data;
    }

    // Fallback: check server API
    const res = await fetch('/api/categories');
    if (res.ok) {
      const json = await res.json();
      if (json.categories && json.categories.length > 0) return json.categories;
    }

    return DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

export async function saveCategoriesToSupabase(categories: Category[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('store_settings')
      .upsert({
        settings_key: 'categories',
        settings_data: categories,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'settings_key' });

    if (error) {
      await fetch('/api/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      });
    }
    return true;
  } catch {
    return false;
  }
}

// =========================================================================
// 5. STORE SETTINGS & SHIPPING (Direct Supabase CRUD)
// =========================================================================

export async function fetchStoreSettingFromSupabase<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('settings_data')
      .eq('settings_key', key)
      .single();

    if (!error && data?.settings_data) {
      return data.settings_data as T;
    }

    // Check server API fallback
    const res = await fetch(`/api/settings/${key}`);
    if (res.ok) {
      const json = await res.json();
      if (json.settings) return json.settings as T;
    }

    return defaultValue;
  } catch {
    return defaultValue;
  }
}

export async function saveStoreSettingToSupabase(key: string, settingsData: any): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('store_settings')
      .upsert({
        settings_key: key,
        settings_data: settingsData,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'settings_key' });

    if (error) {
      await fetch(`/api/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsData),
      });
    }
    return true;
  } catch {
    return false;
  }
}

// =========================================================================
// 6. D17 SETTINGS (Direct Supabase CRUD)
// =========================================================================

export async function fetchD17SettingsFromSupabase(): Promise<{
  recipientPhone: string;
  recipientName: string;
  instructions: string;
}> {
  try {
    const { data, error } = await supabase
      .from('d17_settings')
      .select('*')
      .limit(1)
      .single();

    if (!error && data) {
      return {
        recipientPhone: data.recipient_phone || '+216 55 889 900',
        recipientName: data.recipient_name || 'متجر لينا شوب - Lina Shop Perfumes',
        instructions: data.instructions || '',
      };
    }

    const res = await fetch('/api/settings/d17');
    if (res.ok) {
      const json = await res.json();
      if (json.d17Settings) return json.d17Settings;
    }

    return {
      recipientPhone: '+216 55 889 900',
      recipientName: 'متجر لينا شوب - Lina Shop Perfumes',
      instructions: 'يرجى إرسال المبلغ عبر تطبيق D17 وإرفاق رقم العملية.',
    };
  } catch {
    return {
      recipientPhone: '+216 55 889 900',
      recipientName: 'متجر لينا شوب - Lina Shop Perfumes',
      instructions: 'يرجى إرسال المبلغ عبر تطبيق D17 وإرفاق رقم العملية.',
    };
  }
}

export async function saveD17SettingsToSupabase(recipientPhone: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('d17_settings')
      .upsert({
        id: 1,
        recipient_phone: recipientPhone,
        recipient_name: 'متجر لينا شوب - Lina Shop Perfumes',
        instructions: 'يرجى فتح تطبيق D17 للبريد التونسي وتحويل المبلغ للرقم الموضح ثم إرفاق رقم العملية.',
      }, { onConflict: 'id' });

    if (error) {
      await fetch('/api/settings/d17', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientPhone }),
      });
    }
    return true;
  } catch {
    return false;
  }
}

// =========================================================================
// 7. CUSTOMERS (Aggregated from Supabase Orders)
// =========================================================================

export async function fetchCustomersFromSupabase(): Promise<Customer[]> {
  const orders = await fetchOrdersFromSupabase();
  const customerMap = new Map<string, Customer>();

  for (const o of orders) {
    const key = o.phone || o.customerName;
    const existing = customerMap.get(key);
    if (existing) {
      existing.ordersCount += 1;
      existing.totalSpent += o.total;
      if (o.createdAt > existing.lastOrderDate) {
        existing.lastOrderDate = o.createdAt;
      }
      existing.orders?.push(o);
    } else {
      customerMap.set(key, {
        id: `cust-${customerMap.size + 1}`,
        name: o.customerName,
        phone: o.phone,
        governorate: o.city,
        ordersCount: 1,
        totalSpent: o.total,
        lastOrderDate: o.createdAt,
        orders: [o],
      });
    }
  }

  return Array.from(customerMap.values());
}
