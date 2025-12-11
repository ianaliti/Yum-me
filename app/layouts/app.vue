<template>
  <div class="h-screen flex flex-col bg-background">
    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <NavigationBottomNavigation />

    <!-- Toaster -->
    <Toaster position="top-center" />
  </div>
</template>

<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "@/components/ui/sonner";
</script>
