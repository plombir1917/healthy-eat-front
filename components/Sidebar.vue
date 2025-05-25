<template>
  <div>
    <button
      ref="burgerButtonRef"
      class="fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-lg shadow-lg md:hidden"
      @click="sidebarOpen = !sidebarOpen"
      aria-label="Открыть меню"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
    <aside
      ref="sidebarRef"
      :class="[
        'fixed md:static top-0 left-0 h-full z-40 transition-transform duration-300',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'w-64 bg-white dark:bg-gray-800 shadow-md p-2 sm:p-4',
        'md:translate-x-0 md:w-64 md:p-4',
      ]"
    >
      <div class="mb-4 sm:mb-6 flex justify-between items-center">
        <h2
          class="hidden md:block text-base sm:text-lg font-semibold text-primary dark:text-white px-2"
        >
          Меню
        </h2>
        <div class="flex-1 md:hidden"></div>
        <button
          class="md:hidden text-gray-500"
          @click="sidebarOpen = false"
          aria-label="Закрыть меню"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <nav>
        <ul class="space-y-2 sm:space-y-1">
          <li v-for="(item, index) in menuItems" :key="index">
            <NuxtLink
              :to="item.path"
              active-class="bg-primary text-white dark:bg-gray-700 dark:text-white"
              class="flex items-center px-4 py-4 md:py-3 text-lg md:text-sm text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white rounded-lg transition-all duration-300 group"
            >
              <component
                :is="item.icon"
                class="w-7 h-7 md:w-5 md:h-5 mr-3 transition-transform group-hover:scale-110"
              />
              <span class="font-medium text-lg md:text-base">{{
                item.name
              }}</span>
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div
        class="mt-6 sm:mt-8 p-2 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
      >
        <h3
          class="text-xs sm:text-sm font-medium text-primary dark:text-white mb-2"
        >
          Статистика
        </h3>
        <div class="space-y-2">
          <div class="flex justify-between items-center">
            <span class="text-xs text-secondary dark:text-gray-300"
              >Активность</span
            >
            <div
              class="w-16 sm:w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-primary rounded-full"
                style="width: 75%"
              ></div>
            </div>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-xs text-secondary dark:text-gray-300">Цели</span>
            <div
              class="w-16 sm:w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
            >
              <div
                class="h-full bg-green-500 rounded-full"
                style="width: 60%"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import {
  HomeIcon,
  UsersIcon,
  ClipboardListIcon,
  CogIcon,
  AmbulanceIcon,
  ActivityIcon,
  BarChartIcon,
  CalendarIcon,
  HeartIcon,
  SettingsIcon,
  DropletsIcon,
  ShieldIcon,
  InfoIcon,
} from 'lucide-vue-next';

const sidebarOpen = ref(false);
const sidebarRef = ref(null);
const burgerButtonRef = ref(null);

const handleClickOutside = (event) => {
  if (
    sidebarOpen.value &&
    sidebarRef.value &&
    !sidebarRef.value.contains(event.target) &&
    !burgerButtonRef.value.contains(event.target)
  ) {
    sidebarOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

const menuItems = [
  { name: 'Главная', path: '/admin/dashboard', icon: HomeIcon },
  { name: 'Администраторы', path: '/admin/admins', icon: ShieldIcon },
  { name: 'Пациенты', path: '/admin/patient', icon: UsersIcon },
  { name: 'Врачи', path: '/admin/doctors', icon: AmbulanceIcon },
  { name: 'Характеристики', path: '/admin/characteristics', icon: InfoIcon },
  { name: 'Заболевания', path: '/admin/illness', icon: HeartIcon },
  { name: 'Диеты', path: '/admin/diet', icon: ActivityIcon },
  { name: 'Дорожные карты', path: '/admin/process-map', icon: CalendarIcon },
  { name: 'Симптомы', path: '/admin/symptom', icon: DropletsIcon },
  { name: 'Рекомендации', path: '/admin/recommendation', icon: BarChartIcon },
  { name: 'Заявки', path: '/admin/requests', icon: ClipboardListIcon },
  { name: 'Настройки', path: '/admin/settings', icon: CogIcon },
];
</script>
