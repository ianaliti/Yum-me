<template>
  <div
    class="min-h-screen bg-background flex flex-col items-center justify-center px-6"
  >
    <div class="flex flex-col items-center gap-6">
      <!-- Animated location icon -->
      <div class="relative">
        <!-- Pulsing circles (only when loading) -->
        <template v-if="!isReady">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-32 h-32 rounded-full bg-primary/20 animate-ping" />
          </div>
          <div
            class="absolute inset-0 flex items-center justify-center animation-delay-150"
          >
            <div class="w-24 h-24 rounded-full bg-primary/30 animate-ping" />
          </div>
        </template>

        <!-- Location pin icon -->
        <div
          class="relative w-20 h-20 flex items-center justify-center bg-primary rounded-full shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="text-primary-foreground"
            :class="isReady ? '' : 'animate-bounce'"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
      </div>

      <!-- Text content container with fixed height -->
      <div class="min-h-40 flex flex-col items-center">
        <Transition name="fade" mode="out-in">
          <!-- Loading state -->
          <div v-if="!isReady" key="loading" class="text-center space-y-1">
            <h2 class="text-2xl font-bold text-foreground">Chargement...</h2>
            <p class="text-foreground/60">Nous préparons votre expérience</p>

            <!-- Loading dots -->
            <div class="flex space-x-2 justify-center mt-6">
              <div class="w-3 h-3 bg-primary rounded-full animate-bounce" />
              <div
                class="w-3 h-3 bg-primary rounded-full animate-bounce animation-delay-100"
              />
              <div
                class="w-3 h-3 bg-primary rounded-full animate-bounce animation-delay-200"
              />
            </div>
          </div>

          <!-- Ready state -->
          <div v-else key="ready" class="text-center space-y-1">
            <h2 class="text-2xl font-bold text-foreground">
              Tout est prêt ! 🎉
            </h2>
            <p class="text-foreground/60">
              Découvrez les restaurants autour de vous
            </p>

            <!-- CTA Button -->
            <Button size="lg" class="mt-8" @click="navigateTo('/accueil')">
              Accéder à Yum'me
            </Button>
          </div>
        </Transition>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  isReady?: boolean;
}>();
</script>

<style scoped>
.animation-delay-100 {
  animation-delay: 0.1s;
}

.animation-delay-150 {
  animation-delay: 0.15s;
}

.animation-delay-200 {
  animation-delay: 0.2s;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
