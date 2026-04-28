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
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:39000'
    }
  }
})
