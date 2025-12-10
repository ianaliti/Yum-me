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
          class="h-14 text-base bg-muted/30 border-2 border-border rounded-2xl placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-accent uppercase"
          @keyup.enter="handleJoin"
        />
        <p v-if="errorMessage" class="text-sm text-destructive">
          {{ errorMessage }}
        </p>
      </div>
    </div>

    <!-- Bottom Button - Fixed -->
    <div class="fixed bottom-20 left-0 right-0 p-6 bg-background">
      <button
        @click="handleJoin"
        :disabled="!groupCode.trim() || joining"
        class="w-full h-16 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg transition-all"
      >
        <span v-if="joining">En cours...</span>
        <span v-else>Rejoindre l'événement</span>
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
const joining = ref(false);
const errorMessage = ref("");

const { joinRoom } = useRoom();

const goBack = () => {
  navigateTo("/events");
};

const handleJoin = async () => {
  if (!groupCode.value.trim()) return;

  joining.value = true;
  errorMessage.value = "";

  try {
    // Délai minimum de 2 secondes pour afficher le loading
    const [room] = await Promise.all([
      (async () => {
        // Mock participant - dans un vrai projet, ça viendrait du store user
        // On génère un ID unique pour chaque nouvel utilisateur qui rejoint
        const userId = `user_${Date.now()}`;
        const currentUser = {
          id: userId,
          name: `User ${userId.slice(-4)}`,
          avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        };

        return await joinRoom(groupCode.value, currentUser);
      })(),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);

    if (room) {
      // Redirige vers la page de l'événement
      // On ne remet pas joining à false car on va naviguer
      navigateTo(`/events/room/${room.code}`);
    } else {
      errorMessage.value = "Code invalide ou événement introuvable";
      joining.value = false;
    }
  } catch (error) {
    console.error("Error joining room:", error);
    errorMessage.value = error instanceof Error ? error.message : "Erreur lors de la connexion à l'événement";
    joining.value = false;
  }
};
</script>
