<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-4 sm:py-10">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-primary dark:text-white">
          Симптомы заболеваний
        </h1>
        <button
          v-if="canManageLinks"
          @click="openCreateModal"
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          Добавить связь
        </button>
      </div>

      <!-- Поиск и фильтры -->
      <div class="mb-6 flex flex-col sm:flex-row gap-4">
        <select
          v-model="selectedIllness"
          class="p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">Все заболевания</option>
          <option
            v-for="illness in illnesses"
            :key="illness.id"
            :value="illness.id"
          >
            {{ illness.name }}
          </option>
        </select>
        <select
          v-model="selectedSymptom"
          class="p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="">Все симптомы</option>
          <option
            v-for="symptom in symptoms"
            :key="symptom.id"
            :value="symptom.id"
          >
            {{ symptom.name }}
          </option>
        </select>
      </div>

      <!-- Таблица связей -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50 dark:bg-gray-700">
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Заболевание
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Симптом
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Действия
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr
                v-for="link in filteredLinks"
                :key="`${link.illness_id}-${link.symptome_id}`"
                class="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {{ getIllnessName(link.illness_id) }}
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white"
                >
                  {{ getSymptomName(link.symptome_id) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    v-if="canManageLinks"
                    @click="deleteLink(link)"
                    class="text-red-500 hover:text-red-600"
                    title="Удалить"
                  >
                    🗑
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Модальное окно создания -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md">
        <h2 class="text-xl font-bold text-primary dark:text-white mb-4">
          Добавить связь
        </h2>
        <form @submit.prevent="submitForm" class="space-y-4">
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
          </div>
          <div>
            <label
              class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Симптом
            </label>
            <select
              v-model="form.symptome_id"
              required
              class="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white"
            >
              <option value="">Выберите симптом</option>
              <option
                v-for="symptom in symptoms"
                :key="symptom.id"
                :value="symptom.id"
              >
                {{ symptom.name }}
              </option>
            </select>
          </div>
          <div class="flex justify-end gap-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
            >
              Отмена
            </button>
            <button
              type="submit"
              class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              :disabled="isLoading"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuth } from '~/composables/useAuth';

const { getToken } = useAuth();
const API_URL = 'https://igor-plaxin.store/healthy-eat';
const userRole = ref(null);

const illnesses = ref([]);
const symptoms = ref([]);
const links = ref([]);
const selectedIllness = ref('');
const selectedSymptom = ref('');
const showModal = ref(false);
const isLoading = ref(false);

const form = ref({
  illness_id: '',
  symptome_id: '',
});

const filteredLinks = computed(() => {
  let filtered = links.value;

  if (selectedIllness.value) {
    filtered = filtered.filter(
      (link) => link.illness_id === parseInt(selectedIllness.value)
    );
  }

  if (selectedSymptom.value) {
    filtered = filtered.filter(
      (link) => link.symptome_id === parseInt(selectedSymptom.value)
    );
  }

  return filtered;
});

const getIllnessName = (id) => {
  const illness = illnesses.value.find((i) => i.id === id);
  return illness ? illness.name : 'Неизвестное заболевание';
};

const getSymptomName = (id) => {
  const symptom = symptoms.value.find((s) => s.id === id);
  return symptom ? symptom.name : 'Неизвестный симптом';
};

const fetchTokenPayload = async () => {
  try {
    const token = getToken();
    if (!token) return;
    const res = await fetch(`${API_URL}/auth/token-payload`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    userRole.value = data.role;
  } catch {}
};

const canManageLinks = computed(() => {
  return ['ADMIN', 'DOCTOR'].includes(userRole.value);
});

const fetchIllnesses = async () => {
  try {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/illness`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Ошибка загрузки заболеваний');
    illnesses.value = await res.json();
  } catch (e) {
    console.error(e.message || 'Ошибка загрузки заболеваний');
  }
};

const fetchSymptoms = async () => {
  try {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/symptome`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Ошибка загрузки симптомов');
    symptoms.value = await res.json();
  } catch (e) {
    console.error(e.message || 'Ошибка загрузки симптомов');
  }
};

const fetchLinks = async () => {
  try {
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/illness-on-symptome`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Ошибка загрузки связей');
    links.value = await res.json();
  } catch (e) {
    console.error(e.message || 'Ошибка загрузки связей');
  }
};

const openCreateModal = () => {
  form.value = {
    illness_id: '',
    symptome_id: '',
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  form.value = {
    illness_id: '',
    symptome_id: '',
  };
};

const submitForm = async () => {
  try {
    isLoading.value = true;
    const token = getToken();
    if (!token) return;

    const res = await fetch(`${API_URL}/illness-on-symptome`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        illness_id: parseInt(form.value.illness_id),
        symptome_id: parseInt(form.value.symptome_id),
      }),
    });
    if (!res.ok) throw new Error('Ошибка создания связи');

    await fetchLinks();
    closeModal();
  } catch (e) {
    console.error(e.message || 'Ошибка создания связи');
  } finally {
    isLoading.value = false;
  }
};

const deleteLink = async (link) => {
  if (!confirm('Вы уверены, что хотите удалить эту связь?')) return;

  try {
    const token = getToken();
    if (!token) return;

    const res = await fetch(
      `${API_URL}/illness-on-symptome/${link.illness_id}/${link.symptome_id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) throw new Error('Ошибка удаления связи');

    await fetchLinks();
  } catch (e) {
    console.error(e.message || 'Ошибка удаления связи');
  }
};

onMounted(async () => {
  await Promise.all([
    fetchTokenPayload(),
    fetchIllnesses(),
    fetchSymptoms(),
    fetchLinks(),
  ]);
});
</script>
