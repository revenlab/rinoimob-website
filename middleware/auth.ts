export default defineNuxtRouteMiddleware(async (to, from) => {
  if (!process.client) return

  const auth = useAuth()
  await auth.initializeAuth()

  const requiresAuth = to.meta.requiresAuth
  const isPublic = to.meta.public

  if (requiresAuth && !auth.isAuthenticated.value) {
    return navigateTo({
      path: '/auth/login',
      query: { redirect: to.fullPath }
    })
  }

  if (isPublic && auth.isAuthenticated.value && (to.path === '/auth/login' || to.path === '/auth/register')) {
    return navigateTo('/dashboard')
  }
})
