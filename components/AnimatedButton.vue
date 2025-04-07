<template>
  <button
    v-motion
    :initial="{ opacity: 0, scale: 0.9 }"
    :enter="{ opacity: 1, scale: 1 }"
    :hover="{ scale: 1.05 }"
    :tap="{ scale: 0.95 }"
    :class="[
      'px-4 py-2 rounded-lg font-medium transition-all duration-200',
      variant === 'primary' ? 'bg-primary text-white hover:bg-primary/90' : '',
      variant === 'secondary'
        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
        : '',
      variant === 'outline'
        ? 'border-2 border-primary text-primary hover:bg-primary/10'
        : '',
      disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
      className,
    ]"
    :disabled="disabled || isLoading"
    @click="$emit('click')"
  >
    <div class="flex items-center justify-center gap-2">
      <LoadingSpinner v-if="isLoading" />
      <slot v-else></slot>
    </div>
  </button>
</template>

<script setup>
defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'outline'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  className: {
    type: String,
    default: '',
  },
});

defineEmits(['click']);
</script>
