<template>
  <div class="h-full flex flex-col w-full overflow-hidden">
    <!-- Content - Centered vertically and horizontally -->
    <div class="flex-1 flex flex-col items-center justify-center space-y-4 sm:space-y-8 py-4">
      <!-- Logo -->
      <div class="w-40 sm:w-52 md:w-60 max-h-[15vh]">
        <img
          src="/logo.svg"
          alt="Yum'me logo"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Main Illustration -->
      <div class="w-64 sm:w-80 md:w-90 max-h-[35vh]">
        <img
          src="/onboarding/1.svg"
          alt="Onboarding illustration"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Text -->
      <div class="text-center space-y-1 max-w-sm px-4">
        <h1 class="text-2xl sm:text-3xl font-bold">
          <span class="text-secondary">Bienvenue sur</span>
          {{ " " }}
          <span class="text-primary">Yum'me !</span>
        </h1>
        <p class="text-sm text-foreground/70 leading-relaxed">
          L'app qui trouve instantanément les restaurants adaptés à ton
          alimentation.
        </p>
      </div>
    </div>

    <!-- Button fixed at bottom -->
    <div class="pb-6 sm:pb-8 w-full px-4 sm:px-0">
      <Button size="xl" variant="secondary" class="w-full" @click="nextStep">
        Commencer
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { nextStep } = useOnboarding();
</script>
