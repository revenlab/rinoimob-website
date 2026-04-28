<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div class="max-w-2xl mx-auto px-6 py-12">
      <div class="backdrop-blur-md bg-white/10 rounded-2xl border border-white/20 p-8">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-bold text-white">Edit Profile</h1>
          <NuxtLink to="/dashboard" class="text-white/60 hover:text-white text-sm">← Back</NuxtLink>
        </div>

        <form @submit.prevent="handleUpdateProfile" class="space-y-6">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">First Name</label>
              <input
                v-model="firstName"
                type="text"
                required
                class="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                :disabled="auth.isLoading.value"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-white/90 mb-2">Last Name</label>
              <input
                v-model="lastName"
                type="text"
                required
                class="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                :disabled="auth.isLoading.value"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white/90 mb-2">Email (Read-only)</label>
            <input
              :value="auth.user.value?.email"
              type="email"
              disabled
              class="w-full px-4 py-2 bg-white/10 border border-white/30 rounded-lg text-white/50 cursor-not-allowed"
            />
          </div>

          <div v-if="auth.error.value" class="p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm">
            {{ auth.error.value }}
          </div>

          <div v-if="successMessage" class="p-3 bg-green-500/20 border border-green-500/50 rounded-lg text-green-200 text-sm">
            {{ successMessage }}
          </div>

          <button
            type="submit"
            :disabled="auth.isLoading.value"
            class="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ auth.isLoading.value ? 'Saving...' : 'Save Changes' }}
          </button>
        </form>

        <hr class="my-8 border-white/20" />

        <div>
          <h2 class="text-xl font-semibold text-white mb-4">Danger Zone</h2>
          <NuxtLink
            to="/account/change-password"
            class="inline-block px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 border border-orange-500/30 rounded-lg transition-colors"
          >
            Change Password
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
  requiresAuth: true
})

const auth = useAuth()
const authApi = useAuthApi()

const firstName = ref('')
const lastName = ref('')
const successMessage = ref('')

onMounted(() => {
  if (auth.user.value) {
    firstName.value = auth.user.value.firstName
    lastName.value = auth.user.value.lastName
  }
})

const handleUpdateProfile = async () => {
  try {
    auth.isLoading.value = true
    auth.clearError()
    successMessage.value = ''

    const updated = await authApi.updateProfile(
      auth.accessToken.value!,
      firstName.value,
      lastName.value
    )

    auth.setUser(updated)
    successMessage.value = 'Profile updated successfully'
  } catch (err) {
    auth.error.value = err instanceof Error ? err.message : 'Failed to update profile'
  } finally {
    auth.isLoading.value = false
  }
}
</script>
