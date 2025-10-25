/**
 * Auth Composable - Manages authentication state
 *
 * Provides reactive authentication state and methods.
 * Uses singleton pattern for shared state across components.
 */

import { ref, computed } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

// Shared state (singleton)
const currentUser = ref<User | null>(null)
const isLoading = ref(true)

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value)

  /**
   * Initialize authentication state and set up listeners
   */
  const initialize = async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      currentUser.value = session?.user ?? null
    } catch (error) {
      console.error('Error initializing auth:', error)
      currentUser.value = null
    } finally {
      isLoading.value = false
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event, session) => {
      currentUser.value = session?.user ?? null
    })
  }

  /**
   * Sign up a new user
   */
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  /**
   * Sign in an existing user
   */
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    currentUser.value = null
  }

  return {
    currentUser: computed(() => currentUser.value),
    isAuthenticated,
    isLoading: computed(() => isLoading.value),
    initialize,
    signUp,
    signIn,
    signOut,
  }
}
