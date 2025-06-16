// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/icon'],
  devtools: { enabled: true },
  compatibilityDate: '2024-11-01',
  css: ['~/assets/css/main.css'],
  eslint: {
    config: {
      standalone: false,
    },
  },
  vite: {
    plugins: [
      tailwindcss(),
    ]
  }
})