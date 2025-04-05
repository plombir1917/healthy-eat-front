export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: 'ru',
      },
      meta: [
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },
      ],
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
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
