<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-6 sm:py-10">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 mb-4 sm:mb-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-primary dark:text-white">
          Характеристики пациентов
        </h1>
        <AnimatedButton
          v-if="userRole === 'ADMIN' || userRole === 'PATIENT'"
          @click="openCreateModal"
          variant="primary"
        >
          + Добавить характеристику
        </AnimatedButton>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>

      <!-- Список карточек характеристик -->
      <div
        v-else
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
      >
        <div
          v-for="characteristic in characteristics"
          :key="characteristic.id"
          class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105"
        >
          <div class="p-4 sm:p-6">
            <h2
              class="text-lg sm:text-xl font-semibold text-primary dark:text-white mb-2"
            >
              ID Пациента: {{ characteristic.patient_id || 'Не указан' }}
            </h2>
            <p
              class="text-secondary dark:text-gray-300 mb-2 text-sm sm:text-base"
            >
              <strong>Непереносимость:</strong> {{ characteristic.intolerance }}
            </p>
            <p
              class="text-secondary dark:text-gray-300 mb-2 text-sm sm:text-base"
            >
              <strong>Предпочтения:</strong> {{ characteristic.preference }}
            </p>
            <div
              v-if="
                userRole === 'ADMIN' ||
                (userRole === 'PATIENT' &&
                  characteristic.patient_id === currentPatientId)
              "
              class="flex gap-2 mt-4"
            >
              <button
                class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm w-full"
                @click="openEditModal(characteristic)"
              >
                ✏️ Редактировать
              </button>
              <button
                class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm w-full"
                @click="deleteCharacteristic(characteristic.id)"
              >
                🗑️ Удалить
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="!isLoading && characteristics.length === 0"
        class="text-center text-gray-600 dark:text-gray-400 py-10"
      >
        Нет характеристик пациентов.
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
          type="button"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl transition-colors"
          @click="closeCreateModal"
        >
          &times;
        </button>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Добавить характеристику
        </h2>
        <form @submit.prevent="createCharacteristic" class="space-y-4">
          <div v-if="userRole === 'ADMIN'">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Пациент
            </label>
            <select
              v-model="form.patient_id"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите пациента</option>
              <option
                v-for="patient in patients"
                :key="patient.id"
                :value="patient.id"
              >
                {{ patient.name }} {{ patient.surname }}
              </option>
            </select>
            <span v-if="errors.patient_id" class="text-red-500 text-sm mt-1">{{
              errors.patient_id
            }}</span>
          </div>

          <AnimatedInput
            v-model="form.intolerance"
            label="Непереносимость"
            type="text"
            id="intolerance"
            required
            :error="errors.intolerance"
          />
          <AnimatedInput
            v-model="form.preference"
            label="Предпочтения"
            type="text"
            id="preference"
            required
            :error="errors.preference"
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
          type="button"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl transition-colors"
          @click="closeEditModal"
        >
          &times;
        </button>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Редактировать характеристику
        </h2>
        <form @submit.prevent="saveEditCharacteristic" class="space-y-4">
          <AnimatedInput
            v-model="editForm.intolerance"
            label="Непереносимость"
            type="text"
            id="edit-intolerance"
            required
            :error="errors.intolerance"
          />
          <AnimatedInput
            v-model="editForm.preference"
            label="Предпочтения"
            type="text"
            id="edit-preference"
            required
            :error="errors.preference"
          />
          <div v-if="userRole === 'ADMIN'">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Пациент
            </label>
            <select
              v-model="editForm.patient_id"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите пациента</option>
              <option
                v-for="patient in patients"
                :key="patient.id"
                :value="patient.id"
              >
                {{ patient.name }} {{ patient.surname }}
              </option>
            </select>
            <span v-if="errors.patient_id" class="text-red-500 text-sm mt-1">{{
              errors.patient_id
            }}</span>
          </div>

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
import { ref, onMounted } from 'vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import AnimatedButton from '@/components/AnimatedButton.vue';
import AnimatedInput from '@/components/AnimatedInput.vue';
import { toast } from 'vue3-toastify';
import { useAuth } from '~/composables/useAuth';

const API_URL = 'https://igor-plaxin.ru/healthy-eat/characteristic';
const PATIENTS_URL = 'https://igor-plaxin.ru/healthy-eat/patient';
const TOKEN_PAYLOAD_URL =
  'https://igor-plaxin.ru/healthy-eat/auth/token-payload';
const { getToken } = useAuth();

const characteristics = ref([]);
const patients = ref([]);
const isLoading = ref(true);
const modalLoading = ref(false);
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedCharacteristic = ref(null);
const userRole = ref(null);
const currentPatientId = ref(null);

const form = ref({
  intolerance: '',
  preference: '',
  patient_id: null,
});

const editForm = ref({
  intolerance: '',
  preference: '',
  patient_id: null,
});

const errors = ref({
  intolerance: '',
  preference: '',
  patient_id: '',
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
    if (data.role === 'PATIENT') {
      currentPatientId.value = data.id;
    }
  } catch (e) {
    toast.error(e.message || 'Ошибка получения данных токена');
  }
};

const fetchPatients = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(PATIENTS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка загрузки пациентов');
    patients.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки пациентов');
  }
};

const getPatientId = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(TOKEN_PAYLOAD_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка получения данных токена');
    const data = await res.json();
    return data.id;
  } catch (e) {
    toast.error(e.message || 'Ошибка получения ID пациента');
    return null;
  }
};

