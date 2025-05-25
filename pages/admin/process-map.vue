<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-6 sm:py-10">
    <div class="max-w-7xl mx-auto px-2 sm:px-4">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-primary dark:text-white">
          Дорожные карты
        </h1>
        <AnimatedButton
          v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
          @click="openCreateModal"
          variant="primary"
        >
          + Добавить дорожную карту
        </AnimatedButton>
      </div>

      <!-- Поиск -->
      <div class="mb-6">
        <input
          v-model="search"
          type="text"
          placeholder="🔍 Поиск по названию блюда"
          class="w-full p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white text-sm sm:text-base"
        />
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>

      <!-- Список дорожных карт (раскрывающиеся элементы) -->
      <div v-else class="space-y-4">
        <div
          v-if="filteredProcessMaps.length === 0"
          class="text-center text-gray-600 dark:text-gray-400 py-10"
        >
          Нет дорожных карт.
        </div>
        <div
          v-else
          v-for="item in filteredProcessMaps"
          :key="item.id"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all duration-300"
          :class="{
            'ring-2 ring-primary': selectedItem && selectedItem.id === item.id,
          }"
        >
          <button
            class="w-full text-left p-4 sm:p-6 focus:outline-none flex justify-between items-center"
            @click="toggleItem(item)"
          >
            <h2
              class="text-lg sm:text-xl font-semibold text-primary dark:text-white"
            >
              {{ item.dish_name }}
            </h2>
            <svg
              :class="[
                'w-5 h-5 text-gray-500 transition-transform duration-300',
                { 'rotate-180': selectedItem && selectedItem.id === item.id },
              ]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          <div
            v-if="selectedItem && selectedItem.id === item.id"
            class="p-4 sm:p-6 border-t border-gray-200 dark:border-gray-700"
          >
            <div
              class="text-secondary dark:text-gray-300 text-sm sm:text-base space-y-3"
            >
              <p><strong>Ингредиенты:</strong> {{ item.ingredients }}</p>
              <p>
                <strong>Процесс приготовления:</strong>
                {{ item.cooking_process }}
              </p>
              <div>
                <h3 class="font-semibold text-primary dark:text-white mb-1">
                  Пищевая ценность:
                </h3>
                <ul class="list-disc list-inside ml-4">
                  <li>Белки: {{ item.proteins }}г</li>
                  <li>Жиры: {{ item.fats }}г</li>
                  <li>Углеводы: {{ item.carbohydrates }}г</li>
                  <li>Калории: {{ item.calories }}ккал</li>
                </ul>
              </div>
              <p>
                <strong>Связанная диета:</strong>
                {{ getDietName(item.diet_id) }}
              </p>
            </div>
            <div
              v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
              class="flex gap-2 mt-4"
            >
              <button
                class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm w-full sm:w-auto"
                @click.stop="openEditModal(item)"
              >
                Редактировать
              </button>
              <button
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition text-sm w-full sm:w-auto"
                @click.stop="deleteProcessMap(item)"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 animate-fade-in overflow-y-auto"
    >
      <div
        class="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-scale-in my-4 mx-4"
      >
        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl transition-colors"
          @click="closeCreateModal"
        >
          &times;
        </button>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Добавить дорожную карту
        </h2>
        <form @submit.prevent="createProcessMap" class="space-y-4">
          <AnimatedInput
            v-model="form.dish_name"
            label="Название блюда"
            type="text"
            id="dish_name"
            required
            :error="errors.dish_name"
          />
          <AnimatedInput
            v-model="form.ingredients"
            label="Ингредиенты"
            type="text"
            id="ingredients"
            required
            :error="errors.ingredients"
          />
          <AnimatedInput
            v-model="form.cooking_process"
            label="Процесс приготовления"
            type="text"
            id="cooking_process"
            required
            :error="errors.cooking_process"
          />
          <AnimatedInput
            v-model="form.proteins"
            label="Белки (г)"
            type="number"
            id="proteins"
            required
            :error="errors.proteins"
          />
          <AnimatedInput
            v-model="form.fats"
            label="Жиры (г)"
            type="number"
            id="fats"
            required
            :error="errors.fats"
          />
          <AnimatedInput
            v-model="form.carbohydrates"
            label="Углеводы (г)"
            type="number"
            id="carbohydrates"
            required
            :error="errors.carbohydrates"
          />
          <AnimatedInput
            v-model="form.calories"
            label="Калории (ккал)"
            type="number"
            id="calories"
            required
            :error="errors.calories"
          />
          <AnimatedInput
            v-model="form.diet_id"
            label="ID диеты (необязательно)"
            type="number"
            id="diet_id"
            :error="errors.diet_id"
          />

          <AnimatedButton
            type="submit"
            variant="primary"
            class="w-full"
            :is-loading="modalLoading"
          >
            Добавить
          </AnimatedButton>
        </form>
      </div>
    </div>

    <!-- Модальное окно редактирования -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 animate-fade-in overflow-y-auto"
    >
      <div
        class="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-scale-in my-4 mx-4"
      >
        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl transition-colors"
          @click="closeEditModal"
        >
          &times;
        </button>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Редактировать дорожную карту
        </h2>
        <form @submit.prevent="saveEditProcessMap" class="space-y-4">
          <AnimatedInput
            v-model="editForm.dish_name"
            label="Название блюда"
            type="text"
            id="edit-dish_name"
            required
            :error="errors.dish_name"
          />
          <AnimatedInput
            v-model="editForm.ingredients"
            label="Ингредиенты"
            type="text"
            id="edit-ingredients"
            required
            :error="errors.ingredients"
          />
          <AnimatedInput
            v-model="editForm.cooking_process"
            label="Процесс приготовления"
            type="text"
            id="edit-cooking_process"
            required
            :error="errors.cooking_process"
          />
          <AnimatedInput
            v-model="editForm.proteins"
            label="Белки (г)"
            type="number"
            id="edit-proteins"
            required
            :error="errors.proteins"
          />
          <AnimatedInput
            v-model="editForm.fats"
            label="Жиры (г)"
            type="number"
            id="edit-fats"
            required
            :error="errors.fats"
          />
          <AnimatedInput
            v-model="editForm.carbohydrates"
            label="Углеводы (г)"
            type="number"
            id="edit-carbohydrates"
            required
            :error="errors.carbohydrates"
          />
          <AnimatedInput
            v-model="editForm.calories"
            label="Калории (ккал)"
            type="number"
            id="edit-calories"
            required
            :error="errors.calories"
          />
          <AnimatedInput
            v-model="editForm.diet_id"
            label="ID диеты (необязательно)"
            type="number"
            id="edit-diet_id"
            :error="errors.diet_id"
          />

          <div class="flex gap-2">
            <AnimatedButton type="submit" variant="primary" class="w-full">
              Сохранить
            </AnimatedButton>
            <AnimatedButton
              type="button"
              variant="secondary"
              class="w-full"
              @click="closeEditModal"
            >
              Отмена
            </AnimatedButton>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import AnimatedButton from '@/components/AnimatedButton.vue';
