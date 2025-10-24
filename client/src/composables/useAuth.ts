import { ref, computed } from 'vue'
import type { User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

const currentUser = ref<User | null>(null)
const isLoading = ref(true)

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value)

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

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

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

