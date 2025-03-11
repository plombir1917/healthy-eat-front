<template>
  <div
    class="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center bg-no-repeat bg-center bg-cover"
    :style="{
      backgroundImage: 'url(/back.jpg)',
    }"
  >
    <div
      class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md"
    >
      <h2 class="text-2xl font-semibold text-primary dark:text-white mb-6">
        Вход
      </h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label
            for="email"
            class="block text-secondary dark:text-gray-300 mb-2"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div class="mb-4">
          <label
            for="password"
            class="block text-secondary dark:text-gray-300 mb-2"
            >Пароль</label
          >
          <input
            type="password"
            id="password"
            v-model="form.password"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <nuxt-link to="/"
          ><button
            type="submit"
            class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Войти
          </button></nuxt-link
        >
      </form>
      <p class="mt-4 text-center text-secondary dark:text-gray-300">
        Нет аккаунта?
        <NuxtLink to="/register" class="text-primary hover:text-primary/80"
          >Зарегистрируйтесь</NuxtLink
        >
      </p>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'empty', // Используем пустой макет
});

const form = ref({
  email: '',
  password: '',
});

const handleLogin = () => {
  console.log('Вход:', form.value);
  alert('Вход выполнен успешно!');
};
</script>
