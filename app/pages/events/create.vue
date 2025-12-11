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
    <div class="flex-1 px-6 space-y-6 pb-32 overflow-y-auto">
      <!-- Title -->
      <div>
        <h1 class="text-2xl font-bold text-secondary leading-tight">
          Veuillez renseigner les informations concernant votre groupe.
        </h1>
      </div>

      <!-- Form -->
      <div class="space-y-4">
        <!-- Nom du groupe -->
        <div class="relative">
          <div
            class="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10"
          >
            <Users :size="20" />
          </div>
          <Input
            v-model="groupName"
            type="text"
            placeholder="Nom de groupe"
            class="h-14 text-base bg-muted/30 border-2 border-border rounded-2xl pl-12 placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-accent"
          />
        </div>

        <!-- Description -->
        <div class="relative">
          <div class="absolute left-4 top-4 text-muted-foreground z-10">
            <AlignLeft :size="20" />
          </div>
          <Textarea
            v-model="groupDescription"
            placeholder="Description simple de l'événement"
            class="min-h-32 text-base bg-muted/30 border-2 border-border rounded-2xl pl-12 pt-4 placeholder:text-muted-foreground/50 resize-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-accent"
          />
        </div>
      </div>
    </div>

    <!-- Bottom Button - Fixed -->
    <div class="fixed bottom-20 left-0 right-0 p-6 bg-background">
      <button
        @click="handleCreate"
        :disabled="!groupName.trim() || !groupDescription.trim() || creating"
        class="w-full h-16 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-full shadow-lg transition-all"
      >
        <span v-if="creating">Création en cours...</span>
        <span v-else>Créer l'événement</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Users, AlignLeft } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

definePageMeta({
  layout: "app",
});

useHead({
  title: "Créer un groupe - Yum'me",
});

const groupName = ref("");
const groupDescription = ref("");
const creating = ref(false);

const { createRoom } = useRoom();
const { getCurrentUser, setCurrentUser } = useCurrentUser();

// Fonction pour reset les valeurs
const resetForm = () => {
  groupName.value = "";
  groupDescription.value = "";
  creating.value = false;
};

// Reset à chaque fois qu'on arrive sur la page (première fois)
onMounted(resetForm);

// Reset aussi quand la page est réactivée depuis le cache (navigation retour)
onActivated(resetForm);

const goBack = () => {
  navigateTo("/events");
};

const handleCreate = async () => {
  if (!groupName.value.trim() || !groupDescription.value.trim()) return;

  creating.value = true;

  try {
    // Délai minimum de 2 secondes pour afficher le loading
    const [room] = await Promise.all([
      (async () => {
        // Récupère ou crée l'utilisateur actuel
        const currentUser = getCurrentUser();

        return await createRoom(
          groupName.value,
          groupDescription.value,
          currentUser
        );
      })(),
      new Promise(resolve => setTimeout(resolve, 2000))
    ]);

    if (room) {
      // Redirige vers la page de l'événement
      // On ne remet pas creating à false car on va naviguer
      navigateTo(`/events/room/${room.code}`);
    } else {
      alert("Erreur lors de la création de l'événement");
      creating.value = false;
    }
  } catch (error) {
    console.error("Error creating room:", error);
    alert("Erreur lors de la création de l'événement");
    creating.value = false;
  }
};
</script>
