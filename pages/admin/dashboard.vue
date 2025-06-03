<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-4 sm:py-10">
    <div class="flex flex-col gap-6">
      <!-- Приветствие -->
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300"
      >
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-primary dark:text-white mb-1">
              Добро пожаловать, {{ userName }}!
              {{ userRole === 'DOCTOR' ? '👨‍⚕️' : '' }}
            </h1>
            <p class="text-secondary dark:text-gray-300">
              Вот ваш обзор на сегодня
            </p>
          </div>
          <div class="text-right">
            <p class="text-sm text-secondary dark:text-gray-300">
              {{ currentDate }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ currentTime }}
            </p>
          </div>
        </div>
      </div>

      <!-- Карточки статистики -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="(stat, index) in stats"
          :key="index"
          class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="p-3 rounded-full" :class="stat.bgColor">
              <component
                :is="stat.icon"
                class="w-6 h-6"
                :class="stat.iconColor"
              />
            </div>
            <span class="text-sm font-medium" :class="stat.trendColor">
              {{ stat.trend }}
              <component :is="stat.trendIcon" class="w-4 h-4 inline" />
            </span>
          </div>
          <h3 class="text-2xl font-bold text-primary dark:text-white mb-1">
            {{ stat.value }}
          </h3>
          <p class="text-secondary dark:text-gray-300 text-sm">
            {{ stat.label }}
          </p>
        </div>
      </div>

      <!-- Калькулятор калорий -->
      <div
        class="bg-white dark:bg-gray-800 p-3 sm:p-6 rounded-xl shadow-md transition-all duration-300"
      >
        <h2
          class="text-lg sm:text-xl font-bold text-primary dark:text-white mb-3 sm:mb-4"
        >
          Рассчёт суточной нормы калорий
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div class="space-y-3 sm:space-y-4">
            <div>
              <label
                class="block text-xs sm:text-sm font-medium text-secondary dark:text-gray-300 mb-1"
                >Вес (кг)</label
              >
              <input
                v-model.number="weight"
                type="number"
                placeholder="Введите ваш вес"
                class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              />
            </div>
            <div>
              <label
                class="block text-xs sm:text-sm font-medium text-secondary dark:text-gray-300 mb-1"
                >Рост (см)</label
              >
              <input
                v-model.number="height"
                type="number"
                placeholder="Введите ваш рост"
                class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              />
            </div>
            <div>
              <label
                class="block text-xs sm:text-sm font-medium text-secondary dark:text-gray-300 mb-1"
                >Возраст</label
              >
              <input
                v-model.number="age"
                type="number"
                placeholder="Введите ваш возраст"
                class="w-full p-2 sm:p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 text-sm sm:text-base"
              />
            </div>
            <div>
              <label
                class="block text-xs sm:text-sm font-medium text-secondary dark:text-gray-300 mb-1"
                >Пол</label
              >
              <div
                class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4"
              >
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="gender"
                    value="male"
                    class="mr-2"
                  />
                  <span
                    class="text-secondary dark:text-gray-300 text-sm sm:text-base"
                    >Мужской</span
                  >
                </label>
                <label class="flex items-center">
                  <input
                    type="radio"
                    v-model="gender"
                    value="female"
                    class="mr-2"
                  />
                  <span
                    class="text-secondary dark:text-gray-300 text-sm sm:text-base"
                    >Женский</span
                  >
                </label>
              </div>
            </div>
            <div>
              <label
                class="block text-xs sm:text-sm font-medium text-secondary dark:text-gray-300 mb-1"
                >Уровень активности</label
              >
              <select
                v-model="activityLevel"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
                <option value="1.2">Сидячий образ жизни</option>
                <option value="1.375">Легкая активность</option>
                <option value="1.55">Умеренная активность</option>
                <option value="1.725">Высокая активность</option>
                <option value="1.9">Очень высокая активность</option>
              </select>
            </div>
            <button
              @click="calculateCalories"
              class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Рассчитать
            </button>
          </div>
          <div class="flex items-center justify-center">
            <div
              v-if="calories"
              class="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <h3
                class="text-lg font-medium text-secondary dark:text-gray-300 mb-2"
              >
                Ваша суточная норма калорий:
              </h3>
              <div
                class="text-4xl font-bold text-primary dark:text-white mb-2 animate-pulse"
              >
                {{ calories }}
              </div>
              <p class="text-sm text-secondary dark:text-gray-300">ккал</p>
            </div>
            <div v-else class="text-center p-6">
              <div
                class="w-32 h-32 mx-auto mb-4 text-gray-300 dark:text-gray-600"
              >
                <CalculatorIcon class="w-full h-full" />
              </div>
              <p class="text-secondary dark:text-gray-300">
                Заполните форму для расчета
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Калькулятор ИМТ -->
      <div
        class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition-all duration-300"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-primary dark:text-white">
            Калькулятор индекса массы тела (ИМТ)
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
            <div>
              <label
                class="block text-sm font-medium text-secondary dark:text-gray-300 mb-1"
                >Вес (кг)</label
              >
              <input
                v-model.number="weight"
                type="number"
                placeholder="Введите ваш вес"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium text-secondary dark:text-gray-300 mb-1"
                >Рост (см)</label
              >
              <input
                v-model.number="height"
                type="number"
                placeholder="Введите ваш рост"
                class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              />
            </div>
            <button
              @click="calculateBMI"
              class="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Рассчитать ИМТ
            </button>
          </div>
          <div class="flex items-center justify-center">
            <div
              v-if="bmi"
              class="text-center p-6 bg-gray-50 dark:bg-gray-700 rounded-lg w-full"
            >
              <h3
                class="text-lg font-medium text-secondary dark:text-gray-300 mb-2"
              >
                Ваш индекс массы тела:
              </h3>
              <div
                class="text-4xl font-bold text-primary dark:text-white mb-2 animate-pulse"
              >
                {{ bmi }}
              </div>
              <p class="text-sm text-secondary dark:text-gray-300 mb-4">
                {{ bmiCategory }}
              </p>
              <div
                class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5"
              >
                <div
                  class="h-2.5 rounded-full transition-all duration-300"
                  :class="bmiColor"
                  :style="{ width: bmiProgress + '%' }"
                ></div>
              </div>
            </div>
            <div v-else class="text-center p-6">
              <div
                class="w-32 h-32 mx-auto mb-4 text-gray-300 dark:text-gray-600"
              >
                <CalculatorIcon class="w-full h-full" />
              </div>
              <p class="text-secondary dark:text-gray-300">
                Заполните форму для расчета
              </p>
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
  ActivityIcon,
  UsersIcon,
  HeartIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalculatorIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  CalendarIcon,
  ClipboardListIcon,
  BookOpenIcon,
  StethoscopeIcon,
} from 'lucide-vue-next';
import { useAuth } from '~/composables/useAuth';

