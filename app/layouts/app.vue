<template>
  <div class="h-screen flex flex-col bg-background overflow-hidden">
    <!-- Main content -->
    <main class="flex-1 overflow-hidden">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <NavigationBottomNavigation />
  </div>
</template>
