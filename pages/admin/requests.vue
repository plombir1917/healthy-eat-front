<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-primary dark:text-white">Заявки</h1>
        <AnimatedButton @click="openCreateModal" variant="primary">
          + Создать заявку
        </AnimatedButton>
      </div>

      <!-- Фильтры -->
      <div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="search"
          type="text"
          placeholder="🔍 Поиск по ID"
          class="w-full p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white"
        />
        <select
          v-model="statusFilter"
          class="w-full p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">Все статусы</option>
          <option value="SEND">Отправлено</option>
          <option value="APPROVED">Одобрено</option>
          <option value="REJECTED">Отклонено</option>
        </select>
        <select
          v-if="userRole === 'ADMIN'"
          v-model="userFilter"
          class="w-full p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">Все пользователи</option>
          <option value="DOCTOR">Врачи</option>
          <option value="PATIENT">Пациенты</option>
        </select>
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>

      <!-- Таблица заявок -->
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
                ID доктора
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Доктор
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                ID пациента
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Пациент
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                ID рекомендации
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Статус
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
              v-for="(request, index) in filteredRequests"
              :key="request.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ index + 1 }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ request.doctor_id }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ getDoctorName(request.doctor_id) }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ request.patient_id }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ getPatientName(request.patient_id) }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ request.recommendation_id }}
              </td>
              <td class="py-3 px-4">
                <span
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="{
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300':
                      request.status === 'SEND',
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300':
                      request.status === 'APPROVED',
                    'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300':
                      request.status === 'REJECTED',
                  }"
                >
                  {{ getStatusText(request.status) }}
                </span>
              </td>
              <td class="py-3 px-4">
                <div class="flex gap-2">
                  <button
                    v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
                    @click="updateRequestStatus(request, 'APPROVED')"
                    class="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    :disabled="request.status !== 'SEND'"
                    title="Одобрить"
                  >
                    ✓
                  </button>
                  <button
                    v-if="userRole === 'ADMIN' || userRole === 'DOCTOR'"
                    @click="updateRequestStatus(request, 'REJECTED')"
                    class="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    :disabled="request.status !== 'SEND'"
                    title="Отклонить"
                  >
                    ✕
                  </button>
                  <button
                    v-if="userRole === 'ADMIN'"
                    @click="openEditModal(request)"
                    class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    title="Редактировать"
                  >
                    ✎
                  </button>
                  <button
                    v-if="
                      userRole === 'ADMIN' ||
                      (userRole === 'PATIENT' && request.patient_id === adminId)
                    "
                    @click="deleteRequest(request)"
                    class="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Удалить"
                  >
                    🗑
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Модальное окно создания заявки -->
    <div
      v-if="showCreateModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 class="text-xl font-bold text-primary dark:text-white mb-4">
          Создать заявку
        </h2>
        <form @submit.prevent="createRequest" class="space-y-4">
          <div>
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
          </div>
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
            v-model="form.description"
            label="Описание"
            type="text"
            id="description"
            required
            :error="errors.description"
          />
          <div class="flex gap-2">
            <button
              type="submit"
              class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
              :disabled="isLoadingModal"
            >
              {{ isLoadingModal ? 'Создание...' : 'Создать' }}
            </button>
            <button
              type="button"
              @click="closeCreateModal"
              class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              :disabled="isLoadingModal"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Модальное окно редактирования заявки -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 class="text-xl font-bold text-primary dark:text-white mb-4">
          Редактировать заявку
        </h2>
        <form @submit.prevent="updateRequest" class="space-y-4">
          <div>
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
          </div>
          <div v-if="userRole !== 'PATIENT'">
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
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Рекомендация (необязательно)
            </label>
            <select
              v-model="form.recommendation_id"
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите рекомендацию</option>
              <option
                v-for="recommendation in recommendations"
                :key="recommendation.id"
                :value="recommendation.id"
              >
                Рекомендация #{{ recommendation.id }}
              </option>
            </select>
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Статус
            </label>
            <select
              v-model="form.status"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="SEND">Отправлено</option>
              <option value="APPROVED">Одобрено</option>
              <option value="REJECTED">Отклонено</option>
            </select>
          </div>
          <div class="flex gap-2">
            <button
              type="submit"
              class="flex-1 bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors"
              :disabled="isLoadingModal"
            >
              {{ isLoadingModal ? 'Сохранение...' : 'Сохранить' }}
            </button>
            <button
              type="button"
              @click="closeEditModal"
              class="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              :disabled="isLoadingModal"
            >
              Отмена
            </button>
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

const API_URL = 'https://igor-plaxin.ru/healthy-eat/request';
const TOKEN_PAYLOAD_URL =
  'https://igor-plaxin.ru/healthy-eat/auth/token-payload';
const DOCTORS_URL = 'https://igor-plaxin.ru/healthy-eat/doctor';
const PATIENTS_URL = 'https://igor-plaxin.ru/healthy-eat/patient';
const RECOMMENDATIONS_URL = 'https://igor-plaxin.ru/healthy-eat/recommendation';
const { getToken } = useAuth();

