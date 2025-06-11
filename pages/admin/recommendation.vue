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
                ID врача
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Врач
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Описание
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
                {{ recommendation.doctor_id }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ getDoctorName(recommendation.doctor_id) }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ recommendation.description || '-' }}
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
      @click.self="closeCreateModal"
    >
      <div
        class="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-scale-in my-4 mx-4"
      >
        <button
          type="button"
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl transition-colors"
          @click.stop="closeCreateModal"
        >
          &times;
        </button>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Добавить рекомендацию
        </h2>
        <form @submit.prevent="createRecommendation" class="space-y-4">
          <div v-if="userRole !== 'DOCTOR'">
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Врач
            </label>
            <select
              v-model="form.doctor_id"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите врача</option>
              <option
                v-for="doctor in doctors"
                :key="doctor.id"
                :value="doctor.id"
              >
                {{ doctor.name }} {{ doctor.surname }}
              </option>
            </select>
            <span v-if="errors.doctor_id" class="text-red-500 text-sm mt-1">{{
              errors.doctor_id
            }}</span>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Заявка
            </label>
            <select
              v-model="form.request_id"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
              @change="handleRequestChange($event.target.value)"
            >
              <option value="">Выберите заявку</option>
              <option
                v-for="request in getPendingRequests"
                :key="request.id"
                :value="request.id"
              >
                Заявка #{{ request.id }} - Пациент #{{ request.patient_id }}
              </option>
            </select>
            <span v-if="errors.request_id" class="text-red-500 text-sm mt-1">{{
              errors.request_id
            }}</span>
            <p
              v-if="getPendingRequests.length === 0"
              class="text-yellow-500 text-sm mt-1"
            >
              Нет доступных заявок для создания рекомендации
            </p>
          </div>

          <div v-if="selectedRequest">
            <h3 class="font-medium text-gray-900 dark:text-white mb-2">
              Информация о заявке
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Врач: {{ getDoctorName(selectedRequest.doctor_id) }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              Пациент: {{ getPatientName(selectedRequest.patient_id) }}
            </p>
          </div>

          <!-- Информация о пациенте -->
          <div
            v-if="selectedPatientInfo"
            class="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-4"
          >
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                Основная информация
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Рост: {{ selectedPatientInfo.height || 'Не указан' }} см
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Вес: {{ selectedPatientInfo.weight || 'Не указан' }} кг
              </p>
            </div>

            <div v-if="selectedPatientInfo.characteristic">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                Характеристики
              </h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Непереносимость:
                {{ selectedPatientInfo.characteristic.intolerance }}
              </p>
              <p class="text-sm text-gray-600 dark:text-gray-300">
                Предпочтения:
                {{ selectedPatientInfo.characteristic.preference }}
              </p>
            </div>

            <div v-if="selectedPatientInfo.illnesses.length > 0">
              <h3 class="font-medium text-gray-900 dark:text-white mb-2">
                Заболевания и симптомы
              </h3>
              <div
                v-for="illness in selectedPatientInfo.illnesses"
                :key="illness.name"
                class="mb-3"
              >
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ illness.name }}
                </p>
                <div v-if="illness.symptoms.length > 0" class="ml-4">
                  <p class="text-sm text-gray-600 dark:text-gray-300">
                    Симптомы: {{ illness.symptoms.join(', ') }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Диета
            </label>
            <select
              v-model="form.diet_id"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите диету</option>
              <option v-for="diet in diets" :key="diet.id" :value="diet.id">
                {{ diet.name }}
              </option>
            </select>
            <span v-if="errors.diet_id" class="text-red-500 text-sm mt-1">{{
              errors.diet_id
            }}</span>
          </div>
          <AnimatedInput
            v-model="form.description"
            label="Описание"
            type="text"
            id="description"
            required
            :error="errors.description"
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
          @click="() => (showEditModal = false)"
        >
          &times;
        </button>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Редактировать рекомендацию
        </h2>
        <form @submit.prevent="saveEditRecommendation" class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Диета
            </label>
            <select
              v-model="editForm.diet_id"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите диету</option>
              <option v-for="diet in diets" :key="diet.id" :value="diet.id">
                {{ diet.name }}
              </option>
            </select>
            <span v-if="errors.diet_id" class="text-red-500 text-sm mt-1">{{
              errors.diet_id
            }}</span>
          </div>
          <AnimatedInput
            v-model="editForm.description"
            label="Описание"
            type="text"
            id="edit-description"
            required
            :error="errors.description"
          />
          <div class="flex gap-2">
            <AnimatedButton type="submit" variant="primary" class="w-full">
              Сохранить
            </AnimatedButton>
            <AnimatedButton
              type="button"
              variant="secondary"
              class="w-full"
              @click="() => (showEditModal = false)"
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

const API_URL = 'https://igor-plaxin.store/healthy-eat/recommendation';
const DIET_URL = 'https://igor-plaxin.store/healthy-eat/diet';
const PATIENTS_URL = 'https://igor-plaxin.store/healthy-eat/patient';
const DOCTORS_URL = 'https://igor-plaxin.store/healthy-eat/doctor';
const REQUESTS_URL = 'https://igor-plaxin.store/healthy-eat/request';
const ILLNESSES_URL = 'https://igor-plaxin.store/healthy-eat/illness';
const SYMPTOMS_URL = 'https://igor-plaxin.store/healthy-eat/symptome';
const CHARACTERISTICS_URL =
  'https://igor-plaxin.store/healthy-eat/characteristic';
const ILLNESS_ON_PATIENT_URL =
  'https://igor-plaxin.store/healthy-eat/illness-on-patient';
const ILLNESS_ON_SYMPTOME_URL =
  'https://igor-plaxin.store/healthy-eat/illness-on-symptome';
const TOKEN_PAYLOAD_URL =
  'https://igor-plaxin.store/healthy-eat/auth/token-payload';
const { getToken } = useAuth();

const recommendations = ref([]);
const diets = ref([]);
const patients = ref([]);
const doctors = ref([]);
const requests = ref([]);
const illnesses = ref([]);
const symptoms = ref([]);
const characteristics = ref([]);
const patientIllnesses = ref([]);
const illnessSymptoms = ref([]);
const selectedPatientInfo = ref(null);
const selectedRequest = ref(null);
const isLoading = ref(true);
const modalLoading = ref(false);
const search = ref('');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedRecommendation = ref(null);
const userRole = ref(null);
const adminId = ref(null);

const form = ref({
  diet_id: '',
  doctor_id: '',
  request_id: '',
  description: '',
});

const editForm = ref({
  diet_id: '',
  doctor_id: '',
  description: '',
});

const errors = ref({
  diet_id: '',
  doctor_id: '',
  request_id: '',
  description: '',
});

const filteredRecommendations = computed(() => {
  return recommendations.value.filter((r) => {
    const dietName = getDietName(r.diet_id);
    return dietName.toLowerCase().includes(search.value.toLowerCase());
  });
});

const closeCreateModal = () => {
  showCreateModal.value = false;
  form.value = {
    diet_id: '',
    doctor_id: '',
    request_id: '',
    description: '',
  };
  errors.value = {
    diet_id: '',
    doctor_id: '',
    request_id: '',
    description: '',
  };
  selectedPatientInfo.value = null;
  selectedRequest.value = null;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedRecommendation.value = null;
  editForm.value = {
    diet_id: '',
    doctor_id: '',
    description: '',
  };
  errors.value = {
    diet_id: '',
    doctor_id: '',
    description: '',
  };
};

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
    adminId.value = data.id;
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

const fetchDoctors = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(DOCTORS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка загрузки врачей');
    doctors.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки врачей');
  }
};

