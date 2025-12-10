<template>
  <Sheet :open="isOpen" @update:open="handleOpenChange">
    <SheetContent
      side="bottom"
      class="rounded-t-3xl max-h-[50vh] overflow-hidden p-0 border-0 bg-secondary"
      :showClose="false"
    >
      <!-- Handle bar -->
      <div class="flex justify-center pt-4 pb-6">
        <div class="w-16 h-1.5 bg-background/30 rounded-full" />
      </div>

      <!-- Content -->
      <div class="px-6 pb-8 space-y-4">
        <!-- Rejoindre un groupe button -->
        <Button
          variant="outline"
          size="lg"
          class="w-full h-16 text-lg font-bold bg-background text-secondary hover:bg-background hover:text-secondary hover:opacity-80 border-0 rounded-full transition-opacity"
          @click="handleJoinGroup"
        >
          Rejoindre un groupe
        </Button>

        <!-- Créer un groupe button -->
        <Button
          variant="default"
          size="lg"
          class="w-full h-16 text-lg font-bold bg-primary text-secondary hover:bg-primary/90 border-0 rounded-full"
          @click="handleCreateGroup"
        >
          Créer un groupe
        </Button>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import {
  Sheet,
  SheetContent,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface Props {
  open: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:open': [value: boolean];
  'join': [];
  'create': [];
}>();

const isOpen = computed({
  get: () => props.open,
  set: (value) => emit('update:open', value),
});

const handleOpenChange = (value: boolean) => {
  emit('update:open', value);
};

const handleJoinGroup = () => {
  emit('join');
  // TODO: Naviguer vers la page de rejoindre un groupe
  console.log('Rejoindre un groupe');
};

const handleCreateGroup = () => {
  emit('create');
  // TODO: Naviguer vers la page de créer un groupe
  console.log('Créer un groupe');
};
</script>
