<template>
  <div class="w-full px-4">
    <div
      class="bg-white rounded-full shadow-lg border border-border flex items-center gap-3 px-4 py-3 transition-all"
    >
      <!-- Search Icon -->
      <Search class="w-5 h-5 text-muted-foreground flex-shrink-0" />

      <!-- Input -->
      <input
        ref="inputRef"
        v-model="searchQuery"
        type="text"
        :placeholder="placeholder"
        :autofocus="autofocus"
        class="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
        @focus="handleFocus"
        @blur="handleBlur"
        @input="handleInput"
        @keydown.enter="handleSubmit"
      />

      <!-- Filter Icons -->
      <div class="flex items-center gap-2 flex-shrink-0">
        <button
          v-if="showFilters"
          class="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          @click="handleFilterClick"
        >
          <SlidersHorizontal class="w-5 h-5 text-muted-foreground" />
        </button>

        <button
          v-if="showSettings"
          class="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          @click="handleSettingsClick"
        >
          <Settings class="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Search, SlidersHorizontal, Settings } from "lucide-vue-next";

interface Props {
  placeholder?: string;
  showFilters?: boolean;
  showSettings?: boolean;
  modelValue?: string;
  autofocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "Rechercher un plat, restaurant, etc.",
  showFilters: true,
  showSettings: false,
  modelValue: "",
  autofocus: false,
});

const inputRef = ref<HTMLInputElement | null>(null);

const emit = defineEmits<{
  "update:modelValue": [value: string];
  focus: [];
  blur: [];
  filter: [];
  settings: [];
  submit: [query: string];
}>();

const searchQuery = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const handleFocus = () => {
  emit("focus");
};

const handleBlur = () => {
  emit("blur");
};

const handleInput = () => {
  // Emit se fait automatiquement via le v-model
};

const handleFilterClick = () => {
  emit("filter");
};

const handleSettingsClick = () => {
  emit("settings");
};

const handleSubmit = () => {
  if (searchQuery.value.trim()) {
    emit("submit", searchQuery.value.trim());
  }
};
</script>