const fetchRequests = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(REQUESTS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка загрузки заявок');
    requests.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки заявок');
  }
};

const getPendingRequests = computed(() => {
  return requests.value.filter(
    (request) => request.status === 'SEND' && !request.recommendation_id
  );
});

const fetchIllnesses = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(ILLNESSES_URL, {
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

const fetchSymptoms = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(SYMPTOMS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка загрузки симптомов');
    symptoms.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки симптомов');
  }
};

const fetchCharacteristics = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(CHARACTERISTICS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка загрузки характеристик');
    characteristics.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки характеристик');
  }
};

const fetchPatientIllnesses = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(ILLNESS_ON_PATIENT_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok)
      throw new Error('Ошибка загрузки связей заболеваний с пациентами');
    patientIllnesses.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки связей заболеваний с пациентами');
  }
};

const fetchIllnessSymptoms = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(ILLNESS_ON_SYMPTOME_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok)
      throw new Error('Ошибка загрузки связей заболеваний с симптомами');
    illnessSymptoms.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки связей заболеваний с симптомами');
  }
};

const getDietName = (dietId) => {
  if (!dietId) return '-';
  const diet = diets.value.find((d) => d.id === dietId);
  return diet ? diet.name : 'Неизвестная диета';
};

const getDoctorName = (doctorId) => {
  if (!doctorId) return '-';
  const doctor = doctors.value.find((d) => d.id === doctorId);
  return doctor ? `${doctor.name} ${doctor.surname}` : 'Неизвестный врач';
};

const getPatientName = (patientId) => {
  if (!patientId) return '-';
  const patient = patients.value.find((p) => p.id === patientId);
  return patient ? `${patient.name} ${patient.surname}` : 'Неизвестный пациент';
};

