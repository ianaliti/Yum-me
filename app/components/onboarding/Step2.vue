<template>
  <div class="h-full flex flex-col w-full">
    <!-- Logo - Fixed position at top -->
    <div class="pt-10 flex justify-center shrink-0">
      <div class="w-48 sm:w-52">
        <img
          :src="logoSrc"
          alt="Yum'me logo"
          class="w-full h-auto object-contain"
        />
      </div>
    </div>

    <!-- Content - Centered in remaining space -->
    <div class="flex-1 flex flex-col items-center justify-center space-y-4">
      <!-- Main Illustration -->
      <div class="w-40 sm:w-60 min-h-[180px] flex items-center justify-center">
        <img
          :src="step2Src"
          alt="Onboarding illustration"
          class="w-full h-auto object-contain max-h-[25vh]"
        />
      </div>

      <!-- Title and Description with Badges around -->
      <div class="relative text-center space-y-1 max-w-md px-6 py-12 mt-8">
        <!-- Top Left Badge -->
        <div class="absolute -top-2 left-2 -rotate-6 animate-float-1">
          <OnboardingFeatureBadge
            label="Recherche"
            icon="search"
            variant="primary"
          />
        </div>

        <!-- Top Right Badge -->
        <div class="absolute -top-2 right-4 rotate-6 animate-float-2">
          <OnboardingFeatureBadge
            label="Carte interactive"
            icon="map"
            variant="secondary"
          />
        </div>

        <!-- Title and Description -->
        <h2 class="text-2xl font-bold text-secondary">
          Marre de chercher un restaurant ?
        </h2>
        <p class="text-sm text-foreground/70 leading-relaxed">
          Qui respecte tes habitudes alimentaires ? Yum'me le trouve pour toi.
          Simplement.
        </p>

        <!-- Bottom Left Badge -->
        <div class="absolute -bottom-2 left-2 rotate-3 animate-float-3">
          <OnboardingFeatureBadge
            label="Filtres alimentaires"
            icon="filter"
            variant="secondary"
          />
        </div>

        <!-- Bottom Right Badge -->
        <div class="absolute -bottom-2 right-2 -rotate-3 animate-float-4">
          <OnboardingFeatureBadge
            label="Recommandations"
            icon="star"
            variant="primary"
          />
        </div>
      </div>
    </div>

    <!-- Spacer for fixed button at bottom (managed by index.vue) -->
    <div class="pb-24" />
  </div>
</template>

<script setup lang="ts">
import logoSrc from '~/assets/images/logo.svg';
import step2Src from '~/assets/images/onboarding/2.svg';
</script>

<style scoped>
/* Animation 1 - Float up/down with slight scale */
@keyframes float-1 {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-7px) scale(1.03);
  }
}

/* Animation 2 - Float up/down slower */
@keyframes float-2 {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-6px) scale(1.02);
  }
}

/* Animation 3 - Float with slight rotation */
@keyframes float-3 {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-7px) scale(1.04);
  }
}

/* Animation 4 - Float gentle */
@keyframes float-4 {
  0%,
  100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-5px) scale(1.025);
  }
}

.animate-float-1 {
  animation: float-1 3s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-2 3.5s ease-in-out infinite 0.5s;
}

.animate-float-3 {
  animation: float-3 2.8s ease-in-out infinite 1s;
}

.animate-float-4 {
  animation: float-4 3.2s ease-in-out infinite 1.5s;
}
</style>
