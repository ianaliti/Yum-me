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
    <div class="flex-1 flex flex-col items-center justify-center space-y-4">
      <!-- Main Illustration -->
      <div class="w-60 sm:w-60">
        <img
          src="/onboarding/5.svg"
          alt="Onboarding illustration"
          class="w-full h-auto object-contain max-h-[22vh]"
          loading="eager"
        />
      </div>

      <!-- Title -->
      <div class="text-center space-y-2 max-w-md px-6">
        <h2 class="text-xl font-bold leading-relaxed">
          <span class="text-secondary"
            >Pour te proposer les restaurants les plus proches,</span
          >
          <span class="text-primary"> Yum'me </span>
          <span class="text-secondary">a besoin d'accéder à</span>
          <span class="text-primary"> ta position.</span>
        </h2>
      </div>
    </div>

    <!-- Spacer for fixed button at bottom -->
    <div class="pb-24" />
  </div>
</template>

<script setup lang="ts">
// Pas de logique - la vérification de permission se fait dans index.vue avant d'arriver ici
</script>
