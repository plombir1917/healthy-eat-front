<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-4 sm:py-10">
    <div
      class="max-w-4xl mx-auto p-2 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
    >
      <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
        <img
          :src="user.avatar"
          alt="Аватар"
          class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-primary"
        />
        <div class="flex-1">
          <h1
            class="text-xl sm:text-2xl font-bold text-primary dark:text-white mb-1"
          >
            {{ user.name }}
          </h1>
          <p
            class="text-secondary dark:text-gray-300 text-sm sm:text-base mb-2"
          >
            {{ user.email }}
          </p>
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <span
              class="bg-primary/10 text-primary dark:bg-primary/20 dark:text-white px-2 py-1 rounded text-xs sm:text-sm"
              >ID: {{ user.id }}</span
            >
            <span
              class="bg-gray-100 dark:bg-gray-700 text-secondary dark:text-gray-300 px-2 py-1 rounded text-xs sm:text-sm"
              >Статус: {{ user.status }}</span
            >
          </div>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="space-y-3 sm:space-y-4">
          <div>
            <label
              class="block text-xs sm:text-sm font-medium text-secondary dark:text-gray-300 mb-1"
              >Рост (см)</label
            >
            <input
              v-model.number="editForm.height"
              type="number"
              class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            />
          </div>
          <div>
            <label
              class="block text-xs sm:text-sm font-medium text-secondary dark:text-gray-300 mb-1"
              >Вес (кг)</label
            >
            <input
              v-model.number="editForm.weight"
              type="number"
              class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            />
          </div>
          <div>
            <label
              class="block text-xs sm:text-sm font-medium text-secondary dark:text-gray-300 mb-1"
              >Пол</label
            >
            <select
              v-model="editForm.gender"
              class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base"
            >
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
        </div>
        <div class="space-y-3 sm:space-y-4">
          <div class="p-2 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center mb-2">
              <ActivityIcon class="w-5 h-5 text-primary dark:text-white mr-2" />
              <h3
                class="font-medium text-primary dark:text-white text-sm sm:text-base"
              >
                Активность
              </h3>
            </div>
            <div class="space-y-1 sm:space-y-2">
              <p class="text-secondary dark:text-gray-300 text-xs sm:text-sm">
                <span class="font-medium">Заявок создано:</span>
                {{ user.requests }}
              </p>
              <p class="text-secondary dark:text-gray-300 text-xs sm:text-sm">
                <span class="font-medium">Последний вход:</span>
                {{ user.lastLogin }}
              </p>
              <p class="text-secondary dark:text-gray-300 text-xs sm:text-sm">
                <span class="font-medium">Статус:</span> {{ user.status }}
              </p>
            </div>
          </div>
          <div class="p-2 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center mb-2">
              <HeartIcon class="w-5 h-5 text-primary dark:text-white mr-2" />
              <h3
                class="font-medium text-primary dark:text-white text-sm sm:text-base"
              >
                Здоровье
              </h3>
            </div>
            <div class="space-y-1 sm:space-y-2">
              <p class="text-secondary dark:text-gray-300 text-xs sm:text-sm">
                <span class="font-medium">ИМТ:</span> {{ calculateBMI }}
              </p>
              <p class="text-secondary dark:text-gray-300 text-xs sm:text-sm">
                <span class="font-medium">Категория:</span> {{ bmiCategory }}
              </p>
              <p class="text-secondary dark:text-gray-300 text-xs sm:text-sm">
                <span class="font-medium">Калории:</span>
                {{ user.calories }} ккал/день
              </p>
            </div>
          </div>
        </div>
      </div>
      <!-- Прогресс -->
      <div
        class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 sm:p-6 mt-6"
      >
        <h2
          class="text-lg sm:text-xl font-bold text-primary dark:text-white mb-3 sm:mb-4"
        >
          Прогресс
        </h2>
        <div class="space-y-3 sm:space-y-4">
          <div>
            <div class="flex justify-between mb-1">
              <span
                class="text-xs sm:text-sm font-medium text-secondary dark:text-gray-300"
                >Общий прогресс</span
              >
              <span
                class="text-xs sm:text-sm font-medium text-primary dark:text-white"
                >{{ user.progress }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-primary h-2 rounded-full transition-all duration-500"
                :style="{ width: user.progress + '%' }"
              ></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between mb-1">
              <span
                class="text-xs sm:text-sm font-medium text-secondary dark:text-gray-300"
                >Цель по весу</span
              >
              <span
                class="text-xs sm:text-sm font-medium text-primary dark:text-white"
                >{{ weightProgress }}%</span
              >
            </div>
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                class="bg-green-500 h-2 rounded-full transition-all duration-500"
                :style="{ width: weightProgress + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {
  CameraIcon,
  EditIcon,
  XIcon,
  UserIcon,
  ActivityIcon,
  HeartIcon,
  CalendarIcon,
  LogOutIcon,
  AwardIcon,
  TargetIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { toast } from 'vue3-toastify';

const router = useRouter();
const { removeToken, isAuthenticated, setToken } = useAuth();

// Состояние редактирования
const isEditing = ref(false);

// URL аватарки
const avatarUrl = ref(
  'https://ui-avatars.com/api/?name=Иван+Иванов&background=3b82f6&color=fff&size=200'
);

// Данные пользователя
const user = ref({
  name: 'Иван Иванов',
  email: 'ivan.ivanov@example.com',
  age: 25,
  height: 178,
  weight: 75,
  gender: 'male',
  requests: 15,
  lastLogin: 'Сегодня',
  status: 'Активный',
  calories: 2200,
  progress: 75,
  achievements: [
    {
      title: 'Сбросил 5 кг за месяц!',
      description: 'Достигнута цель по снижению веса',
      date: '15.05.2023',
      icon: TrendingUpIcon,
    },
    {
      title: 'Прошел 30 тренировок',
      description: 'Регулярные тренировки в течение месяца',
      date: '10.06.2023',
      icon: ActivityIcon,
    },
    {
      title: 'Поднял свой личный рекорд',
      description: 'Новый рекорд в жиме лежа',
      date: '22.07.2023',
      icon: TargetIcon,
    },
    {
      title: '100 дней подряд',
      description: 'Ежедневное отслеживание питания',
      date: '05.08.2023',
      icon: ClockIcon,
    },
    {
      title: 'Здоровый сон',
      description: 'Средняя продолжительность сна 8 часов',
      date: '12.09.2023',
      icon: CheckCircleIcon,
    },
    {
      title: 'Мастер здорового питания',
      description: 'Следование плану питания 30 дней',
      date: '01.10.2023',
      icon: AwardIcon,
    },
  ],
});

// Форма редактирования
const editForm = ref({
  name: '',
  email: '',
  age: 0,
  height: 0,
  weight: 0,
  gender: 'male',
});

// Прогресс
const weightProgress = ref(60);
const activityProgress = ref(85);

// Вычисляемые свойства
const calculateBMI = computed(() => {
  const heightInMeters = user.value.height / 100;
  const bmi = user.value.weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(1);
});

const bmiCategory = computed(() => {
  const bmi = parseFloat(calculateBMI.value);
  if (bmi < 18.5) return 'Недостаточный вес';
  if (bmi < 25) return 'Нормальный вес';
  if (bmi < 30) return 'Избыточный вес';
  return 'Ожирение';
});

// Методы
const handleAvatarUpdate = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      avatarUrl.value = e.target.result;
      await handleProfileUpdate();
    };
    reader.readAsDataURL(file);
  }
};

const handleProfileUpdate = async () => {
  // В реальном приложении здесь будет запрос к API
  user.value = {
    ...user.value,
    ...editForm.value,
  };

  toast.success('Профиль успешно обновлен');
  isEditing.value = false;
};

const handleLogout = () => {
  removeToken();
  toast.success('Вы успешно вышли из системы');
  router.push('/login');
};

// Инициализация
onMounted(() => {
  // Загрузка данных пользователя
  if (isAuthenticated()) {
    // В реальном приложении здесь будет запрос к API

    // Инициализация формы редактирования
    editForm.value = {
      name: user.value.name,
      email: user.value.email,
      age: user.value.age,
      height: user.value.height,
      weight: user.value.weight,
      gender: user.value.gender,
    };
  } else {
    router.push('/login');
  }
});
</script>

<style scoped>
input,
select {
  transition: all 0.3s ease-in-out;
}
input:focus,
select:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
</style>
