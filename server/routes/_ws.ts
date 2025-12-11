import { roomManager } from '../utils/roomManager';
import type { EventParticipant, ChatMessage } from '~/types/event';

// Types pour les messages WebSocket
interface WSMessage {
  type: 'create' | 'join' | 'leave' | 'ping' | 'chat-message';
  data?: any;
}

interface CreateRoomData {
  title: string;
  description: string;
  participant: EventParticipant;
}

interface JoinRoomData {
  code: string;
  participant: EventParticipant;
}

interface ChatMessageData {
  roomCode: string;
  message: ChatMessage;
}

export default defineWebSocketHandler({
  open(peer) {
    console.log('[WebSocket] Client connected:', peer.id);
  },

  message(peer, message) {
    try {
      const msg: WSMessage = JSON.parse(message.text());
      console.log('[WebSocket] Message received:', msg.type, 'from', peer.id);

      switch (msg.type) {
        case 'create': {
          const data = msg.data as CreateRoomData;
          const room = roomManager.createRoom(
            peer.id,
            data.title,
            data.description,
            data.participant
          );

          // S'abonne au canal de la room pour recevoir les mises à jour
          peer.subscribe(room.code);

          // Envoie la confirmation au créateur
          peer.send(JSON.stringify({
            type: 'room-created',
            data: roomManager.roomToEventGroup(room),
          }));

          console.log('[WebSocket] Room created:', room.code, 'by', peer.id);
          break;
        }

        case 'join': {
          const data = msg.data as JoinRoomData;
          const room = roomManager.joinRoom(
            peer.id,
            data.code,
            data.participant
          );

          if (!room) {
            peer.send(JSON.stringify({
              type: 'error',
              data: { message: 'Room not found' },
            }));
            return;
          }

          // Envoie la confirmation au participant
          peer.send(JSON.stringify({
            type: 'room-joined',
            data: roomManager.roomToEventGroup(room),
          }));

          // Notifie tous les autres participants
          peer.publish(data.code.toUpperCase(), JSON.stringify({
            type: 'participant-joined',
            data: {
              participant: data.participant,
              room: roomManager.roomToEventGroup(room),
            },
          }));

          // S'abonne au canal de la room
          peer.subscribe(data.code.toUpperCase());

          console.log('[WebSocket] User joined room:', data.code, 'user:', peer.id);
          break;
        }

        case 'leave': {
          const result = roomManager.leaveRoom(peer.id);

          if (result) {
            // Notifie les autres participants
            peer.publish(result.code, JSON.stringify({
              type: 'participant-left',
              data: { participant: result.participant },
            }));

            // Se désabonne
            peer.unsubscribe(result.code);

            console.log('[WebSocket] User left room:', result.code, 'user:', peer.id);
          }
          break;
        }

        case 'chat-message': {
          const data = msg.data as ChatMessageData;
          const room = roomManager.getRoom(data.roomCode);

          if (!room) {
            peer.send(JSON.stringify({
              type: 'error',
              data: { message: 'Room not found' },
            }));
            return;
          }

          // Ajoute le message à la room
          roomManager.addMessage(data.roomCode, data.message);

          const messagePayload = JSON.stringify({
            type: 'chat-message',
            data: data.message,
          });

          // Envoie le message à l'émetteur aussi
          peer.send(messagePayload);

          // Diffuse le message aux autres participants
          peer.publish(data.roomCode.toUpperCase(), messagePayload);

          console.log('[WebSocket] Chat message sent to room:', data.roomCode, 'by:', data.message.participantName);
          break;
        }

        case 'ping': {
          peer.send(JSON.stringify({ type: 'pong' }));
          break;
        }

        default:
          console.warn('[WebSocket] Unknown message type:', msg.type);
      }
    } catch (error) {
      console.error('[WebSocket] Error processing message:', error);
      peer.send(JSON.stringify({
        type: 'error',
        data: { message: 'Invalid message format' },
      }));
    }
  },

  close(peer, details) {
    console.log('[WebSocket] Client disconnected:', peer.id);

    // Nettoie la room si l'utilisateur était connecté
    const result = roomManager.leaveRoom(peer.id);
    if (result) {
      peer.publish(result.code, JSON.stringify({
        type: 'participant-left',
        data: { participant: result.participant },
      }));
    }
  },

  error(peer, error) {
    console.error('[WebSocket] Error:', peer.id, error);
  },
});
