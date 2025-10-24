<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useArticles } from '@/composables/useArticles'
import ArticleForm from '@/components/ArticleForm.vue'
import ArticleCard from '@/components/ArticleCard.vue'

const { isAuthenticated } = useAuth()
const { articles, loading, fetchArticles } = useArticles()

onMounted(async () => {
  await fetchArticles()
})
</script>

<template>
  <div class="home-page">
    <div class="container">
      <div class="page-header">
        <h1 class="page-title">{{ isAuthenticated ? 'Your Feed' : 'Public Feed' }}</h1>
        <p class="page-subtitle">
          {{ isAuthenticated ? 'Share your thoughts with the world' : 'See what others are sharing' }}
        </p>
      </div>

      <!-- Article Form - Only for authenticated users -->
      <ArticleForm v-if="isAuthenticated" @article-created="fetchArticles" />

      <!-- Call to action for non-authenticated users -->
      <div v-if="!isAuthenticated" class="cta-banner">
        <div class="cta-content">
          <h2>Join the conversation</h2>
          <p>Sign up to share your thoughts and connect with others</p>
          <div class="cta-actions">
            <router-link to="/signup" class="btn btn-primary">Sign Up</router-link>
            <router-link to="/login" class="btn btn-outline">Sign In</router-link>
          </div>
        </div>
      </div>

      <!-- Articles Feed -->
      <div class="articles-feed">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading articles...</p>
        </div>

        <div v-else-if="articles.length === 0" class="empty-state">
          <div class="empty-icon">📝</div>
          <h3>No articles yet</h3>
          <p v-if="isAuthenticated">Be the first to share something!</p>
          <p v-else>Check back soon for new content</p>
        </div>

        <div v-else class="articles-list">
          <ArticleCard
            v-for="article in articles"
            :key="article.id"
            :article="article"
            @article-updated="fetchArticles"
            @article-deleted="fetchArticles"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: calc(100vh - 4rem);
  min-height: calc(100dvh - 4rem);
  padding-block: var(--spacing-2xl);
  background-color: var(--color-surface);
}

.page-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.page-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 700;
  margin-bottom: var(--spacing-sm);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  font-size: 1rem;
  color: var(--color-text-secondary);
}

.cta-banner {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 5%, transparent) 0%,
    color-mix(in srgb, var(--color-primary-light) 5%, transparent) 100%
  );
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  margin-bottom: var(--spacing-2xl);
  text-align: center;

  & h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: var(--spacing-sm);
  }

  & p {
    color: var(--color-text-secondary);
    margin-bottom: var(--spacing-lg);
  }
}

.cta-content {
  max-width: 500px;
  margin-inline: auto;
}

.cta-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: center;
  flex-wrap: wrap;
}

.articles-feed {
  margin-top: var(--spacing-2xl);
}

.loading-state {
  text-align: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);

  & .spinner {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    margin-bottom: var(--spacing-md);
  }
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);

  & h3 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
  }

  & p {
    color: var(--color-text-secondary);
  }
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

@media (max-width: 768px) {
  .home-page {
    padding-block: var(--spacing-lg);
  }

  .page-header {
    margin-bottom: var(--spacing-lg);
  }

  .cta-banner {
    padding: var(--spacing-xl);
  }

  .cta-actions {
    flex-direction: column;
  }
}
</style>