const requests = ref([]);
const doctors = ref([]);
const patients = ref([]);
const recommendations = ref([]);
const isLoading = ref(true);
const isLoadingModal = ref(false);
const search = ref('');
const statusFilter = ref('');
const userFilter = ref('');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const userRole = ref(null);
const selectedRequest = ref(null);
const adminId = ref(null);

const form = ref({
  doctor_id: '',
  patient_id: '',
  recommendation_id: '',
  status: 'SEND',
  description: '',
});

const errors = ref({});

const filteredRequests = computed(() => {
  return requests.value.filter((request) => {
    const matchesSearch = request.id.toString().includes(search.value);
    const matchesStatus =
      !statusFilter.value || request.status === statusFilter.value;
    const matchesUser =
      !userFilter.value ||
      (userFilter.value === 'DOCTOR' && request.doctor_id) ||
      (userFilter.value === 'PATIENT' && request.patient_id);

    return matchesSearch && matchesStatus && matchesUser;
  });
});

const getStatusText = (status) => {
  const statusMap = {
    SEND: 'Отправлено',
    APPROVED: 'Одобрено',
    REJECTED: 'Отклонено',
  };
  return statusMap[status] || status;
};

const getDoctorName = (doctorId) => {
  if (!doctorId) return '-';
  const doctor = doctors.value.find((d) => d.id === doctorId);
  return doctor ? `${doctor.name} ${doctor.surname}` : 'Неизвестный врач';
};

const getPatientName = (patientId) => {
  if (!patientId) return '-';
  const patient = patients.value.find((p) => p.id === patientId);
  if (!patient) return 'Неизвестный пациент';
  return patient.surname ? `${patient.name} ${patient.surname}` : patient.name;
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

const fetchRecommendations = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(RECOMMENDATIONS_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка загрузки рекомендаций');
    recommendations.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки рекомендаций');
  }
};

const fetchRequests = async () => {
  isLoading.value = true;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка загрузки заявок');
    requests.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки заявок');
  } finally {
    isLoading.value = false;
  }
};

const createRequest = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      doctor_id: parseInt(form.value.doctor_id),
      patient_id: parseInt(form.value.patient_id),
      status: 'SEND',
      description: form.value.description,
    };

    if (form.value.recommendation_id && userRole.value !== 'PATIENT') {
      payload.recommendation_id = parseInt(form.value.recommendation_id);
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка создания заявки');
    toast.success('Заявка успешно создана');
    closeCreateModal();
    fetchRequests();
  } catch (e) {
    toast.error(e.message || 'Ошибка создания заявки');
  }
};

const updateRequestStatus = async (request, newStatus) => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(`${API_URL}/${request.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) throw new Error('Ошибка обновления статуса заявки');
    toast.success('Статус заявки обновлен');
    fetchRequests();
  } catch (e) {
    toast.error(e.message || 'Ошибка обновления статуса заявки');
  }
};

const deleteRequest = async (request) => {
  if (!confirm('Вы действительно хотите удалить эту заявку?')) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(`${API_URL}/${request.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Ошибка удаления заявки');
    toast.success('Заявка успешно удалена');
    fetchRequests();
  } catch (e) {
    toast.error(e.message || 'Ошибка удаления заявки');
  }
};

const openCreateModal = () => {
  showCreateModal.value = true;
  form.value = {
    doctor_id: '',
    patient_id: userRole.value === 'PATIENT' ? adminId.value : '',
    recommendation_id: '',
    status: 'SEND',
    description: '',
  };
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditModal = (request) => {
  selectedRequest.value = request;
  form.value = {
    doctor_id: request.doctor_id.toString(),
    patient_id: request.patient_id.toString(),
    recommendation_id: request.recommendation_id?.toString() || '',
    status: request.status,
    description: request.description || '',
  };
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedRequest.value = null;
  form.value = {
    doctor_id: '',
    patient_id: '',
    recommendation_id: '',
    status: 'SEND',
    description: '',
  };
};

const updateRequest = async () => {
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      doctor_id: parseInt(form.value.doctor_id),
      patient_id: parseInt(form.value.patient_id),
      status: form.value.status,
      description: form.value.description,
    };

    if (form.value.recommendation_id) {
      payload.recommendation_id = parseInt(form.value.recommendation_id);
    }

    const res = await fetch(`${API_URL}/${selectedRequest.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка обновления заявки');
    toast.success('Заявка успешно обновлена');
    closeEditModal();
    fetchRequests();
  } catch (e) {
    toast.error(e.message || 'Ошибка обновления заявки');
  }
};

onMounted(async () => {
  await fetchTokenPayload();
  await Promise.all([
    fetchRequests(),
    fetchDoctors(),
    fetchPatients(),
    fetchRecommendations(),
  ]);
});
</script>

<style scoped>
table {
  border-collapse: collapse;
  width: 100%;
}
th,
td {
  padding: 12px 16px;
  text-align: left;
}
th {
  background: #f9fafb;
  font-weight: 600;
}
.dark th {
  background: #374151;
}
tr:last-child td {
  border-bottom: none;
}
</style>
