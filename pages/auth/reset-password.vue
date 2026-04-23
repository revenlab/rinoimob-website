<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
    <div class="backdrop-blur-md bg-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/30">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Rinoimob</h1>
        <p class="text-white/80">Reset your password</p>
      </div>

      <form @submit.prevent="handleReset" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-white/90 mb-2">New Password</label>
          <input
            v-model="password"
            type="password"
            required
            minlength="8"
            class="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-md"
            placeholder="••••••••"
            :disabled="auth.isLoading.value"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-white/90 mb-2">Confirm Password</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            minlength="8"
            class="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-md"
            placeholder="••••••••"
            :disabled="auth.isLoading.value"
          />
        </div>

        <div v-if="auth.error.value" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {{ auth.error.value }}
        </div>

        <button
          type="submit"
          :disabled="auth.isLoading.value"
          class="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ auth.isLoading.value ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>

      <div class="mt-6 text-center">
        <NuxtLink to="/auth/login" class="text-white/60 text-sm hover:text-white transition-colors">
          Back to login
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PasswordResetRequest } from '~/types/auth'

definePageMeta({
  middleware: 'auth',
  layout: 'blank',
  authPage: true
})

const router = useRouter()
const route = useRoute()
const auth = useAuth()
const authApi = useAuthApi()

const password = ref('')
const confirmPassword = ref('')
const token = computed(() => route.query.token as string)

const handleReset = async () => {
  if (!token.value) {
    auth.error.value = 'Invalid reset token'
    return
  }

  if (password.value !== confirmPassword.value) {
    auth.error.value = 'Passwords do not match'
    return
  }

  try {
    auth.isLoading.value = true
    auth.clearError()

    await authApi.resetPassword({
      token: token.value,
      password: password.value,
      confirmPassword: confirmPassword.value
    } as PasswordResetRequest)

    await router.push('/auth/login')
  } catch (err) {
    auth.error.value = err instanceof Error ? err.message : 'Password reset failed'
  } finally {
    auth.isLoading.value = false
  }
}
</script>