const validateForm = (formData) => {
  let valid = true;
  errors.value = {
    diet_id: '',
    doctor_id: '',
    request_id: '',
    description: '',
  };

  if (!formData.diet_id) {
    errors.value.diet_id = 'ID диеты обязательно';
    valid = false;
  }

  if (!formData.doctor_id) {
    errors.value.doctor_id = 'ID врача обязательно';
    valid = false;
  }

  if (!formData.request_id) {
    errors.value.request_id = 'ID заявки обязательно';
    valid = false;
  }

  if (!formData.description) {
    errors.value.description = 'Описание обязательно';
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

    // Получаем выбранную заявку
    const selectedRequest = requests.value.find(
      (r) => r.id === parseInt(form.value.request_id)
    );
    if (!selectedRequest) throw new Error('Заявка не найдена');

    // Если врач не указан в заявке и текущий пользователь - врач
    if (!selectedRequest.doctor_id && userRole.value === 'DOCTOR') {
      await fetchTokenPayload(); // Обновляем adminId
    }

    const payload = {
      diet_id: parseInt(form.value.diet_id),
      doctor_id: selectedRequest.doctor_id || adminId.value,
      request_id: parseInt(form.value.request_id),
      description: form.value.description,
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

    const newRecommendation = await res.json();

    // Обновляем заявку, связывая её с новой рекомендацией и добавляем врача, если его не было
    const updateRequestRes = await fetch(
      `${REQUESTS_URL}/${form.value.request_id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          recommendation_id: newRecommendation.id,
          status: 'APPROVED',
          doctor_id: selectedRequest.doctor_id || adminId.value, // Добавляем врача, если его не было
        }),
      }
    );

    if (!updateRequestRes.ok) throw new Error('Ошибка обновления заявки');

    toast.success('Рекомендация успешно добавлена');
    closeCreateModal();
    await Promise.all([fetchRecommendations(), fetchRequests()]);
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
    doctor_id: userRole.value === 'DOCTOR' ? adminId.value : '',
    request_id: '',
    description: '',
  };
  errors.value = {
    diet_id: '',
    doctor_id: '',
    request_id: '',
    description: '',
  };
  selectedPatientInfo.value = null;
  selectedRequest.value = null;
};

const openEditModal = (recommendation) => {
  try {
    selectedRecommendation.value = recommendation;
    editForm.value = {
      diet_id: recommendation.diet_id,
      description: recommendation.description || '',
    };
    errors.value = {
      diet_id: '',
      description: '',
    };
    showEditModal.value = true;
  } catch (e) {
    toast.error('Ошибка при открытии формы редактирования');
    console.error(e);
  }
};

const saveEditRecommendation = async () => {
  if (!validateForm(editForm.value)) return;
  if (!selectedRecommendation.value) {
    toast.error('Не выбрана рекомендация для редактирования');
    return;
  }

  modalLoading.value = true;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      ...editForm.value,
      diet_id: parseInt(editForm.value.diet_id),
      description: editForm.value.description,
    };

    const res = await fetch(`${API_URL}/${selectedRecommendation.value.id}`, {
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

    toast.success('Данные рекомендации обновлены');
    closeEditModal();
    await fetchRecommendations(); // Обновить список рекомендаций после редактирования
  } catch (e) {
    toast.error(e.message || 'Ошибка при обновлении данных');
  } finally {
    modalLoading.value = false;
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

const getPatientInfo = (patientId) => {
  const patient = patients.value.find((p) => p.id === parseInt(patientId));
  if (!patient) return null;

  const patientIllnessesList = patientIllnesses.value
    .filter((pi) => pi.patient_id === parseInt(patientId))
    .map((pi) => {
      const illness = illnesses.value.find((i) => i.id === pi.illness_id);
      const illnessSymptomsList = illnessSymptoms.value
        .filter((is) => is.illness_id === pi.illness_id)
        .map((is) => {
          const symptom = symptoms.value.find((s) => s.id === is.symptome_id);
          return symptom ? symptom.name : null;
        })
        .filter(Boolean);

      return {
        name: illness ? illness.name : 'Неизвестное заболевание',
        symptoms: illnessSymptomsList,
      };
    });

  const characteristic = characteristics.value.find(
    (c) => c.patient_id === parseInt(patientId)
  );

  return {
    ...patient,
    illnesses: patientIllnessesList,
    characteristic: characteristic || null,
  };
};

const handlePatientChange = (patientId) => {
  selectedPatientInfo.value = getPatientInfo(patientId);
};

const handleRequestChange = async (requestId) => {
  const request = requests.value.find((r) => r.id === parseInt(requestId));
  if (request) {
    selectedRequest.value = request;

    // Если врач не указан в заявке и текущий пользователь - врач
    if (!request.doctor_id && userRole.value === 'DOCTOR') {
      await fetchTokenPayload(); // Обновляем adminId
      form.value.doctor_id = adminId.value;
    } else {
      form.value.doctor_id = request.doctor_id?.toString() || '';
    }

    handlePatientChange(request.patient_id.toString());
  }
};

onMounted(async () => {
  await fetchTokenPayload();
  await Promise.all([
    fetchRecommendations(),
    fetchDiets(),
    fetchPatients(),
    fetchDoctors(),
    fetchRequests(),
    fetchIllnesses(),
    fetchSymptoms(),
    fetchCharacteristics(),
    fetchPatientIllnesses(),
    fetchIllnessSymptoms(),
  ]);
});
</script>
