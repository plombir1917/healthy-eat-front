<template>
  <header class="bg-white dark:bg-gray-800 shadow-sm">
    <div class="container mx-auto py-4">
      <div class="flex items-center justify-between">
        <!-- Логотип с дополнительным отступом слева -->
        <div class="flex items-center space-x-2">
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

        <!-- Уведомления, смена темы и кнопка выхода -->
        <div class="flex items-center space-x-4">
          <button
            @click="showNotifications"
            class="relative text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white"
          >
            <BellIcon class="w-6 h-6" />
            <span
              v-if="unreadNotifications > 0"
              class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5"
            >
              {{ unreadNotifications }}
            </span>
          </button>

          <ThemeToggle />

          <NuxtLink to="/profile">
            <button
              class="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white"
            >
              Профиль
            </button></NuxtLink
          >
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
import { ref } from 'vue';
import { BellIcon } from 'lucide-vue-next';
import ThemeToggle from '~/components/ThemeToggle.vue';

const unreadNotifications = ref(3);

const showNotifications = () => {
  alert('У вас 3 новых уведомления!');
  unreadNotifications.value = 0;
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
