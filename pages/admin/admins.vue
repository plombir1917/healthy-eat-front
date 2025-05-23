<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-primary dark:text-white">
          Администраторы
        </h1>
        <AnimatedButton
          v-if="userRole === 'ADMIN'"
          @click="openCreateModal"
          variant="primary"
        >
          + Добавить администратора
        </AnimatedButton>
      </div>

      <!-- Поиск -->
      <div class="mb-6">
        <input
          v-model="search"
          type="text"
          placeholder="🔍 Поиск по имени или логину"
          class="w-full p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white"
        />
      </div>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>

      <!-- Таблица администраторов -->
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
                Имя
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Фамилия
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Логин
              </th>
              <th
                class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
              >
                Роль
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
              v-for="(admin, index) in filteredAdmins"
              :key="admin.id"
              class="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ index + 1 }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ admin.name }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ admin.surname }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ admin.login }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                {{ admin.role }}
              </td>
              <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                <div v-if="userRole === 'ADMIN'" class="flex gap-2">
                  <button
                    class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
                    @click="openEditModal(admin)"
                  >
                    ✏️
                  </button>
                  <button
                    class="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
                    @click="deleteAdmin(admin)"
                  >
                    🗑️
                  </button>
                </div>
                <span v-else>-</span>
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
          Добавить администратора
        </h2>
        <form @submit.prevent="createAdmin" class="space-y-4">
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
          Редактировать администратора
        </h2>
        <form @submit.prevent="saveEditAdmin" class="space-y-4">
          <AnimatedInput
            v-model="editForm.name"
            label="Имя"
            type="text"
            id="edit-name"
            required
            :error="errors.name"
          />
          <AnimatedInput
            v-model="editForm.surname"
            label="Фамилия"
            type="text"
            id="edit-surname"
            required
            :error="errors.surname"
          />
          <AnimatedInput
            v-model="editForm.login"
            label="Логин (email)"
            type="email"
            id="edit-login"
            required
            :error="errors.login"
          />
          <AnimatedInput
            v-model="editForm.password"
            label="Пароль (оставьте пустым, если не менять)"
            type="password"
            id="edit-password"
            :error="errors.password"
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

const API_URL = 'https://igor-plaxin.ru/healthy-eat/admin';
const TOKEN_PAYLOAD_URL =
  'https://igor-plaxin.ru/healthy-eat/auth/token-payload';
const { getToken } = useAuth();

const admins = ref([]);
const isLoading = ref(true);
const modalLoading = ref(false);
const search = ref('');
const showCreateModal = ref(false);
const showEditModal = ref(false);
const selectedAdmin = ref(null);
const userRole = ref(null);

const form = ref({
  name: '',
  surname: '',
  login: '',
  password: '',
});

const editForm = ref({
  name: '',
  surname: '',
  login: '',
  password: '',
});

const errors = ref({
  name: '',
  surname: '',
  login: '',
  password: '',
});

const filteredAdmins = computed(() => {
  return admins.value.filter(
    (admin) =>
      admin.name.toLowerCase().includes(search.value.toLowerCase()) ||
      admin.surname.toLowerCase().includes(search.value.toLowerCase()) ||
      admin.login.toLowerCase().includes(search.value.toLowerCase())
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

const fetchAdmins = async () => {
  isLoading.value = true;
  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error('Ошибка загрузки администраторов');
    admins.value = await res.json();
  } catch (e) {
    toast.error(e.message || 'Ошибка загрузки администраторов');
  } finally {
    isLoading.value = false;
  }
};

const validateForm = (formData, isEdit = false) => {
  let valid = true;
  errors.value = {
    name: '',
    surname: '',
    login: '',
    password: '',
  };

  if (!formData.name) {
    errors.value.name = 'Имя обязательно';
    valid = false;
  }
  if (!formData.surname) {
    errors.value.surname = 'Фамилия обязательна';
    valid = false;
  }
  if (!formData.login) {
    errors.value.login = 'Логин обязателен';
    valid = false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.login)) {
    errors.value.login = 'Введите корректный email';
    valid = false;
  }

  if (!isEdit && !formData.password) {
    errors.value.password = 'Пароль обязателен';
    valid = false;
  }

  return valid;
};

const createAdmin = async () => {
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

    if (!res.ok) throw new Error('Ошибка создания администратора');
    toast.success('Администратор успешно добавлен');
    closeCreateModal();
    fetchAdmins();
  } catch (e) {
    toast.error(e.message || 'Ошибка создания администратора');
  } finally {
    modalLoading.value = false;
  }
};

const openCreateModal = () => {
  showCreateModal.value = true;
  form.value = {
    name: '',
    surname: '',
    login: '',
    password: '',
  };
  errors.value = {
    name: '',
    surname: '',
    login: '',
    password: '',
  };
};

const closeCreateModal = () => {
  showCreateModal.value = false;
};

const openEditModal = (admin) => {
  selectedAdmin.value = admin;
  editForm.value = {
    name: admin.name,
    surname: admin.surname,
    login: admin.login,
    password: '',
  };
  showEditModal.value = true;
};

const saveEditAdmin = async () => {
  if (!validateForm(editForm.value, true)) return;
  if (!selectedAdmin.value) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const payload = {
      ...editForm.value,
    };
    if (!payload.password) delete payload.password;

    const res = await fetch(`${API_URL}/${selectedAdmin.value.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Ошибка при обновлении данных');
    toast.success('Данные администратора обновлены');
    closeEditModal();
    fetchAdmins();
  } catch (e) {
    toast.error(e.message || 'Ошибка при обновлении данных');
  }
};

const deleteAdmin = async (admin) => {
  if (!confirm('Вы действительно хотите удалить этого администратора?')) return;

  try {
    const token = getToken();
    if (!token) throw new Error('Токен авторизации не найден');

    const res = await fetch(`${API_URL}/${admin.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error('Ошибка при удалении администратора');
    toast.success('Администратор успешно удален');
    fetchAdmins();
  } catch (e) {
    toast.error(e.message || 'Ошибка при удалении администратора');
  }
};

const closeEditModal = () => {
  showEditModal.value = false;
};

onMounted(async () => {
  await fetchTokenPayload();
  if (userRole.value === 'ADMIN') {
    await fetchAdmins();
  } else {
    toast.error('У вас нет прав для просмотра этой страницы.');
  }
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