const { isAuthenticated, getToken } = useAuth();
const adminName = ref('');
const adminSurname = ref('');
const userName = ref('Пользователь');
const userRole = ref(null);

// Данные для калькулятора
const weight = ref(null);
const height = ref(null);
const age = ref(25);
const gender = ref('male');
const activityLevel = ref('1.55');
const calories = ref(null);

// ИМТ
const bmi = ref(null);
const bmiCategory = ref('');
const bmiColor = ref('');
const bmiProgress = ref(0);

// Статистика
const API_URL = 'https://igor-plaxin.ru/healthy-eat';
const stats = ref([
  {
    label: 'Активные пользователи',
    value: '2,847',
    trend: '+12%',
    trendColor: 'text-green-500',
    trendIcon: TrendingUpIcon,
    icon: UsersIcon,
    bgColor: 'bg-blue-100 dark:bg-blue-900',
    iconColor: 'text-blue-500 dark:text-blue-300',
  },
  {
    label: 'Заявки на консультацию',
    value: '156',
    trend: '+8%',
    trendColor: 'text-green-500',
    trendIcon: TrendingUpIcon,
    icon: ClipboardListIcon,
    bgColor: 'bg-purple-100 dark:bg-purple-900',
    iconColor: 'text-purple-500 dark:text-purple-300',
  },
  {
    label: 'Технологические карты',
    value: '0',
    trend: '-3%',
    trendColor: 'text-green-500',
    trendIcon: TrendingUpIcon,
    icon: BookOpenIcon,
    bgColor: 'bg-red-100 dark:bg-red-900',
    iconColor: 'text-red-500 dark:text-red-300',
  },
  {
    label: 'Врачи',
    value: '0',
    trend: '+5%',
    trendColor: 'text-green-500',
    trendIcon: TrendingUpIcon,
    icon: StethoscopeIcon,
    bgColor: 'bg-green-100 dark:bg-green-900',
    iconColor: 'text-green-500 dark:text-green-300',
  },
]);

