<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
    <div
      class="max-w-7xl mx-auto px-4 mb-6 flex justify-between items-center gap-4"
    >
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Поиск по имени или логину пациента"
        class="w-full p-2 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200 dark:border-gray-600 focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/20 transition-colors"
      />
      <AnimatedButton @click="openCreateModal" variant="primary" class="ml-4">
        + Добавить пациента
      </AnimatedButton>
    </div>

    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <LoadingSpinner />
    </div>

    <div v-else>
      <div
        v-if="filteredPatients.length === 0"
        class="text-center text-gray-600 dark:text-gray-400 py-10"
      >
        Нет пациентов.
      </div>
      <div v-else class="overflow-x-auto">
        <table
          class="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <thead>
            <tr class="bg-gray-50 dark:bg-gray-700 text-left">
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                ID
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Имя
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Логин
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Рост (см)
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Вес (кг)
              </th>
              <th
                class="py-3 px-4 text-center text-gray-600 dark:text-gray-300 font-medium"
              >
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="patient in filteredPatients"
              :key="patient.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ patient.id }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ patient.name }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ patient.login }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ patient.height ?? '-' }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ patient.weight ?? '-' }}
              </td>
              <td class="py-3 px-4 flex gap-2 justify-center">
                <AnimatedButton
                  variant="secondary"
                  size="sm"
                  @click="openEditModal(patient)"
                  >Редактировать</AnimatedButton
                >
                <AnimatedButton
                  size="sm"
                  class="text-gray-900 dark:text-white dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-600"
                  @click="openDeleteModal(patient)"
                  >Удалить</AnimatedButton
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Модальное окно создания/редактирования пациента -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 animate-fade-in overflow-y-auto"
    >
      <div
        class="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-md relative animate-scale-in my-4 mx-4"
      >
        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl transition-colors"
          @click="closeModal"
        >
          &times;
        </button>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {{ isEditMode ? 'Редактировать пациента' : 'Добавить пациента' }}
        </h2>
        <form
          @submit.prevent="isEditMode ? updatePatient() : createPatient()"
          class="space-y-4"
        >
          <AnimatedInput
            v-model="form.name"
            label="Имя"
            type="text"
            id="name"
            required
            :error="errors.name"
          />
          <AnimatedInput
            v-model="form.login"
            label="Логин (email)"
            type="email"
            id="login"
            required
            :error="errors.login"
          />
          <AnimatedInput
            v-model="form.password"
            label="Пароль"
            type="password"
            id="password"
            :required="!isEditMode"
            :error="errors.password"
          />
          <AnimatedInput
            v-model="form.height"
            label="Рост (см)"
            type="number"
            id="height"
            :error="errors.height"
          />
          <AnimatedInput
            v-model="form.weight"
            label="Вес (кг)"
            type="number"
            id="weight"
            :error="errors.weight"
          />
          <AnimatedButton
            type="submit"
            variant="primary"
            class="w-full"
            :is-loading="modalLoading"
          >
            {{ isEditMode ? 'Сохранить изменения' : 'Добавить' }}
          </AnimatedButton>
        </form>
      </div>
    </div>

    <!-- Модальное окно подтверждения удаления -->
    <div
      v-if="showDeleteModal"
      class="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 animate-fade-in overflow-y-auto"
    >
      <div
        class="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-2xl shadow-2xl w-full max-w-sm relative animate-scale-in my-4 mx-4"
      >
        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl transition-colors"
          @click="closeDeleteModal"
        >
          &times;
        </button>
        <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Удалить пациента?
        </h2>
        <p class="mb-6 text-gray-600 dark:text-gray-300">
          Вы уверены, что хотите удалить пациента
          <b class="text-gray-900 dark:text-white">{{
            patientToDelete?.name
          }}</b
          >?
        </p>
        <div class="flex gap-4">
          <AnimatedButton
            variant="danger"
            class="w-full text-gray-900 dark:text-white dark:bg-red-600 dark:hover:bg-red-700 hover:bg-red-600"
            :is-loading="deleteLoading"
            @click="deletePatient"
            >Удалить</AnimatedButton
          >
          <AnimatedButton
            variant="secondary"
            class="w-full"
            @click="closeDeleteModal"
            >Отмена</AnimatedButton
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import AnimatedButton from '@/components/AnimatedButton.vue';
import AnimatedInput from '@/components/AnimatedInput.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { toast } from 'vue3-toastify';

const API_URL = 'https://igor-plaxin.ru/healthy-eat/patient';

