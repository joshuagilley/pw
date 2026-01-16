// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2026-01-16',
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/ui'
  ],
  runtimeConfig: {
    mongodbUri: process.env.MONGODB_URI,
    mongodbDb: process.env.MONGODB_DB || 'prestige-worldwide',
    sessionSecret: process.env.SESSION_SECRET || 'change-me-in-production',
    public: {
      // Public runtime config (exposed to client)
    }
  },
  css: ['~/assets/css/main.css'],
  tailwindcss: {
    exposeConfig: true
  }
})
