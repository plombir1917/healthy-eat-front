<template>
  <button
    @click="toggleTheme"
    class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
    aria-label="Переключить тему"
  >
    <div class="relative w-6 h-6">
      <span
        class="absolute inset-0 flex items-center justify-center transition-all duration-500 transform"
        :class="{
          'opacity-0 translate-y-2': isDark,
          'opacity-100 translate-y-0': !isDark,
        }"
      >
        <SunIcon class="w-5 h-5 text-yellow-500" />
      </span>
      <span
        class="absolute inset-0 flex items-center justify-center transition-all duration-500 transform"
        :class="{
          'opacity-100 translate-y-0': isDark,
          'opacity-0 -translate-y-2': !isDark,
        }"
      >
        <MoonIcon class="w-5 h-5 text-blue-400" />
      </span>
    </div>
  </button>
</template>

<script setup>
import { SunIcon, MoonIcon } from 'lucide-vue-next';

const colorMode = useColorMode();
const isDark = ref(false);

onMounted(() => {
  isDark.value = colorMode.value === 'dark';
});

watch(
  () => colorMode.value,
  (newValue) => {
    isDark.value = newValue === 'dark';
  }
);

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light';
};
</script>
