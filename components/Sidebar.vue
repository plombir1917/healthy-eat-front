<template>
  <aside
    class="w-64 bg-white dark:bg-gray-800 shadow-md h-screen p-4 transition-all duration-300"
  >
    <div class="mb-6">
      <h2 class="text-lg font-semibold text-primary dark:text-white px-2">
        Меню
      </h2>
    </div>
    <nav>
      <ul class="space-y-1">
        <li v-for="(item, index) in menuItems" :key="index">
          <NuxtLink
            :to="item.path"
            active-class="bg-primary text-white dark:bg-gray-700 dark:text-white"
            class="flex items-center p-3 text-secondary hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white rounded-lg transition-all duration-300 group"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 mr-3 transition-transform group-hover:scale-110"
            />
            <span class="font-medium">{{ item.name }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h3 class="text-sm font-medium text-primary dark:text-white mb-2">
        Статистика
      </h3>
      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <span class="text-xs text-secondary dark:text-gray-300"
            >Активность</span
          >
          <div
            class="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
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
            class="w-24 h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden"
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
</template>

<script setup>
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
} from 'lucide-vue-next';

const menuItems = [
  { name: 'Дашборд', path: '/admin/dashboard', icon: HomeIcon },
  { name: 'Пользователи', path: '/admin/users', icon: UsersIcon },
  { name: 'Заявки', path: '/admin/requests', icon: ClipboardListIcon },
  { name: 'Врачи', path: '/admin/doctors', icon: AmbulanceIcon },
  { name: 'Активность', path: '/admin/activity', icon: ActivityIcon },
  { name: 'Статистика', path: '/admin/statistics', icon: BarChartIcon },
  { name: 'Календарь', path: '/admin/calendar', icon: CalendarIcon },
  { name: 'Здоровье', path: '/admin/health', icon: HeartIcon },
  { name: 'Настройки', path: '/admin/settings', icon: SettingsIcon },
];
</script>
