<template>
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-sm overflow-x-auto">
    <h1 class="text-xl sm:text-2xl font-semibold text-primary mb-4">Заявки</h1>
    <table
      class="w-full min-w-[600px] border-collapse border border-gray-200 text-sm sm:text-base"
    >
      <thead class="bg-gray-100">
        <tr>
          <th class="border border-gray-200 p-2 text-left">№</th>
          <th class="border border-gray-200 p-2 text-left">Имя</th>
          <th class="border border-gray-200 p-2 text-left">Email</th>
          <th class="border border-gray-200 p-2 text-left">Статус</th>
          <th class="border border-gray-200 p-2 text-left">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(request, index) in requests"
          :key="index"
          class="hover:bg-gray-50"
        >
          <td class="border border-gray-200 p-2">{{ index + 1 }}</td>
          <td class="border border-gray-200 p-2">{{ request.name }}</td>
          <td class="border border-gray-200 p-2 break-all">
            {{ request.email }}
          </td>
          <td class="border border-gray-200 p-2">
            <span :class="getStatusClass(request.status)">{{
              request.status
            }}</span>
          </td>
          <td class="border border-gray-200 p-2 whitespace-nowrap">
            <button
              class="text-blue-500 hover:underline mr-2 text-xs sm:text-base"
            >
              Принять
            </button>
            <button class="text-red-500 hover:underline text-xs sm:text-base">
              Отклонить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const requests = [
  { name: 'Иван Иванов', email: 'ivan@example.com', status: 'Ожидание' },
  { name: 'Мария Смирнова', email: 'maria@example.com', status: 'Принято' },
  { name: 'Алексей Петров', email: 'alex@example.com', status: 'Отклонено' },
];

const getStatusClass = (status) => {
  switch (status) {
    case 'Ожидание':
      return 'text-yellow-500';
    case 'Принято':
      return 'text-green-500';
    case 'Отклонено':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};
</script>

<style scoped>
th,
td {
  padding: 8px 12px;
  text-align: left;
}
</style>
