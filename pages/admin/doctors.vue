<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-6 sm:py-10">
    <!-- Фильтрация врачей -->
    <div
      class="max-w-7xl mx-auto px-2 sm:px-4 mb-4 sm:mb-6 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4"
    >
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Поиск по имени"
        class="w-full p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white text-sm sm:text-base"
      />
      <AnimatedButton
        v-if="userRole === 'ADMIN'"
        @click="openCreateModal"
        variant="primary"
        class="ml-4"
      >
        + Добавить врача
      </AnimatedButton>
    </div>

    <!-- Индикатор загрузки -->
    <div v-if="isLoading" class="flex justify-center items-center py-10">
      <LoadingSpinner />
    </div>

    <!-- Список карточек врачей -->
    <div
      v-else
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8 max-w-7xl mx-auto px-2 sm:px-4"
    >
      <div
        v-for="(doctor, index) in filteredDoctors"
        :key="index"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
        @click="openModal(doctor)"
      >
        <!-- Фото -->
        <img
          :src="doctor.photo || '/doctor-default.png'"
          alt="Фото врача"
          class="w-full h-40 sm:h-48 object-cover"
          @error="(event) => (event.target.src = '/doctor-default.png')"
        />
        <!-- Информация о враче -->
        <div class="p-4 sm:p-6">
          <h2
            class="text-lg sm:text-xl font-semibold text-primary dark:text-white mb-2"
          >
            {{ doctor.name }} {{ doctor.surname }}
          </h2>
          <p
            class="text-secondary dark:text-gray-300 mb-2 text-sm sm:text-base"
          >
            {{ doctor.achievements }}
          </p>
        </div>
      </div>
    </div>

    <!-- Модальное окно просмотра -->
    <div
      v-if="selectedDoctor"
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
        <!-- Информация о враче или форма редактирования -->
        <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
          <img
            :src="
              isEditMode
                ? editForm.photo || '/doctor-default.png'
                : selectedDoctor.photo || '/doctor-default.png'
            "
            alt="Фото врача"
            class="h-32 w-32 sm:h-48 sm:w-48 rounded-lg object-cover mx-auto sm:mx-0"
            @error="(event) => (event.target.src = '/doctor-default.png')"
          />
          <div v-if="!isEditMode">
            <h2
              class="text-xl sm:text-2xl font-bold text-primary dark:text-white mb-2 sm:mb-4"
            >
              {{ selectedDoctor.name }} {{ selectedDoctor.surname }}
            </h2>
            <p
              class="text-secondary dark:text-gray-300 mb-2 text-sm sm:text-base"
            >
              <strong>Достижения:</strong> {{ selectedDoctor.achievements }}
            </p>
            <p
              class="text-secondary dark:text-gray-300 mb-2 text-sm sm:text-base"
            >
              <strong>Логин:</strong> {{ selectedDoctor.login }}
            </p>
            <button
              v-if="userRole === 'ADMIN'"
              class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-lg transition w-full mt-2 mb-2"
              @click="openEditDoctor"
            >
              Редактировать
            </button>
            <button
              v-if="userRole === 'ADMIN'"
              class="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition w-full mb-2"
              @click="deleteDoctor"
            >
              Удалить
            </button>
          </div>
          <form
            v-else
            @submit.prevent="saveEditDoctor"
            class="flex-1 space-y-2"
          >
            <AnimatedInput
              v-model="editForm.name"
              label="Имя"
              type="text"
              id="edit-name"
              required
            />
            <AnimatedInput
              v-model="editForm.surname"
              label="Фамилия"
              type="text"
              id="edit-surname"
              required
            />
            <AnimatedInput
              v-model="editForm.photo"
              label="URL фото"
              type="text"
              id="edit-photo"
            />
            <AnimatedInput
              v-model="editForm.achievements"
              label="Достижения"
              type="text"
              id="edit-achievements"
              required
            />
            <AnimatedInput
              v-model="editForm.login"
              label="Логин (email)"
              type="email"
              id="edit-login"
              required
            />
            <AnimatedInput
              v-model="editForm.password"
              label="Пароль (оставьте пустым, если не менять)"
              type="password"
              id="edit-password"
            />
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

    <!-- Модальное окно создания врача -->
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
          Добавить врача
        </h2>
        <form @submit.prevent="createDoctor" class="space-y-4">
          <AnimatedInput
            v-model="form.name"
            label="Имя"
            type="text"
            id="name"
            required
            :error="errors.name"
          />
          <AnimatedInput
            v-model="form.surname"
            label="Фамилия"
            type="text"
            id="surname"
            required
            :error="errors.surname"
          />
          <AnimatedInput
            v-model="form.photo"
            label="URL фото"
            type="text"
            id="photo"
            required
            :error="errors.photo"
          />
          <AnimatedInput
            v-model="form.achievements"
            label="Достижения"
            type="text"
            id="achievements"
            required
            :error="errors.achievements"
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
            required
            :error="errors.password"
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import AnimatedButton from '@/components/AnimatedButton.vue';
import AnimatedInput from '@/components/AnimatedInput.vue';
import { useAuth } from '~/composables/useAuth';

