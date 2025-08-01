// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import tailwindcss from '@tailwindcss/vite'
import "./lib/env"
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    '@vee-validate/nuxt',
    'nuxt-csurf',
    'nuxt-maplibre',
  ],
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
    ],
    optimizeDeps: {
      include: [
        'maplibre-gl',
        'maplibre-gl-js',
        '@maplibre/maplibre-gl-geocoder',
      ],
    }
  },
  colorMode: {
    dataValue: 'theme',
  },
})
