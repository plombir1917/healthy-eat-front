<template>
  <div class="flex items-center justify-center">
    <div class="relative">
      <!-- Внешний круг -->
      <div class="w-12 h-12 border-4 border-primary/20 rounded-full"></div>
      <!-- Вращающийся круг -->
      <div
        class="w-12 h-12 border-4 border-primary border-t-transparent rounded-full loading-spinner absolute top-0 left-0"
      ></div>
      <!-- Точки -->
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-1"
      >
        <div
          class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
          style="animation-delay: 0s"
        ></div>
        <div
          class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
          style="animation-delay: 0.2s"
        ></div>
        <div
          class="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
          style="animation-delay: 0.4s"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  size: {
    type: String,
    default: 'md',
  },
});
</script>

<style scoped>
.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.animate-bounce {
  animation: bounce 1s infinite;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}
</style>
