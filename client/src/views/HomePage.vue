<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const { isAuthenticated } = useAuth()
const router = useRouter()

const navigateToDashboard = () => {
  if (isAuthenticated.value) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
}
</script>

<template>
  <div class="home-page">
    <div class="hero">
      <div class="hero-content">
        <h1 class="hero-title">Welcome to Article App</h1>
        <p class="hero-description">
          A modern platform for creating, publishing, and discovering articles. Share your thoughts,
          stories, and insights with the world.
        </p>
        <div class="hero-actions">
          <button @click="navigateToDashboard" class="btn btn-primary btn-lg">
            {{ isAuthenticated ? 'Go to Dashboard' : 'Get Started' }}
          </button>
          <router-link v-if="!isAuthenticated" to="/login" class="btn btn-outline btn-lg">
            Sign In
          </router-link>
        </div>
      </div>
    </div>

    <div class="features">
      <div class="container">
        <h2 class="features-title">Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">📝</div>
            <h3>Article Management</h3>
            <p>Create, edit, and organize your articles with an intuitive and powerful editor.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🌐</div>
            <h3>Public Articles</h3>
            <p>Browse and read publicly available articles from our community of writers.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">✍️</div>
            <h3>Rich Content</h3>
            <p>Publish articles with rich formatting and beautiful layouts that engage readers.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔒</div>
            <h3>Secure Publishing</h3>
            <p>Control your content with authentication and manage who can see your articles.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: calc(100vh - 4rem);
  min-height: calc(100dvh - 4rem);
}

.hero {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 5%, transparent) 0%,
    color-mix(in srgb, var(--color-primary-light) 5%, transparent) 100%
  );
  padding-block: var(--spacing-2xl);
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: var(--container-md);
  margin-inline: auto;
  text-align: center;
  padding-inline: var(--spacing-lg);
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-description {
  font-size: clamp(1rem, 2vw, 1.25rem);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-2xl);
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.btn-lg {
  padding: var(--spacing-md) var(--spacing-xl);
  font-size: 1rem;
}

.features {
  padding-block: var(--spacing-2xl);
  background-color: var(--color-background);
}

.features-title {
  text-align: center;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: var(--spacing-2xl);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-xl);
  margin-block: var(--spacing-2xl);
}

.feature-card {
  padding: var(--spacing-xl);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: all var(--transition-base);

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: color-mix(in srgb, var(--color-primary) 30%, var(--color-border));
  }

  & h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }

  & p {
    color: var(--color-text-secondary);
    line-height: 1.6;
  }
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: var(--spacing-md);
}

@media (max-width: 768px) {
  .hero {
    padding-block: var(--spacing-xl);
    min-height: 400px;
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>