const API_URL = 'https://igor-plaxin.store/healthy-eat/doctor';
const TOKEN_PAYLOAD_URL =
  'https://igor-plaxin.store/healthy-eat/auth/token-payload';

const doctors = ref([]);
const isLoading = ref(true);
const modalLoading = ref(false);
const search = ref('');
const selectedDoctor = ref(null);
const showCreateModal = ref(false);
const adminId = ref(null);
const userRole = ref(null);
const { getToken } = useAuth();
const isEditMode = ref(false);
const editForm = ref({
  name: '',
  surname: '',
  photo: '',
  achievements: '',
  login: '',
  password: '',
});

const form = ref({
  name: '',
  surname: '',
  photo: '',
  achievements: '',
  login: '',
  password: '',
});

const errors = ref({
  name: '',
  surname: '',
  photo: '',
  achievements: '',
  login: '',
  password: '',
});

const filteredDoctors = computed(() => {
  return doctors.value.filter((d) =>
    d.name.toLowerCase().includes(search.value.toLowerCase())
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
    adminId.value = data.id;
    userRole.value = data.role;
  } catch (e) {
    toast.error(e.message || 'Ошибка получения данных токена');
  }
};

const fetchDoctors = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error('Ошибка загрузки врачей');
    doctors.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки врачей');
  } finally {
    isLoading.value = false;
  }
};

const validateForm = () => {
  let valid = true;
  errors.value = {
    name: '',
    surname: '',
    photo: '',
    achievements: '',
    login: '',
    password: '',
  };

  if (!form.value.name) {
    errors.value.name = 'Имя обязательно';
    valid = false;
  }
  if (!form.value.surname) {
    errors.value.surname = 'Фамилия обязательна';
    valid = false;
  }
  if (!form.value.photo) {
    errors.value.photo = 'URL фото обязателен';
    valid = false;
  }
  if (!form.value.achievements) {
    errors.value.achievements = 'Достижения обязательны';
    valid = false;
  }
  if (!form.value.login) {
    errors.value.login = 'Логин обязателен';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.login)) {
    errors.value.login = 'Введите корректный email';
    valid = false;
  }
  if (!form.value.password) {
    errors.value.password = 'Пароль обязателен';
    valid = false;
  }

  return valid;
};

const createDoctor = async () => {
  if (!validateForm()) return;
  if (!adminId.value) {
    toast.error('Не удалось получить ID администратора');
    return;
  }

  modalLoading.value = true;
  try {
    const payload = {
      ...form.value,
      admin_id: adminId.value,
    };
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Ошибка создания врача');
    toast.success('Врач успешно добавлен');
    closeCreateModal();
    fetchDoctors();
  } catch (e) {
    toast.error(e.message || 'Ошибка создания врача');
  } finally {
    modalLoading.value = false;
  }
};

const openCreateModal = () => {
  if (userRole.value === 'PATIENT' || userRole.value === 'DOCTOR') {
    toast.error('У вас нет прав для добавления врачей');
    return;
  }
  showCreateModal.value = true;
  form.value = {
    name: '',
    surname: '',
    photo: '',
    achievements: '',
    login: '',
    password: '',
  };
  errors.value = {
    name: '',
    surname: '',
    photo: '',
    achievements: '',
    login: '',
    password: '',
  };
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditDoctor = () => {
  isEditMode.value = true;
  editForm.value = {
    name: selectedDoctor.value.name,
    surname: selectedDoctor.value.surname,
    photo: selectedDoctor.value.photo,
    achievements: selectedDoctor.value.achievements,
    login: selectedDoctor.value.login,
    password: '',
  };
};

const saveEditDoctor = async () => {
  if (!selectedDoctor.value) return;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');
    const payload = { ...editForm.value };
    if (!payload.password) delete payload.password; // не отправлять пустой пароль
    const res = await fetch(`${API_URL}/${selectedDoctor.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Ошибка при обновлении данных');
    toast.success('Данные врача обновлены');
    isEditMode.value = false;
    closeModal();
    fetchDoctors();
  } catch (e) {
    toast.error(e.message || 'Ошибка при обновлении данных');
  }
};

const deleteDoctor = async () => {
  if (!selectedDoctor.value) return;
  if (!confirm('Вы действительно хотите удалить этого врача?')) return;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');
    const res = await fetch(`${API_URL}/${selectedDoctor.value.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка при удалении врача');
    toast.success('Врач успешно удалён');
    closeModal();
    fetchDoctors();
  } catch (e) {
    toast.error(e.message || 'Ошибка при удалении врача');
  }
};

const openModal = (doctor) => {
  selectedDoctor.value = doctor;
  isEditMode.value = false;
};

const closeModal = () => (selectedDoctor.value = null);

onMounted(async () => {
  await fetchTokenPayload();
  await fetchDoctors();
});
</script>
