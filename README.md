# Premium Full-Stack Portfolio

This project is a modern, fully functional portfolio website built with React (Vite) and Node.js. It features a premium UI with dark mode, glassmorphism, fluid typography, and dynamic animations.

## Tech Stack
- **Frontend**: React.js (Vite), Vanilla CSS.
- **Backend**: Node.js, Express.js.
- **Database**: Supabase PostgreSQL.
- **Authentication**: Firebase Authentication.

## Setup Instructions

### 1. Environment Variables

Before starting the server or frontend, you must configure the environment variables.

**Backend (`backend/.env`):**
Create a `.env` file in the `backend` folder with the following variables:
```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

**Frontend (`frontend/.env`):**
Create a `.env` file in the `frontend` folder with the following variables:
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
```

### 2. Backend Setup

The backend now uses `serverless-http` to run as a Netlify Function.

1. Open a terminal and navigate to the backend folder:
   ```bash
   cd ~/Desktop/AhmarData/portfolio_02/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. To test the backend locally, you can still run:
   ```bash
   npm run dev
   ```
   *Note: For production, Netlify will serve the backend via `backend/functions/api.js`.*

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd ~/Desktop/AhmarData/portfolio_02/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the React dev server:
   ```bash
   npm run dev
   ```

### 4. Deployment (Netlify)

This project is configured to deploy seamlessly on Netlify.
- The `netlify.toml` file in the root directory handles the build process.
- Frontend is built into the `dist` folder.
- Backend Express app is converted to a serverless function in `backend/functions/api.js`.
- All requests to `/api/*` are redirected to the Netlify function.

### 3. Database Schema

You will need to run the following SQL queries in your Supabase SQL editor:

```sql
-- Profile Table (Run this new query for the settings feature)
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

-- Projects Table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  image_url text,
  live_link text,
  github_link text,
  tech_stack text[],
  created_at timestamp with time zone default now()
);

-- Skills Table
create table skills (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  icon text,
  proficiency integer check (proficiency >= 0 and proficiency <= 100),
  created_at timestamp with time zone default now()
);

-- Messages Table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  subject text,
  content text not null,
  created_at timestamp with time zone default now()
);

-- Certifications Table
create table certifications (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  issuer text not null,
  description text,
  color text default '#10b981',
  created_at timestamp with time zone default now()
);

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

-- Profile Additions
ALTER TABLE profile ADD COLUMN IF NOT EXISTS resume_url TEXT;
```
