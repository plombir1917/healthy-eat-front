<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-6 sm:py-10">
    <!-- Фильтрация диет -->
    <div
      class="max-w-7xl mx-auto px-2 sm:px-4 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4"
    >
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Поиск по названию"
        class="w-full p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white text-sm sm:text-base"
      />
      <AnimatedButton
        v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
        @click="openCreateModal"
        variant="primary"
      >
        + Добавить диету
      </AnimatedButton>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <LoadingSpinner />
    </div>

    <!-- Список карточек диет -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-7xl mx-auto px-2 sm:px-4"
    >
      <div
        v-for="diet in filteredDiets"
        :key="diet.id"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
        @click="openModal(diet)"
      >
        <!-- Информация о диете -->
        <div class="p-4 sm:p-6">
          <h2
            class="text-lg sm:text-xl font-semibold text-primary dark:text-white mb-2"
          >
            {{ diet.name }}
          </h2>
          <p
            class="text-secondary dark:text-gray-300 mb-2 text-sm sm:text-base"
          >
            <strong>Заболевание:</strong> {{ getIllnessName(diet.illness_id) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Модальное окно просмотра -->
    <div
      v-if="selectedDiet"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in"
    >
      <div
        class="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-2xl relative animate-scale-in"
      >
        <!-- Кнопка закрытия -->
        <button
          class="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-xl"
          @click="closeModal"
        >
          &times;
        </button>
        <!-- Информация о диете или форма редактирования -->
        <div class="flex flex-col gap-4 sm:gap-6">
          <div v-if="!isEditMode">
            <h2
              class="text-xl sm:text-2xl font-bold text-primary dark:text-white mb-2 sm:mb-4"
            >
              {{ selectedDiet.name }}
            </h2>
            <p
              class="text-secondary dark:text-gray-300 mb-2 text-sm sm:text-base"
            >
              <strong>Заболевание:</strong>
              {{ getIllnessName(selectedDiet.illness_id) }}
            </p>
            <!-- Добавляем секцию для связанных технологических карт -->
            <div
              class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <h3
                class="text-lg font-semibold text-gray-900 dark:text-white mb-2"
              >
                Связанные технологические карты:
              </h3>
              <ul
                v-if="relatedProcessMaps.length > 0"
                class="list-disc list-inside ml-4"
              >
                <li
                  v-for="pm in relatedProcessMaps"
                  :key="pm.id"
                  class="text-secondary dark:text-gray-300 text-sm sm:text-base"
                >
                  {{ pm.dish_name }}
                </li>
              </ul>
              <p
                v-else
                class="text-secondary dark:text-gray-400 text-sm italic"
              >
                Нет связанных технологических карт.
              </p>
            </div>
            <div
              v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
              class="flex gap-2 mt-4"
            >
              <button
                class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition w-full"
                @click="openEditDiet"
              >
                Редактировать
              </button>
              <button
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition w-full"
                @click="deleteDiet"
              >
                Удалить
              </button>
            </div>
          </div>
          <form v-else @submit.prevent="saveEditDiet" class="flex-1 space-y-2">
            <AnimatedInput
              v-model="editForm.name"
              label="Название"
              type="text"
              id="edit-name"
              required
            />
            <div>
              <label
                class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Заболевание
              </label>
              <select
                v-model="editForm.illness_id"
                required
                class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Выберите заболевание</option>
                <option
                  v-for="illness in illnesses"
                  :key="illness.id"
                  :value="illness.id"
                >
                  {{ illness.name }}
                </option>
              </select>
              <span
                v-if="errors.illness_id"
                class="text-red-500 text-sm mt-1"
                >{{ errors.illness_id }}</span
              >
            </div>
            <div class="flex gap-2 mt-2">
              <AnimatedButton type="submit" variant="primary" class="w-full"
                >Сохранить</AnimatedButton
              >
              <AnimatedButton
                type="button"
                variant="secondary"
                class="w-full"
                @click="isEditMode = false"
                >Отмена</AnimatedButton
              >
            </div>
          </form>
        </div>
        <button
          class="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full mt-4"
          @click="closeModal"
        >
          Закрыть
        </button>
      </div>
    </div>

    <!-- Модальное окно создания диеты -->
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
          Добавить диету
        </h2>
        <form @submit.prevent="createDiet" class="space-y-4">
          <AnimatedInput
            v-model="form.name"
            label="Название"
            type="text"
            id="name"
            required
          />
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Заболевание
            </label>
            <select
              v-model="form.illness_id"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите заболевание</option>
              <option
                v-for="illness in illnesses"
                :key="illness.id"
                :value="illness.id"
              >
                {{ illness.name }}
              </option>
            </select>
            <span v-if="errors.illness_id" class="text-red-500 text-sm mt-1">{{
              errors.illness_id
            }}</span>
          </div>
          <AnimatedButton
            type="submit"
            variant="primary"
            class="w-full mt-2"
            :is-loading="modalLoading"
          >
            Добавить
          </AnimatedButton>
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

const API_URL = 'https://igor-plaxin.store/healthy-eat/diet';
const ILLNESS_URL = 'https://igor-plaxin.store/healthy-eat/illness';
const TOKEN_PAYLOAD_URL =
  'https://igor-plaxin.store/healthy-eat/auth/token-payload';
const { getToken } = useAuth();

const diets = ref([]);
const illnesses = ref([]);
const processMaps = ref([]);
const isLoading = ref(true);
const modalLoading = ref(false);
const search = ref('');
const selectedDiet = ref(null);
const showCreateModal = ref(false);
const userRole = ref(null);
const isEditMode = ref(false);

const form = ref({
  name: '',
  illness_id: '',
});

const editForm = ref({
  name: '',
  illness_id: '',
});

const errors = ref({
  name: '',
  illness_id: '',
});

const filteredDiets = computed(() => {
  return diets.value.filter((d) =>
    d.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const relatedProcessMaps = computed(() => {
  if (!selectedDiet.value) return [];
  return processMaps.value.filter((pm) => pm.diet_id === selectedDiet.value.id);
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

const fetchDiets = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Ошибка загрузки диет');
    diets.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки диет');
  } finally {
    isLoading.value = false;
  }
};

const fetchIllnesses = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(ILLNESS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка загрузки заболеваний');
    illnesses.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки заболеваний');
  }
};

const fetchProcessMaps = async () => {
  try {
    const res = await fetch(
      'https://igor-plaxin.store/healthy-eat/process-map'
    );
    if (!res.ok) throw new Error('Ошибка загрузки технологических карт');
    processMaps.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки технологических карт');
  }
};

const getIllnessName = (illnessId) => {
  const illness = illnesses.value.find((i) => i.id === illnessId);
  return illness ? illness.name : 'Неизвестное заболевание';
};

const validateForm = (formData) => {
  let valid = true;
  errors.value = {
    name: '',
    illness_id: '',
  };

  if (!formData.name) {
    errors.value.name = 'Название обязательно';
    valid = false;
  }
  if (!formData.illness_id) {
    errors.value.illness_id = 'ID заболевания обязателен';
    valid = false;
  }

  return valid;
};

const createDiet = async () => {
  if (!validateForm(form.value)) return;

  modalLoading.value = true;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      ...form.value,
      illness_id: parseInt(form.value.illness_id),
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка создания диеты');
    toast.success('Диета успешно добавлена');
    closeCreateModal();
    fetchDiets();
  } catch (e) {
    toast.error(e.message || 'Ошибка создания диеты');
  } finally {
    modalLoading.value = false;
  }
};

const openCreateModal = () => {
  showCreateModal.value = true;
  form.value = {
    name: '',
    illness_id: '',
  };
  errors.value = {
    name: '',
    illness_id: '',
  };
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditDiet = () => {
  isEditMode.value = true;
  editForm.value = {
    name: selectedDiet.value.name,
    illness_id: selectedDiet.value.illness_id,
  };
};

const saveEditDiet = async () => {
  if (!validateForm(editForm.value)) return;
  if (!selectedDiet.value) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      ...editForm.value,
      illness_id: parseInt(editForm.value.illness_id),
    };

    const res = await fetch(`${API_URL}/${selectedDiet.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка при обновлении данных');
    toast.success('Данные диеты обновлены');
    isEditMode.value = false;
    closeModal();
    fetchDiets();
  } catch (e) {
    toast.error(e.message || 'Ошибка при обновлении данных');
  }
};

const deleteDiet = async () => {
  if (!selectedDiet.value) return;
  if (!confirm('Вы действительно хотите удалить эту диету?')) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(`${API_URL}/${selectedDiet.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Ошибка при удалении диеты');
    toast.success('Диета успешно удалена');
    closeModal();
    fetchDiets();
  } catch (e) {
    toast.error(e.message || 'Ошибка при удалении диеты');
  }
};

const openModal = (diet) => {
  selectedDiet.value = diet;
  isEditMode.value = false;
};

const closeModal = () => {
  selectedDiet.value = null;
  isEditMode.value = false;
};

onMounted(async () => {
  await fetchTokenPayload();
  await Promise.all([fetchDiets(), fetchIllnesses(), fetchProcessMaps()]);
});
</script>
