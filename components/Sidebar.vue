<template>
  <aside class="w-64 bg-white dark:bg-gray-800 shadow-sm h-screen p-4">
    <nav>
      <ul class="space-y-2">
        <li>
          <NuxtLink
            to="/dashboard"
            active-class="bg-primary text-white dark:bg-gray-700 dark:text-white"
            class="flex items-center p-2 text-secondary hover:bg-primary hover:text-white dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white rounded-lg transition-colors"
          >
            <span class="ml-2">Дашборд</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/users"
            active-class="bg-primary text-white dark:bg-gray-700 dark:text-white"
            class="flex items-center p-2 text-secondary hover:bg-primary hover:text-white dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white rounded-lg transition-colors"
          >
            <span class="ml-2">Пользователи</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/settings"
            active-class="bg-primary text-white dark:bg-gray-700 dark:text-white"
            class="flex items-center p-2 text-secondary hover:bg-primary hover:text-white dark:hover:bg-gray-700 dark:text-gray-300 dark:hover:text-white rounded-lg transition-colors"
          >
            <span class="ml-2">Настройки</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>