const patients = ref([]);
const isLoading = ref(true);
const modalLoading = ref(false);
const deleteLoading = ref(false);
const showModal = ref(false);
const showDeleteModal = ref(false);
const isEditMode = ref(false);
const patientToEdit = ref(null);
const patientToDelete = ref(null);
const search = ref('');

const form = ref({
  name: '',
  login: '',
  password: '',
  height: null,
  weight: null,
});

const errors = ref({
  name: '',
  login: '',
  password: '',
  height: '',
  weight: '',
});

const fetchPatients = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Ошибка загрузки пациентов');
    patients.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки пациентов');
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPatients);

const filteredPatients = computed(() => {
  return patients.value.filter(
    (p) =>
      p.name.toLowerCase().includes(search.value.toLowerCase()) ||
      p.login.toLowerCase().includes(search.value.toLowerCase())
  );
});

const openCreateModal = () => {
  isEditMode.value = false;
  showModal.value = true;
  form.value = {
    name: '',
    login: '',
    password: '',
    height: null,
    weight: null,
  };
  errors.value = { name: '', login: '', password: '', height: '', weight: '' };
};

const openEditModal = (patient) => {
  isEditMode.value = true;
  showModal.value = true;
  patientToEdit.value = patient;
  form.value = {
    name: patient.name,
    login: patient.login,
    password: '',
    height: patient.height ? Number(patient.height) : null,
    weight: patient.weight ? Number(patient.weight) : null,
  };
  errors.value = { name: '', login: '', password: '', height: '', weight: '' };
};

const closeModal = () => {
  showModal.value = false;
  patientToEdit.value = null;
};

const validateForm = () => {
  let valid = true;
  errors.value = { name: '', login: '', password: '', height: '', weight: '' };
  if (!form.value.name) {
    errors.value.name = 'Имя обязательно';
    valid = false;
  }
  if (!form.value.login) {
    errors.value.login = 'Логин обязателен';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.login)) {
    errors.value.login = 'Введите корректный email';
    valid = false;
  }
  if (!isEditMode.value && !form.value.password) {
    errors.value.password = 'Пароль обязателен';
    valid = false;
  }
  if (
    form.value.height &&
    (isNaN(form.value.height) || form.value.height < 0)
  ) {
    errors.value.height = 'Некорректный рост';
    valid = false;
  }
  if (
    form.value.weight &&
    (isNaN(form.value.weight) || form.value.weight < 0)
  ) {
    errors.value.weight = 'Некорректный вес';
    valid = false;
  }
  return valid;
};

const createPatient = async () => {
  if (!validateForm()) return;
  modalLoading.value = true;
  try {
    const payload = { ...form.value };
    if (payload.height !== null) {
      payload.height = Math.round(Number(payload.height));
    } else {
      delete payload.height;
    }
    if (payload.weight !== null) {
      payload.weight = Math.round(Number(payload.weight));
    } else {
      delete payload.weight;
    }
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Ошибка создания пациента');
    toast.success('Пациент успешно добавлен');
    closeModal();
    fetchPatients();
  } catch (e) {
    toast.error(e.message || 'Ошибка создания пациента');
  } finally {
    modalLoading.value = false;
  }
};

const updatePatient = async () => {
  if (!validateForm()) return;
  modalLoading.value = true;
  try {
    const payload = { ...form.value };
    if (!payload.password) delete payload.password;
    if (payload.height !== null) {
      payload.height = Math.round(Number(payload.height));
    } else {
      delete payload.height;
    }
    if (payload.weight !== null) {
      payload.weight = Math.round(Number(payload.weight));
    } else {
      delete payload.weight;
    }
    const res = await fetch(`${API_URL}/${patientToEdit.value.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Ошибка обновления пациента');
    toast.success('Данные пациента обновлены');
    closeModal();
    fetchPatients();
  } catch (e) {
    toast.error(e.message || 'Ошибка обновления пациента');
  } finally {
    modalLoading.value = false;
  }
};

const openDeleteModal = (patient) => {
  patientToDelete.value = patient;
  showDeleteModal.value = true;
};
const closeDeleteModal = () => {
  showDeleteModal.value = false;
  patientToDelete.value = null;
};
const deletePatient = async () => {
  deleteLoading.value = true;
  try {
    const res = await fetch(`${API_URL}/${patientToDelete.value.id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Ошибка удаления пациента');
    toast.success('Пациент удалён');
    closeDeleteModal();
    fetchPatients();
  } catch (e) {
    toast.error(e.message || 'Ошибка удаления пациента');
  } finally {
    deleteLoading.value = false;
  }
};
</script>
