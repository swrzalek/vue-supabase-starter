/**
 * Article Service - Data access layer for articles
 *
 * This service handles all Supabase interactions for articles.
 * All database queries and storage operations are centralized here.
 */

import { supabase } from '@/lib/supabase'
import type { Article, CreateArticleDto, UpdateArticleDto } from '@/types'
import { STORAGE_CONFIG } from '@/config/constants'
import type { PostgrestError } from '@supabase/supabase-js'

type QueryResult<T> = { data: T | null; error: PostgrestError | unknown }

export const ArticleService = {
  async query(): Promise<QueryResult<Article[]>> {
    try {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false })

      return { data, error }
    } catch (e) {
      return { data: null, error: e }
    }
  },

  async create(userId: string, dto: CreateArticleDto): Promise<QueryResult<Article>> {
    let imageUrl: string | null = null

    // Upload image if provided
    if (dto.imageFile) {
      imageUrl = await this.uploadImage(userId, dto.imageFile)
    }

    try {
      const { data, error } = await supabase
        .from('articles')
        .insert([
          {
            user_id: userId,
            content: dto.content,
            image_url: imageUrl,
          },
        ])
        .select()
        .single()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },
  
  async update(id: string, dto: UpdateArticleDto) {
    try {
      const { data, error } = await supabase
        .from('articles')
        .update({
          content: dto.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },
  async remove(id: string, imageUrl: string | null): Promise<QueryResult<null>> {
    try {
      if (imageUrl) {
        await this.deleteImage(imageUrl)
      }

      const { error, data } = await supabase.from('articles').delete().eq('id', id)
      return { data: null, error }
    } catch (e) {
      return { data: null, error: e }
    }
  },

  async uploadImage(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_CONFIG.ARTICLE_IMAGES_BUCKET)
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data } = supabase.storage
      .from(STORAGE_CONFIG.ARTICLE_IMAGES_BUCKET)
      .getPublicUrl(fileName)

    return data.publicUrl
  },

  async deleteImage(imageUrl: string): Promise<void> {
    const path = imageUrl.split(`/${STORAGE_CONFIG.ARTICLE_IMAGES_BUCKET}/`)[1]
    if (!path) return

    const { error } = await supabase.storage
      .from(STORAGE_CONFIG.ARTICLE_IMAGES_BUCKET)
      .remove([path])

    if (error) {
      console.error('Error deleting image:', error)
      // Don't throw error - image deletion is not critical
    }
  },
}