const fetchCharacteristics = async () => {
  isLoading.value = true;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка загрузки характеристик');
    const data = await res.json();

    // Если пользователь с ролью PATIENT, фильтруем только его характеристики
    if (userRole.value === 'PATIENT') {
      const patientId = await getPatientId();
      characteristics.value = data.filter(
        (char) => char.patient_id === patientId
      );
    } else {
      characteristics.value = data;
    }
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки характеристик');
  } finally {
    isLoading.value = false;
  }
};

const validateForm = (formData) => {
  let valid = true;
  errors.value = {
    intolerance: '',
    preference: '',
    patient_id: '',
  };

  if (!formData.intolerance) {
    errors.value.intolerance = 'Непереносимость обязательна';
    valid = false;
  }
  if (!formData.preference) {
    errors.value.preference = 'Предпочтения обязательны';
    valid = false;
  }
  if (
    formData.patient_id !== null &&
    formData.patient_id !== '' &&
    (isNaN(formData.patient_id) || formData.patient_id <= 0)
  ) {
    errors.value.patient_id = 'ID пациента должен быть положительным числом';
    valid = false;
  }

  return valid;
};

const openCreateModal = async () => {
  if (userRole.value !== 'ADMIN' && userRole.value !== 'PATIENT') {
    toast.error('У вас нет прав для выполнения этого действия');
    return;
  }
  showCreateModal.value = true;
  form.value = {
    intolerance: '',
    preference: '',
    patient_id: null,
  };
  errors.value = {
    intolerance: '',
    preference: '',
    patient_id: '',
  };

  // Если пользователь с ролью PATIENT, автоматически устанавливаем его ID
  if (userRole.value === 'PATIENT') {
    const patientId = await getPatientId();
    form.value.patient_id = patientId;
  }
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditModal = async (characteristic) => {
  if (userRole.value !== 'ADMIN' && userRole.value !== 'PATIENT') {
    toast.error('У вас нет прав для выполнения этого действия');
    return;
  }

  // Проверяем, может ли пользователь редактировать эту характеристику
  if (
    userRole.value === 'PATIENT' &&
    characteristic.patient_id !== currentPatientId.value
  ) {
    toast.error('Вы можете редактировать только свои характеристики');
    return;
  }

  selectedCharacteristic.value = characteristic;
  editForm.value = {
    intolerance: characteristic.intolerance,
    preference: characteristic.preference,
    patient_id: characteristic.patient_id,
  };
  showEditModal.value = true;
};

const saveEditCharacteristic = async () => {
  if (!validateForm(editForm.value)) return;
  if (userRole.value !== 'ADMIN' && userRole.value !== 'PATIENT') {
    toast.error('У вас нет прав для выполнения этого действия');
    return;
  }

  // Проверяем, может ли пользователь редактировать эту характеристику
  if (
    userRole.value === 'PATIENT' &&
    selectedCharacteristic.value.patient_id !== currentPatientId.value
  ) {
    toast.error('Вы можете редактировать только свои характеристики');
    return;
  }

  if (!selectedCharacteristic.value) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    // Если пользователь с ролью PATIENT, используем его ID
    if (userRole.value === 'PATIENT') {
      editForm.value.patient_id = currentPatientId.value;
    }

    const payload = {
      ...editForm.value,
      patient_id:
        editForm.value.patient_id === null || editForm.value.patient_id === ''
          ? null
          : Number(editForm.value.patient_id),
    };

    const res = await fetch(`${API_URL}/${selectedCharacteristic.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Ошибка при обновлении данных');
    }
    toast.success('Данные характеристики обновлены');
    closeEditModal();
    fetchCharacteristics();
  } catch (e) {
    toast.error(e.message || 'Ошибка при обновлении данных');
  }
};

const deleteCharacteristic = async (id) => {
  if (userRole.value !== 'ADMIN' && userRole.value !== 'PATIENT') {
    toast.error('У вас нет прав для выполнения этого действия');
    return;
  }

  // Находим характеристику для проверки
  const characteristic = characteristics.value.find((c) => c.id === id);
  if (!characteristic) {
    toast.error('Характеристика не найдена');
    return;
  }

  // Проверяем, может ли пользователь удалить эту характеристику
  if (
    userRole.value === 'PATIENT' &&
    characteristic.patient_id !== currentPatientId.value
  ) {
    toast.error('Вы можете удалять только свои характеристики');
    return;
  }

  if (!confirm('Вы действительно хотите удалить эту характеристику?')) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(
        errorData.message || 'Ошибка при удалении характеристики'
      );
    }
    toast.success('Характеристика успешно удалена');
    fetchCharacteristics();
  } catch (e) {
    toast.error(e.message || 'Ошибка при удалении характеристики');
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedCharacteristic.value = null;
};

const createCharacteristic = async () => {
  if (!validateForm(form.value)) return;
  if (userRole.value !== 'ADMIN' && userRole.value !== 'PATIENT') {
    toast.error('У вас нет прав для выполнения этого действия');
    return;
  }

  modalLoading.value = true;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    // Если пользователь с ролью PATIENT, используем его ID
    if (userRole.value === 'PATIENT') {
      const patientId = await getPatientId();
      form.value.patient_id = patientId;
    }

    const payload = {
      ...form.value,
      patient_id:
        form.value.patient_id === null || form.value.patient_id === ''
          ? null
          : Number(form.value.patient_id),
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.message || 'Ошибка создания характеристики');
    }
    toast.success('Характеристика успешно добавлена');
    closeCreateModal();
    fetchCharacteristics();
  } catch (e) {
    toast.error(e.message || 'Ошибка создания характеристики');
  } finally {
    modalLoading.value = false;
  }
};

onMounted(async () => {
  await fetchTokenPayload();
  await Promise.all([fetchCharacteristics(), fetchPatients()]);
});
</script>

<style scoped>
/* Дополнительные стили при необходимости */
</style>