import AnimatedInput from '@/components/AnimatedInput.vue';
import { useAuth } from '~/composables/useAuth';

const API_URL = 'https://igor-plaxin.ru/healthy-eat/process-map';
const DIET_URL = 'https://igor-plaxin.ru/healthy-eat/diet';
const TOKEN_PAYLOAD_URL =
  'https://igor-plaxin.ru/healthy-eat/auth/token-payload';
const { getToken } = useAuth();

const processMaps = ref([]);
const diets = ref([]);
const isLoading = ref(true);
const modalLoading = ref(false);
const search = ref('');
const selectedItem = ref(null); // Для управления раскрытием элемента
const showCreateModal = ref(false);
const showEditModal = ref(false);
const userRole = ref(null);

const form = ref({
  dish_name: '',
  ingredients: '',
  cooking_process: '',
  proteins: '',
  fats: '',
  carbohydrates: '',
  calories: '',
  diet_id: '',
});

const editForm = ref({
  dish_name: '',
  ingredients: '',
  cooking_process: '',
  proteins: '',
  fats: '',
  carbohydrates: '',
  calories: '',
  diet_id: '',
});

const errors = ref({
  dish_name: '',
  ingredients: '',
  cooking_process: '',
  proteins: '',
  fats: '',
  carbohydrates: '',
  calories: '',
  diet_id: '',
});

const filteredProcessMaps = computed(() => {
  return processMaps.value.filter((item) =>
    item.dish_name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const fetchTokenPayload = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Токен авторизации не найден');
    }
    const res = await fetch(TOKEN_PAYLOAD_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка получения данных токена');
    const data = await res.json();
    userRole.value = data.role;
  } catch (e) {
    toast.error(e.message || 'Ошибка получения данных токена');
  }
};

const fetchProcessMaps = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Ошибка загрузки дорожных карт');
    processMaps.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки дорожных карт');
  } finally {
    isLoading.value = false;
  }
};

const fetchDiets = async () => {
  try {
    const res = await fetch(DIET_URL);
    if (!res.ok) throw new Error('Ошибка загрузки диет');
    diets.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки диет');
  }
};

const getDietName = (dietId) => {
  if (!dietId) return 'Не привязана';
  const diet = diets.value.find((d) => d.id === dietId);
  return diet ? diet.name : 'Неизвестная диета';
};

