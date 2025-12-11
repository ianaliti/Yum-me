<template>
  <div>
    <!-- Loading Screen -->
    <OnboardingLoader v-if="isLoadingLocation" :is-ready="isLoadingComplete" />

    <!-- Onboarding Content -->
    <div
      v-else
      class="h-dvh flex flex-col relative overflow-hidden"
      :style="{
        backgroundImage: 'url(/pattern-bg.svg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }"
    >
      <!-- Skip Button - Top Right (hidden on Step 1) -->
      <div v-if="currentStep > 0" class="absolute top-4 right-4 z-10">
        <Button variant="ghost" @click="handleNextStep">Passer</Button>
      </div>

      <!-- Main Content -->
      <div class="flex-1 overflow-hidden">
        <div class="h-full w-full flex flex-col px-6 max-w-2xl mx-auto">
          <!-- Dynamic Step Component with Transition -->
          <Transition
            mode="out-in"
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-4"
          >
            <component :is="currentStepComponent" :key="currentStep" />
          </Transition>
        </div>
      </div>

      <!-- Fixed Bottom Section (Step 2+) with Transition - Absolute Position -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out delay-200"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-8"
      >
        <div
          v-if="currentStep > 0"
          class="absolute bottom-0 left-0 right-0 flex flex-col gap-4 px-6 pb-3 max-w-2xl mx-auto w-full"
        >
          <!-- Step Indicator -->
          <OnboardingStepIndicator
            :current-step="currentStep"
            :total-steps="totalSteps"
            @step-click="goToStep"
          />

          <!-- Navigation Button -->
          <Button
            size="xl"
            variant="secondary"
            class="w-full"
            :disabled="isNextButtonDisabled"
            @click="handleNextStep"
          >
            {{ currentStep === 4 ? "Activer la localisation" : "Suivant" }}
          </Button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import OnboardingStep1 from "~/components/onboarding/Step1.vue";
import OnboardingStep2 from "~/components/onboarding/Step2.vue";
import OnboardingStep3 from "~/components/onboarding/Step3.vue";
import OnboardingStep4 from "~/components/onboarding/Step4.vue";
import OnboardingStep5 from "~/components/onboarding/Step5.vue";

const {
  currentStep,
  totalSteps,
  isLoadingLocation,
  isLoadingComplete,
  dietaryPreferences,
  specialNeeds,
  goToStep,
  skipOnboarding,
  nextStep,
  completeOnboarding,
} = useOnboarding();

// Disable button if on step 3 or 4 and no tags selected
const isNextButtonDisabled = computed(() => {
  if (currentStep.value === 2) {
    // Step 3 (diet preferences)
    return dietaryPreferences.value.length === 0;
  }
  if (currentStep.value === 3) {
    // Step 4 (special needs)
    return specialNeeds.value.length === 0;
  }
  return false;
});

// Map of step components
const stepComponents = [
  OnboardingStep1,
  OnboardingStep2,
  OnboardingStep3,
  OnboardingStep4,
  OnboardingStep5,
];

// Computed property to get the current step component
const currentStepComponent = computed(() => stepComponents[currentStep.value]);

// Handle next step with geolocation check
const handleNextStep = async () => {
  // Step 4 (index 3) - Check if we need to show geolocation step
  if (currentStep.value === 3) {
    // Note: On ne vérifie plus navigator.permissions.query car Safari a des bugs
    // On affiche toujours Step 5 pour demander la localisation proprement
    nextStep();
    return;
  }

  // Step 5 (index 4) - Activer la localisation
  if (currentStep.value === 4) {
    // IMPORTANT: On appelle completeOnboarding() directement ici
    // Cela déclenche la géolocalisation immédiatement au click du bouton
    // C'est crucial pour iOS/Safari qui requiert un user gesture
    await completeOnboarding();
    return;
  }

  // Go to next step
  nextStep();
};
</script>
