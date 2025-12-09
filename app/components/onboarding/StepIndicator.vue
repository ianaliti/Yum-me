<template>
  <div class="flex items-center justify-center gap-2">
    <button
      v-for="index in totalSteps"
      :key="index"
      type="button"
      :class="[
        'h-2 rounded-full transition-all duration-300 cursor-pointer hover:scale-110',
        index - 1 === currentStep
          ? 'w-8 bg-primary'
          : 'w-2 bg-primary/30 hover:bg-primary/50'
      ]"
      :aria-label="`Aller à l'étape ${index}`"
      @click="emit('step-click', index - 1)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentStep: number;
  totalSteps: number;
}

interface Emits {
  (e: 'step-click', step: number): void;
}

defineProps<Props>();
const emit = defineEmits<Emits>();
</script>
