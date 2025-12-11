<template>
  <div class="flex flex-col h-screen w-full p-6">
    <div class="max-w-4xl mx-auto w-full">
      <h1 class="text-3xl font-bold text-foreground mb-4">Mon profil</h1>
      <p class="text-foreground/60">
        Gère tes préférences et informations personnelles
      </p>

      <div class="mt-8 text-center py-12">
        <IconUser :size="64" class="mx-auto mb-4 text-foreground/30" />
        <p class="text-foreground/60">
          Configurer mon profil pour personnaliser mon expérience
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import IconUser from "@/components/icons/IconUser.vue";

definePageMeta({
  layout: "app",
});

useHead({
  title: "Mon profil - Yum'me",
  meta: [{ name: "description", content: "Votre profil utilisateur" }],
});
</script>
