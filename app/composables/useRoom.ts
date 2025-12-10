import type { EventGroup, EventParticipant } from '~/types/event';

export const useRoom = () => {
  // Utilise useState pour partager l'état entre les pages
  const ws = useState<WebSocket | null>('ws-connection', () => null);
  const connected = useState<boolean>('ws-connected', () => false);
  const currentRoom = useState<EventGroup | null>('current-room', () => null);
  const error = useState<string | null>('ws-error', () => null);

  // Détermine l'URL du WebSocket
  const getWebSocketUrl = () => {
    if (process.client) {
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      return `${protocol}//${window.location.host}/_ws`;
    }
    return '';
  };

  // Connecte au serveur WebSocket
  const connect = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!process.client) {
        reject(new Error('WebSocket can only be used on client side'));
        return;
      }

      if (ws.value && connected.value) {
        resolve();
        return;
      }

      try {
        const url = getWebSocketUrl();
        ws.value = new WebSocket(url);

        ws.value.onopen = () => {
          console.log('[WS Client] Connected');
          connected.value = true;
          error.value = null;
          resolve();
        };

        ws.value.onerror = (err) => {
          console.error('[WS Client] Error:', err);
          error.value = 'WebSocket connection error';
          reject(err);
        };

        ws.value.onclose = () => {
          console.log('[WS Client] Disconnected');
          connected.value = false;
        };

        ws.value.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            handleMessage(message);
          } catch (err) {
            console.error('[WS Client] Failed to parse message:', err);
          }
        };
      } catch (err) {
        console.error('[WS Client] Failed to create WebSocket:', err);
        error.value = 'Failed to create WebSocket connection';
        reject(err);
      }
    });
  };

  // Gère les messages reçus
  const handleMessage = (message: any) => {
    console.log('[WS Client] Message received:', message.type);

    switch (message.type) {
      case 'room-created':
      case 'room-joined':
        currentRoom.value = message.data;
        break;

      case 'participant-joined':
        if (currentRoom.value && message.data.room) {
          currentRoom.value = message.data.room;
        }
        break;

      case 'participant-left':
        if (currentRoom.value && message.data.participant) {
          currentRoom.value.participants = currentRoom.value.participants.filter(
            (p) => p.id !== message.data.participant.id
          );
        }
        break;

      case 'error':
        error.value = message.data.message;
        break;

      case 'pong':
        // Keepalive response
        break;

      default:
        console.warn('[WS Client] Unknown message type:', message.type);
    }
  };

  // Envoie un message
  const send = (message: any) => {
    if (!ws.value || !connected.value) {
      console.error('[WS Client] Not connected');
      return;
    }

    ws.value.send(JSON.stringify(message));
  };

  // Crée une room
  const createRoom = async (
    title: string,
    description: string,
    participant: EventParticipant
  ): Promise<EventGroup | null> => {
    try {
      await connect();

      return new Promise((resolve, reject) => {
        if (!ws.value) {
          reject(new Error('WebSocket not connected'));
          return;
        }

        // Écoute la réponse
        const handleResponse = (event: MessageEvent) => {
          const message = JSON.parse(event.data);
          if (message.type === 'room-created') {
            ws.value?.removeEventListener('message', handleResponse);
            resolve(message.data);
          } else if (message.type === 'error') {
            ws.value?.removeEventListener('message', handleResponse);
            reject(new Error(message.data.message));
          }
        };

        ws.value.addEventListener('message', handleResponse);

        // Envoie la requête
        send({
          type: 'create',
          data: { title, description, participant },
        });

        // Timeout après 5 secondes
        setTimeout(() => {
          ws.value?.removeEventListener('message', handleResponse);
          reject(new Error('Timeout waiting for room creation'));
        }, 5000);
      });
    } catch (err) {
      console.error('[WS Client] Failed to create room:', err);
      error.value = 'Failed to create room';
      return null;
    }
  };

  // Rejoint une room
  const joinRoom = async (
    code: string,
    participant: EventParticipant
  ): Promise<EventGroup | null> => {
    try {
      await connect();

      return new Promise((resolve, reject) => {
        if (!ws.value) {
          reject(new Error('WebSocket not connected'));
          return;
        }

        // Écoute la réponse
        const handleResponse = (event: MessageEvent) => {
          const message = JSON.parse(event.data);
          if (message.type === 'room-joined') {
            ws.value?.removeEventListener('message', handleResponse);
            resolve(message.data);
          } else if (message.type === 'error') {
            ws.value?.removeEventListener('message', handleResponse);
            reject(new Error(message.data.message));
          }
        };

        ws.value.addEventListener('message', handleResponse);

        // Envoie la requête
        send({
          type: 'join',
          data: { code, participant },
        });

        // Timeout après 5 secondes
        setTimeout(() => {
          ws.value?.removeEventListener('message', handleResponse);
          reject(new Error('Timeout waiting to join room'));
        }, 5000);
      });
    } catch (err) {
      console.error('[WS Client] Failed to join room:', err);
      error.value = 'Failed to join room';
      return null;
    }
  };

  // Quitte la room
  const leaveRoom = () => {
    if (ws.value && connected.value) {
      send({ type: 'leave' });
      currentRoom.value = null;
    }
  };

  // Déconnecte
  const disconnect = () => {
    if (ws.value) {
      ws.value.close();
      ws.value = null;
      connected.value = false;
      currentRoom.value = null;
    }
  };

  // Note: On ne déconnecte pas au démontage pour garder la connexion active entre les pages

  return {
    connected,
    currentRoom,
    error,
    connect,
    createRoom,
    joinRoom,
    leaveRoom,
    disconnect,
  };
};
