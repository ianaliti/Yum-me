<template>
  <div class="relative w-full rounded-3xl bg-[#F9C846] overflow-hidden p-6">
    <div class="flex items-start justify-between">
      <!-- Left Content -->
      <div class="flex-1 flex flex-col justify-between h-full min-h-40">
        <h2 class="text-white text-2xl font-bold leading-tight min-w-60">
          Réduction sur l'abonnement de 30% aujourd'hui!
        </h2>

        <Button
          variant="rounded"
          size="lg"
          class="self-start"
          @click="handleSubscribe"
        >
          S'abonner
        </Button>
      </div>

      <!-- Right Content - Mascotte -->
      <div class="relative shrink-0 w-40 h-40">
        <img
          src="/home/mascotte-promo.svg"
          alt="Mascotte Yum'me"
          class="w-full h-full object-contain"
        />
      </div>
    </div>

    <!-- Progress dots (absolute bottom right) -->
    <div
      class="absolute bottom-6 right-6 flex gap-2 bg-white rounded-full px-3 py-2"
    >
      <span
        v-for="(dot, index) in totalSlides"
        :key="index"
        :class="[
          'h-2 rounded-full transition-all',
          index === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-gray-300',
        ]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { toast } from "vue-sonner";

interface Props {
  currentSlide?: number;
  totalSlides?: number;
}

const props = withDefaults(defineProps<Props>(), {
  currentSlide: 0,
  totalSlides: 3,
});

const handleSubscribe = () => {
  toast("Fonctionnalité non disponible", {
    description: "L'abonnement premium sera bientôt disponible.",
  });
};
</script>
