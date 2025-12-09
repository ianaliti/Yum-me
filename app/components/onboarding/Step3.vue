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
          src="/onboarding/3.svg"
          alt="Onboarding illustration"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Title -->
      <div class="text-center space-y-2 max-w-md px-6">
        <h2 class="text-2xl font-bold text-secondary">
          Dis-nous ce que tu manges, on s'occupe du reste !
        </h2>
      </div>

      <!-- Selectable Tags -->
      <div class="flex flex-wrap gap-3 justify-center max-w-md px-6">
        <OnboardingSelectableBadge
          v-for="tag in dietTags"
          :key="tag"
          :label="tag"
          :isSelected="dietaryPreferences.includes(tag)"
          @toggle="toggleTag(tag)"
        />
      </div>
    </div>

    <!-- Spacer for fixed button at bottom -->
    <div class="pb-24" />
  </div>
</template>

<script setup lang="ts">
const { dietaryPreferences } = useOnboarding();

const dietTags = [
  "Végétarien",
  "Vegan",
  "Sans gluten",
  "Halal",
  "Sans lactose",
  "Casher",
  "Keto",
  "Sportif",
  "Allergie",
  "Autres",
];

const toggleTag = (tag: string) => {
  const index = dietaryPreferences.value.indexOf(tag);
  if (index > -1) {
    dietaryPreferences.value.splice(index, 1);
  } else {
    dietaryPreferences.value.push(tag);
  }
};
</script>
