<template>
  <div class="bg-background p-4">
    <form @submit.prevent="handleSend" class="relative">
      <!-- Input Container -->
      <div class="relative flex items-center">
        <textarea
          v-model="messageContent"
          placeholder="Écrivez un message..."
          rows="1"
          class="w-full min-h-[3.5rem] px-4 py-3 pr-14 bg-muted/30 border-2 border-border rounded-2xl resize-none focus-visible:outline-none focus-visible:ring-0 focus-visible:border-accent text-base placeholder:text-muted-foreground/50 transition-all"
          @keydown.enter.exact.prevent="handleSend"
          @input="autoResize"
          ref="textareaRef"
          :disabled="disabled"
        />

        <!-- Send Button Inside Input -->
        <button
          type="submit"
          :disabled="!canSend || disabled"
          :class="[
            'absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all',
            canSend && !disabled
              ? 'bg-secondary text-secondary-foreground shadow-md hover:scale-105 active:scale-95'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          ]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
interface Props {
  disabled?: boolean;
}

interface Emits {
  (e: "send", content: string): void;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
});

const emit = defineEmits<Emits>();

const messageContent = ref("");
const textareaRef = ref<HTMLTextAreaElement | null>(null);

const canSend = computed(() => messageContent.value.trim().length > 0);

const handleSend = () => {
  const content = messageContent.value.trim();

  if (!content || props.disabled) {
    return;
  }

  emit("send", content);
  messageContent.value = "";

  // Reset textarea height
  nextTick(() => {
    if (textareaRef.value) {
      textareaRef.value.style.height = "auto";
    }
  });
};

const autoResize = () => {
  if (textareaRef.value) {
    textareaRef.value.style.height = "auto";
    textareaRef.value.style.height = `${Math.min(
      textareaRef.value.scrollHeight,
      120
    )}px`;
  }
};
</script>
