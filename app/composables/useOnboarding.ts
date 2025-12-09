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
  const isLoadingLocation = useState<boolean>("is-loading-location", () => false);

  const steps: OnboardingStep[] = [
    {
      title: "Les meilleures adresses",
      description:
        "Yum'me vous aide à trouver facilement des restaurants, compatibles avec votre alimentation et votre style de vie.",
    },
    {
      title: "Découvrez autour de vous",
      description:
        "Explorez les meilleurs restaurants près de chez vous, adaptés à vos préférences alimentaires.",
    },
    {
      title: "Partagez vos découvertes",
      description:
        "Sauvegardez vos adresses préférées et partagez-les avec vos proches.",
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
    isLoadingLocation.value = true;

    // Simulate location loading with a nice transition
    await new Promise((resolve) => setTimeout(resolve, 2000));

    hasCompletedOnboarding.value = true;
    isLoadingLocation.value = false;
    navigateTo("/restaurants");
  };

  const goToStep = (step: number) => {
    if (step >= 0 && step < totalSteps.value) {
      currentStep.value = step;
    }
  };

  const resetOnboarding = () => {
    currentStep.value = 0;
    hasCompletedOnboarding.value = false;
  };

  return {
    currentStep,
    hasCompletedOnboarding,
    isLoadingLocation,
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
