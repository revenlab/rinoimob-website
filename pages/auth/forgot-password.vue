<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-12 px-4 sm:px-6 lg:px-8">
    <div class="backdrop-blur-md bg-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/30">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white mb-2">Rinoimob</h1>
        <p class="text-white/80">Forgot your password?</p>
      </div>

      <form @submit.prevent="handleForgot" class="space-y-4">
        <p class="text-white/80 text-sm mb-4">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <div>
          <label class="block text-sm font-medium text-white/90 mb-2">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-md"
            placeholder="you@example.com"
            :disabled="auth.isLoading.value"
          />
        </div>

        <div v-if="auth.error.value" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
          {{ auth.error.value }}
        </div>

        <div v-if="success" class="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
          Check your email for a password reset link
        </div>

        <button
          type="submit"
          :disabled="auth.isLoading.value"
          class="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ auth.isLoading.value ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <div class="mt-6 text-center space-y-2">
        <NuxtLink to="/auth/login" class="block text-white font-semibold hover:underline">
          Back to login
        </NuxtLink>
        <NuxtLink to="/auth/register" class="text-white/60 text-sm hover:text-white transition-colors">
          Create an account
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  layout: 'blank',
  authPage: true
})

const auth = useAuth()
const authApi = useAuthApi()

const email = ref('')
const success = ref(false)

const handleForgot = async () => {
  try {
    auth.isLoading.value = true
    auth.clearError()
    success.value = false

    await authApi.forgotPassword(email.value)
    success.value = true
  } catch (err) {
    auth.error.value = err instanceof Error ? err.message : 'Failed to request password reset'
  } finally {
    auth.isLoading.value = false
  }
}
</script>
