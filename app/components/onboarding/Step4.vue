<template>
  <div class="h-full flex flex-col w-full">
    <!-- Content - Centered vertically -->
    <div class="flex-1 flex flex-col items-center justify-center space-y-6">
      <!-- Logo -->
      <div class="w-28">
        <img
          src="/logo.svg"
          alt="Yum'me logo"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Main Illustration -->
      <div class="w-68">
        <img
          src="/onboarding/4.svg"
          alt="Onboarding illustration"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Title -->
      <div class="text-center space-y-2 max-w-md px-6">
        <h2 class="text-2xl font-bold text-secondary">
          Dites-nous en plus sur vos besoins particuliers
        </h2>
      </div>

      <!-- Selectable Tags -->
      <div class="flex flex-wrap gap-3 justify-center max-w-md px-6">
        <OnboardingSelectableBadge
          v-for="tag in specialNeedsTags"
          :key="tag"
          :label="tag"
          :isSelected="selectedTags.includes(tag)"
          @toggle="toggleTag(tag)"
        />
      </div>
    </div>

    <!-- Spacer for fixed button at bottom -->
    <div class="pb-24" />
  </div>
</template>

<script setup lang="ts">
const selectedTags = ref<string[]>([]);

const specialNeedsTags = [
  "Poussettes",
  "Handicaps visuels",
  "Bruit",
  "Famille",

  "Lumière",
  "Anxiété",
  "Auditifs",

  "Autres",
];

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};
</script>
