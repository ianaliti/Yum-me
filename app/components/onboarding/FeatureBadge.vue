<template>
  <div
    class="inline-flex items-center gap-2 px-4 py-2 rounded-full font-light text-xs transition-colors"
    :class="[
      variant === 'primary'
        ? 'bg-primary text-primary-foreground'
        : 'bg-secondary text-secondary-foreground',
    ]"
  >
    <component :is="iconComponent" v-if="icon" class="w-4 h-4" />
    <span>{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
import { Search, MapPin, SlidersHorizontal, Star } from "lucide-vue-next";

interface Props {
  label: string;
  icon?: "search" | "map" | "filter" | "star";
  variant?: "primary" | "secondary";
}

const props = withDefaults(defineProps<Props>(), {
  variant: "primary",
});

const iconMap = {
  search: Search,
  map: MapPin,
  filter: SlidersHorizontal,
  star: Star,
};

const iconComponent = computed(() => (props.icon ? iconMap[props.icon] : null));
</script>
