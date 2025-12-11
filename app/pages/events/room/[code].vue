<template>
  <div class="flex flex-col min-h-full w-full bg-background">
    <!-- Header -->
    <div class="flex items-center justify-center relative p-4 pb-6">
      <button
        @click="handleLeave"
        class="absolute left-4 p-2 hover:bg-muted rounded-full transition-colors"
        aria-label="Retour"
      >
        <ChevronLeft :size="24" class="text-foreground" />
      </button>
      <h1 class="text-xl font-bold text-secondary">Inviter des amis</h1>
    </div>

    <!-- Loading State -->
    <div v-if="!room" class="flex-1 flex items-center justify-center">
      <div class="text-center space-y-4">
        <div class="animate-spin rounded-full h-12 w-12 border-2 border-primary border-t-transparent mx-auto" />
        <p class="text-sm text-muted-foreground">Connexion à l'événement...</p>
      </div>
    </div>

    <!-- Event Content -->
    <div v-else class="flex-1 px-4 space-y-4 pb-32 overflow-y-auto">
      <!-- Event Card -->
      <div
        :class="[
          'p-6 rounded-3xl text-white shadow-lg relative overflow-hidden',
          room.color ? eventGroupColors[room.color] : 'bg-secondary',
        ]"
      >
        <!-- Title & Description -->
        <h2 class="text-2xl font-bold mb-3">
          {{ room.title }}
        </h2>
        <p class="text-white/90 text-sm mb-6">
          {{ room.description }}
        </p>

        <!-- Bottom section: Code + Avatars -->
        <div class="flex items-center justify-between">
          <!-- Code with copy icon -->
          <div class="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-2xl">
            <span class="text-lg font-bold tracking-wider">{{ room.code }}</span>
            <button @click="copyCode" class="text-white/80 hover:text-white transition-colors">
              <Check v-if="copied" :size="18" class="text-green-400" />
              <Copy v-else :size="18" />
            </button>
          </div>

          <!-- Chat Button -->
          <button
            @click="openChat"
            class="relative flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-2xl hover:bg-white/20 transition-colors"
          >
            <span class="text-base font-semibold">Chat</span>
            <MessageCircle :size="18" />
            <!-- Unread Badge (optional - for future) -->
            <div
              v-if="hasUnreadMessages"
              class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold"
            >
              {{ unreadCount }}
            </div>
          </button>
        </div>
      </div>

      <!-- Participants List -->
      <div class="space-y-3">
        <div
          v-for="participant in room.participants"
          :key="participant.id"
          class="flex items-center gap-3 animate-fade-in"
        >
          <!-- Avatar with online indicator -->
          <div class="relative">
            <img
              :src="participant.avatar"
              :alt="participant.name"
              class="w-14 h-14 rounded-full object-cover"
            />
            <div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
          </div>

          <!-- Name -->
          <div class="flex-1">
            <p class="font-semibold text-foreground text-base">
              {{ participant.name }}
            </p>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="room.participants.length === 0" class="text-center py-8">
        <p class="text-sm text-muted-foreground">
          Aucun participant pour le moment
        </p>
      </div>
    </div>

    <!-- Bottom Buttons -->
    <div class="fixed bottom-20 left-0 right-0 p-4 bg-background space-y-3">
      <!-- Share Button -->
      <button
        @click="shareEvent"
        class="w-full h-16 text-lg font-bold bg-background text-secondary hover:bg-background hover:opacity-80 border-2 border-secondary rounded-full shadow-lg transition-opacity flex items-center justify-center gap-2"
      >
        <Share2 :size="20" />
        Partagez avec vos amis
      </button>

      <!-- Quit Button -->
      <button
        @click="handleLeave"
        class="w-full h-16 text-lg font-bold bg-secondary text-secondary-foreground hover:bg-secondary/90 border-0 rounded-full shadow-lg transition-all flex items-center justify-center"
      >
        Quitter l'événement
      </button>
    </div>

    <!-- Chat Panel -->
    <EventsChatPanel
      v-if="room"
      :open="isChatOpen"
      :messages="room.messages || []"
      :current-user-id="currentUser.id"
      :participant-count="room.participants.length"
      :connected="connected"
      @update:open="isChatOpen = $event"
      @send="handleSendMessage"
    />
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Copy, Check, Share2, MessageCircle } from "lucide-vue-next";
import { eventGroupColors } from "~/types/event";
import EventsChatPanel from "~/components/events/ChatPanel.vue";

definePageMeta({
  layout: "app",
});

const route = useRoute();
const code = computed(() => route.params.code as string);

useHead({
  title: () => `Événement ${code.value} - Yum'me`,
});

const { currentRoom: room, connected, disconnect, sendMessage } = useRoom();
const { getCurrentUser } = useCurrentUser();

const copied = ref(false);
const isChatOpen = ref(false);

// Récupère l'utilisateur actuel
const currentUser = getCurrentUser();

// Chat state (for future unread messages feature)
const hasUnreadMessages = ref(false);
const unreadCount = ref(0);

// Fonction pour copier le code
const copyCode = async () => {
  if (!room.value) return;

  try {
    await navigator.clipboard.writeText(room.value.code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error("Failed to copy code:", err);
  }
};

// Fonction pour partager l'événement
const shareEvent = async () => {
  if (!room.value) return;

  const shareText = `Rejoignez mon événement "${room.value.title}" avec le code: ${room.value.code}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: room.value.title,
        text: shareText,
      });
    } catch (err) {
      // Fallback: copie le code
      await copyCode();
    }
  } else {
    // Fallback: copie le code
    await copyCode();
  }
};

// Fonction pour ouvrir le chat
const openChat = () => {
  console.log('[Chat] Click sur bouton chat');
  console.log('[Chat] Room:', room.value);
  console.log('[Chat] Participants:', room.value?.participants.length);
  console.log('[Chat] isChatOpen avant:', isChatOpen.value);

  if (!room.value) {
    console.log('[Chat] Pas de room - abandon');
    return;
  }

  // Temporairement désactivé pour tester même avec 1 participant
  // if (room.value.participants.length < 2) {
  //   console.log('[Chat] Pas assez de participants - abandon');
  //   return;
  // }

  isChatOpen.value = true;
  console.log('[Chat] isChatOpen après:', isChatOpen.value);

  // Reset unread messages when opening chat
  hasUnreadMessages.value = false;
  unreadCount.value = 0;
};

// Fonction pour envoyer un message
const handleSendMessage = (content: string) => {
  console.log('[Chat] Envoi message:', content);
  sendMessage(content, currentUser);
};

// Watch pour debug
watch(isChatOpen, (newValue) => {
  console.log('[Room] isChatOpen changed to:', newValue);
});

watch(() => room.value?.participants.length, (newValue) => {
  console.log('[Room] Participants count:', newValue);
});

// Fonction pour quitter l'événement
const handleLeave = async () => {
  disconnect();
  navigateTo("/events");
};

// Nettoyage au démontage
onUnmounted(() => {
  disconnect();
});
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>
