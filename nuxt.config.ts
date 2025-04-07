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
    pageTransition: {
      name: 'page',
      mode: 'out-in',
    },
    layoutTransition: {
      name: 'layout',
      mode: 'out-in',
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
          keyframes: {
            'fade-in': {
              '0%': { opacity: '0' },
              '100%': { opacity: '1' },
            },
            'slide-in': {
              '0%': { transform: 'translateY(20px)', opacity: '0' },
              '100%': { transform: 'translateY(0)', opacity: '1' },
            },
            'scale-in': {
              '0%': { transform: 'scale(0.95)', opacity: '0' },
              '100%': { transform: 'scale(1)', opacity: '1' },
            },
          },
          animation: {
            'fade-in': 'fade-in 0.5s ease-out',
            'slide-in': 'slide-in 0.5s ease-out',
            'scale-in': 'scale-in 0.5s ease-out',
          },
        },
      },
    },
  },
  css: ['~/assets/css/transitions.css'],
  compatibilityDate: '2025-01-28',
});
