/**
 * Articles Composable - Provides article service methods
 *
 * This composable provides service methods for article operations.
 * State management is handled by parent components.
 */

import { ArticleService } from '@/services/article.service'
import { useAuth } from '@/composables/useAuth'
import type { Article, CreateArticleDto, UpdateArticleDto } from '@/types'

export const ERROR_MESSAGES = {
  ARTICLE_CREATE_FAILED: 'Failed to create article',
  ARTICLE_UPDATE_FAILED: 'Failed to update article',
  ARTICLE_DELETE_FAILED: 'Failed to delete article',
  ARTICLE_FETCH_FAILED: 'Failed to load articles',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const

export function useArticles() {
  const { currentUser } = useAuth()

  /**
   * Fetch all articles
   */
  const fetchArticles = async () => {
    try {
      return await ArticleService.query()
    } catch (err) {
      console.error('Error fetching articles:', err)
      throw err
    }
  }

  /**
   * Create a new article
   */
  const createArticle = async (articlePayload: CreateArticleDto) => {
    if (!currentUser.value) {
      throw new Error('User not authenticated')
    }

    const { data, error } = await ArticleService.create(currentUser.value.id, articlePayload)

    if (error) {
      throw error
    }

    return data
  }

  /**
   * Update an existing article
   */
  const updateArticle = async (id: string, article: UpdateArticleDto) => {
    const { data, error } = await ArticleService.update(id, article)

    if (error) {
      throw error
    }

    return data
  }

  /**
   * Delete an article
   */
  const deleteArticle = async (id: string, imageUrl: string | null) => {
    try {
      await ArticleService.remove(id, imageUrl)
    } catch (err) {
      console.error('Error deleting article:', err)
      throw err
    }
  }

  /**
   * Check if current user owns an article
   */
  const isOwner = (article: Article): boolean => {
    return currentUser.value?.id === article.user_id
  }

  return {
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    isOwner,
  }
}