// Текущая дата и время
const currentDate = computed(() => {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date().toLocaleDateString('ru-RU', options);
});

const currentTime = computed(() => {
  return new Date().toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

// Расчет калорий
const calculateCalories = () => {
  if (weight.value && height.value && age.value) {
    // Формула Миффлина-Сан Жеора
    let bmr;
    if (gender.value === 'male') {
      bmr = 10 * weight.value + 6.25 * height.value - 5 * age.value + 5;
    } else {
      bmr = 10 * weight.value + 6.25 * height.value - 5 * age.value - 161;
    }

    calories.value = Math.round(bmr * parseFloat(activityLevel.value));
  } else {
    calories.value = 'Заполните все поля!';
  }
};

const calculateBMI = () => {
  if (weight.value && height.value) {
    const heightInMeters = height.value / 100;
    const bmiValue = weight.value / (heightInMeters * heightInMeters);
    bmi.value = bmiValue.toFixed(1);

    // Определение категории ИМТ с учетом степеней ожирения
    if (bmiValue < 18.5) {
      bmiCategory.value = 'Недостаточный вес';
      bmiColor.value = 'bg-blue-500';
      bmiProgress.value = 25;
    } else if (bmiValue < 25) {
      bmiCategory.value = 'Нормальный вес';
      bmiColor.value = 'bg-green-500';
      bmiProgress.value = 50;
    } else if (bmiValue < 30) {
      bmiCategory.value = 'Избыточный вес';
      bmiColor.value = 'bg-yellow-500';
      bmiProgress.value = 75;
    } else if (bmiValue < 35) {
      bmiCategory.value = 'Ожирение I степени';
      bmiColor.value = 'bg-orange-500';
      bmiProgress.value = 85;
    } else if (bmiValue < 40) {
      bmiCategory.value = 'Ожирение II степени';
      bmiColor.value = 'bg-red-500';
      bmiProgress.value = 90;
    } else {
      bmiCategory.value = 'Ожирение III степени';
      bmiColor.value = 'bg-red-700';
      bmiProgress.value = 100;
    }
  } else {
    bmi.value = null;
    bmiCategory.value = '';
  }
};

const fetchTokenPayload = async () => {
  try {
    const token = getToken();
    if (!token) return;
    const res = await fetch(
      'https://igor-plaxin.ru/healthy-eat/auth/token-payload',
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    if (!res.ok) return;
    const data = await res.json();
    adminName.value = data.name || '';
    adminSurname.value = data.surname || '';
    userRole.value = data.role;
    userName.value =
      `${adminName.value} ${adminSurname.value}`.trim() || 'Пользователь';
  } catch {}
};

const fetchStats = async () => {
  try {
    const token = getToken();
    if (!token) return;

    // Получаем количество пользователей
    const usersRes = await fetch(`${API_URL}/patient`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (usersRes.ok) {
      const users = await usersRes.json();
      stats.value[0].value = users.length.toString();
    }

    // Получаем количество заявок
    const requestsRes = await fetch(`${API_URL}/request`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (requestsRes.ok) {
      const requests = await requestsRes.json();
      stats.value[1].value = requests.length.toString();
    }

    // Получаем количество технологических карт
    const processMapsRes = await fetch(`${API_URL}/process-map`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (processMapsRes.ok) {
      const processMaps = await processMapsRes.json();
      stats.value[2].value = processMaps.length.toString();
    }

    // Получаем количество врачей
    const doctorsRes = await fetch(`${API_URL}/doctor`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (doctorsRes.ok) {
      const doctors = await doctorsRes.json();
      stats.value[3].value = doctors.length.toString();
    }
  } catch (e) {
    console.error('Ошибка загрузки статистики:', e);
  }
};

onMounted(async () => {
  await Promise.all([fetchTokenPayload(), fetchStats()]);
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
