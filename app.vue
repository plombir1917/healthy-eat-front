<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
useHead({
  title: 'Zдоровье - Персональное питание для здоровья вашего ЖКТ',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    {
      name: 'description',
      content:
        'Персональное питание для здоровья вашего ЖКТ. Индивидуальные рекомендации от врачей, учет непереносимости и подбор оптимального рациона.',
    },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'theme-color', content: '#3b82f6' },
    {
      property: 'og:title',
      content: 'Zдоровье - Персональное питание для здоровья вашего ЖКТ',
    },
    {
      property: 'og:description',
      content:
        'Персональное питание для здоровья вашего ЖКТ. Индивидуальные рекомендации от врачей, учет непереносимости и подбор оптимального рациона.',
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Zдоровье' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:title',
      content: 'Zдоровье - Персональное питание для здоровья вашего ЖКТ',
    },
    {
      name: 'twitter:description',
      content:
        'Персональное питание для здоровья вашего ЖКТ. Индивидуальные рекомендации от врачей, учет непереносимости и подбор оптимального рациона.',
    },
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
    { rel: 'manifest', href: '/site.webmanifest' },
  ],
});
</script>
