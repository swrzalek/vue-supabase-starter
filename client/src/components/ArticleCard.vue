<script setup lang="ts">
import { ref } from 'vue'
import type { Article } from '@/composables/useArticles'
import { useArticles } from '@/composables/useArticles'

const props = defineProps<{
  article: Article
}>()

const { updateArticle, deleteArticle, isOwner } = useArticles()

const isEditing = ref(false)
const editContent = ref(props.article.content)
const isDeleting = ref(false)

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

const handleEdit = async () => {
  if (!editContent.value.trim()) return

  try {
    await updateArticle(props.article.id, editContent.value)
    isEditing.value = false
  } catch (error) {
    console.error('Error updating article:', error)
  }
}

const handleDelete = async () => {
  if (!confirm('Are you sure you want to delete this article?')) return

  isDeleting.value = true
  try {
    await deleteArticle(props.article.id, props.article.image_url)
  } catch (error) {
    console.error('Error deleting article:', error)
    isDeleting.value = false
  }
}

const cancelEdit = () => {
  editContent.value = props.article.content
  isEditing.value = false
}
</script>

<template>
  <article class="article-card" :class="{ deleting: isDeleting }">
    <div class="article-header">
      <div class="article-author">
        <div class="author-avatar">{{ getInitials(article.user_email || 'User') }}</div>
        <div class="author-info">
          <div class="author-name">{{ article.user_email?.split('@')[0] || 'User' }}</div>
          <div class="article-time">{{ formatDate(article.created_at) }}</div>
        </div>
      </div>

      <div v-if="isOwner(article)" class="article-actions">
        <button
          v-if="!isEditing"
          @click="isEditing = true"
          class="action-btn"
          title="Edit"
          :disabled="isDeleting"
        >
          ✏️
        </button>
        <button
          @click="handleDelete"
          class="action-btn action-btn-danger"
          title="Delete"
          :disabled="isDeleting"
        >
          🗑️
        </button>
      </div>
    </div>

    <div class="article-content">
      <template v-if="isEditing">
        <textarea
          v-model="editContent"
          class="edit-textarea"
          rows="3"
          placeholder="What's on your mind?"
          maxlength="500"
        ></textarea>
        <div class="edit-actions">
          <button @click="cancelEdit" class="btn btn-outline btn-sm">Cancel</button>
          <button @click="handleEdit" class="btn btn-primary btn-sm">Save</button>
        </div>
      </template>
      <template v-else>
        <p class="article-text">{{ article.content }}</p>
        <img v-if="article.image_url" :src="article.image_url" alt="Article image" class="article-image" />
      </template>
    </div>
  </article>
</template>

<style scoped>
.article-card {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--transition-base);

  &:hover {
    border-color: color-mix(in srgb, var(--color-primary) 20%, var(--color-border));
  }

  &.deleting {
    opacity: 0.5;
    pointer-events: none;
  }
}

.article-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

.article-author {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
}

.author-avatar {
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

.author-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.author-name {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.9375rem;
}

.article-time {
  font-size: 0.8125rem;
  color: var(--color-text-light);
}

.article-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: all var(--transition-fast);
  border-radius: var(--radius-sm);

  &:hover:not(:disabled) {
    background-color: var(--color-surface);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &.action-btn-danger:hover:not(:disabled) {
    background-color: color-mix(in srgb, var(--color-danger) 10%, transparent);
  }
}

.article-content {
  margin-top: var(--spacing-md);
}

.article-text {
  color: var(--color-text);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
}

.article-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: var(--radius-md);
  margin-top: var(--spacing-md);
  border: 1px solid var(--color-border);
}

.edit-textarea {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 80px;
  font-family: inherit;

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent);
  }
}

.edit-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  margin-top: var(--spacing-md);
}

.btn-sm {
  padding: var(--spacing-xs) var(--spacing-md);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .article-card {
    padding: var(--spacing-md);
  }

  .author-avatar {
    width: 2rem;
    height: 2rem;
    font-size: 0.75rem;
  }

  .article-image {
    max-height: 300px;
  }
}
</style>

