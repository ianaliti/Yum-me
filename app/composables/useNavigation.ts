export interface NavigationItem {
  name: string;
  label: string;
  icon: string;
  path: string;
}

export const useNavigation = () => {
  const route = useRoute();

  const navigationItems: NavigationItem[] = [
    {
      name: 'home',
      label: 'Accueil',
      icon: 'IconHome',
      path: '/',
    },
    {
      name: 'restaurants',
      label: 'Restaurants',
      icon: 'IconRestaurant',
      path: '/restaurants',
    },
    {
      name: 'saved',
      label: 'Sauvegarder',
      icon: 'IconBookmark',
      path: '/saved',
    },
    {
      name: 'profile',
      label: 'Profile',
      icon: 'IconUser',
      path: '/profile',
    },
  ];

  const isActive = (path: string) => {
    return route.path === path;
  };

  return {
    navigationItems,
    isActive,
  };
};
