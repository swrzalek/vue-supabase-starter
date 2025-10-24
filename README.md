# Vue 3 + Supabase Starter Template

A modern, production-ready starter template for building article/blog applications with Vue 3, Supabase authentication, and custom CSS. This template provides a complete authentication system with protected routes, ready for you to add your article CRUD functionality.

## 🚀 Features

- ✅ **Vue 3** with Composition API and `<script setup>`
- ✅ **Supabase Authentication** - Email/password auth with session management
- ✅ **Protected Routes** - Route guards for authenticated and public pages
- ✅ **Reactive State Management** - Custom auth composable with Vue reactivity
- ✅ **Modern CSS** - Custom properties, nesting, color-mix(), no frameworks
- ✅ **Dark Mode Support** - Automatic dark mode via `prefers-color-scheme`
- ✅ **Fully Responsive** - Mobile-first design with modern CSS features
- ✅ **TypeScript** - Full type safety throughout the application
- ✅ **Production Ready** - Linting, type-checking, and best practices

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Authentication System](#-authentication-system)
- [Routing](#-routing)
- [Styling Architecture](#-styling-architecture)
- [Adding Article CRUD](#-adding-article-crud)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)
- [Technology Stack](#-technology-stack)

## 🏁 Quick Start

### Prerequisites

- Node.js 20.19+ or 22.12+
- npm or yarn
- Supabase CLI (for local development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd beatflow-v3
   ```

2. **Install dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Start Supabase locally** (in project root)
   ```bash
   cd ..
   supabase start
   ```
   
   This will start local Supabase services on:
   - API: http://127.0.0.1:54321
   - Studio: http://127.0.0.1:54323
   - Inbucket (emails): http://127.0.0.1:54324

4. **Start the development server**
   ```bash
   cd client
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

### Testing the Authentication

1. Visit the home page - you'll see the public landing page
2. Click "Get Started" or "Sign Up"
3. Create an account with any email/password (minimum 6 characters)
4. You'll be automatically logged in and redirected to the dashboard
5. Your email and avatar (initials) will appear in the header
6. Click "Logout" to sign out

## 📁 Project Structure

```
client/
├── src/
│   ├── components/
│   │   └── AppHeader.vue          # Header with auth status and navigation
│   ├── composables/
│   │   └── useAuth.ts              # Authentication composable
│   ├── lib/
│   │   └── supabase.ts             # Supabase client configuration
│   ├── router/
│   │   └── index.ts                # Vue Router with auth guards
│   ├── stores/
│   │   └── counter.ts              # Pinia store example
│   ├── styles/
│   │   └── global.css              # Global CSS with modern features
│   ├── views/
│   │   ├── HomePage.vue            # Public landing page
│   │   ├── LoginPage.vue           # Login form
│   │   ├── SignupPage.vue          # Signup form
│   │   └── DashboardPage.vue       # Protected dashboard
│   ├── App.vue                     # Root component
│   └── main.ts                     # App entry point
├── public/
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🔐 Authentication System

### Auth Composable (`composables/useAuth.ts`)

The authentication system is built around a composable that provides reactive state and methods:

```typescript
const { 
  currentUser,      // Reactive user object
  isAuthenticated,  // Boolean auth status
  isLoading,        // Loading state
  initialize,       // Initialize auth
  signUp,           // Create account
  signIn,           // Sign in
  signOut           // Sign out
} = useAuth()
```

### How It Works

1. **Initialization**: Auth state is initialized in `App.vue` on mount
2. **Session Persistence**: Supabase automatically persists sessions in localStorage
3. **Real-time Updates**: Auth state changes are automatically synced across tabs
4. **Route Protection**: Navigation guards check auth status before route changes

### Using Auth in Components

```vue
<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { currentUser, isAuthenticated, signOut } = useAuth()
</script>

<template>
  <div v-if="isAuthenticated">
    <p>Welcome, {{ currentUser?.email }}</p>
    <button @click="signOut">Logout</button>
  </div>
</template>
```

## 🛣️ Routing

### Available Routes

| Path | Component | Access | Description |
|------|-----------|--------|-------------|
| `/` | HomePage | Public | Landing page with features |
| `/login` | LoginPage | Guest only | Login form |
| `/signup` | SignupPage | Guest only | Signup form |
| `/dashboard` | DashboardPage | Protected | User dashboard |

### Route Protection

Routes are protected using navigation guards in `router/index.ts`:

```typescript
// Protected route
{
  path: '/dashboard',
  component: DashboardPage,
  meta: { requiresAuth: true }
}

// Guest-only route
{
  path: '/login',
  component: LoginPage,
  meta: { guestOnly: true }
}
```

**Behavior:**
- Unauthenticated users accessing protected routes → redirected to `/login`
- Authenticated users accessing guest-only routes → redirected to `/dashboard`

### Adding New Routes

```typescript
// router/index.ts
{
  path: '/articles/:id',
  name: 'article',
  component: ArticleView,
  meta: { requiresAuth: false } // Public route
}
```

## 🎨 Styling Architecture

### Global CSS (`styles/global.css`)

The template uses modern CSS features without any frameworks:

- **CSS Custom Properties** for theming
- **Native CSS Nesting** for better organization
- **color-mix()** for dynamic color manipulation
- **Modern viewport units** (`dvh` for mobile)
- **Automatic dark mode** via `prefers-color-scheme`

### CSS Variables

Customize the theme by modifying CSS variables:

```css
:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  
  /* Spacing */
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  
  /* Border radius */
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  
  /* Typography */
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', ...;
}
```

### Utility Classes

Pre-defined utility classes available globally:

```html
<!-- Buttons -->
<button class="btn btn-primary">Primary Button</button>
<button class="btn btn-danger">Danger Button</button>
<button class="btn btn-outline">Outline Button</button>

<!-- Forms -->
<div class="form-group">
  <label class="form-label">Email</label>
  <input class="form-input" type="email">
</div>

<!-- Cards -->
<div class="card">
  Card content
</div>

<!-- Container -->
<div class="container">
  Centered content with max-width
</div>
```

### Scoped Styles

Each component uses scoped styles for component-specific styling:

```vue
<style scoped>
.component-specific {
  /* Styles only apply to this component */
}
</style>
```

## 📝 Adding Article CRUD

This template is ready for you to add article functionality. Here's how:

### 1. Create Articles Table in Supabase

Run this SQL in Supabase Studio or via migration:

```sql
-- Create articles table
create table articles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  content text not null,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table articles enable row level security;

-- Policy: Users can view all published articles
create policy "Public articles are viewable by everyone"
  on articles for select
  using (published = true);

-- Policy: Users can view their own articles
create policy "Users can view their own articles"
  on articles for select
  using (auth.uid() = user_id);

-- Policy: Users can create their own articles
create policy "Users can create articles"
  on articles for insert
  with check (auth.uid() = user_id);

-- Policy: Users can update their own articles
create policy "Users can update own articles"
  on articles for update
  using (auth.uid() = user_id);

-- Policy: Users can delete their own articles
create policy "Users can delete own articles"
  on articles for delete
  using (auth.uid() = user_id);
```

### 2. Create Article Composable

Create `src/composables/useArticles.ts`:

```typescript
import { ref } from 'vue'
import { supabase } from '@/lib/supabase'

export function useArticles() {
  const articles = ref([])
  const loading = ref(false)

  const fetchPublicArticles = async () => {
    loading.value = true
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    articles.value = data
    loading.value = false
  }

  const createArticle = async (article) => {
    const { data, error } = await supabase
      .from('articles')
      .insert([article])
      .select()
    
    if (error) throw error
    return data[0]
  }

  // Add more CRUD operations...

  return {
    articles,
    loading,
    fetchPublicArticles,
    createArticle
  }
}
```

### 3. Create Article Components

Suggested components:

- `ArticleList.vue` - Display list of articles
- `ArticleCard.vue` - Individual article preview card
- `ArticleEditor.vue` - Create/edit article form
- `ArticleView.vue` - Full article view

### 4. Add Article Routes

```typescript
// router/index.ts
{
  path: '/articles/:id',
  name: 'article-view',
  component: ArticleView,
  meta: { requiresAuth: false }
},
{
  path: '/dashboard/articles/new',
  name: 'article-new',
  component: ArticleEditor,
  meta: { requiresAuth: true }
},
{
  path: '/dashboard/articles/:id/edit',
  name: 'article-edit',
  component: ArticleEditor,
  meta: { requiresAuth: true }
}
```

## 🌍 Environment Variables

### Local Development

The template uses default local Supabase credentials. No environment variables needed for local development.

### Production

Create `.env` file in the `client` directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Important:**
- Never commit `.env` files to git
- The anon key is safe to expose (protected by Row Level Security)
- Get credentials from your Supabase project settings

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type-check
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## 🚢 Deployment

### Building for Production

```bash
cd client
npm run build
```

The build output will be in `client/dist`.

### Deploy to Vercel

1. Connect your repository to Vercel
2. Set build settings:
   - Build Command: `cd client && npm run build`
   - Output Directory: `client/dist`
3. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### Deploy to Netlify

1. Connect your repository to Netlify
2. Set build settings:
   - Base directory: `client`
   - Build command: `npm run build`
   - Publish directory: `client/dist`
3. Add environment variables in Netlify dashboard

### Supabase Production Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from project settings
3. Run migrations or SQL to create tables
4. Set up Row Level Security policies
5. Configure email templates (optional)

## 🛠️ Technology Stack

### Frontend
- **Vue 3** - Progressive JavaScript framework
- **TypeScript** - Type safety
- **Vite** - Next-generation frontend tooling
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management (included but optional)

### Backend & Auth
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Row Level Security
  - Real-time subscriptions (ready to use)
  - Storage (ready to use)

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **oxlint** - Fast linting
- **vue-tsc** - TypeScript checker for Vue

### CSS
- **Modern CSS** - Custom properties, nesting, color-mix()
- **No frameworks** - Pure CSS with utility classes
- **Responsive** - Mobile-first design

## 🔒 Security Best Practices

1. **Row Level Security (RLS)**: Always enable RLS on Supabase tables
2. **Environment Variables**: Never commit credentials to git
3. **Validation**: Validate user input on both client and server
4. **Email Confirmation**: Enable in production for added security
5. **Password Requirements**: Configured in Supabase (min 6 chars by default)

## 📚 Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [Supabase Documentation](https://supabase.com/docs)
- [Vite Documentation](https://vitejs.dev/)
- [Vue Router Documentation](https://router.vuejs.org/)
- [MDN CSS Documentation](https://developer.mozilla.org/en-US/docs/Web/CSS)

## 🤝 Contributing

This is a starter template. Feel free to:
- Fork and customize for your needs
- Report issues or suggest improvements
- Share your projects built with this template

## 📄 License

MIT License - feel free to use this template for any project.

---

**Happy coding! 🚀** Start building your article platform by adding CRUD operations and customizing the design to match your vision.

