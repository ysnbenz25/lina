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
      console.warn('Supabase products fetch warning:', error.message);
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
        volume: row.volume || '30 ml',
        rating: Number(row.rating || 5.0),
        reviewsCount: Number(row.reviews_count || 1),
        image: row.image,
        gallery: Array.isArray(row.gallery) ? row.gallery : [row.image],
        sizes: Array.isArray(row.sizes) ? row.sizes : ['30 ml', '50 ml', '100 ml'],
        sizeOptions: row.sizes_options || row.size_options || undefined,
        fragranceType: row.fragrance_type || '',
        inspiredBy: row.inspired_by || '',
        gender: row.gender || 'unisex',
        isSpecialOffer: Boolean(row.is_special_offer),
        isFeatured: Boolean(row.is_featured ?? true),
        isBestseller: Boolean(row.is_bestseller),
        isNew: Boolean(row.is_new),
        isMostDemanded: Boolean(row.is_most_demanded),
        isActive: row.is_active !== false,
        stock: Number(row.stock || 20),
        sku: row.sku || `LINA-${row.id}`,
        description: row.description || '',
        notes: row.notes || {
          top: row.top_note || 'حمضيات منعشة',
          heart: row.heart_note || 'زهور نادرة وتوابل',
          base: row.base_note || 'أخشاب وعنبر ومسك',
        },
        inStock: row.in_stock !== false,
      }));
    }

    // Seed Supabase with initial products if table is currently empty
    seedInitialProductsToSupabase().catch(() => {});
    return PERFUMES_DATA;
  } catch (err) {
    console.error('Error fetching products from Supabase:', err);
    return PERFUMES_DATA;
  }
}

export async function saveProductToSupabase(perfume: Perfume): Promise<Perfume> {
  const row = {
    id: String(perfume.id),
    name: perfume.name,
    arabic_name: perfume.arabicName,
    badge: perfume.badge || '',
    category: perfume.category,
    price: perfume.price,
    original_price: perfume.originalPrice,
    volume: perfume.volume,
    rating: perfume.rating || 5.0,
    reviews_count: perfume.reviewsCount || 1,
    image: perfume.image,
    gallery: perfume.gallery || [perfume.image],
    sizes: perfume.sizes || ['30 ml', '50 ml', '100 ml'],
    gender: perfume.gender || 'unisex',
    fragrance_type: perfume.fragranceType || '',
    inspired_by: perfume.inspiredBy || '',
    is_special_offer: Boolean(perfume.isSpecialOffer),
    is_featured: Boolean(perfume.isFeatured),
    is_bestseller: Boolean(perfume.isBestseller),
    is_new: Boolean(perfume.isNew),
    is_active: perfume.isActive !== false,
    in_stock: perfume.inStock !== false,
    description: perfume.description || '',
    notes: perfume.notes || { top: '', heart: '', base: '' },
    stock: perfume.stock || 25,
    sku: perfume.sku || `LINA-${perfume.id}`,
  };

  const { data, error } = await supabase
    .from('products')
    .upsert(row, { onConflict: 'id' })
    .select()
    .single();

  if (error) {
    console.warn('Supabase product upsert warning:', error.message);
    // Also proxy to /api/products for server-level persistence
    try {
      await fetch(`/api/products/${perfume.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfume),
      });
    } catch {}
  }

  return perfume;
}

export async function deleteProductFromSupabase(id: number | string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', String(id));

    if (error) {
      console.warn('Supabase product delete warning:', error.message);
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    }
    return true;
  } catch (err) {
    console.error('Error deleting product from Supabase:', err);
    return false;
  }
}

// Seed initial perfume items into Supabase
export async function seedInitialProductsToSupabase() {
  try {
    const rows = PERFUMES_DATA.map((p) => ({
      id: String(p.id),
      name: p.name,
      arabic_name: p.arabicName,
      badge: p.badge || '',
      category: p.category,
      price: p.price,
      original_price: p.originalPrice,
      volume: p.volume,
      rating: p.rating || 5.0,
      reviews_count: p.reviewsCount || 1,
      image: p.image,
      gallery: p.gallery || [p.image],
      sizes: p.sizes || ['30 ml', '50 ml', '100 ml'],
      gender: p.gender || 'unisex',
      fragrance_type: p.fragranceType || '',
      inspired_by: p.inspiredBy || '',
      is_special_offer: Boolean(p.isSpecialOffer),
      is_featured: Boolean(p.isFeatured),
      is_bestseller: Boolean(p.isBestseller),
      is_new: Boolean(p.isNew),
      is_active: p.isActive !== false,
      in_stock: p.inStock !== false,
      description: p.description || '',
      notes: p.notes || { top: '', heart: '', base: '' },
      stock: p.stock || 25,
      sku: p.sku || `LINA-${p.id}`,
    }));

    await supabase.from('products').upsert(rows, { onConflict: 'id' });
  } catch {}
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
