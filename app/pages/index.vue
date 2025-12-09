<template>
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
    class="min-h-screen bg-background flex flex-col"
  >
    <!-- Skip Button - Top Right -->
    <div class="absolute top-6 right-6 z-10">
      <Button
        variant="ghost"
        size="sm"
        class="text-foreground/60 hover:text-foreground"
        @click="skipOnboarding"
      >
        Passé
      </Button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col items-center justify-between px-6 py-12 max-w-2xl mx-auto w-full">
      <!-- Logo and Content -->
      <div class="flex flex-col items-center justify-center flex-1 space-y-12">
        <!-- Logo -->
        <div class="w-64 h-32 flex items-center justify-center">
          <img
            src="/logo.svg"
            alt="Yum'me logo"
            class="w-full h-full object-contain"
          >
        </div>

        <!-- Title and Description with transition -->
        <div class="min-h-[16rem] flex items-center justify-center">
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
              class="text-center space-y-6 px-4"
            >
              <h1 class="text-4xl font-bold">
                <span class="inline-block">
                  <span class="text-foreground">
                    {{ currentStepData.title.split(' ')[0] }}
                  </span>
                  {{ ' ' }}
                  <span class="text-accent">
                    {{ currentStepData.title.split(' ').slice(1).join(' ') }}
                  </span>
                </span>
              </h1>
              <p class="text-lg text-foreground/70 leading-relaxed max-w-md mx-auto">
                {{ currentStepData.description }}
              </p>
            </div>
          </Transition>
        </div>
      </div>

      <!-- Bottom Section: Indicators and Next Button -->
      <div class="w-full space-y-8">
        <!-- Step Indicators -->
        <OnboardingStepIndicator
          :current-step="currentStep"
          :total-steps="totalSteps"
          @step-click="goToStep"
        />

        <!-- Next Button -->
        <div class="flex justify-end">
          <Button
            size="lg"
            class="bg-primary text-primary-foreground hover:bg-primary/90 px-12"
            @click="nextStep"
          >
            <span class="text-base font-medium">Suivant</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M5 12h14" />
              <path d="m12 5 7 7-7 7" />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
<<<<<<< HEAD

const { mapReady, mapOptions, getUserPosition, activateGeolocateControl } =
  useGeolocation();

// Simulation de restaurants depuis une base de données
const restaurants = ref([
  {
    id: 1,
    name: "Restaurant Annecy",
    coordinates: [6.1294, 45.8992],
    color: "#ef4444",
  },
  {
    id: 2,
    name: "Restaurant Poissy",
    coordinates: [2.0494, 48.9283],
    color: "#3b82f6",
  },
]);

onMounted(() => {
  getUserPosition();
});

useHead({
  title: "Yum-me",
  meta: [
    { name: "description", content: "Découvrez les meilleurs restaurants" },
  ],
});
=======
const {
  currentStep,
  totalSteps,
  currentStepData,
  isLoadingLocation,
  nextStep,
  goToStep,
  skipOnboarding,
} = useOnboarding();
>>>>>>> 5c0c87a (Fonctionnalité : Introduction d’un parcours d’intégration avec chargement de la localisation et indicateurs d’étape, transformation de la page d’accueil et ajout d’un nouveau logo.)
</script>

