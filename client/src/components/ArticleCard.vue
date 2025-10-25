<script setup lang="ts">
import { ref } from 'vue'
import { useArticles } from '@/composables/useArticles'
import type { Article } from '@/types'
import { formatRelativeTime } from '@/utils/date'

const props = defineProps<{
  article: Article
}>()

const emit = defineEmits<{
  update: [id: string, payload: Pick<Article, 'content'>]
  delete: [id: string, imageUrl: string | null]
}>()

const { isOwner } = useArticles()

const isEditing = ref(false)
const editContent = ref(props.article.content)

const handleEdit = () => {
  if (!editContent.value.trim()) return

  emit('update', props.article.id, { content: editContent.value })
  isEditing.value = false
}

const handleDelete = () => {
  if (!confirm('Are you sure you want to delete this article?')) return

  emit('delete', props.article.id, props.article.image_url)
}

const cancelEdit = () => {
  editContent.value = props.article.content
  isEditing.value = false
}
</script>

<template>
  <article class="article-card">
    <div class="article-header">
      <div class="article-author">
        <div class="author-info">
          <div class="author-name">User {{ article.user_id.slice(0, 8) }}</div>
          <div class="article-time">{{ formatRelativeTime(article.created_at) }}</div>
        </div>
      </div>

      <div v-if="isOwner(article)" class="article-actions">
        <button v-if="!isEditing" @click="isEditing = true" class="action-btn" title="Edit">
          ✏️
        </button>
        <button @click="handleDelete" class="action-btn action-btn-danger" title="Delete">
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
        <img
          v-if="article.image_url"
          :src="article.image_url"
          alt="Article image"
          class="article-image"
        />
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

  .article-image {
    max-height: 300px;
  }
}
</style>
