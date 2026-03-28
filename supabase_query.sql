-- Profile Table
create table profile (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  role_title text not null,
  hero_image_url text,
  about_text text,
  about_image_url text,
  contact_location text,
  contact_email text,
  contact_phone text,
  github_url text,
  linkedin_url text,
  twitter_url text,
  updated_at timestamp with time zone default now()
);

-- Row Level Security (RLS)
alter table profile enable row level security;

-- Insert initial values (so the frontend works immediately)
insert into profile (
  full_name, 
  role_title, 
  hero_image_url, 
  about_text, 
  about_image_url,
  contact_location,
  contact_email,
  contact_phone,
  github_url,
  linkedin_url,
  twitter_url
) values (
  'Ahmar Wajahat', 
  'Full Stack Developer', 
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=800', 
  'I am a passionate Full Stack Developer focused on crafting beautiful and high-performance digital experiences.',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2072',
  'Mianwali, Punjab, Pakistan',
  'ahmarwajhatawan@gmail.com',
  '+92 300 4085054',
  'https://github.com/Ahmarwajahat',
  'https://linkedin.com/in/ahmar',
  'https://twitter.com/ahmar'
);

-- Add resume_url to existing profile table (if it doesn't exist)
ALTER TABLE profile ADD COLUMN IF NOT EXISTS resume_url TEXT;

-- Certifications Table
create table certifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  issuer text not null,
  description text,
  color text default '#10b981',
  created_at timestamp with time zone default now()
);

alter table certifications enable row level security;

-- Tech Blogs Table
create table blogs (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  category text,
  category_color text default '#10b981',
  description text,
  image_url text,
  link text,
  created_at timestamp with time zone default now()
);

alter table blogs enable row level security;
