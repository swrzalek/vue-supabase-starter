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
 * Extended article with user information for display
 */
export interface ArticleWithUser extends Article {
  user_email: string
  user_display_name?: string
}

/**
 * Data transfer object for creating a new article
 */
export interface CreateArticleDto {
  content: string
  imageFile?: File | null
}

/**
 * Data transfer object for updating an article
 */
export interface UpdateArticleDto {
  content: string
}

