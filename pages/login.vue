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
        <button
          type="submit"
          class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Войти
        </button>
      </form>
      <p class="mt-4 text-center text-secondary dark:text-gray-300">
        Нет аккаунта?
        <NuxtLink to="/register" class="text-primary hover:text-primary/80"
          >Зарегистрируйтесь</NuxtLink
        >
      </p>
      <div class="mt-6 text-center">
        <NuxtLink
          to="/"
          class="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeftIcon class="w-4 h-4" />
          На главную
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import { useAuth } from '../composables/useAuth';
import { ArrowLeftIcon } from 'lucide-vue-next';
import { useHead } from 'unhead';

definePageMeta({
  layout: 'empty',
});

useHead({
  title: 'Zдоровье - Вход',
  meta: [
    {
      name: 'description',
      content:
        'Войдите в свой аккаунт Zдоровье для доступа к персональным рекомендациям по питанию.',
    },
    { property: 'og:title', content: 'Zдоровье - Вход' },
    {
      property: 'og:description',
      content:
        'Войдите в свой аккаунт Zдоровье для доступа к персональным рекомендациям по питанию.',
    },
    { property: 'og:type', content: 'website' },
  ],
});

const form = ref({
  email: '',
  password: '',
});

const router = useRouter();
const toast = useToast();
const { setToken } = useAuth();

const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при входе');
    }

    if (data.token) {
      setToken(data.token);
      toast.success('Вход выполнен успешно!');
      router.push('/admin/dashboard');
    } else {
      throw new Error('Токен не получен');
    }
  } catch (error) {
    console.error('Ошибка входа:', error);
    toast.error(
      error.message || 'Произошла ошибка при входе. Попробуйте позже.'
    );
  }
};
</script>
