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
          'opacity-0 translate-y-2': colorMode.value === 'dark',
          'opacity-100 translate-y-0': colorMode.value === 'light',
        }"
      >
        <SunIcon class="w-5 h-5 text-yellow-500" />
      </span>
      <span
        class="absolute inset-0 flex items-center justify-center transition-all duration-500 transform"
        :class="{
          'opacity-100 translate-y-0': colorMode.value === 'dark',
          'opacity-0 -translate-y-2': colorMode.value === 'light',
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

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light';
};
</script>
