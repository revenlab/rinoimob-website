export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return

  const auth = useAuth()
  await auth.initializeAuth()

  const requiresAuth = to.meta.requiresAuth
  const isAuthPage = to.meta.authPage

  if (requiresAuth && !auth.isAuthenticated.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }

  if (isAuthPage && auth.isAuthenticated.value) {
    return navigateTo('/dashboard')
  }
})
