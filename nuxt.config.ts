export default defineNuxtConfig({
  modules: ['@nuxtjs/color-mode', '@nuxtjs/tailwindcss'],

  colorMode: {
    preference: 'system', // По умолчанию использует системную тему
    fallback: 'light', // Если системная тема не определена, использует светлую
    classSuffix: '', // Добавляет суффикс к классам темы (например, `dark:bg-gray-900`)
    storageKey: 'nuxt-color-mode', // Ключ для хранения темы в localStorage
  },

  tailwindcss: {
    config: {
      darkMode: 'class', // Включаем поддержку тёмной темы через классы
      theme: {
        extend: {
          colors: {
            primary: '#2563EB',
            secondary: '#6B7280',
            background: '#F9FAFB',
            dark: {
              background: '#1F2937',
              text: '#F9FAFB',
            },
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
          },
        },
      },
    },
  },

  compatibilityDate: '2025-01-28',
});