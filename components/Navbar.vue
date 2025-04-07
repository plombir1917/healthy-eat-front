<template>
  <header
    class="bg-white dark:bg-gray-800 shadow-md transition-all duration-300"
  >
    <div class="container mx-auto py-4 px-4">
      <div class="flex items-center justify-between">
        <!-- Логотип -->
        <NuxtLink
          to="/admin"
          class="flex items-center space-x-2 group transition-transform hover:scale-105"
        >
          <img
            src="~/assets/images/logo.png"
            alt="Логотип"
            class="h-10 w-auto transition-transform group-hover:rotate-12"
          />
          <span
            class="text-xl font-bold text-primary dark:text-white transition-colors"
          >
            Zдоровье
          </span>
        </NuxtLink>

        <!-- Уведомления, смена темы и профиль -->
        <div class="flex items-center space-x-6">
          <button
            @click="showNotifications"
            class="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Уведомления"
          >
            <BellIcon class="w-6 h-6 text-secondary dark:text-gray-300" />
            <span
              v-if="unreadNotifications > 0"
              class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse"
            >
              {{ unreadNotifications }}
            </span>
          </button>

          <ThemeToggle />

          <div class="relative group">
            <button
              @click="toggleProfileMenu"
              class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label="Профиль"
            >
              <img
                :src="userAvatar"
                alt="Аватар пользователя"
                class="w-8 h-8 rounded-full border-2 border-primary"
              />
              <span
                class="text-secondary dark:text-gray-300 hidden md:inline-block"
                >{{ userName }}</span
              >
              <ChevronDownIcon
                class="w-4 h-4 text-secondary dark:text-gray-300 transition-transform"
                :class="{ 'rotate-180': isProfileMenuOpen }"
              />
            </button>

            <!-- Выпадающее меню профиля -->
            <div
              v-if="isProfileMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700"
            >
              <NuxtLink
                to="/admin/profile"
                class="block px-4 py-2 text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                @click="isProfileMenuOpen = false"
              >
                Профиль
              </NuxtLink>
              <NuxtLink
                to="/admin/settings"
                class="block px-4 py-2 text-secondary dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                @click="isProfileMenuOpen = false"
              >
                Настройки
              </NuxtLink>
              <div
                class="border-t border-gray-200 dark:border-gray-700 my-1"
              ></div>
              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { BellIcon, ChevronDownIcon } from 'lucide-vue-next';
import ThemeToggle from '~/components/ThemeToggle.vue';
import { useAuth } from '../composables/useAuth';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();
const { removeToken, isAuthenticated } = useAuth();

const unreadNotifications = ref(3);
const isProfileMenuOpen = ref(false);
const userName = ref('Пользователь');
const userAvatar = ref(
  'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff'
);

// Закрытие меню при клике вне его
const closeProfileMenu = (e) => {
  if (isProfileMenuOpen.value && !e.target.closest('.group')) {
    isProfileMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', closeProfileMenu);

  // Загрузка данных пользователя
  if (isAuthenticated()) {
    // В реальном приложении здесь будет запрос к API
    userName.value = 'Иван Иванов';
    userAvatar.value =
      'https://ui-avatars.com/api/?name=Иван+Иванов&background=3b82f6&color=fff';
  }
});

onUnmounted(() => {
  document.removeEventListener('click', closeProfileMenu);
});

const toggleProfileMenu = () => {
  isProfileMenuOpen.value = !isProfileMenuOpen.value;
};

const showNotifications = () => {
  toast.info('У вас 3 новых уведомления!');
  unreadNotifications.value = 0;
};

const handleLogout = () => {
  removeToken();
  toast.success('Вы успешно вышли из системы');
  router.push('/login');
};
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>
