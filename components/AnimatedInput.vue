<template>
  <div class="relative">
    <label
      v-if="label"
      :for="id"
      class="block text-secondary dark:text-gray-300 mb-2 transition-all duration-200"
      :class="{ 'text-primary': isFocused }"
    >
      {{ label }}
    </label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="isFocused = true"
        @blur="isFocused = false"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        class="w-full p-2 border rounded-lg transition-all duration-200 focus:outline-none"
        :class="[
          'border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white',
          isFocused ? 'border-primary ring-2 ring-primary/20' : '',
          error ? 'border-red-500 ring-2 ring-red-500/20' : '',
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text',
        ]"
      />
      <div
        v-if="error"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 text-red-500"
      >
        <AlertCircleIcon class="w-5 h-5" />
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-red-500">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
      {{ hint }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { AlertCircleIcon } from 'lucide-vue-next';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: '',
  },
  label: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: 'text',
  },
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
});

defineEmits(['update:modelValue']);

const isFocused = ref(false);
</script>
