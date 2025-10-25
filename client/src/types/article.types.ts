export interface Article {
  id: string
  user_id: string
  content: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export type CreateArticleDto = Pick<Article, 'content'> & {
  imageFile?: File | null
}
