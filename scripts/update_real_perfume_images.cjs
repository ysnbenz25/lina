const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://jkdwpnmcnidfftebypet.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ji1hdOtU3Whc9jGSvWMV8A_LAxtxdR5';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PROGRESS_FILE = path.join(__dirname, 'real_images_progress.json');

function loadProgress() {
  if (fs.existsSync(PROGRESS_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf8'));
    } catch (e) {
      return {};
    }
  }
  return {};
}

function saveProgress(progress) {
  fs.writeFileSync(PROGRESS_FILE, JSON.stringify(progress, null, 2), 'utf8');
}

function cleanSearchName(name) {
  return name
    .replace(/\s*(pour homme|pour femme|for women and men|for men and women|women and men)\s*/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function getYandexPerfumeImage(name) {
  const clean = cleanSearchName(name);
  const q = `${clean} perfume bottle`;
  const url = 'https://yandex.com/images/search?text=' + encodeURIComponent(q);

  const res = await fetchWithTimeout(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9'
    }
  }, 5000);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();

  const regex = /&quot;image&quot;:&quot;(\/\/avatars\.mds\.yandex\.net\/[^\"]+)&quot;.*?img_url=([^&\"']+)/g;
  const matches = [...html.matchAll(regex)];
  if (matches.length > 0) {
    const avatar = 'https:' + matches[0][1].replace(/&amp;/g, '&');
    const orig = decodeURIComponent(matches[0][2]);
    return { avatar, orig };
  }

  // Fallback: any avatar match
  const avatarMatches = [...html.matchAll(/\/\/(avatars\.mds\.yandex\.net\/i\?id=[^\"]+)/g)];
  if (avatarMatches.length > 0) {
    return { avatar: 'https://' + avatarMatches[0][1].replace(/&amp;/g, '&') };
  }

  return null;
}

async function downloadBuffer(imageInfo) {
  // Try orig first if available
  if (imageInfo.orig && !imageInfo.orig.endsWith('.svg')) {
    try {
      const res = await fetchWithTimeout(imageInfo.orig, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      }, 3000);
      if (res.ok) {
        const ct = res.headers.get('content-type') || '';
        if (ct.includes('image') || ct.includes('octet-stream')) {
          const ab = await res.arrayBuffer();
          const buf = Buffer.from(ab);
          if (buf.length > 3000) {
            return { buffer: buf, contentType: ct || 'image/jpeg' };
          }
        }
      }
    } catch (e) {
      // fallback to avatar
    }
  }

  // Fallback to avatar
  if (imageInfo.avatar) {
    const res = await fetchWithTimeout(imageInfo.avatar, {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    }, 3500);
    if (res.ok) {
      const ab = await res.arrayBuffer();
      const buf = Buffer.from(ab);
      if (buf.length > 1000) {
        return { buffer: buf, contentType: 'image/jpeg' };
      }
    }
  }

  return null;
}

async function uploadToSupabase(productId, buffer, contentType) {
  const storagePath = `products/${productId}.jpg`;
  const { error } = await supabase.storage.from('products').upload(storagePath, buffer, {
    contentType: contentType || 'image/jpeg',
    upsert: true
  });
  if (error) throw error;
  return supabase.storage.from('products').getPublicUrl(storagePath).data.publicUrl;
}

async function main() {
  console.log('=== Updating Real Authentic Bottle Images for Catalog ===');

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, arabic_name, image')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error fetching products:', error);
    process.exit(1);
  }

  const targets = products.filter(p => p.id.startsWith('prod_'));
  console.log(`Total target products: ${targets.length}`);

  const progress = loadProgress();
  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (let i = 0; i < targets.length; i++) {
    const p = targets[i];
    const prefix = `[${i + 1}/${targets.length}]`;

    // 1. If product already has supabase storage image in DB
    if (p.image && p.image.includes('supabase.co/storage/v1/object/public/products/products/prod_')) {
      progress[p.id] = { name: p.name, supabaseUrl: p.image, timestamp: new Date().toISOString() };
      saveProgress(progress);
      skipped++;
      continue;
    }

    // 2. Check if the image file was already uploaded to storage in a previous run
    const expectedStorageUrl = `https://jkdwpnmcnidfftebypet.supabase.co/storage/v1/object/public/products/products/${p.id}.jpg`;
    if (progress[p.id] && progress[p.id].supabaseUrl) {
      const url = progress[p.id].supabaseUrl;
      await supabase.from('products').update({ image: url }).eq('id', p.id);
      skipped++;
      continue;
    }

    console.log(`${prefix} Processing real photo for: "${p.name}"`);

    try {
      const imgInfo = await getYandexPerfumeImage(p.name);
      if (!imgInfo) {
        console.warn(`  x No image found for ${p.name}`);
        failed++;
        continue;
      }

      const downloaded = await downloadBuffer(imgInfo);
      if (!downloaded) {
        console.warn(`  x Failed to download buffer for ${p.name}`);
        failed++;
        continue;
      }

      const publicUrl = await uploadToSupabase(p.id, downloaded.buffer, downloaded.contentType);

      // Update in DB (only image column, no gallery)
      const { error: dbErr } = await supabase
        .from('products')
        .update({
          image: publicUrl
        })
        .eq('id', p.id);

      if (dbErr) {
        console.error(`  x DB update error: ${dbErr.message}`);
        failed++;
      } else {
        console.log(`  ✓ SUCCESS: ${publicUrl}`);
        progress[p.id] = {
          name: p.name,
          supabaseUrl: publicUrl,
          timestamp: new Date().toISOString()
        };
        saveProgress(progress);
        success++;
      }
    } catch (err) {
      console.error(`  x Error on ${p.name}:`, err.message);
      failed++;
    }

    // Polite delay
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n=== COMPLETED! Success: ${success}, Already done/Skipped: ${skipped}, Failed: ${failed} ===`);
}

main();
