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
  color: "red" | "blue" | "green" | "purple" | "orange" | "pink";
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
  red: "bg-red-700/85",
  blue: "bg-blue-700/85",
  green: "bg-green-700/85",
  purple: "bg-purple-700/85",
  orange: "bg-orange-700/85",
  pink: "bg-pink-700/85",
} as const;
