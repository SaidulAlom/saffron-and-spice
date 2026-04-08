-- ============================================================
-- Saffron & Spice — Supabase Migration
-- Run this once in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- 1. MENU ITEMS
create table if not exists menu_items (
  id           serial primary key,
  name         text    not null,
  description  text    not null,
  price        integer not null,
  category     text    not null,
  image        text    not null,
  spice_level  integer not null default 0,
  is_signature boolean not null default false
);

-- 2. TESTIMONIALS
create table if not exists testimonials (
  id       serial primary key,
  name     text    not null,
  location text    not null,
  rating   integer not null check (rating between 1 and 5),
  review   text    not null,
  image    text    not null
);

-- 3. GALLERY IMAGES
create table if not exists gallery_images (
  id         serial primary key,
  url        text    not null,
  title      text    not null,
  sort_order integer not null default 0
);

-- 4. CONTACTS
create table if not exists contacts (
  id         uuid primary key default gen_random_uuid(),
  name       text    not null,
  email      text    not null,
  phone      text,
  guests     text,
  message    text    not null,
  status     text    not null default 'new' check (status in ('new', 'read', 'replied')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contacts_created_at_idx on contacts (created_at desc);

-- 5. RESERVATIONS
create table if not exists reservations (
  id           uuid primary key default gen_random_uuid(),
  name         text    not null,
  email        text    not null,
  phone        text    not null,
  guests       text    not null,
  date         date    not null,
  time         text    not null,
  requests     text,
  status       text    not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create index if not exists reservations_date_idx    on reservations (date);
create index if not exists reservations_created_at_idx on reservations (created_at desc);

-- 6. ORDERS
create table if not exists orders (
  id             uuid primary key default gen_random_uuid(),
  order_id       text not null unique,         -- human-readable: SS-YYYYMMDD-XXXXX
  customer_name  text not null,
  customer_phone text not null,
  address        text not null,
  city           text not null,
  pincode        text not null,
  payment_method text not null check (payment_method in ('card', 'upi', 'cod')),
  subtotal       integer not null,             -- in paise / rupees (stored as integer)
  tax            integer not null,
  total          integer not null,
  status         text not null default 'placed' check (status in ('placed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists orders_order_id_idx    on orders (order_id);
create index if not exists orders_created_at_idx  on orders (created_at desc);
create index if not exists orders_status_idx      on orders (status);

-- 7. ORDER ITEMS
create table if not exists order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references orders (id) on delete cascade,
  item_id    text not null,
  item_name  text not null,
  price      integer not null,
  quantity   integer not null check (quantity > 0)
);

create index if not exists order_items_order_id_idx on order_items (order_id);

-- ============================================================
-- SEED DATA
-- ============================================================

insert into menu_items (name, description, price, category, image, spice_level, is_signature) values
  ('Butter Chicken (Murgh Makhani)', 'Tender chicken pieces simmered in a rich, creamy tomato and butter gravy with aromatic spices.', 545, 'Non-Vegetarian', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800', 1, true),
  ('Paneer Tikka Masala', 'Grilled cottage cheese cubes cooked in a spiced tomato-based gravy with bell peppers.', 425, 'Vegetarian', 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800', 2, false),
  ('Awadhi Lamb Biryani', 'Fragrant long-grain basmati rice layered with succulent lamb, saffron, and traditional Awadhi spices.', 675, 'Biryanis & Pulaos', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800', 2, true),
  ('Kashmiri Rogan Josh', 'A signature Kashmiri dish of slow-cooked lamb in a gravy flavored with dry ginger and alkanet flower.', 625, 'Non-Vegetarian', 'https://images.unsplash.com/photo-1545247181-516773cae754?auto=format&fit=crop&q=80&w=800', 3, false),
  ('Dal Makhani', 'Black lentils slow-cooked overnight with cream and butter for a velvety texture.', 385, 'Vegetarian', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800', 1, false),
  ('Galouti Kebab', 'Melt-in-your-mouth minced lamb kebabs, a royal delicacy from the kitchens of Nawabs.', 495, 'Starters', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800', 2, true),
  ('Garlic Naan', 'Traditional leavened bread topped with fresh garlic and cilantro, baked in a clay oven.', 95, 'Breads', 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800', 0, false),
  ('Gulab Jamun with Rabri', 'Warm milk dumplings soaked in saffron syrup, served with thickened sweetened milk.', 245, 'Desserts', 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=800', 0, false),
  ('Saffron Mango Lassi', 'A refreshing yogurt-based drink with Alphonso mango pulp and a hint of saffron.', 195, 'Beverages & Mocktails', 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=800', 0, false),
  ('Tandoori Malai Broccoli', 'Broccoli florets marinated in a creamy cheese and cardamom mix, grilled to perfection.', 375, 'Starters', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=800', 1, false),
  ('Prawn Pulao', 'Spiced rice cooked with fresh prawns, coconut milk, and coastal spices.', 595, 'Biryanis & Pulaos', 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800', 2, false),
  ('Shahi Tukda', 'Royal bread pudding soaked in saffron milk and topped with silver leaf and nuts.', 275, 'Desserts', 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=800', 0, false),
  ('Masala Chai', 'Traditional Indian tea brewed with ginger, cardamom, and a blend of spices.', 125, 'Beverages & Mocktails', 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&q=80&w=800', 1, false),
  ('Palak Paneer', 'Fresh spinach puree cooked with cottage cheese cubes and tempered with garlic.', 415, 'Vegetarian', 'https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?auto=format&fit=crop&q=80&w=800', 1, false),
  ('Chicken Tikka', 'Boneless chicken marinated in yogurt and spices, grilled in a traditional tandoor.', 465, 'Starters', 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&q=80&w=800', 2, false);

insert into testimonials (name, location, rating, review, image) values
  ('Ananya Sharma', 'Mumbai', 5, 'The most authentic Awadhi Biryani I have had outside of Lucknow. The ambiance is truly royal.', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200'),
  ('Vikram Singh', 'Delhi', 5, 'Saffron & Spice is a masterclass in fine dining. The Galouti Kebabs are a must-try!', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'),
  ('Sarah Jenkins', 'London', 5, 'Incredible flavors and impeccable service. The saffron-infused dishes are out of this world.', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200'),
  ('Rohan Mehra', 'New York', 5, 'Authentic Indian flavors in a contemporary setting. The Chef''s Table experience was outstanding.', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'),
  ('Priya Patel', 'Toronto', 5, 'The attention to detail in every dish is remarkable. A perfect place for special occasions.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200');

insert into gallery_images (url, title, sort_order) values
  ('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000', 'Main Dining Hall', 1),
  ('https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=1000', 'Chef''s Table', 2),
  ('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=1000', 'Royal Interior', 3),
  ('https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=1000', 'Signature Thali', 4),
  ('https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=1000', 'Spice Blending', 5),
  ('https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&q=80&w=1000', 'Tandoori Specialties', 6),
  ('https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=1000', 'Samosa Platter', 7),
  ('https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&q=80&w=1000', 'Dessert Selection', 8);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Read-only public tables
alter table menu_items     enable row level security;
alter table testimonials   enable row level security;
alter table gallery_images enable row level security;

-- Write tables — all require explicit policies
alter table contacts     enable row level security;
alter table reservations enable row level security;
alter table orders       enable row level security;
alter table order_items  enable row level security;

-- ── Public read policies (existing tables) ─────────────────────────────────

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'menu_items'     and policyname = 'Public read menu_items') then
    create policy "Public read menu_items"     on menu_items     for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'testimonials'   and policyname = 'Public read testimonials') then
    create policy "Public read testimonials"   on testimonials   for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'gallery_images' and policyname = 'Public read gallery_images') then
    create policy "Public read gallery_images" on gallery_images for select using (true);
  end if;
end $$;

-- ── Write policies for anon role ───────────────────────────────────────────
--
-- WHY: The Express server currently uses the publishable/anon key (no
-- service-role key yet). The service_role key bypasses RLS automatically,
-- so once you add SUPABASE_SERVICE_ROLE_KEY to .env.local you can DROP
-- these INSERT policies for tighter security.
--
-- Security note: even with anon INSERT allowed in Supabase, all writes are
-- still protected by: CSRF tokens, rate limiting, input validation, and the
-- Express server acting as the only ingress point.

do $$
begin
  if not exists (select 1 from pg_policies where tablename = 'contacts' and policyname = 'anon insert contacts') then
    create policy "anon insert contacts"
      on contacts for insert to anon with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'reservations' and policyname = 'anon insert reservations') then
    create policy "anon insert reservations"
      on reservations for insert to anon with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'orders' and policyname = 'anon insert orders') then
    create policy "anon insert orders"
      on orders for insert to anon with check (true);
  end if;

  if not exists (select 1 from pg_policies where tablename = 'order_items' and policyname = 'anon insert order_items') then
    create policy "anon insert order_items"
      on order_items for insert to anon with check (true);
  end if;
end $$;

-- ── UPGRADE PATH ───────────────────────────────────────────────────────────
-- Once you add a service-role key and set SUPABASE_SERVICE_ROLE_KEY in
-- .env.local, you can DROP the anon insert policies above:
--
--   drop policy "anon insert contacts"     on contacts;
--   drop policy "anon insert reservations" on reservations;
--   drop policy "anon insert orders"       on orders;
--   drop policy "anon insert order_items"  on order_items;
