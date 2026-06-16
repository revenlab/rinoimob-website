export default defineNuxtConfig({
  ssr: true,
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  tailwindcss: {
    configPath: 'tailwind.config.js'
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL ?? '',
      appUrl: process.env.NUXT_PUBLIC_API_URL ?? 'http://localhost:5173'
    }
  },
  routeRules: {
    '/api/**': {
      proxy: `${process.env.NUXT_API_INTERNAL_URL || 'http://localhost:39000'}/api/**`
    }
  }
})
