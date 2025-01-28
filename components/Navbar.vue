<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto py-4">
      <div class="flex items-center justify-between">
        <!-- Логотип с дополнительным отступом слева -->
        <div class="flex items-center space-x-2">
          <!-- Добавлен pl-6 для отступа слева -->
          <router-link
            to="/"
            class="flex items-center space-x-2 hover:text-primary dark:hover:text-white"
          >
            <img
              src="~/assets/images/logo.png"
              alt="Логотип"
              class="h-8 w-auto"
            />
            <span class="text-xl font-semibold text-primary dark:text-white">
              Zдоровье
            </span>
          </router-link>
        </div>

        <!-- Кнопки и переключатель темы -->
        <div class="flex items-center space-x-4">
          <ThemeToggle />
          <button
            class="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white"
          >
            Профиль
          </button>
          <NuxtLink to="/login"
            ><button
              class="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white"
            >
              Выйти
            </button></NuxtLink
          >
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import ThemeToggle from '~/components/ThemeToggle.vue';
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
