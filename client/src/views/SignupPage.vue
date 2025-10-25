<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

const router = useRouter()
const { signUp } = useAuth()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const error = ref('')
const success = ref('')
const isLoading = ref(false)

const handleSubmit = async () => {
  if (!email.value || !password.value || !confirmPassword.value) {
    error.value = 'Please fill in all fields'
    return
  }

  if (password.value.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  if (password.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  error.value = ''
  success.value = ''
  isLoading.value = true

  try {
    await signUp(email.value, password.value)
    success.value = 'Account created successfully! Redirecting...'
    setTimeout(() => {
      router.push('/')
    }, 1500)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to create account. Please try again.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card card">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join BeatFlow and start creating</p>
        </div>

        <form @submit.prevent="handleSubmit" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="you@example.com"
              required
              autocomplete="email"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
              autocomplete="new-password"
              :disabled="isLoading"
            />
          </div>

          <div class="form-group">
            <label for="confirm-password" class="form-label">Confirm Password</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              class="form-input"
              placeholder="••••••••"
              required
              autocomplete="new-password"
              :disabled="isLoading"
            />
          </div>

          <div v-if="error" class="form-error">
            {{ error }}
          </div>

          <div v-if="success" class="form-success">
            {{ success }}
          </div>

          <button type="submit" class="btn btn-primary btn-full" :disabled="isLoading">
            <span v-if="isLoading" class="spinner"></span>
            {{ isLoading ? 'Creating account...' : 'Sign Up' }}
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account?
            <router-link to="/login">Sign in</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: calc(100vh - 4rem);
  min-height: calc(100dvh - 4rem);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--color-primary) 3%, transparent) 0%,
    color-mix(in srgb, var(--color-primary-light) 3%, transparent) 100%
  );
}

.auth-container {
  width: 100%;
  max-width: 420px;
}

.auth-card {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.auth-header {
  text-align: center;
  margin-bottom: var(--spacing-xl);

  & h1 {
    font-size: 1.875rem;
    font-weight: 700;
    margin-bottom: var(--spacing-sm);
  }

  & p {
    color: var(--color-text-secondary);
  }
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.btn-full {
  width: 100%;
  justify-content: center;
}

.auth-footer {
  margin-top: var(--spacing-xl);
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border);

  & p {
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }
}
</style>
