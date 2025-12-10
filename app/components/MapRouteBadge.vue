<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-x-4"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-4"
  >
    <div v-if="visible" class="flex flex-col gap-2">
      <!-- Tag Distance -->
      <div
        class="bg-white shadow-lg rounded-full px-3 py-1.5 flex items-center gap-2 border border-border"
      >
        <component :is="NavigationIcon" class="w-3.5 h-3.5 text-primary" />
        <span class="text-sm font-medium text-foreground">
          {{ distance }}
        </span>
      </div>

      <!-- Tag Durée -->
      <div
        class="bg-white shadow-lg rounded-full px-3 py-1.5 flex items-center gap-2 border border-border"
      >
        <component :is="ClockIcon" class="w-3.5 h-3.5 text-primary" />
        <span class="text-sm font-medium text-foreground">
          {{ duration }}
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Navigation as NavigationIcon, Clock as ClockIcon } from "lucide-vue-next";

interface Props {
  distance: string;
  duration: string;
  visible: boolean;
}

defineProps<Props>();
</script>
