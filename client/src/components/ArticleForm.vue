<script setup lang="ts">
import { ref } from 'vue'
import { useArticles } from '@/composables/useArticles'
import { useAuth } from '@/composables/useAuth'

const emit = defineEmits<{
  articleCreated: []
}>()

const { createArticle, loading } = useArticles()
const { currentUser } = useAuth()

const content = ref('')
const imageFile = ref<File | null>(null)
const imagePreview = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
const error = ref('')

const MAX_CONTENT_LENGTH = 500
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

const handleImageSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file size
  if (file.size > MAX_IMAGE_SIZE) {
    error.value = 'Image must be less than 5MB'
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    error.value = 'Please select an image file'
    return
  }

  error.value = ''
  imageFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  imageFile.value = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleSubmit = async () => {
  if (!content.value.trim() && !imageFile.value) {
    error.value = 'Please write something or add an image'
    return
  }

  if (content.value.length > MAX_CONTENT_LENGTH) {
    error.value = `Content must be less than ${MAX_CONTENT_LENGTH} characters`
    return
  }

  error.value = ''

  try {
    await createArticle(content.value, imageFile.value, () => {
      // Emit event to parent to refetch articles
      emit('articleCreated')
    })

    // Reset form
    content.value = ''
    imageFile.value = null
    imagePreview.value = null
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to post article'
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
  <div class="article-form">
    <div class="form-header">
      <div class="user-avatar">{{ getInitials(currentUser?.email) }}</div>
      <div class="form-title">What's on your mind?</div>
    </div>

    <form @submit.prevent="handleSubmit" class="form-content">
      <textarea
        v-model="content"
        class="form-textarea"
        placeholder="Share your thoughts..."
        rows="3"
        :maxlength="MAX_CONTENT_LENGTH"
        :disabled="loading"
      ></textarea>

      <div v-if="content.length > 0" class="character-count">
        {{ content.length }} / {{ MAX_CONTENT_LENGTH }}
      </div>

      <div v-if="imagePreview" class="image-preview">
        <img :src="imagePreview" alt="Preview" />
        <button
          @click="removeImage"
          type="button"
          class="remove-image"
          :disabled="loading"
          title="Remove image"
        >
          ✕
        </button>
      </div>

      <div v-if="error" class="form-error">
        {{ error }}
      </div>

      <div class="form-actions">
        <label class="image-upload-label" :class="{ disabled: loading }">
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            @change="handleImageSelect"
            class="image-input"
            :disabled="loading"
          />
          <span class="upload-icon">📷</span>
          <span class="upload-text">Add Image</span>
        </label>

        <button
          type="submit"
          class="btn btn-primary"
          :disabled="loading || (!content.trim() && !imageFile)"
        >
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Posting...' : 'Post' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.article-form {
  background-color: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.form-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
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

.form-title {
  font-weight: 500;
  color: var(--color-text-secondary);
  font-size: 0.9375rem;
}

.form-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-textarea {
  width: 100%;
  padding: var(--spacing-md);
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  transition: all var(--transition-fast);

  &:focus {
    outline: none;
    border-color: var(--color-primary);
    background-color: var(--color-background);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent);
  }

  &::placeholder {
    color: var(--color-text-light);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.character-count {
  font-size: 0.75rem;
  color: var(--color-text-light);
  text-align: right;
  margin-top: calc(var(--spacing-xs) * -1);
}

.image-preview {
  position: relative;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--color-border);

  & img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    display: block;
  }
}

.remove-image {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-full);
  background-color: color-mix(in srgb, var(--color-background) 90%, transparent);
  backdrop-filter: blur(4px);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 1.125rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);

  &:hover:not(:disabled) {
    background-color: var(--color-danger);
    color: white;
    border-color: var(--color-danger);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.form-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
}

.image-upload-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  background-color: transparent;
  color: var(--color-text-secondary);
  font-size: 0.875rem;

  &:hover:not(.disabled) {
    background-color: var(--color-surface);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }

  &.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.image-input {
  display: none;
}

.upload-icon {
  font-size: 1.125rem;
}

.upload-text {
  font-weight: 500;
}

@media (max-width: 768px) {
  .article-form {
    padding: var(--spacing-md);
  }

  .upload-text {
    display: none;
  }

  .form-actions {
    flex-direction: row;
  }
}
</style>

