<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
    <div class="max-w-7xl mx-auto px-4 mb-6">
      <h1 class="text-2xl font-bold text-primary dark:text-white mb-6">
        Заявки
      </h1>
      <div v-if="isLoading" class="flex justify-center items-center py-10">
        <LoadingSpinner />
      </div>
      <div v-else>
        <div
          v-if="requests.length === 0"
          class="text-center text-gray-600 dark:text-gray-400 py-10"
        >
          Нет заявок.
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
                  ID пациента
                </th>
                <th
                  class="py-3 px-4 text-gray-600 dark:text-gray-300 font-medium"
                >
                  ID рекомендации
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(request, index) in requests"
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
                  {{ request.patient_id }}
                </td>
                <td class="py-3 px-4 text-gray-900 dark:text-gray-100">
                  {{ request.recommendation_id }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';
import { toast } from 'vue3-toastify';

const REQUESTS_URL = 'https://igor-plaxin.ru/healthy-eat/request';
const requests = ref([]);
const isLoading = ref(true);

const fetchRequests = async () => {
  isLoading.value = true;
  try {
    const res = await fetch(REQUESTS_URL);
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Ошибка сервера:', errorText);
      throw new Error(
        `Ошибка загрузки заявок: ${res.status} ${res.statusText}`
      );
    }

    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Неверный формат ответа от сервера');
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      throw new Error('Получены данные в неверном формате');
    }

    requests.value = data;
  } catch (e) {
    console.error('Ошибка при загрузке заявок:', e);
    toast.error(e.message || 'Ошибка загрузки заявок');
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchRequests);
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
