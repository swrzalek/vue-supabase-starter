<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter, useRoute } from 'vue-router'

const { currentUser, isAuthenticated, signOut } = useAuth()
const router = useRouter()
const route = useRoute()

const handleLogout = async () => {
  try {
    await signOut()
    router.push('/')
  } catch (error) {
    console.error('Logout error:', error)
  }
}

const getInitials = (email: string | undefined) => {
  if (!email) return 'U'
  const parts = email.split('@')[0]?.split('.') || []
  return parts
    .map((part) => part?.[0] || '')
    .filter(Boolean)
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U'
}
</script>

<template>
  <header class="header">
    <div class="header-container">
      <div class="header-content">
        <router-link to="/" class="logo">
          <h1>Article App</h1>
        </router-link>

        <nav class="nav">
          <template v-if="isAuthenticated">
            <div class="user-menu">
              <div class="user-avatar" :title="currentUser?.email ?? 'User'">
                {{ getInitials(currentUser?.email) }}
              </div>
              <div class="user-info">
                <span class="user-email">{{ currentUser?.email ?? 'User' }}</span>
                <button @click="handleLogout" class="btn btn-danger btn-sm">Logout</button>
              </div>
            </div>
          </template>

          <template v-else>
            <!-- Hide login/signup buttons on home page (they're in the CTA banner) -->
            <template v-if="route.name !== 'home'">
              <router-link to="/login" class="btn btn-outline">Login</router-link>
              <router-link to="/signup" class="btn btn-primary">Sign Up</router-link>
            </template>
          </template>
        </nav>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(8px);
  background-color: color-mix(in srgb, var(--color-background) 95%, transparent);
}

.header-container {
  max-width: var(--container-xl);
  margin-inline: auto;
  padding-inline: var(--spacing-lg);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 4rem;
  gap: var(--spacing-lg);
}

.logo {
  text-decoration: none;

  & h1 {
    font-size: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin: 0;
  }

  &:hover h1 {
    opacity: 0.8;
  }
}

.nav {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.nav-link {
  font-weight: 500;
  color: var(--color-text-secondary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);

  &:hover {
    color: var(--color-text);
    background-color: var(--color-surface);
    text-decoration: none;
  }

  &.router-link-active {
    color: var(--color-primary);
  }
}

.user-menu {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  position: relative;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-email {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: 0.75rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .header-content {
    min-height: 3.5rem;
  }

  .logo h1 {
    font-size: 1.25rem;
  }

  .user-email {
    display: none;
  }

  .nav {
    gap: var(--spacing-sm);
  }
}
</style>

