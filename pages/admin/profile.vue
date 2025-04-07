<template>
  <div class="max-w-4xl mx-auto space-y-6">
    <!-- Карточка профиля -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300"
    >
      <!-- Шапка профиля -->
      <div class="h-32 bg-gradient-to-r from-primary to-blue-600 relative">
        <div class="absolute -bottom-16 left-8">
          <label class="cursor-pointer group">
            <input
              type="file"
              class="hidden"
              @change="handleAvatarUpdate"
              accept="image/*"
            />
            <div class="relative">
              <img
                :src="avatarUrl"
                alt="Аватар"
                class="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg transition-transform group-hover:scale-105"
              />
              <div
                class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <CameraIcon class="w-8 h-8 text-white" />
              </div>
            </div>
          </label>
        </div>
        <div class="absolute top-4 right-4">
          <button
            @click="isEditing = !isEditing"
            class="bg-white dark:bg-gray-700 text-primary dark:text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors flex items-center"
          >
            <component
              :is="isEditing ? 'XIcon' : 'EditIcon'"
              class="w-4 h-4 mr-2"
            />
            {{ isEditing ? 'Отмена' : 'Редактировать' }}
          </button>
        </div>
      </div>

      <!-- Информация профиля -->
      <div class="pt-20 px-8 pb-8">
        <div
          class="flex flex-col md:flex-row md:items-end justify-between mb-6"
        >
          <div>
            <h1 class="text-2xl font-bold text-primary dark:text-white">
              {{ user.name }}
            </h1>
            <p class="text-secondary dark:text-gray-300">{{ user.email }}</p>
          </div>
          <div class="mt-4 md:mt-0">
            <span
              class="inline-block px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-sm"
            >
              {{ user.status }}
            </span>
          </div>
        </div>

        <!-- Форма редактирования -->
        <div
          v-if="isEditing"
          class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6"
        >
          <div>
            <label
              class="block text-sm font-medium text-secondary dark:text-gray-300 mb-1"
              >Имя</label
            >
            <input
              v-model="editForm.name"
              type="text"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-secondary dark:text-gray-300 mb-1"
              >Email</label
            >
            <input
              v-model="editForm.email"
              type="email"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-secondary dark:text-gray-300 mb-1"
              >Возраст</label
            >
            <input
              v-model.number="editForm.age"
              type="number"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-secondary dark:text-gray-300 mb-1"
              >Рост (см)</label
            >
            <input
              v-model.number="editForm.height"
              type="number"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-secondary dark:text-gray-300 mb-1"
              >Вес (кг)</label
            >
            <input
              v-model.number="editForm.weight"
              type="number"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium text-secondary dark:text-gray-300 mb-1"
              >Пол</label
            >
            <select
              v-model="editForm.gender"
              class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            >
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
            </select>
          </div>
          <div class="md:col-span-2 flex justify-end space-x-3">
            <button
              @click="isEditing = false"
              class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Отмена
            </button>
            <button
              @click="handleProfileUpdate"
              class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Сохранить
            </button>
          </div>
        </div>

        <!-- Информация профиля (не в режиме редактирования) -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center mb-2">
              <UserIcon class="w-5 h-5 text-primary dark:text-white mr-2" />
              <h3 class="font-medium text-primary dark:text-white">
                Основные данные
              </h3>
            </div>
            <div class="space-y-2">
              <p class="text-secondary dark:text-gray-300">
                <span class="font-medium">Возраст:</span> {{ user.age }} лет
              </p>
              <p class="text-secondary dark:text-gray-300">
                <span class="font-medium">Рост:</span> {{ user.height }} см
              </p>
              <p class="text-secondary dark:text-gray-300">
                <span class="font-medium">Вес:</span> {{ user.weight }} кг
              </p>
              <p class="text-secondary dark:text-gray-300">
                <span class="font-medium">Пол:</span>
                {{ user.gender === 'male' ? 'Мужской' : 'Женский' }}
              </p>
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center mb-2">
              <ActivityIcon class="w-5 h-5 text-primary dark:text-white mr-2" />
              <h3 class="font-medium text-primary dark:text-white">
                Активность
              </h3>
            </div>
            <div class="space-y-2">
              <p class="text-secondary dark:text-gray-300">
                <span class="font-medium">Заявок создано:</span>
                {{ user.requests }}
              </p>
              <p class="text-secondary dark:text-gray-300">
                <span class="font-medium">Последний вход:</span>
                {{ user.lastLogin }}
              </p>
              <p class="text-secondary dark:text-gray-300">
                <span class="font-medium">Статус:</span> {{ user.status }}
              </p>
            </div>
          </div>

          <div class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div class="flex items-center mb-2">
              <HeartIcon class="w-5 h-5 text-primary dark:text-white mr-2" />
              <h3 class="font-medium text-primary dark:text-white">Здоровье</h3>
            </div>
            <div class="space-y-2">
              <p class="text-secondary dark:text-gray-300">
                <span class="font-medium">ИМТ:</span> {{ calculateBMI }}
              </p>
              <p class="text-secondary dark:text-gray-300">
                <span class="font-medium">Категория:</span> {{ bmiCategory }}
              </p>
              <p class="text-secondary dark:text-gray-300">
                <span class="font-medium">Калории:</span>
                {{ user.calories }} ккал/день
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Достижения -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300"
    >
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-bold text-primary dark:text-white">
          Достижения
        </h2>
        <button class="text-sm text-primary dark:text-white hover:underline">
          Все достижения
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="(achievement, index) in user.achievements"
          :key="index"
          class="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all duration-300 hover:shadow-md"
        >
          <div class="flex items-center mb-2">
            <component
              :is="achievement.icon"
              class="w-5 h-5 text-primary dark:text-white mr-2"
            />
            <h3 class="font-medium text-primary dark:text-white">
              {{ achievement.title }}
            </h3>
          </div>
          <p class="text-sm text-secondary dark:text-gray-300">
            {{ achievement.description }}
          </p>
          <div class="mt-2 flex items-center">
            <CalendarIcon
              class="w-4 h-4 text-gray-500 dark:text-gray-400 mr-1"
            />
            <span class="text-xs text-gray-500 dark:text-gray-400">{{
              achievement.date
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Прогресс -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300"
    >
      <h2 class="text-xl font-bold text-primary dark:text-white mb-4">
        Прогресс
      </h2>
      <div class="space-y-4">
        <div>
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-secondary dark:text-gray-300"
              >Общий прогресс</span
            >
            <span class="text-sm font-medium text-primary dark:text-white"
              >{{ user.progress }}%</span
            >
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-primary h-2.5 rounded-full transition-all duration-500"
              :style="{ width: user.progress + '%' }"
            ></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-secondary dark:text-gray-300"
              >Цель по весу</span
            >
            <span class="text-sm font-medium text-primary dark:text-white"
              >{{ weightProgress }}%</span
            >
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-green-500 h-2.5 rounded-full transition-all duration-500"
              :style="{ width: weightProgress + '%' }"
            ></div>
          </div>
        </div>

        <div>
          <div class="flex justify-between mb-1">
            <span class="text-sm font-medium text-secondary dark:text-gray-300"
              >Активность</span
            >
            <span class="text-sm font-medium text-primary dark:text-white"
              >{{ activityProgress }}%</span
            >
          </div>
          <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              class="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              :style="{ width: activityProgress + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Кнопки действий -->
    <div class="flex justify-end space-x-3">
      <button
        @click="handleLogout"
        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center"
      >
        <LogOutIcon class="w-4 h-4 mr-2" />
        Выйти
      </button>
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
