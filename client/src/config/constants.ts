export const STORAGE_CONFIG = {
  ARTICLE_IMAGES_BUCKET: 'article-images',
} as const

/**
 * Error messages
 */
export const ERROR_MESSAGES = {
  ARTICLE_CREATE_FAILED: 'Failed to create article',
  ARTICLE_UPDATE_FAILED: 'Failed to update article',
  ARTICLE_DELETE_FAILED: 'Failed to delete article',
  ARTICLE_FETCH_FAILED: 'Failed to load articles',
  GENERIC_ERROR: 'Something went wrong. Please try again.',
} as const

