<template>
  <div class="bg-white p-6 rounded-lg shadow-sm">
    <h1 class="text-2xl font-semibold text-primary mb-4">Дашборд</h1>
    <p class="text-secondary mb-6">
      Здесь будут отображаться основные метрики и статистика.
    </p>

    <!-- Калькулятор калорий -->
    <div class="bg-gray-100 p-4 rounded-lg shadow-inner">
      <h2 class="text-xl font-semibold mb-2">Рассчёт суточной нормы калорий</h2>
      <div class="flex gap-4 mb-4">
        <input
          v-model.number="weight"
          type="number"
          placeholder="Вес (кг)"
          class="p-2 border rounded w-full"
        />
        <input
          v-model.number="height"
          type="number"
          placeholder="Рост (см)"
          class="p-2 border rounded w-full"
        />
      </div>
      <button
        @click="calculateCalories"
        class="bg-primary text-white px-4 py-2 rounded hover:bg-opacity-90 transition"
      >
        Рассчитать
      </button>
      <div v-if="calories" class="mt-4 text-lg font-semibold">
        Ваша суточная норма калорий:
        <span class="text-green-500 animate-pulse">{{ calories }} ккал</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const weight = ref(null);
const height = ref(null);
const calories = ref(null);

const calculateCalories = () => {
  if (weight.value && height.value) {
    calories.value = Math.round(
      10 * weight.value + 6.25 * height.value - 5 * 25 + 5
    );
  } else {
    calories.value = 'Заполните все поля!';
  }
};
</script>

<style scoped>
input {
  transition: 0.3s ease-in-out;
}
input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 5px rgba(59, 130, 246, 0.5);
}
</style>
