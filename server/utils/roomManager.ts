// Gestionnaire de rooms en mémoire pour le prototype
import type { EventGroup, EventParticipant } from '~/types/event';

interface Room {
  id: string;
  code: string;
  title: string;
  description: string;
  color: "red" | "blue" | "green" | "purple" | "orange" | "pink";
  participants: Map<string, EventParticipant>; // socketId -> participant
  createdAt: string;
  createdBy: string;
}

class RoomManager {
  private rooms: Map<string, Room> = new Map(); // code -> room
  private socketToRoom: Map<string, string> = new Map(); // socketId -> code

  // Génère un code unique à 5 caractères
  private generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    do {
      code = '';
      for (let i = 0; i < 5; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (this.rooms.has(code));
    return code;
  }

  // Génère une couleur aléatoire
  private generateColor(): "red" | "blue" | "green" | "purple" | "orange" | "pink" {
    const colors: Array<"red" | "blue" | "green" | "purple" | "orange" | "pink"> =
      ["red", "blue", "green", "purple", "orange", "pink"];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Crée une nouvelle room
  createRoom(socketId: string, title: string, description: string, creator: EventParticipant): Room {
    const code = this.generateCode();
    const room: Room = {
      id: code,
      code,
      title,
      description,
      color: this.generateColor(),
      participants: new Map([[socketId, creator]]),
      createdAt: new Date().toISOString(),
      createdBy: creator.id,
    };

    this.rooms.set(code, room);
    this.socketToRoom.set(socketId, code);

    return room;
  }

  // Rejoint une room existante
  joinRoom(socketId: string, code: string, participant: EventParticipant): Room | null {
    const room = this.rooms.get(code.toUpperCase());

    if (!room) {
      return null;
    }

    room.participants.set(socketId, participant);
    this.socketToRoom.set(socketId, code.toUpperCase());

    return room;
  }

  // Quitte une room
  leaveRoom(socketId: string): { code: string; participant: EventParticipant } | null {
    const code = this.socketToRoom.get(socketId);

    if (!code) {
      return null;
    }

    const room = this.rooms.get(code);

    if (!room) {
      return null;
    }

    const participant = room.participants.get(socketId);

    if (!participant) {
      return null;
    }

    room.participants.delete(socketId);
    this.socketToRoom.delete(socketId);

    // Si la room est vide, on la supprime
    if (room.participants.size === 0) {
      this.rooms.delete(code);
    }

    return { code, participant };
  }

  // Récupère une room
  getRoom(code: string): Room | null {
    return this.rooms.get(code.toUpperCase()) || null;
  }

  // Récupère la room d'un socket
  getRoomBySocketId(socketId: string): Room | null {
    const code = this.socketToRoom.get(socketId);
    return code ? this.getRoom(code) : null;
  }

  // Convertit une room en EventGroup pour le client
  roomToEventGroup(room: Room): EventGroup {
    return {
      id: room.id,
      code: room.code,
      title: room.title,
      description: room.description,
      color: room.color,
      participants: Array.from(room.participants.values()),
      createdAt: room.createdAt,
      createdBy: room.createdBy,
    };
  }
}

// Instance unique partagée
export const roomManager = new RoomManager();
