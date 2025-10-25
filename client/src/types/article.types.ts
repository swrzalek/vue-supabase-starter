/**
 * Article related TypeScript type definitions
 */

/**
 * Base article entity from database
 */
export interface Article {
  id: string
  user_id: string
  content: string
  image_url: string | null
  created_at: string
  updated_at: string
}

/**
 * Data transfer object for creating a new article
 * Uses Pick to select only the content field from Article, plus imageFile
 */
export type CreateArticleDto = Pick<Article, 'content'> & {
  imageFile?: File | null
}

