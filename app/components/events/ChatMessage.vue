<template>
  <div
    :class="[
      'flex gap-2 mb-4',
      isCurrentUser ? 'flex-row-reverse' : 'flex-row'
    ]"
  >
    <!-- Avatar -->
    <img
      :src="message.participantAvatar"
      :alt="message.participantName"
      class="w-8 h-8 rounded-full object-cover border border-border flex-shrink-0"
    />

    <!-- Message Bubble -->
    <div :class="[
      'flex flex-col max-w-[75%]',
      isCurrentUser ? 'items-end' : 'items-start'
    ]">
      <!-- Name -->
      <span class="text-xs text-muted-foreground mb-1 px-2">
        {{ message.participantName }}
      </span>

      <!-- Content -->
      <div :class="[
        'px-4 py-2 rounded-2xl break-words',
        isCurrentUser
          ? 'bg-primary text-primary-foreground rounded-br-md'
          : 'bg-muted text-foreground rounded-bl-md'
      ]">
        <p class="text-sm">{{ message.content }}</p>
      </div>

      <!-- Timestamp -->
      <span class="text-xs text-muted-foreground mt-1 px-2">
        {{ formattedTime }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ChatMessage } from "~/types/event";

interface Props {
  message: ChatMessage;
  currentUserId: string;
}

const props = defineProps<Props>();

const isCurrentUser = computed(() => props.message.participantId === props.currentUserId);

const formattedTime = computed(() => {
  const date = new Date(props.message.timestamp);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  });
});
</script>
