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
      name: "home",
      label: "Accueil",
      icon: "IconHome",
      path: "/accueil",
    },
    {
      name: "restaurants",
      label: "Restaurants",
      icon: "IconRestaurant",
      path: "/restaurants",
    },
    {
      name: "events",
      label: "Événements",
      icon: "IconBookmark",
      path: "/events",
    },
    {
      name: "profile",
      label: "Profile",
      icon: "IconUser",
      path: "/profile",
    },
  ];

  const isActive = (path: string) => {
    // Pour les sous-routes (ex: /events/join), on vérifie si le path commence par le path parent
    return route.path.startsWith(path);
  };

  return {
    navigationItems,
    isActive,
  };
};
