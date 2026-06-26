-- Supabase Schema for Honey & Spices E-commerce
-- Paste this script into the Supabase SQL Editor and run it to initialize your database.

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PRODUCTS TABLE
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  scientific_name text,
  price numeric not null,
  category text not null,
  description text,
  image_url text,
  tag text,
  stock integer not null default 0,
  featured boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- 3. PROFILES TABLE (Extends Auth.Users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  email text not null,
  phone text,
  role text not null default 'customer' check (role in ('admin', 'customer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- 4. ORDERS TABLE
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  total_amount numeric not null,
  payment_method text not null,
  payment_status text not null default 'Pending',
  order_status text not null default 'Pending',
  shipping_address text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.orders enable row level security;

-- 5. ORDER ITEMS TABLE
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null check (quantity > 0),
  price numeric not null
);

-- Enable RLS
alter table public.order_items enable row level security;

-- 6. CART TABLE
create table public.cart (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  product_id uuid references public.products(id) on delete cascade not null,
  quantity integer not null check (quantity > 0),
  unique (user_id, product_id)
);

-- Enable RLS
alter table public.cart enable row level security;

-- 7. CONTACT MESSAGES TABLE
create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  replied boolean not null default false,
  reply_text text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.contact_messages enable row level security;


-- 8. ROW LEVEL SECURITY (RLS) POLICIES

-- Profiles Policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Products Policies
create policy "Products are viewable by everyone" on public.products
  for select using (true);

create policy "Admins can do everything on products" on public.products
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Orders Policies
create policy "Users can select their own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Users can create their own orders" on public.orders
  for insert with check (auth.uid() = user_id);

create policy "Admins can manage all orders" on public.orders
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Order Items Policies
create policy "Users can select their own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Users can insert their own order items" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id and orders.user_id = auth.uid()
    )
  );

create policy "Admins can manage all order items" on public.order_items
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

-- Cart Policies
create policy "Users can manage their own cart" on public.cart
  for all using (auth.uid() = user_id);

-- Contact Messages Policies
create policy "Anyone can insert contact messages" on public.contact_messages
  for insert with check (true);

create policy "Admins can manage contact messages" on public.contact_messages
  for all using (
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 9. TRIGGERS & PROCEDURES (Automatic Profile Creation)
create or replace function public.handle_new_user()
returns trigger as $$
declare
  default_role text := 'customer';
begin
  -- Automatically make admin@honeyspices.com an admin role
  if new.email = 'admin@honeyspices.com' then
    default_role := 'admin';
  end if;
  
  insert into public.profiles (id, full_name, email, role, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Valued Customer'),
    new.email,
    default_role,
    new.raw_user_meta_data->>'phone'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 10. STORAGE SETUP
-- Create storage bucket for product images
insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do nothing;

-- Storage Policies
create policy "Product images are publicly accessible" on storage.objects
  for select using (bucket_id = 'products');

create policy "Admins can upload product images" on storage.objects
  for insert with check (
    bucket_id = 'products' and
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can update product images" on storage.objects
  for update using (
    bucket_id = 'products' and
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );

create policy "Admins can delete product images" on storage.objects
  for delete using (
    bucket_id = 'products' and
    exists (
      select 1 from public.profiles
      where profiles.id = auth.uid() and profiles.role = 'admin'
    )
  );


-- 11. SEED DATA (Products)
insert into public.products (name, scientific_name, price, category, description, image_url, tag, stock, featured)
values
  (
    'Alleppey Gold Turmeric',
    'Curcuma longa',
    950,
    'single-origin',
    'Sourced from the hills of Alleppey, offering an exceptionally high curcumin content and warm earthy flavor.',
    null,
    'Imperial Selection',
    45,
    true
  ),
  (
    'Kashmiri Chili Powder',
    'Capsicum annuum',
    850,
    'single-origin',
    'Hand-harvested vibrant crimson pods dried and ground to preserve their rich color and mild, sweet heat.',
    null,
    'Ultra-Rare Grade A',
    28,
    true
  ),
  (
    'Royal Garam Masala',
    'Artisanal Blend',
    1100,
    'blends',
    'A traditional royal recipe blending black cardamom, star anise, cloves, and mace, dry-roasted and stone-ground.',
    null,
    'Reserve Blend',
    5,
    true
  ),
  (
    'Ceylon Cinnamon Bark',
    'Cinnamomum verum',
    1300,
    'single-origin',
    'Delicate, multi-layered quills of authentic Ceylon cinnamon, releasing a refined sweet, warm woody aroma.',
    null,
    'Fine Quill Selection',
    12,
    false
  ),
  (
    'Malabar Tellicherry Pepper',
    'Piper nigrum',
    980,
    'single-origin',
    'Extra-large vine-ripened black peppercorns offering deep complex pungency, hot citrus sharpness, and woodsmoke notes.',
    null,
    'Premium Pepper',
    0,
    false
  ),
  (
    'Saffron Infused Honey',
    'Mellifica & Crocus',
    1750,
    'honey-elixirs',
    'Pure, organic wildflower honey cold-steeped with Kashmiri saffron threads for a honeyed floral luxury finish.',
    null,
    'Limited Release',
    32,
    false
  ),
  (
    'Wild Forest Honey',
    'Apis dorsata',
    650,
    'honey-elixirs',
    'Sourced from native wild beehives in dense forest reserves, rich in natural pollen and enzyme notes.',
    null,
    'Wild Sourced',
    60,
    false
  ),
  (
    'Green Cardamom Pods',
    'Elettaria cardamomum',
    1450,
    'single-origin',
    'Extra-bold 8mm green cardamom pods, hand-sorted for intense aromatic eucalyptus and citrus brightness.',
    null,
    'Imperial Grade',
    8,
    false
  );
