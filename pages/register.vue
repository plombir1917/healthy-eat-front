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
        Регистрация
      </h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-4">
          <label for="name" class="block text-secondary dark:text-gray-300 mb-2"
            >Имя</label
          >
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <div class="mb-4">
          <label
            for="email"
            class="block text-secondary dark:text-gray-300 mb-2"
            >Логин</label
          >
          <input
            type="email"
            id="email"
            v-model="form.login"
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
        <div class="mb-4">
          <label
            for="confirmPassword"
            class="block text-secondary dark:text-gray-300 mb-2"
            >Подтвердите пароль</label
          >
          <input
            type="password"
            id="confirmPassword"
            v-model="form.confirmPassword"
            class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Зарегистрироваться
        </button>
      </form>
      <p class="mt-4 text-center text-secondary dark:text-gray-300">
        Уже есть аккаунт?
        <NuxtLink to="/login" class="text-primary hover:text-primary/80"
          >Войдите</NuxtLink
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
import { ArrowLeftIcon } from 'lucide-vue-next';

definePageMeta({
  layout: 'empty',
});

useHead({
  title: 'Zдоровье - Регистрация',
  meta: [
    {
      name: 'description',
      content:
        'Зарегистрируйтесь в Zдоровье и получите доступ к персональным рекомендациям по питанию от квалифицированных врачей.',
    },
    { property: 'og:title', content: 'Zдоровье - Регистрация' },
    {
      property: 'og:description',
      content:
        'Зарегистрируйтесь в Zдоровье и получите доступ к персональным рекомендациям по питанию от квалифицированных врачей.',
    },
    { property: 'og:type', content: 'website' },
  ],
});

const form = ref({
  name: '',
  login: '',
  password: '',
  confirmPassword: '',
});

const router = useRouter();
const toast = useToast();

const handleRegister = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    toast.error('Пароли не совпадают');
    return;
  }

  try {
    const { confirmPassword, ...registerData } = form.value;
    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка при регистрации');
    }

    toast.success('Регистрация прошла успешно!');
    router.push('/login');
  } catch (error) {
    console.error('Ошибка регистрации:', error);
    toast.error(
      error.message || 'Произошла ошибка при регистрации. Попробуйте позже.'
    );
  }
};
</script>
