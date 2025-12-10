<template>
  <div class="flex flex-col min-h-full w-full bg-background">
    <!-- Header avec bouton retour -->
    <div class="flex items-start p-4 pb-6">
      <button
        @click="goBack"
        class="p-2 hover:bg-muted rounded-full transition-colors"
        aria-label="Retour"
      >
        <ChevronLeft :size="24" class="text-foreground" />
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 px-6 space-y-6 pb-32">
      <!-- Title & Description -->
      <div class="space-y-2">
        <h1 class="text-2xl font-bold text-secondary leading-tight">
          Rejoins avec le code de groupe
        </h1>
        <p class="text-sm text-muted-foreground">
          Assurez-vous que le code que vous avez saisi est correct.
        </p>
      </div>

      <!-- Input for code -->
      <div class="space-y-2">
        <Input
          v-model="groupCode"
          type="text"
          placeholder="Entrez le code du groupe"
          class="h-14 text-base bg-muted/30 border-2 border-border rounded-2xl placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-accent"
        />
      </div>
    </div>

    <!-- Bottom Button - Fixed -->
    <div class="fixed bottom-20 left-0 right-0 p-6 bg-background">
      <button
        @click="handleJoin"
        :disabled="!groupCode.trim()"
        class="w-full h-14 text-base font-semibold bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl shadow-lg transition-all"
      >
        Rejoindre
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

definePageMeta({
  layout: "app",
});

useHead({
  title: "Rejoindre un groupe - Yum'me",
});

const groupCode = ref("");

const goBack = () => {
  navigateTo("/events");
};

const handleJoin = () => {
  if (!groupCode.value.trim()) return;

  // TODO: Implémenter la logique de rejoindre un groupe
  console.log("Rejoindre le groupe avec le code:", groupCode.value);

  // Pour l'instant, on retourne à la page events
  navigateTo("/events");
};
</script>
