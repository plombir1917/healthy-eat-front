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
        Регистрация
      </h2>
      <form @submit.prevent="handleRegister" class="space-y-4">
        <AnimatedInput
          v-model="form.name"
          label="Имя"
          type="text"
          id="name"
          required
          :error="errors.name"
          class="animate-slide-in"
          style="animation-delay: 0.1s"
        />
        <AnimatedInput
          v-model="form.login"
          label="Логин"
          type="email"
          id="email"
          required
          :error="errors.login"
          class="animate-slide-in"
          style="animation-delay: 0.2s"
        />
        <AnimatedInput
          v-model="form.password"
          label="Пароль"
          type="password"
          id="password"
          required
          :error="errors.password"
          class="animate-slide-in"
          style="animation-delay: 0.3s"
        />
        <AnimatedInput
          v-model="form.confirmPassword"
          label="Подтвердите пароль"
          type="password"
          id="confirmPassword"
          required
          :error="errors.confirmPassword"
          class="animate-slide-in"
          style="animation-delay: 0.4s"
        />
        <AnimatedButton
          type="submit"
          variant="primary"
          class="w-full animate-slide-in"
          style="animation-delay: 0.5s"
          :is-loading="isLoading"
          @click="handleRegister"
        >
          Зарегистрироваться
        </AnimatedButton>
      </form>
      <p
        class="mt-4 text-center text-secondary dark:text-gray-300 animate-fade-in"
        style="animation-delay: 0.6s"
      >
        Уже есть аккаунт?
        <NuxtLink
          to="/login"
          class="text-primary hover:text-primary/80 transition-colors"
          >Войдите</NuxtLink
        >
      </p>
      <div
        class="mt-6 text-center animate-fade-in"
        style="animation-delay: 0.7s"
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
import { ArrowLeftIcon } from 'lucide-vue-next';
import { ref } from 'vue';

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

const errors = ref({
  name: '',
  login: '',
  password: '',
  confirmPassword: '',
});

const router = useRouter();
const toast = useToast();
const isLoading = ref(false);

const validateForm = () => {
  let isValid = true;
  errors.value = {
    name: '',
    login: '',
    password: '',
    confirmPassword: '',
  };

  if (!form.value.name) {
    errors.value.name = 'Имя обязательно';
    isValid = false;
  }

  if (!form.value.login) {
    errors.value.login = 'Логин обязателен';
    isValid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.login)) {
    errors.value.login = 'Введите корректный email';
    isValid = false;
  }

  if (!form.value.password) {
    errors.value.password = 'Пароль обязателен';
    isValid = false;
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Пароль должен быть не менее 6 символов';
    isValid = false;
  }

  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Подтвердите пароль';
    isValid = false;
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Пароли не совпадают';
    isValid = false;
  }

  return isValid;
};

const handleRegister = async () => {
  if (!validateForm()) {
    return;
  }

  isLoading.value = true;
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
  } finally {
    isLoading.value = false;
  }
};
</script>
