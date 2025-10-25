/**
 * Articles Composable - Manages article state and operations
 *
 * Provides reactive article state and CRUD operations.
 * Uses singleton pattern for shared state across components.
 */

import { ref, computed } from 'vue'
import { ArticleService } from '@/services/article.service'
import { useAuth } from '@/composables/useAuth'
import type { Article, ArticleWithUser, CreateArticleDto, UpdateArticleDto } from '@/types'
import { ERROR_MESSAGES } from '@/config/constants'

// Shared state (singleton)
const articles = ref<ArticleWithUser[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

export function useArticles() {
  const { currentUser } = useAuth()

  // Computed
  const articleCount = computed(() => articles.value.length)
  const hasArticles = computed(() => articles.value.length > 0)

  /**
   * Enrich article with user display information
   */
  const enrichArticle = (article: Article): ArticleWithUser => {
    let userEmail = 'Anonymous'

    if (currentUser.value && article.user_id === currentUser.value.id) {
      userEmail = currentUser.value.email || 'User'
    } else {
      userEmail = `User ${article.user_id.slice(0, 8)}`
    }

    return {
      ...article,
      user_email: userEmail,
    }
  }

  /**
   * Fetch all articles from the database
   */
  const fetchArticles = async () => {
    loading.value = true
    error.value = null

    try {
      const data = await ArticleService.query()
      articles.value = data.map(enrichArticle)
    } catch (err) {
      error.value = err instanceof Error ? err.message : ERROR_MESSAGES.ARTICLE_FETCH_FAILED
      console.error('Error fetching articles:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Create a new article
   */
  const createArticle = async (articlePayload: CreateArticleDto) => {
    if (!currentUser.value) {
      throw new Error('User must be authenticated to create articles')
    }

    loading.value = true
    error.value = null

    try {
      const article = await ArticleService.create(currentUser.value.id, articlePayload)
      const enrichedArticle = enrichArticle(article)

      // Add to beginning of array
      articles.value.unshift(enrichedArticle)

      return enrichedArticle
    } catch (err) {
      error.value = err instanceof Error ? err.message : ERROR_MESSAGES.ARTICLE_CREATE_FAILED
      console.error('Error creating article:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Update an existing article
   */
  const updateArticle = async (id: string, article: UpdateArticleDto) => {
    loading.value = true
    error.value = null

    try {
      const updatedArticle = await ArticleService.update(id, article)

      // Update in local state
      const index = articles.value.findIndex((a) => a.id === id)
      if (index !== -1) {
        const enrichedUpdate = enrichArticle(updatedArticle)
        articles.value[index] = enrichedUpdate
      }

      return updatedArticle
    } catch (err) {
      error.value = err instanceof Error ? err.message : ERROR_MESSAGES.ARTICLE_UPDATE_FAILED
      console.error('Error updating article:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Delete an article
   */
  const deleteArticle = async (id: string, imageUrl: string | null) => {
    loading.value = true
    error.value = null

    try {
      await ArticleService.remove(id, imageUrl)

      // Remove from local state
      articles.value = articles.value.filter((a) => a.id !== id)
    } catch (err) {
      error.value = err instanceof Error ? err.message : ERROR_MESSAGES.ARTICLE_DELETE_FAILED
      console.error('Error deleting article:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Check if current user owns an article
   */
  const isOwner = (article: ArticleWithUser): boolean => {
    return currentUser.value?.id === article.user_id
  }

  return {
    // State
    articles: computed(() => articles.value),
    loading: computed(() => loading.value),
    error: computed(() => error.value),

    // Computed
    articleCount,
    hasArticles,

    // Actions
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    isOwner,
  }
}

