/**
 * Article Service - Data access layer for articles
 *
 * This service handles all Supabase interactions for articles.
 * All database queries and storage operations are centralized here.
 */

import { supabase } from '@/lib/supabase'
import type { Article, CreateArticleDto, UpdateArticleDto } from '@/types'
import { STORAGE_CONFIG } from '@/config/constants'

export const ArticleService = {
  /**
   * Query all articles ordered by creation date (newest first)
   */
  async query(): Promise<Article[]> {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * Create a new article with optional image upload
   */
  async create(userId: string, dto: CreateArticleDto): Promise<Article> {
    let imageUrl: string | null = null

    // Upload image if provided
    if (dto.imageFile) {
      imageUrl = await this.uploadImage(userId, dto.imageFile)
    }

    // Create article record
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

    if (error) throw error
    return data
  },

  /**
   * Update an existing article
   */
  async update(id: string, dto: UpdateArticleDto): Promise<Article> {
    const { data, error } = await supabase
      .from('articles')
      .update({
        content: dto.content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Remove an article and its associated image
   */
  async remove(id: string, imageUrl: string | null): Promise<void> {
    // Delete image from storage if exists
    if (imageUrl) {
      await this.deleteImage(imageUrl)
    }

    // Delete article record
    const { error } = await supabase.from('articles').delete().eq('id', id)

    if (error) throw error
  },

  /**
   * Upload an image to storage
   */
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

  /**
   * Delete an image from storage
   */
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

