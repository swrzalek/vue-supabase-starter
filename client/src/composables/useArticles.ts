import { ArticleService } from '@/services/article.service'
import { useAuth } from '@/composables/useAuth'
import type { Article, CreateArticleDto, UpdateArticleDto } from '@/types'
import { ref } from 'vue'

export const ERROR_MESSAGES = {
  ARTICLE_CREATE_FAILED: 'Failed to create article',
  ARTICLE_UPDATE_FAILED: 'Failed to update article',
  ARTICLE_DELETE_FAILED: 'Failed to delete article',
  ARTICLE_FETCH_FAILED: 'Failed to load articles',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const

export function useArticles() {
  const { currentUser } = useAuth()
  const articles = ref<Article[]>([])

  const fetchArticles = async () => {
    const { error, data } = await ArticleService.query()
    if (error) {
      alert(ERROR_MESSAGES.ARTICLE_FETCH_FAILED)
    }

    if (data) {
      articles.value = data
    }
  }

  const createArticle = async (articlePayload: CreateArticleDto) => {
    if (!currentUser.value) {
      alert('User not authenticated')
      return
    }

    const { data, error } = await ArticleService.create(currentUser.value.id, articlePayload)
    if (error) {
      alert(ERROR_MESSAGES.ARTICLE_CREATE_FAILED)
    }
    if (data) {
      await fetchArticles()
    }
  }

  const updateArticle = async (id: string, article: UpdateArticleDto) => {
    const { data, error } = await ArticleService.update(id, article)

    if (error) {
      alert(ERROR_MESSAGES.ARTICLE_UPDATE_FAILED)
    }

    if(data) {
      await fetchArticles()
    }
  }

  const deleteArticle = async (id: string, imageUrl: string | null) => {
    const { error } = await ArticleService.remove(id, imageUrl)

    if (error) {
      alert(ERROR_MESSAGES.ARTICLE_DELETE_FAILED)
    } else {
      await fetchArticles()
    }
  }

  const isOwner = (article: Article): boolean => {
    return currentUser.value?.id === article.user_id
  }

  return {
    articles,
    fetchArticles,
    createArticle,
    updateArticle,
    deleteArticle,
    isOwner,
  }
}
