<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
    <!-- Фильтрация врачей -->
    <div
      class="max-w-7xl mx-auto px-4 mb-6 flex justify-between items-center gap-4"
    >
      <input
        v-model="search"
        type="text"
        placeholder="🔍 Поиск по имени или специальности"
        class="w-full p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white"
      />
      <select
        v-model="selectedSpecialty"
        class="p-2 rounded-lg shadow-sm dark:bg-gray-700 dark:text-white"
      >
        <option value="">Все специальности</option>
        <option
          v-for="specialty in specialties"
          :key="specialty"
          :value="specialty"
        >
          {{ specialty }}
        </option>
      </select>
    </div>

    <!-- Список карточек врачей -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4"
    >
      <div
        v-for="(doctor, index) in filteredDoctors"
        :key="index"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105 cursor-pointer"
        @click="openModal(doctor)"
      >
        <!-- Аватар -->
        <img
          :src="doctor.avatar"
          alt="Аватар врача"
          class="w-full h-48 object-cover"
        />
        <!-- Информация о враче -->
        <div class="p-6">
          <h2 class="text-xl font-semibold text-primary dark:text-white mb-2">
            {{ doctor.name }}
          </h2>
          <p class="text-secondary dark:text-gray-300 mb-2">
            {{ doctor.specialty }}
          </p>
          <!-- Рейтинг врача -->
          <p class="text-yellow-500 mb-4">⭐ {{ doctor.rating }}/5</p>
        </div>
      </div>
    </div>

    <!-- Модальное окно -->
    <div
      v-if="selectedDoctor"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div
        class="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-2xl relative"
      >
        <!-- Кнопка закрытия -->
        <button
          class="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-xl"
          @click="closeModal"
        >
          &times;
        </button>
        <!-- Информация о враче -->
        <div class="flex gap-6">
          <img
            :src="selectedDoctor.avatar"
            alt="Фото врача"
            class="h-48 w-48 rounded-lg object-cover"
          />
          <div>
            <h2 class="text-2xl font-bold text-primary dark:text-white mb-4">
              {{ selectedDoctor.name }}
            </h2>
            <p class="text-secondary dark:text-gray-300 mb-2">
              <strong>Специальность:</strong> {{ selectedDoctor.specialty }}
            </p>
            <p class="text-secondary dark:text-gray-300 mb-2">
              <strong>Опыт работы:</strong> {{ selectedDoctor.experience }} лет
            </p>
            <p class="text-secondary dark:text-gray-300 mb-2">
              <strong>Образование:</strong> {{ selectedDoctor.education }}
            </p>
            <p class="text-secondary dark:text-gray-300 mb-4">
              <strong>Описание:</strong> {{ selectedDoctor.description }}
            </p>
          </div>
        </div>
        <button
          class="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full mt-4"
          @click="closeModal"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Моковые данные врачей
const doctors = ref([
  {
    name: 'Анна Петрова',
    specialty: 'Терапевт',
    experience: 10,
    education: 'МГУ',
    description: 'Опытный терапевт.',
    avatar: 'https://via.placeholder.com/150',
    rating: 4.8,
  },
  {
    name: 'Иван Сидоров',
    specialty: 'Хирург',
    experience: 15,
    education: 'РНИМУ',
    description: 'Высококвалифицированный хирург.',
    avatar: 'https://via.placeholder.com/150',
    rating: 4.7,
  },
  {
    name: 'Мария Кузнецова',
    specialty: 'Педиатр',
    experience: 8,
    education: 'СПбГУ',
    description: 'Любящий детей педиатр.',
    avatar: 'https://via.placeholder.com/150',
    rating: 4.9,
  },
  {
    name: 'Александр Иванов',
    specialty: 'Кардиолог',
    experience: 12,
    education: 'МАМИ',
    description: 'Эксперт по сердечно-сосудистым заболеваниям.',
    avatar: 'https://via.placeholder.com/150',
    rating: 4.6,
  },
  {
    name: 'Екатерина Смирнова',
    specialty: 'Невролог',
    experience: 9,
    education: 'РУДН',
    description: 'Специалист по нервным расстройствам.',
    avatar: 'https://via.placeholder.com/150',
    rating: 4.7,
  },
  {
    name: 'Дмитрий Козлов',
    specialty: 'Стоматолог',
    experience: 7,
    education: 'МГМСУ',
    description: 'Профессионал в эстетической стоматологии.',
    avatar: 'https://via.placeholder.com/150',
    rating: 4.9,
  },
  {
    name: 'Василиса Тихонова',
    specialty: 'Дерматолог',
    experience: 11,
    education: 'Сеченовский университет',
    description: 'Эксперт по кожным заболеваниям.',
    avatar: 'https://via.placeholder.com/150',
    rating: 4.8,
  },
  {
    name: 'Сергей Морозов',
    specialty: 'Офтальмолог',
    experience: 13,
    education: 'РНИМУ',
    description: 'Диагностика и лечение глазных болезней.',
    avatar: 'https://via.placeholder.com/150',
    rating: 4.9,
  },
  {
    name: 'Ольга Беляева',
    specialty: 'Эндокринолог',
    experience: 14,
    education: 'ММА',
    description: 'Специалист по лечению эндокринных заболеваний.',
    avatar: 'https://via.placeholder.com/150',
    rating: 4.8,
  },
]);

const search = ref('');
const selectedSpecialty = ref('');

const specialties = computed(() => [
  ...new Set(doctors.value.map((d) => d.specialty)),
]);

const filteredDoctors = computed(() => {
  return doctors.value.filter(
    (d) =>
      (d.name.toLowerCase().includes(search.value.toLowerCase()) ||
        d.specialty.toLowerCase().includes(search.value.toLowerCase())) &&
      (selectedSpecialty.value === '' ||
        d.specialty === selectedSpecialty.value)
  );
});

const selectedDoctor = ref(null);
const openModal = (doctor) => (selectedDoctor.value = doctor);
const closeModal = () => (selectedDoctor.value = null);
</script>
