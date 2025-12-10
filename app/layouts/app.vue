<template>
  <div class="h-screen flex flex-col bg-background">
    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Bottom Navigation -->
    <NavigationBottomNavigation />
  </div>
</template>
