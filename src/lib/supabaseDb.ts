import { getSupabaseServerAdmin } from './supabaseServer.ts';

export interface SupabaseOrderRecord {
  tracking_number: string;
  customer_name: string;
  phone: string;
  city: string;
  delegation?: string;
  address: string;
  perfume_id: string;
  perfume_name: string;
  perfume_arabic_name?: string;
  quantity: number;
  total: number;
  payment_method: string;
  d17_tx_id?: string | null;
  status: string;
  client_ip?: string | null;
  user_id?: string | null;
  items?: any;
  created_at?: string;
}

export interface SupabaseD17Record {
  recipient_phone: string;
  recipient_name: string;
  instructions: string;
  updated_at?: string;
}

/**
 * Save an order to Supabase 'orders' table
 */
export async function supabaseInsertOrder(order: SupabaseOrderRecord) {
  try {
    const supabase = getSupabaseServerAdmin();
    const { data, error } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (error) {
      console.warn('Supabase order insert notice (verify table exists):', error.message);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase order insert error:', err?.message || err);
    return { success: false, error: err?.message || 'Database error' };
  }
}

/**
 * Fetch all orders from Supabase 'orders' table
 */
export async function supabaseGetOrders() {
  try {
    const supabase = getSupabaseServerAdmin();
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase get orders notice:', error.message);
      return null;
    }

    return data;
  } catch (err) {
    console.warn('Supabase get orders exception:', err);
    return null;
  }
}

/**
 * Update order status in Supabase
 */
export async function supabaseUpdateOrderStatus(trackingNumber: string, status: string) {
  try {
    const supabase = getSupabaseServerAdmin();
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('tracking_number', trackingNumber)
      .select();

    if (error) {
      console.warn('Supabase update order notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase update order exception:', err);
    return false;
  }
}

/**
 * Get D17 payment settings from Supabase 'd17_settings' table
 */
export async function supabaseGetD17Settings(): Promise<SupabaseD17Record | null> {
  try {
    const supabase = getSupabaseServerAdmin();
    const { data, error } = await supabase
      .from('d17_settings')
      .select('*')
      .order('id', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) {
      return null;
    }

    const row = data[0];
    return {
      recipient_phone: row.recipient_phone || row.recipientPhone,
      recipient_name: row.recipient_name || row.recipientName,
      instructions: row.instructions,
    };
  } catch (err) {
    return null;
  }
}

/**
 * Save D17 payment settings to Supabase
 */
export async function supabaseSaveD17Settings(settings: SupabaseD17Record) {
  try {
    const supabase = getSupabaseServerAdmin();
    const { error } = await supabase
      .from('d17_settings')
      .insert([{
        recipient_phone: settings.recipient_phone,
        recipient_name: settings.recipient_name,
        instructions: settings.instructions,
      }]);

    if (error) {
      console.warn('Supabase save D17 settings notice:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Get store CMS settings from Supabase 'store_settings'
 */
export async function supabaseGetStoreSettings(key: string) {
  try {
    const supabase = getSupabaseServerAdmin();
    const { data, error } = await supabase
      .from('store_settings')
      .select('settings_data')
      .eq('settings_key', key)
      .single();

    if (error || !data) return null;
    return data.settings_data;
  } catch (err) {
    return null;
  }
}

/**
 * Upsert store CMS settings in Supabase 'store_settings'
 */
export async function supabaseSaveStoreSettings(key: string, data: any) {
  try {
    const supabase = getSupabaseServerAdmin();
    const { error } = await supabase
      .from('store_settings')
      .upsert({
        settings_key: key,
        settings_data: data,
        updated_at: new Date().toISOString()
      }, { onConflict: 'settings_key' });

    if (error) {
      console.warn(`Supabase save setting (${key}) notice:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * Sync or create user in Supabase 'users' table
 */
export async function supabaseGetOrCreateUser(
  uid: string,
  email: string,
  displayName?: string,
  photoUrl?: string
) {
  try {
    const supabase = getSupabaseServerAdmin();
    const { data, error } = await supabase
      .from('users')
      .upsert({
        uid,
        email,
        display_name: displayName || null,
        photo_url: photoUrl || null,
      }, { onConflict: 'uid' })
      .select()
      .single();

    if (error) {
      console.warn('Supabase getOrCreateUser notice:', error.message);
      return { id: uid, uid, email, displayName, photoUrl };
    }

    return data;
  } catch (err) {
    return { id: uid, uid, email, displayName, photoUrl };
  }
}
