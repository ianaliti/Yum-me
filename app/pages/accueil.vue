<template>
  <div class="flex flex-col h-screen w-full bg-background">
    <main class="flex-1 flex items-center justify-center px-6">
      <div class="text-center space-y-8 max-w-2xl">
        <!-- Mascotte -->
        <div class="relative left-8 h-64 mx-auto w-64">
          <img
            src="/mascotte.svg"
            alt="Yum'me mascotte"
            class="w-full h-full object-contain"
          />
        </div>

        <!-- Titre -->
        <h1 class="text-4xl font-bold">
          <span class="text-secondary">Bienvenue sur</span>
          {{ " " }}
          <span class="text-primary">Yum'me !</span>
        </h1>

        <!-- Description -->
        <p class="text-lg text-foreground/70 leading-relaxed">
          Découvrez les meilleurs restaurants adaptés à votre alimentation et votre style de vie.
        </p>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center pt-8">
          <Button
            size="lg"
            class="bg-primary text-primary-foreground hover:bg-primary/90"
            @click="navigateTo('/restaurants')"
          >
            Voir la carte
          </Button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "app",
});

useHead({
  title: "Accueil - Yum'me",
  meta: [
    { name: "description", content: "Découvrez les meilleurs restaurants" },
  ],
});
</script>
