<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'

const { currentUser } = useAuth()

const stats = [
  { label: 'Total Articles', value: '0', icon: '📝' },
  { label: 'Published', value: '0', icon: '🌐' },
  { label: 'Drafts', value: '0', icon: '📄' },
  { label: 'Total Views', value: '0', icon: '👁️' },
]
</script>

<template>
  <div class="dashboard-page">
    <div class="container">
      <div class="dashboard-header">
        <div>
          <h1 class="dashboard-title">Dashboard</h1>
          <p class="dashboard-subtitle">Welcome back, {{ currentUser?.email?.split('@')[0] }}!</p>
        </div>
      </div>

      <div class="stats-grid">
        <div v-for="stat in stats" :key="stat.label" class="stat-card card">
          <div class="stat-icon">{{ stat.icon }}</div>
          <div class="stat-content">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div class="content-grid">
        <div class="content-section card">
          <h2 class="section-title">Recent Activity</h2>
          <div class="empty-state">
            <div class="empty-icon">📊</div>
            <p>No recent activity yet</p>
            <p class="empty-subtitle">Start creating to see your activity here</p>
          </div>
        </div>

        <div class="content-section card">
          <h2 class="section-title">Quick Actions</h2>
          <div class="actions-list">
            <button class="action-button">
              <span class="action-icon">➕</span>
              <span class="action-text">New Article</span>
            </button>
            <button class="action-button">
              <span class="action-icon">📄</span>
              <span class="action-text">View Drafts</span>
            </button>
            <button class="action-button">
              <span class="action-icon">🌐</span>
              <span class="action-text">Published Articles</span>
            </button>
            <button class="action-button">
              <span class="action-icon">⚙️</span>
              <span class="action-text">Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  min-height: calc(100vh - 4rem);
  min-height: calc(100dvh - 4rem);
  padding-block: var(--spacing-2xl);
  background-color: var(--color-surface);
}

.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-2xl);
  gap: var(--spacing-lg);
}

.dashboard-title {
  font-size: clamp(1.75rem, 4vw, 2.25rem);
  font-weight: 700;
  margin-bottom: var(--spacing-xs);
}

.dashboard-subtitle {
  color: var(--color-text-secondary);
  font-size: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-2xl);
}

.stat-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);

  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
}

.stat-icon {
  font-size: 2rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 10%, transparent),
    color-mix(in srgb, var(--color-primary-light) 10%, transparent)
  );
  border-radius: var(--radius-md);
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-xl);
}

.content-section {
  padding: var(--spacing-xl);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-lg);
}

.empty-state {
  text-align: center;
  padding: var(--spacing-2xl) var(--spacing-lg);
  color: var(--color-text-secondary);

  & p {
    margin-bottom: var(--spacing-xs);
  }

  & .empty-subtitle {
    font-size: 0.875rem;
    color: var(--color-text-light);
  }
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.action-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  text-align: left;

  &:hover {
    background-color: var(--color-surface);
    border-color: var(--color-primary);
    transform: translateX(4px);
  }
}

.action-icon {
  font-size: 1.25rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-text {
  font-weight: 500;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>

