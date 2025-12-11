<template>
  <div class="h-full flex flex-col w-full">
    <!-- Logo - Fixed position at top -->
    <div class="pt-10 flex justify-center shrink-0">
      <div class="w-48 sm:w-52">
        <img
          src="/logo.svg"
          alt="Yum'me logo"
          class="w-full h-auto object-contain"
          loading="eager"
        />
      </div>
    </div>

    <!-- Content - Centered in remaining space -->
    <div class="flex-1 flex flex-col items-center justify-center space-y-3">
      <!-- Main Illustration -->
      <div class="w-40 sm:w-60">
        <img
          src="/onboarding/4.svg"
          alt="Onboarding illustration"
          class="w-full h-auto object-contain max-h-[22vh]"
          loading="eager"
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
          :isSelected="specialNeeds.includes(tag)"
          @toggle="toggleTag(tag)"
        />
      </div>
    </div>

    <!-- Spacer for fixed button at bottom -->
    <div class="pb-24" />
  </div>
</template>

<script setup lang="ts">
const { specialNeeds } = useOnboarding();

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
  const index = specialNeeds.value.indexOf(tag);
  if (index > -1) {
    specialNeeds.value.splice(index, 1);
  } else {
    specialNeeds.value.push(tag);
  }
};
</script>
