import { ref, computed } from 'vue'
import { ArticleService, type Article as BaseArticle } from '@/services/article.service'
import { useAuth } from '@/composables/useAuth'

// Extended Article type with user email for display
export interface Article extends BaseArticle {
  user_email?: string
}

export function useArticles() {
  const articles = ref<Article[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { currentUser } = useAuth()

  // Helper to add user email to article
  const enrichArticle = (article: BaseArticle): Article => {
    let userEmail = 'Anonymous'

    // If this is the current user's article, use their email
    if (currentUser.value && article.user_id === currentUser.value.id) {
      userEmail = currentUser.value.email || 'User'
    } else {
      // For other users, just show a generic identifier
      userEmail = `User ${article.user_id.slice(0, 8)}`
    }

    return {
      ...article,
      user_email: userEmail,
    }
  }

  // Fetch all articles (public feed)
  const fetchArticles = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await ArticleService.query()
      articles.value = data.map(enrichArticle)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch articles'
      console.error('Error fetching articles:', err)
    } finally {
      loading.value = false
    }
  }

  // Create new article
  const createArticle = async (
    content: string,
    imageFile: File | null = null,
    onSuccess?: () => void
  ) => {
    if (!currentUser.value) {
      throw new Error('User must be authenticated to create articles')
    }

    loading.value = true
    error.value = null

    try {
      const article = await ArticleService.create(currentUser.value.id, {
        content,
        imageFile,
      })

      // Call success callback to trigger refetch
      if (onSuccess) {
        onSuccess()
      }

      return article
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create article'
      console.error('Error creating article:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Update article
  const updateArticle = async (id: string, content: string) => {
    loading.value = true
    error.value = null

    try {
      const updatedArticle = await ArticleService.update(id, { content })

      // Update local state
      const index = articles.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        articles.value[index] = {
          ...articles.value[index],
          ...updatedArticle,
        }
      }

      return updatedArticle
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update article'
      console.error('Error updating article:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Delete article
  const deleteArticle = async (id: string, imageUrl: string | null) => {
    loading.value = true
    error.value = null

    try {
      await ArticleService.remove(id, imageUrl)

      // Remove from local state
      articles.value = articles.value.filter((a) => a.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete article'
      console.error('Error deleting article:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Check if current user owns the article
  const isOwner = (article: Article) => {
    return currentUser.value?.id === article.user_id
  }

  return {
    articles: computed(() => articles.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    isOwner,
  }
}

