export interface OnboardingStep {
  title: string;
  description: string;
}

export const useOnboarding = () => {
  const currentStep = useState<number>("onboarding-step", () => 0);
  const hasCompletedOnboarding = useState<boolean>(
    "onboarding-completed",
    () => false
  );
  const isLoadingLocation = useState<boolean>(
    "is-loading-location",
    () => false
  );
  const isLoadingComplete = useState<boolean>(
    "is-loading-complete",
    () => false
  );
  const dietaryPreferences = useState<string[]>(
    "dietary-preferences",
    () => []
  );
  const specialNeeds = useState<string[]>("special-needs", () => []);

  const steps: OnboardingStep[] = [
    {
      title: "Bienvenue sur Yum'me !",
      description:
        "L’app qui permet de manger ensemble sans compromis, partout et pour tous.",
    },
    {
      title: "Marre de chercher un restaurant ?",
      description:
        "Qui respecte tes besoins spécifiques ?  Yum’me le trouve pour toi. Simplement.",
    },
    {
      title: "Dis-nous ce que tu manges, on s'occupe du reste !",
      description: "",
    },
    {
      title: "Dites-nous en plus sur tes besoins particuliers",
      description: "",
    },
    {
      title:
        "Pour te proposer les restaurants les plus proches, Yum'me a besoin d'accéder à ta position.",
      description: "",
    },
  ];

  const totalSteps = computed(() => steps.length);
  const isFirstStep = computed(() => currentStep.value === 0);
  const isLastStep = computed(() => currentStep.value === totalSteps.value - 1);
  const currentStepData = computed(() => steps[currentStep.value]);

  const nextStep = () => {
    if (!isLastStep.value) {
      currentStep.value++;
    } else {
      completeOnboarding();
    }
  };

  const previousStep = () => {
    if (!isFirstStep.value) {
      currentStep.value--;
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    const debugStore = useGeolocationDebugStore();

    debugStore.info('🚀 Début completeOnboarding (click bouton Step 5)');

    isLoadingLocation.value = true;
    isLoadingComplete.value = false;

    const startTime = Date.now();
    const MIN_LOADING_TIME = 2000; // 2 secondes minimum

    // Précharger les données en parallèle
    const geolocationStore = useGeolocationStore();
    const restaurantStore = useRestaurantStore();

    try {
      // IMPORTANT: Sur iOS/Safari, getUserPosition() DOIT être appelé directement
      // depuis un event handler de click, pas dans une Promise.all()
      // On appelle donc getUserPosition() de manière synchrone ici
      debugStore.info('📞 Appel getUserPosition(true) DEPUIS click handler');

      const geolocationPromise = geolocationStore.getUserPosition(true);
      const restaurantsPromise = restaurantStore.fetchRestaurants();

      // Attendre les deux en parallèle
      debugStore.info('⏳ Attente résultats...');
      const [geoResult] = await Promise.all([
        geolocationPromise,
        restaurantsPromise,
      ]);

      debugStore.info('📊 Résultat géolocalisation', geoResult);

      // Attendre au minimum 2 secondes depuis le début
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);

      if (remainingTime > 0) {
        await new Promise((resolve) => setTimeout(resolve, remainingTime));
      }

      // Si la géolocalisation a échoué, on continue quand même avec Annecy par défaut
      if (!geoResult.success) {
        if (geoResult.error === 'permission_denied') {
          debugStore.warning('⚠️ Permission refusée → Utilisation position par défaut (Annecy)');
        } else {
          debugStore.warning(`⚠️ Erreur géoloc (${geoResult.error}) → Position par défaut`);
        }
      } else {
        debugStore.success('✅ Onboarding terminé avec succès !');
      }
    } catch (error) {
      debugStore.error('❌ Erreur dans completeOnboarding', error);
      console.error("Error preloading data:", error);
    }

    hasCompletedOnboarding.value = true;
    isLoadingComplete.value = true;
    // On ne navigue plus automatiquement - l'utilisateur clique sur le bouton
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps.value) {
      currentStep.value = step;
    }
  };

  const resetOnboarding = () => {
    currentStep.value = 0;
    hasCompletedOnboarding.value = false;
    isLoadingLocation.value = false;
    isLoadingComplete.value = false;
  };

  return {
    currentStep,
    hasCompletedOnboarding,
    isLoadingLocation,
    isLoadingComplete,
    dietaryPreferences,
    specialNeeds,
    steps,
    totalSteps,
    isFirstStep,
    isLastStep,
    currentStepData,
    nextStep,
    previousStep,
    goToStep,
    skipOnboarding,
    completeOnboarding,
    resetOnboarding,
  };
};
