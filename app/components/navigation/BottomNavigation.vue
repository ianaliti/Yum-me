<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
    <div class="max-w-screen-lg mx-auto px-4">
      <div class="flex items-center justify-around h-20">
        <NuxtLink
          v-for="item in navigationItems"
          :key="item.name"
          :to="item.path"
          class="flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors relative"
        >
          <!-- Icon -->
          <component
            :is="getIconComponent(item.icon)"
            :size="24"
            :color="isActive(item.path) ? '#379287' : '#6B7280'"
            :class="[
              'transition-all',
              isActive(item.path) ? 'scale-110' : 'scale-100'
            ]"
          />

          <!-- Label -->
          <span
            :class="[
              'text-xs font-medium transition-all',
              isActive(item.path)
                ? 'text-primary font-semibold'
                : 'text-foreground/60 font-normal'
            ]"
          >
            {{ item.label }}
          </span>
        </NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import IconHome from '@/components/icons/IconHome.vue';
import IconRestaurant from '@/components/icons/IconRestaurant.vue';
import IconBookmark from '@/components/icons/IconBookmark.vue';
import IconUser from '@/components/icons/IconUser.vue';

const { navigationItems, isActive, navigate } = useNavigation();

const iconComponents: Record<string, Component> = {
  IconHome,
  IconRestaurant,
  IconBookmark,
  IconUser,
};

const getIconComponent = (iconName: string) => {
  return iconComponents[iconName];
};
</script>
