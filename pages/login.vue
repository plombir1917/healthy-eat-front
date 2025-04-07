<template>
  <div
    class="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center bg-no-repeat bg-center bg-cover animate-fade-in"
    :style="{
      backgroundImage: 'url(/back.jpg)',
    }"
  >
    <div
      class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md animate-scale-in"
    >
      <h2
        class="text-2xl font-semibold text-primary dark:text-white mb-6 animate-slide-in"
      >
        Вход
      </h2>
      <form @submit.prevent="handleLogin" class="space-y-4">
        <AnimatedInput
          v-model="form.email"
          label="Email"
          type="email"
          id="email"
          required
          :error="errors.email"
          class="animate-slide-in"
          style="animation-delay: 0.1s"
        />
        <AnimatedInput
          v-model="form.password"
          label="Пароль"
          type="password"
          id="password"
          required
          :error="errors.password"
          class="animate-slide-in"
          style="animation-delay: 0.2s"
        />
        <AnimatedButton
          type="submit"
          variant="primary"
          class="w-full animate-slide-in"
          style="animation-delay: 0.3s"
          :is-loading="isLoading"
          @click="handleLogin"
        >
          Войти
        </AnimatedButton>
      </form>
      <p
        class="mt-4 text-center text-secondary dark:text-gray-300 animate-fade-in"
        style="animation-delay: 0.4s"
      >
        Нет аккаунта?
        <NuxtLink
          to="/register"
          class="text-primary hover:text-primary/80 transition-colors"
          >Зарегистрируйтесь</NuxtLink
        >
      </p>
      <div
        class="mt-6 text-center animate-fade-in"
        style="animation-delay: 0.5s"
      >
        <NuxtLink
          to="/"
          class="text-secondary dark:text-gray-300 hover:text-primary dark:hover:text-white transition-colors flex items-center justify-center gap-2 btn-hover"
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
import { ref } from 'vue';

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

const errors = ref({
  email: '',
  password: '',
});

const router = useRouter();
const toast = useToast();
const { setToken } = useAuth();
const isLoading = ref(false);

const validateForm = () => {
  let isValid = true;
  errors.value = {
    email: '',
    password: '',
  };

  if (!form.value.email) {
    errors.value.email = 'Email обязателен';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Введите корректный email';
    isValid = false;
  }

  if (!form.value.password) {
    errors.value.password = 'Пароль обязателен';
    isValid = false;
  }

  return isValid;
};

const handleLogin = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
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
  } finally {
    isLoading.value = false;
  }
};
</script>
