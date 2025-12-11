import type { EventParticipant } from '~/types/event';

export const useCurrentUser = () => {
  const currentUser = useState<EventParticipant | null>('current-user', () => {
    // Récupère l'utilisateur depuis le localStorage s'il existe
    if (process.client) {
      const stored = localStorage.getItem('yumme-current-user');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return null;
        }
      }
    }
    return null;
  });

  const setCurrentUser = (user: EventParticipant) => {
    currentUser.value = user;
    if (process.client) {
      localStorage.setItem('yumme-current-user', JSON.stringify(user));
    }
  };

  const getCurrentUser = (): EventParticipant => {
    if (currentUser.value) {
      return currentUser.value;
    }

    // Si pas d'utilisateur, on crée un utilisateur par défaut
    const defaultUser: EventParticipant = {
      id: '1',
      name: 'Younes Boualam',
      avatar: 'https://i.pravatar.cc/150?img=12',
    };

    setCurrentUser(defaultUser);
    return defaultUser;
  };

  const clearCurrentUser = () => {
    currentUser.value = null;
    if (process.client) {
      localStorage.removeItem('yumme-current-user');
    }
  };

  return {
    currentUser,
    setCurrentUser,
    getCurrentUser,
    clearCurrentUser,
  };
};