const toggleItem = (item) => {
  if (selectedItem.value && selectedItem.value.id === item.id) {
    selectedItem.value = null; // Закрыть, если уже открыт
  } else {
    selectedItem.value = item; // Открыть
  }
};

const validateForm = (formData) => {
  let valid = true;
  errors.value = {
    dish_name: '',
    ingredients: '',
    cooking_process: '',
    proteins: '',
    fats: '',
    carbohydrates: '',
    calories: '',
    diet_id: '',
  };

  if (!formData.dish_name) {
    errors.value.dish_name = 'Название блюда обязательно';
    valid = false;
  }
  if (!formData.ingredients) {
    errors.value.ingredients = 'Ингредиенты обязательны';
    valid = false;
  }
  if (!formData.cooking_process) {
    errors.value.cooking_process = 'Процесс приготовления обязателен';
    valid = false;
  }
  if (
    formData.proteins === '' ||
    formData.proteins === null ||
    formData.proteins < 0
  ) {
    errors.value.proteins = 'Введите корректное количество белков';
    valid = false;
  }
  if (formData.fats === '' || formData.fats === null || formData.fats < 0) {
    errors.value.fats = 'Введите корректное количество жиров';
    valid = false;
  }
  if (
    formData.carbohydrates === '' ||
    formData.carbohydrates === null ||
    formData.carbohydrates < 0
  ) {
    errors.value.carbohydrates = 'Введите корректное количество углеводов';
    valid = false;
  }
  if (
    formData.calories === '' ||
    formData.calories === null ||
    formData.calories < 0
  ) {
    errors.value.calories = 'Введите корректное количество калорий';
    valid = false;
  }

  if (
    formData.diet_id !== '' &&
    formData.diet_id !== null &&
    formData.diet_id < 0
  ) {
    errors.value.diet_id = 'Введите корректный ID диеты';
    valid = false;
  }

  return valid;
};

const createProcessMap = async () => {
  if (!validateForm(form.value)) return;

  modalLoading.value = true;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      ...form.value,
      proteins: parseInt(form.value.proteins),
      fats: parseInt(form.value.fats),
      carbohydrates: parseInt(form.value.carbohydrates),
      calories: parseInt(form.value.calories),
      diet_id: form.value.diet_id ? parseInt(form.value.diet_id) : null,
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка создания дорожной карты');
    toast.success('Дорожная карта успешно добавлена');
    closeCreateModal();
    fetchProcessMaps();
  } catch (e) {
    toast.error(e.message || 'Ошибка создания дорожной карты');
  } finally {
    modalLoading.value = false;
  }
};

const openCreateModal = () => {
  showCreateModal.value = true;
  form.value = {
    dish_name: '',
    ingredients: '',
    cooking_process: '',
    proteins: '',
    fats: '',
    carbohydrates: '',
    calories: '',
    diet_id: '',
  };
  errors.value = {
    dish_name: '',
    ingredients: '',
    cooking_process: '',
    proteins: '',
    fats: '',
    carbohydrates: '',
    calories: '',
    diet_id: '',
  };
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditModal = (item) => {
  selectedItem.value = item;
  editForm.value = {
    dish_name: item.dish_name,
    ingredients: item.ingredients,
    cooking_process: item.cooking_process,
    proteins: item.proteins,
    fats: item.fats,
    carbohydrates: item.carbohydrates,
    calories: item.calories,
    diet_id: item.diet_id || '',
  };
  showEditModal.value = true;
};

const saveEditProcessMap = async () => {
  if (!validateForm(editForm.value)) return;
  if (!selectedItem.value) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      ...editForm.value,
      proteins: parseInt(editForm.value.proteins),
      fats: parseInt(editForm.value.fats),
      carbohydrates: parseInt(editForm.value.carbohydrates),
      calories: parseInt(editForm.value.calories),
      diet_id: editForm.value.diet_id ? parseInt(editForm.value.diet_id) : null,
    };

    const res = await fetch(`${API_URL}/${selectedItem.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка при обновлении данных');
    toast.success('Данные дорожной карты обновлены');
    closeEditModal();
    fetchProcessMaps();
  } catch (e) {
    toast.error(e.message || 'Ошибка при обновлении данных');
  }
};

const deleteProcessMap = async (item) => {
  if (!confirm('Вы действительно хотите удалить эту дорожную карту?')) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(`${API_URL}/${item.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Ошибка при удалении дорожной карты');
    toast.success('Дорожная карта успешно удалена');
    selectedItem.value = null; // Закрыть раскрытый элемент
    fetchProcessMaps();
  } catch (e) {
    toast.error(e.message || 'Ошибка при удалении дорожной карты');
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
};

onMounted(async () => {
  await fetchTokenPayload();
  await Promise.all([fetchProcessMaps(), fetchDiets()]);
});
</script>
