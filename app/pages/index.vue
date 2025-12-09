<template>
  <div>
    <!-- Loading Screen -->
    <Transition
      enter-active-class="transition-opacity duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-500"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <OnboardingLocationLoader v-if="isLoadingLocation" />
    </Transition>

    <!-- Onboarding Content -->
    <div
      v-if="!isLoadingLocation"
      class="min-h-screen flex flex-col relative"
      :style="
        currentStep === 0
          ? {
              backgroundImage: 'url(/pattern-bg.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }
          : { backgroundColor: 'var(--background)' }
      "
    >
    <!-- Skip Button - Top Right -->
    <div class="absolute top-6 right-6 z-10">
      <Button variant="ghost" size="sm" @click="skipOnboarding">
        Passer
      </Button>
    </div>

    <!-- Next Button - Bottom Right -->
    <div class="absolute bottom-6 right-6 z-10">
      <Button @click="nextStep">
        <span class="text-base font-medium">{{
          currentStep === 0 ? "Commencer" : "Suivant"
        }}</span>
      </Button>
    </div>

    <!-- Main Content -->
    <div
      class="flex-1 flex flex-col items-center justify-center px-6 max-w-2xl mx-auto w-full"
    >
      <div class="flex flex-col items-center w-full space-y-4">
        <!-- Mascotte -->
        <div class="relative left-8 h-64">
          <img
            src="/mascotte.svg"
            alt="Yum'me mascotte"
            class="w-full h-full object-contain"
          />
        </div>

        <!-- Brand Name -->
        <h2 class="text-5xl font-bold text-accent">Yum'me</h2>

        <!-- Title and Description with transition -->
        <div class="pt-6 pb-4">
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <div
              v-if="currentStepData"
              :key="currentStep"
              class="text-center space-y-3 px-4"
            >
              <h1 class="text-3xl font-bold">
                <span class="text-secondary">{{
                  currentStepData.title.split(" ").slice(0, 2).join(" ")
                }}</span>
                {{ " " }}
                <span class="text-primary">{{
                  currentStepData.title.split(" ").slice(2).join(" ")
                }}</span>
              </h1>
              <p
                class="text-sm text-foreground/70 leading-relaxed max-w-md mx-auto"
              >
                {{ currentStepData.description }}
              </p>
            </div>
          </Transition>
        </div>

        <!-- Step Indicators -->
        <OnboardingStepIndicator
          :current-step="currentStep"
          :total-steps="totalSteps"
          @step-click="goToStep"
        />
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
const {
  currentStep,
  totalSteps,
  currentStepData,
  isLoadingLocation,
  nextStep,
  goToStep,
  skipOnboarding,
} = useOnboarding();
</script>
