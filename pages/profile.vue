<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md max-w-4xl mx-auto mt-10"
  >
    <!-- Аватар и информация -->
    <div class="flex items-center space-x-6 mb-4">
      <label class="cursor-pointer">
        <input type="file" class="hidden" @change="uploadAvatar" />
        <img
          :src="avatarUrl"
          alt="Аватар"
          class="w-24 h-24 rounded-full border-4 border-primary shadow-md hover:opacity-80 transition"
        />
      </label>
      <div>
        <h1 class="text-2xl font-bold text-primary dark:text-white">
          {{ user.name }}
        </h1>
        <p class="text-secondary dark:text-gray-300">{{ user.email }}</p>
      </div>
    </div>

    <!-- Основные данные -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-primary dark:text-white mb-2">
          Основные данные
        </h2>
        <p class="text-secondary dark:text-gray-300">
          Возраст: {{ user.age }} лет
        </p>
        <p class="text-secondary dark:text-gray-300">
          Рост: {{ user.height }} см
        </p>
        <p class="text-secondary dark:text-gray-300">
          Вес: {{ user.weight }} кг
        </p>
      </div>

      <!-- Статистика активности -->
      <div class="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
        <h2 class="text-lg font-semibold text-primary dark:text-white mb-2">
          Активность
        </h2>
        <p class="text-secondary dark:text-gray-300">
          Заявок создано: {{ user.requests }}
        </p>
        <p class="text-secondary dark:text-gray-300">
          Последний вход: {{ user.lastLogin }}
        </p>
      </div>
    </div>

    <!-- Достижения и графики -->
    <div class="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow">
      <h2 class="text-lg font-semibold text-primary dark:text-white mb-4">
        Достижения
      </h2>
      <ul class="list-disc list-inside text-secondary dark:text-gray-300">
        <li v-for="(achievement, index) in user.achievements" :key="index">
          {{ achievement }}
        </li>
      </ul>
    </div>

    <div class="mt-6">
      <h2 class="text-lg font-semibold text-primary dark:text-white mb-2">
        Прогресс
      </h2>
      <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
        <div
          class="bg-primary h-4 rounded-full transition-all duration-500"
          :style="{ width: user.progress + '%' }"
        ></div>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="mt-6 flex justify-end space-x-2">
      <button
        class="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Редактировать профиль
      </button>
      <button
        class="bg-red-500 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Выйти
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Моковые данные
const user = ref({
  name: 'Иван Иванов',
  email: 'ivan.ivanov@example.com',
  age: 25,
  height: 178,
  weight: 75,
  requests: 15,
  lastLogin: 'Сегодня',
  achievements: [
    'Сбросил 5 кг за месяц!',
    'Прошел 30 тренировок',
    'Поднял свой личный рекорд',
  ],
  progress: 75,
});

// URL красивой моковой аватарки
const avatarUrl = ref(
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
);

const uploadAvatar = (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
</script>

<style scoped>
.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
