<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-primary dark:text-white">
          Симптомы
        </h1>
        <AnimatedButton
          v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
          @click="openCreateModal"
          variant="primary"
        >
          + Добавить симптом
        </AnimatedButton>
      </div>

      <!-- Поиск -->
      <div class="mb-6">
        <input
          v-model="search"
          type="text"
          placeholder="🔍 Поиск по названию"
          class="w-full p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>

      <!-- Таблица симптомов -->
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
                Название
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
              v-for="(symptom, index) in filteredSymptoms"
              :key="symptom.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ index + 1 }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ symptom.name }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                <div class="flex gap-2">
                  <button
                    v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
                    class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
                    @click="openEditModal(symptom)"
                  >
                    ✏️
                  </button>
                  <button
                    v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
                    class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
                    @click="deleteSymptom(symptom)"
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
          Добавить симптом
        </h2>
        <form @submit.prevent="createSymptom" class="space-y-4">
          <AnimatedInput
            v-model="form.name"
            label="Название"
            type="text"
            id="name"
            required
            :error="errors.name"
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
          Редактировать симптом
        </h2>
        <form @submit.prevent="saveEditSymptom" class="space-y-4">
          <AnimatedInput
            v-model="editForm.name"
            label="Название"
            type="text"
            id="edit-name"
            required
            :error="errors.name"
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

const API_URL = 'https://igor-plaxin.store/healthy-eat/symptome';
const TOKEN_PAYLOAD_URL =
  'https://igor-plaxin.store/healthy-eat/auth/token-payload';
const { getToken } = useAuth();

const symptoms = ref([]);
const isLoading = ref(true);
const modalLoading = ref(false);
const search = ref('');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedSymptom = ref(null);
const userRole = ref(null);

const form = ref({
  name: '',
});

const editForm = ref({
  name: '',
});

const errors = ref({
  name: '',
});

const filteredSymptoms = computed(() => {
  return symptoms.value.filter((s) =>
    s.name.toLowerCase().includes(search.value.toLowerCase())
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

const fetchSymptoms = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Ошибка загрузки симптомов');
    symptoms.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки симптомов');
  } finally {
    isLoading.value = false;
  }
};

const validateForm = (formData) => {
  let valid = true;
  errors.value = {
    name: '',
  };

  if (!formData.name) {
    errors.value.name = 'Название обязательно';
    valid = false;
  }

  return valid;
};

const createSymptom = async () => {
  if (!validateForm(form.value)) return;

  modalLoading.value = true;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      ...form.value,
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка создания симптома');
    toast.success('Симптом успешно добавлен');
    closeCreateModal();
    fetchSymptoms();
  } catch (e) {
    toast.error(e.message || 'Ошибка создания симптома');
  } finally {
    modalLoading.value = false;
  }
};

const openCreateModal = () => {
  showCreateModal.value = true;
  form.value = {
    name: '',
  };
  errors.value = {
    name: '',
  };
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditModal = (symptom) => {
  selectedSymptom.value = symptom;
  editForm.value = {
    name: symptom.name,
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedSymptom.value = null;
};

const saveEditSymptom = async () => {
  if (!validateForm(editForm.value)) return;
  if (!selectedSymptom.value) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      ...editForm.value,
    };

    const res = await fetch(`${API_URL}/${selectedSymptom.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка при обновлении данных');
    toast.success('Данные симптома обновлены');
    closeEditModal();
    fetchSymptoms();
  } catch (e) {
    toast.error(e.message || 'Ошибка при обновлении данных');
  }
};

const deleteSymptom = async (symptom) => {
  if (!confirm('Вы действительно хотите удалить этот симптом?')) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(`${API_URL}/${symptom.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Ошибка при удалении симптома');
    toast.success('Симптом успешно удален');
    fetchSymptoms();
  } catch (e) {
    toast.error(e.message || 'Ошибка при удалении симптома');
  }
};

onMounted(async () => {
  await fetchTokenPayload();
  await fetchSymptoms();
});
</script>
