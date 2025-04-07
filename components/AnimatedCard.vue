<template>
  <div
    v-motion
    :initial="{ opacity: 0, y: 100 }"
    :enter="{ opacity: 1, y: 0 }"
    :hover="{ scale: 1.02 }"
    :tap="{ scale: 0.98 }"
    class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 card-hover"
  >
    <slot></slot>
  </div>
</template>

<script setup>
defineProps({
  delay: {
    type: Number,
    default: 0,
  },
});
</script>

<style scoped>
.card-hover {
  transition: all 0.3s ease-in-out;
}

.card-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}
</style>
