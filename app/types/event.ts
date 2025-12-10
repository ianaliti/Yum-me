// Types pour la page Événements/Ensemble

export interface Friend {
  id: string;
  name: string;
  avatar: string;
}

export interface EventParticipant {
  id: string;
  name: string;
  avatar: string;
}

export interface EventGroup {
  id: string;
  title: string;
  description: string;
  code: string;
  color: 'red' | 'blue' | 'green' | 'purple' | 'orange' | 'pink';
  participants: EventParticipant[];
  createdAt: string;
  createdBy: string;
}

export interface User {
  id: string;
  name: string;
  firstName: string;
  avatar: string;
  hasUnreadNotifications: boolean;
}

// Couleurs des cartes de groupe
export const eventGroupColors = {
  red: 'bg-red-600',
  blue: 'bg-blue-500',
  green: 'bg-green-600',
  purple: 'bg-purple-600',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
} as const;
