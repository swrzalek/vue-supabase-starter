# Vue 3 + Supabase Article Platform - Starter Kit

A modern, production-ready boilerplate for building article/social feed applications with Vue 3, TypeScript, Supabase, and custom CSS. Features complete authentication, article CRUD with image uploads, and a beautiful responsive design.

## ✨ Features

- ✅ **Vue 3** with Composition API and `<script setup>`
- ✅ **TypeScript** - Full type safety with auto-generated database types
- ✅ **Supabase Backend** - Authentication, PostgreSQL database, and file storage
- ✅ **Article Management** - Create, read, update, delete articles with image uploads
- ✅ **Protected Routes** - Route guards for authenticated and public pages
- ✅ **Modern CSS** - Custom properties, nesting, color-mix(), no frameworks needed
- ✅ **Dark Mode Support** - Automatic dark mode via `prefers-color-scheme`
- ✅ **Fully Responsive** - Mobile-first design
- ✅ **Production Ready** - Linting, type-checking, and best practices

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development Workflow](#-development-workflow)
- [Customization Guide](#-customization-guide)
- [Deployment](#-deployment)
- [Technology Stack](#️-technology-stack)

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20.19+ or 22.12+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Supabase CLI** ([Installation Guide](https://supabase.com/docs/guides/cli/getting-started))

#### Install Supabase CLI

```bash
# macOS (Homebrew)
brew install supabase/tap/supabase

# Windows (Scoop)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Linux/macOS/Windows (npm)
npm install -g supabase

# Verify installation
supabase --version
```

### Step-by-Step Setup

#### 1. Clone and Navigate

```bash
git clone <your-repo-url>
cd beatflow-v3
```

#### 2. Install Vue App Dependencies

```bash
cd client
npm install
```

This will install all frontend dependencies including Vue 3, Vue Router, Supabase client, and TypeScript.

#### 3. Start Supabase Locally

Open a new terminal and navigate back to the project root:

```bash
cd ..  # If you're in the client directory
supabase start
```

**What this does:**
- Downloads Docker containers for PostgreSQL, PostgREST, GoTrue (auth), and more
- Starts local Supabase services
- Runs all migrations automatically (creates articles table and storage bucket)
- Sets up Row Level Security policies

**First-time setup** may take 2-5 minutes to download Docker images.

#### 4. Save Your Local Credentials

After `supabase start` completes, you'll see output like this:

```bash
API URL: http://127.0.0.1:54321
GraphQL URL: http://127.0.0.1:54321/graphql/v1
S3 Storage URL: http://127.0.0.1:54321/storage/v1/s3
DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
Studio URL: http://127.0.0.1:54323
Inbucket URL: http://127.0.0.1:54324
JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Important:** Copy the `anon key` - you'll need it if you want to customize environment variables.

💡 **For local development, the app uses default credentials automatically - no .env file needed!**

#### 5. Explore Supabase Studio (Optional)

Open [http://127.0.0.1:54323](http://127.0.0.1:54323) to access Supabase Studio where you can:
- View your database tables
- Check authentication users
- Browse storage buckets
- Test SQL queries

#### 6. Start the Vue Development Server

In a new terminal:

```bash
cd client
npm run dev
```

The app will be available at **http://localhost:5173**

#### 7. Test the Application

1. Open http://localhost:5173 in your browser
2. Click "Sign Up" and create an account (use any email/password)
3. You'll be logged in automatically
4. Create an article with text and/or an image
5. Edit or delete your articles
6. Sign out and sign back in to test authentication persistence

**Email verification:** During local development, check the Inbucket email testing interface at http://127.0.0.1:54324 to see confirmation emails.

---

## 📁 Project Structure

```
beatflow-v3/
├── client/                        # Vue 3 Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── AppHeader.vue      # Navigation with auth status
│   │   │   ├── ArticleCard.vue    # Individual article display
│   │   │   └── ArticleForm.vue    # Create article form
│   │   ├── composables/
│   │   │   ├── useAuth.ts         # Authentication logic
│   │   │   └── useArticles.ts     # Article CRUD operations
│   │   ├── config/
│   │   │   └── constants.ts       # App-wide constants
│   │   ├── lib/
│   │   │   └── supabase.ts        # Supabase client config
│   │   ├── router/
│   │   │   └── index.ts           # Vue Router with guards
│   │   ├── services/
│   │   │   └── article.service.ts # Article API service
│   │   ├── styles/
│   │   │   └── global.css         # Global CSS variables & utilities
│   │   ├── types/
│   │   │   ├── article.types.ts   # Article type definitions
│   │   │   ├── database.types.ts  # Auto-generated Supabase types
│   │   │   └── index.ts           # Type exports
│   │   ├── utils/
│   │   │   └── date.ts            # Date formatting utilities
│   │   ├── views/
│   │   │   ├── HomePage.vue       # Main feed page
│   │   │   ├── LoginPage.vue      # Login form
│   │   │   └── SignupPage.vue     # Signup form
│   │   ├── App.vue                # Root component
│   │   ├── env.ts                 # Environment config
│   │   └── main.ts                # App entry point
│   ├── package.json               # Dependencies
│   └── vite.config.ts             # Vite configuration
│
├── supabase/                      # Supabase Backend Configuration
│   ├── config.toml                # Supabase local settings
│   └── migrations/
│       └── 20250124000000_create_articles.sql  # Database schema
│
└── README.md                      # This file
```

---

## 🔧 Development Workflow

### Managing Supabase

#### Start Supabase

```bash
# From project root
supabase start
```

#### Stop Supabase

```bash
supabase stop
```

#### Reset Database (⚠️ Deletes all data)

```bash
supabase db reset
```

This will:
1. Drop all tables
2. Rerun all migrations
3. Reset to a clean state

#### View Supabase Status

```bash
supabase status
```

### Database Type Generation

The project includes auto-generated TypeScript types in `client/src/types/database.types.ts`. These types are already up-to-date with your schema.

**To regenerate types** after schema changes:

```bash
# From project root
supabase gen types typescript --local > client/src/types/database.types.ts
```

**When to regenerate:**
- After adding new tables or columns
- After modifying existing table structure
- After creating new enums or functions

### Adding New Migrations

When you need to modify the database schema:

```bash
# Create a new migration file
supabase migration new your_migration_name

# Edit the generated file in supabase/migrations/
# Then apply it with:
supabase db reset  # or restart supabase
```

### Development Commands

```bash
# Start development server (with hot reload)
cd client && npm run dev

# Type check (find TypeScript errors)
cd client && npm run type-check

# Lint code (auto-fix issues)
cd client && npm run lint

# Format code with Prettier
cd client && npm run format

# Build for production
cd client && npm run build

# Preview production build
cd client && npm run preview
```

### Debugging Tips

**Check Supabase Logs:**
```bash
# View all logs
supabase logs

# View specific service logs
supabase logs auth
supabase logs storage
supabase logs db
```

**Common Issues:**

1. **Port Already in Use**
   ```bash
   # Stop Supabase first
   supabase stop
   # Then start again
   supabase start
   ```

2. **Database Connection Issues**
   - Ensure Docker is running
   - Check `supabase status` to verify services are up

3. **Type Errors After Schema Changes**
   - Regenerate types: `supabase gen types typescript --local > client/src/types/database.types.ts`
   - Restart your development server

---

## 🎨 Customization Guide

### Styling

#### Change Theme Colors

Edit `client/src/styles/global.css`:

```css
:root {
  /* Primary brand color */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  
  /* Adjust spacing scale */
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Border radius */
  --radius-md: 0.5rem;
}
```

#### Add Custom Utility Classes

```css
/* In global.css */
.btn-secondary {
  background-color: var(--color-text-secondary);
  color: white;
}
```

### Database Schema

#### Add New Columns to Articles

Create a new migration:

```bash
supabase migration new add_article_fields
```

Edit the migration file:

```sql
-- supabase/migrations/[timestamp]_add_article_fields.sql
alter table public.articles 
add column title text,
add column published boolean default false;
```

Apply the migration:

```bash
supabase db reset
```

Regenerate types:

```bash
supabase gen types typescript --local > client/src/types/database.types.ts
```

#### Add New Tables

```sql
-- Example: Add comments table
create table public.comments (
  id uuid default gen_random_uuid() primary key,
  article_id uuid references public.articles(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.comments enable row level security;

-- Add policies
create policy "Comments are viewable by everyone"
  on public.comments for select using (true);

create policy "Authenticated users can create comments"
  on public.comments for insert
  to authenticated
  with check (auth.uid() = user_id);
```

### Authentication

#### Enable Email Confirmation

Edit `supabase/config.toml`:

```toml
[auth.email]
enable_confirmations = true  # Change from false to true
```

Restart Supabase:

```bash
supabase stop && supabase start
```

#### Configure OAuth Providers

Edit `supabase/config.toml` to enable providers like GitHub, Google, etc.:

```toml
[auth.external.github]
enabled = true
client_id = "your-github-client-id"
secret = "env(GITHUB_CLIENT_SECRET)"
```

---

## 🚢 Deployment

### Prepare for Production

#### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and set project name
4. Wait for project setup (2-3 minutes)

#### 2. Link Your Project

```bash
# Login to Supabase
supabase login

# Link local project to remote
supabase link --project-ref your-project-ref
```

#### 3. Push Migrations to Production

```bash
supabase db push
```

This will apply your local migrations to the production database.

#### 4. Get Production Credentials

From your Supabase project dashboard:
1. Go to Project Settings → API
2. Copy the **Project URL** and **anon public** key

### Deploy Frontend

#### Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Configure build settings:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Add environment variables:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
6. Click "Deploy"

#### Deploy to Netlify

1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to your repository
5. Configure build settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`
6. Add environment variables in Site settings → Environment variables
7. Click "Deploy site"

### Production Checklist

- [ ] Enable email confirmations in Supabase auth settings
- [ ] Set up email templates (optional)
- [ ] Configure OAuth providers if needed
- [ ] Set up custom domain
- [ ] Enable database backups
- [ ] Review and test Row Level Security policies
- [ ] Set up monitoring/error tracking (e.g., Sentry)
- [ ] Configure CORS settings if needed
- [ ] Test image upload functionality
- [ ] Test authentication flow end-to-end

---

## 🛠️ Technology Stack

### Frontend
- **[Vue 3](https://vuejs.org/)** - Progressive JavaScript framework
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Vite](https://vitejs.dev/)** - Next-generation frontend tooling
- **[Vue Router](https://router.vuejs.org/)** - Official router for Vue.js

### Backend & Services
- **[Supabase](https://supabase.com/)** - Backend as a Service
  - PostgreSQL database
  - Authentication (JWT-based)
  - Row Level Security (RLS)
  - File storage with CDN
  - Real-time subscriptions (ready to use)

### Development Tools
- **[ESLint](https://eslint.org/)** + **[oxlint](https://oxc.rs/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[vue-tsc](https://github.com/vuejs/language-tools)** - TypeScript checker for Vue

### CSS
- **Modern CSS** - Custom properties, nesting, color-mix()
- **No frameworks** - Pure CSS with utility classes
- **Responsive** - Mobile-first design with modern viewport units

---

## 🔒 Security Features

This boilerplate includes production-ready security:

### Row Level Security (RLS)

All database tables have RLS enabled with policies:
- Anyone can view articles (public feed)
- Only authenticated users can create articles
- Users can only edit/delete their own articles
- Users can only upload/delete their own images

### Storage Security

The `article-images` bucket has policies ensuring:
- Public read access (anyone can view images)
- Only authenticated users can upload
- Users can only manage their own images (stored in user-specific folders)

### Authentication

- Passwords hashed with bcrypt
- JWT-based session management
- Secure HTTP-only cookies (in production)
- CSRF protection built-in
- Rate limiting configured

---

## 📚 Learn More

### Documentation
- [Vue 3 Documentation](https://vuejs.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [Vue Router Documentation](https://router.vuejs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tutorials
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Vue 3 Composition API](https://vuejs.org/guide/extras/composition-api-faq.html)
- [Modern CSS Features](https://developer.mozilla.org/en-US/docs/Web/CSS)

---

## 🤝 Contributing

This is a starter template. Feel free to:
- Fork and customize for your projects
- Report issues or suggest improvements
- Share projects built with this template

---

## 📄 License

MIT License - Feel free to use this template for any project, commercial or personal.

---

## 🆘 Troubleshooting

### Supabase won't start

**Issue:** Port conflicts
```bash
# Stop all containers and restart
docker stop $(docker ps -aq)
supabase stop
supabase start
```

**Issue:** Docker not running
- Ensure Docker Desktop is installed and running
- On macOS/Windows: Check Docker Desktop app is open

### Build Errors

**Issue:** TypeScript errors after schema changes
```bash
# Regenerate database types
supabase gen types typescript --local > client/src/types/database.types.ts
```

**Issue:** Module not found
```bash
cd client
rm -rf node_modules package-lock.json
npm install
```

### Authentication Issues

**Issue:** Can't sign up or login
- Check Supabase status: `supabase status`
- Verify auth service is running
- Check browser console for errors
- Ensure `enable_signup = true` in `supabase/config.toml`

### Storage/Upload Issues

**Issue:** Image upload fails
- Check storage service is running: `supabase status`
- Verify storage bucket policies in Supabase Studio
- Check file size (5MB limit by default)
- Ensure allowed MIME types are correct

---

## 💬 Support

- **Supabase Discord:** [discord.supabase.com](https://discord.supabase.com)
- **Vue Discord:** [chat.vuejs.org](https://chat.vuejs.org)
- **GitHub Issues:** Open an issue in your repository

---

**Happy coding! 🚀** 

Start building your next article platform, blog, or social feed with this production-ready foundation.
