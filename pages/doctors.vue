<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-10">
    <!-- Список карточек врачей -->
    <div
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto px-4"
    >
      <div
        v-for="(doctor, index) in doctors"
        :key="index"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-transform hover:scale-105"
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
          <p class="text-secondary dark:text-gray-300 mb-4">
            {{ doctor.specialty }}
          </p>
          <!-- Кнопки -->
          <div class="flex justify-between space-x-2">
            <button
              class="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full"
              @click="openModal(doctor)"
            >
              Подробнее
            </button>
            <button
              class="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full"
            >
              Отправить заявку
            </button>
          </div>
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
        <button
          class="bg-primary hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition w-full"
          @click="closeModal"
        >
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Моковые данные врачей
const doctors = ref([
  {
    name: 'Анна Петрова',
    specialty: 'Терапевт',
    experience: 10,
    education: 'МГУ им. Ломоносова',
    description:
      'Опытный терапевт с многолетним стажем работы. Специализируется на лечении хронических заболеваний.',
    avatar:
      'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Иван Сидоров',
    specialty: 'Хирург',
    experience: 15,
    education: 'РНИМУ им. Пирогова',
    description:
      'Высококвалифицированный хирург. Проводит сложные операции и консультирует пациентов.',
    avatar:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Мария Кузнецова',
    specialty: 'Педиатр',
    experience: 8,
    education: 'СПбГУ',
    description:
      'Любящий дети педиатр. Помогает родителям в уходе за детьми и лечении детских заболеваний.',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Александр Иванов',
    specialty: 'Кардиолог',
    experience: 12,
    education: 'МАМИ',
    description:
      'Эксперт в диагностике и лечении сердечно-сосудистых заболеваний.',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Екатерина Смирнова',
    specialty: 'Невролог',
    experience: 9,
    education: 'Российский университет дружбы народов',
    description:
      'Специализируется на лечении головных болей, мигреней и нервных расстройств.',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
  {
    name: 'Дмитрий Козлов',
    specialty: 'Стоматолог',
    experience: 7,
    education: 'МГМСУ',
    description:
      'Профессионал в области эстетической стоматологии и имплантологии.',
    avatar:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
  },
]);

// Управление модальным окном
const selectedDoctor = ref(null);

const openModal = (doctor) => {
  selectedDoctor.value = doctor;
};

const closeModal = () => {
  selectedDoctor.value = null;
};
</script>

<style scoped>
.text-primary {
  color: #3b82f6;
}

.text-secondary {
  color: #6b7280;
}

.bg-primary {
  background-color: #3b82f6;
}
</style>
