<template>
  <Transition
    enter-active-class="transition-all duration-200 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-150 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="visible && (results.length > 0 || loading)"
      class="w-full px-4 mt-2 relative z-2"
    >
      <div
        class="bg-white rounded-2xl shadow-xl border border-border overflow-hidden max-h-96 overflow-y-auto"
      >
        <!-- Loading State -->
        <div v-if="loading" class="p-4 text-center">
          <div
            class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-primary border-t-transparent"
          ></div>
          <p class="mt-2 text-sm text-muted-foreground">
            Recherche en cours...
          </p>
        </div>

        <!-- Results -->
        <div v-else class="divide-y divide-border">
          <button
            v-for="result in results"
            :key="result.id"
            class="w-full p-4 hover:bg-muted/50 transition-colors text-left flex items-start gap-3"
            @click="handleResultClick(result)"
          >
            <!-- Restaurant Image -->
            <div
              class="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-muted"
            >
              <img
                :src="result.image"
                :alt="result.name"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- Restaurant Info -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between gap-2">
                <h3 class="font-semibold text-sm text-foreground truncate">
                  {{ result.name }}
                </h3>
                <div class="flex items-center gap-1 flex-shrink-0">
                  <Star class="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span class="text-xs font-medium text-foreground">{{
                    result.rating
                  }}</span>
                </div>
              </div>

              <p class="text-xs text-muted-foreground mt-0.5">
                {{ result.cuisine }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { Star } from "lucide-vue-next";
import type { Restaurant } from "~/types/restaurant";

interface SearchResult extends Restaurant {
  matchingSpecialties?: string[];
}

interface Props {
  visible: boolean;
  results: SearchResult[];
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
});

const emit = defineEmits<{
  select: [restaurant: SearchResult];
}>();

const handleResultClick = (result: SearchResult) => {
  emit("select", result);
};
</script>
