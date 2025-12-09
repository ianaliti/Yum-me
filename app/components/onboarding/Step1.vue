<template>
  <div class="h-full flex flex-col w-full">
    <!-- Content - Centered vertically and horizontally -->
    <div class="flex-1 flex flex-col items-center justify-center space-y-8">
      <!-- Logo -->
      <div class="w-60">
        <img
          src="/logo.svg"
          alt="Yum'me logo"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Main Illustration -->
      <div class="w-90">
        <img
          src="/onboarding/1.svg"
          alt="Onboarding illustration"
          class="w-full h-full object-contain"
        />
      </div>

      <!-- Text -->
      <div class="text-center space-y-1 max-w-sm">
        <h1 class="text-3xl font-bold">
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
    <div class="pb-8 w-full">
      <Button size="xl" variant="secondary" class="w-full" @click="nextStep">
        Commencer
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { nextStep } = useOnboarding();
</script>
