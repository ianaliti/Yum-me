<template>
  <button
    @click="$emit('toggle')"
    :class="[
      'px-4 py-3 rounded-full text-sm font-medium transition-all duration-200',
      isSelected
        ? 'bg-primary text-secondary scale-105'
        : 'bg-secondary/10 text-foreground hover:bg-secondary/20',
    ]"
  >
    {{ label }}
  </button>
</template>

<script setup lang="ts">
defineProps<{
  label: string;
  isSelected: boolean;
}>();

defineEmits<{
  toggle: [];
}>();
</script>
