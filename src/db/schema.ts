import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table (linked to Firebase Auth)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Orders table for customer orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  trackingNumber: text('tracking_number').notNull().unique(),
  customerName: text('customer_name').notNull(),
  phone: text('phone').notNull(),
  city: text('city').notNull(),
  address: text('address').notNull(),
  perfumeId: text('perfume_id').notNull(),
  perfumeName: text('perfume_name').notNull(),
  perfumeArabicName: text('perfume_arabic_name'),
  quantity: integer('quantity').notNull().default(1),
  total: integer('total').notNull(),
  paymentMethod: text('payment_method').notNull(),
  d17TxId: text('d17_tx_id'),
  status: text('status').notNull().default('pending'),
  clientIp: text('client_ip'),
  userId: text('user_id'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Products table
export const products = pgTable('products', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  arabicName: text('arabic_name').notNull(),
  price: integer('price').notNull(),
  originalPrice: integer('original_price'),
  category: text('category').notNull(),
  image: text('image').notNull(),
  description: text('description'),
  inStock: boolean('in_stock').default(true),
  volume: text('volume'),
  badge: text('badge'),
  topNote: text('top_note'),
  heartNote: text('heart_note'),
  baseNote: text('base_note'),
  longevity: text('longevity'),
  sillage: text('sillage'),
  season: text('season'),
  rating: text('rating'),
  reviewsCount: integer('reviews_count').default(0),
  createdAt: timestamp('created_at').defaultNow(),
});

// D17 settings table
export const d17SettingsTable = pgTable('d17_settings', {
  id: serial('id').primaryKey(),
  recipientPhone: text('recipient_phone').notNull(),
  recipientName: text('recipient_name').notNull(),
  instructions: text('instructions').notNull(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
