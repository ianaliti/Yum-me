<template>
  <div
    :class="[
      'rounded-3xl p-6 text-white space-y-4 cursor-pointer transition-transform active:scale-[0.98]',
      colorClass,
    ]"
    @click="handleClick"
  >
    <!-- Title -->
    <h3 class="text-xl font-bold">
      {{ group.title }}
    </h3>

    <!-- Description -->
    <p class="text-sm opacity-90 leading-relaxed">
      {{ group.description }}
    </p>

    <!-- Footer: Code + Participants -->
    <div class="flex items-center justify-between pt-2">
      <!-- Code with gift icon -->
      <div class="flex items-center gap-2 bg-white/20 rounded-full px-4 py-2">
        <!-- <Gift :size="18" /> -->
        <span class="text-sm font-semibold">{{ group.code }}</span>
      </div>

      <!-- Participants avatars -->
      <div class="flex items-center -space-x-3">
        <img
          v-for="(participant, index) in displayedParticipants"
          :key="participant.id"
          :src="participant.avatar"
          :alt="participant.name"
          class="w-10 h-10 rounded-full border-2 border-white object-cover"
          :style="{ zIndex: displayedParticipants.length - index }"
        />

        <!-- +X for overflow -->
        <div
          v-if="remainingCount > 0"
          class="w-10 h-10 rounded-full border-2 border-white bg-white/30 flex items-center justify-center text-xs font-bold"
          :style="{ zIndex: 0 }"
        >
          +{{ remainingCount }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Gift } from "lucide-vue-next";
import type { EventGroup } from "~/types/event";
import { eventGroupColors } from "~/types/event";

interface Props {
  group: EventGroup;
}

const props = defineProps<Props>();

// Limiter à 3 participants visibles
const MAX_VISIBLE_PARTICIPANTS = 3;

const displayedParticipants = computed(() => {
  return props.group.participants.slice(0, MAX_VISIBLE_PARTICIPANTS);
});

const remainingCount = computed(() => {
  return Math.max(
    0,
    props.group.participants.length - MAX_VISIBLE_PARTICIPANTS
  );
});

const colorClass = computed(() => {
  return eventGroupColors[props.group.color] || eventGroupColors.blue;
});

const handleClick = () => {
  // TODO: Naviguer vers le détail du groupe
  console.log("Groupe cliqué:", props.group.title);
};
</script>
