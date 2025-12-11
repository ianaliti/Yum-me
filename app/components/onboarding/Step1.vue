<template>
  <div class="h-full w-full relative flex flex-col">
    <!-- Logo - Fixed position at top -->
    <div class="pt-6 flex justify-center flex-shrink-0">
      <div class="w-48 sm:w-52">
        <img
          :src="logoSrc"
          alt="Yum'me logo"
          class="w-full h-auto object-contain"
        />
      </div>
    </div>

    <!-- Content - Centered in remaining space -->
    <div class="flex-1 flex items-center justify-center pb-20">
      <div class="flex flex-col items-center gap-4 w-full">
        <!-- Main Illustration -->
        <div class="w-80 sm:w-92 min-h-[200px] flex items-center justify-center">
          <img
            :src="step1Src"
            alt="Onboarding illustration"
            class="w-full h-auto object-contain max-h-[30vh]"
          />
        </div>

        <!-- Text with padding-top -->
        <div class="text-center space-y-2 max-w-sm pt-6">
          <h1 class="text-3xl sm:text-3xl font-bold">
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
    </div>

    <!-- Button - Absolute at bottom -->
    <div class="absolute bottom-0 left-0 right-0 pb-3">
      <Button size="xl" variant="secondary" class="w-full" @click="nextStep">
        Commencer
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import logoSrc from '~/assets/images/logo.svg';
import step1Src from '~/assets/images/onboarding/1.svg';

const { nextStep } = useOnboarding();
</script>
