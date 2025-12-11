<template>
  <Sheet :open="isOpen" @update:open="handleOpenChange">
    <SheetContent
      side="bottom"
      class="rounded-t-3xl h-[75vh] overflow-hidden p-0 border-0 bg-background flex flex-col"
      :showClose="false"
    >
      <!-- Handle bar -->
      <div class="flex justify-center pt-4 pb-2 shrink-0">
        <div class="w-16 h-1.5 bg-muted-foreground/30 rounded-full" />
      </div>

      <!-- Header -->
      <div class="px-6 pb-4 border-b border-border shrink-0">
        <h2 class="text-xl font-bold text-foreground">Chat</h2>
        <p class="text-sm text-muted-foreground mt-1">
          {{ participantCount }} participant{{
            participantCount > 1 ? "s" : ""
          }}
        </p>
      </div>

      <!-- Messages List -->
      <div
        ref="messagesContainer"
        class="flex-1 overflow-y-auto px-6 py-4 space-y-2"
      >
        <!-- Empty State -->
        <div
          v-if="messages.length === 0"
          class="flex flex-col items-center justify-center h-full text-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-16 h-16 text-muted-foreground/40 mb-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            />
          </svg>
          <p class="text-muted-foreground">Aucun message pour le moment</p>
          <p class="text-sm text-muted-foreground/70 mt-1">
            Soyez le premier à envoyer un message !
          </p>
        </div>

        <!-- Messages -->
        <EventsChatMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :current-user-id="currentUserId"
        />
      </div>

      <!-- Input -->
      <EventsChatInput :disabled="!connected" @send="handleSendMessage" />
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { ChatMessage } from "~/types/event";
import EventsChatMessage from "./ChatMessage.vue";
import EventsChatInput from "./ChatInput.vue";

interface Props {
  open: boolean;
  messages: ChatMessage[];
  currentUserId: string;
  participantCount: number;
  connected: boolean;
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "send", content: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const messagesContainer = ref<HTMLDivElement | null>(null);

const isOpen = computed({
  get: () => {
    console.log("[ChatPanel] isOpen get:", props.open);
    return props.open;
  },
  set: (value) => {
    console.log("[ChatPanel] isOpen set:", value);
    emit("update:open", value);
  },
});

const handleOpenChange = (value: boolean) => {
  console.log("[ChatPanel] handleOpenChange:", value);
  emit("update:open", value);
};

// Watch pour debug
watch(
  () => props.open,
  (newValue) => {
    console.log("[ChatPanel] props.open changed:", newValue);
  }
);

const handleSendMessage = (content: string) => {
  emit("send", content);
};

// Auto-scroll to bottom when new messages arrive
watch(
  () => props.messages.length,
  () => {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop =
          messagesContainer.value.scrollHeight;
      }
    });
  }
);

// Scroll to bottom when panel opens
watch(isOpen, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (messagesContainer.value) {
        messagesContainer.value.scrollTop =
          messagesContainer.value.scrollHeight;
      }
    });
  }
});
</script>
