<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-primary dark:text-white">
          Рекомендации
        </h1>
        <AnimatedButton
          v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
          @click="openCreateModal"
          variant="primary"
        >
          + Добавить рекомендацию
        </AnimatedButton>
      </div>

      <!-- Поиск -->
      <div class="mb-6">
        <input
          v-model="search"
          type="text"
          placeholder="🔍 Поиск по названию диеты"
          class="w-full p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>

      <!-- Таблица рекомендаций -->
      <div v-else class="overflow-x-auto">
        <table
          class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-700 text-left">
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                #
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Название диеты
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(recommendation, index) in filteredRecommendations"
              :key="recommendation.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ index + 1 }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ getDietName(recommendation.diet_id) }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                <div class="flex gap-2">
                  <button
                    v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
                    @click="openEditModal(recommendation)"
                  >
                    ✏️
                  </button>
                  <button
                    v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
                    class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
                    @click="deleteRecommendation(recommendation)"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
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
          Добавить рекомендацию
        </h2>
        <form @submit.prevent="createRecommendation" class="space-y-4">
          <AnimatedInput
            v-model="form.diet_id"
            label="ID диеты"
            type="number"
            id="diet_id"
            required
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
          Редактировать рекомендацию
        </h2>
        <form @submit.prevent="saveEditRecommendation" class="space-y-4">
          <AnimatedInput
            v-model="editForm.diet_id"
            label="ID диеты"
            type="number"
            id="edit-diet_id"
            required
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

const API_URL = 'https://igor-plaxin.ru/healthy-eat/recommendation';
const DIET_URL = 'https://igor-plaxin.ru/healthy-eat/diet';
const TOKEN_PAYLOAD_URL =
  'https://igor-plaxin.ru/healthy-eat/auth/token-payload';
const { getToken } = useAuth();

const recommendations = ref([]);
const diets = ref([]);
const isLoading = ref(true);
const modalLoading = ref(false);
const search = ref('');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedRecommendation = ref(null);
const userRole = ref(null);

const form = ref({
  diet_id: '',
});

const editForm = ref({
  diet_id: '',
});

const errors = ref({
  diet_id: '',
});

const filteredRecommendations = computed(() => {
  return recommendations.value.filter((r) => {
    const dietName = getDietName(r.diet_id);
    return dietName.toLowerCase().includes(search.value.toLowerCase());
  });
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

const fetchRecommendations = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Ошибка загрузки рекомендаций');
    recommendations.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки рекомендаций');
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
  if (!dietId) return '-';
  const diet = diets.value.find((d) => d.id === dietId);
  return diet ? diet.name : 'Неизвестная диета';
};

const validateForm = (formData) => {
  let valid = true;
  errors.value = {
    diet_id: '',
  };

  if (!formData.diet_id) {
    errors.value.diet_id = 'ID диеты обязательно';
    valid = false;
  }

  return valid;
};

const createRecommendation = async () => {
  if (!validateForm(form.value)) return;

  modalLoading.value = true;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      ...form.value,
      diet_id: parseInt(form.value.diet_id),
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка создания рекомендации');
    toast.success('Рекомендация успешно добавлена');
    closeCreateModal();
    fetchRecommendations(); // Обновить список рекомендаций после добавления
  } catch (e) {
    toast.error(e.message || 'Ошибка создания рекомендации');
  } finally {
    modalLoading.value = false;
  }
};

const openCreateModal = () => {
  showCreateModal.value = true;
  form.value = {
    diet_id: '',
  };
  errors.value = {
    diet_id: '',
  };
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditModal = (recommendation) => {
  selectedRecommendation.value = recommendation;
  editForm.value = {
    diet_id: recommendation.diet_id,
  };
  showEditModal.value = true;
};

const saveEditRecommendation = async () => {
  if (!validateForm(editForm.value)) return;
  if (!selectedRecommendation.value) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      ...editForm.value,
      diet_id: parseInt(editForm.value.diet_id),
    };

    const res = await fetch(`${API_URL}/${selectedRecommendation.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка при обновлении данных');
    toast.success('Данные рекомендации обновлены');
    closeEditModal();
    fetchRecommendations(); // Обновить список рекомендаций после редактирования
  } catch (e) {
    toast.error(e.message || 'Ошибка при обновлении данных');
  }
};

const deleteRecommendation = async (recommendation) => {
  if (!confirm('Вы действительно хотите удалить эту рекомендацию?')) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(`${API_URL}/${recommendation.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Ошибка при удалении рекомендации');
    toast.success('Рекомендация успешно удалена');
    fetchRecommendations(); // Обновить список рекомендаций после удаления
  } catch (e) {
    toast.error(e.message || 'Ошибка при удалении рекомендации');
  }
};

onMounted(async () => {
  await fetchTokenPayload();
  await Promise.all([fetchRecommendations(), fetchDiets()]);
});
</script>
