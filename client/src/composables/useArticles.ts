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

export const ERROR_MESSAGES = {
  ARTICLE_CREATE_FAILED: 'Failed to create article',
  ARTICLE_UPDATE_FAILED: 'Failed to update article',
  ARTICLE_DELETE_FAILED: 'Failed to delete article',
  ARTICLE_FETCH_FAILED: 'Failed to load articles',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const

export function useArticles() {
  const articles = ref<Article[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { currentUser } = useAuth()


  const fetchArticles = async () => {
    try {
      const data = await ArticleService.query()
      console.log(data);
      articles.value = data
    } catch (err) {
      alert(ERROR_MESSAGES.ARTICLE_FETCH_FAILED);
    }
  }

  /**
   * Create a new article
   */
  const createArticle = async (articlePayload: CreateArticleDto) => {
    if(!currentUser.value) {
      alert('User not authenticated');
      return;
    }

    const { data, error } = await ArticleService.create(currentUser.value.id, articlePayload)

    if(data) {
      fetchArticles();
    }

    if(error) {
      alert(ERROR_MESSAGES.ARTICLE_CREATE_FAILED);
    }
  }

  /**
   * Update an existing article
   */
  const updateArticle = async (id: string, article: UpdateArticleDto) => {
    const { data, error } = await ArticleService.update(id, article)
    if(data) {
      fetchArticles();
    }

    if(error) {
      alert(ERROR_MESSAGES.ARTICLE_UPDATE_FAILED);
    }
  }

  const deleteArticle = async (id: string, imageUrl: string | null) => {
    loading.value = true
    error.value = null

    try {
      await ArticleService.remove(id, imageUrl)
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

    // Actions
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    isOwner,
  }
}

