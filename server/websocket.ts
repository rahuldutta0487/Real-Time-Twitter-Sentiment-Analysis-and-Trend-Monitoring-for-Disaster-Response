import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { storage } from './storage';
import { log } from './vite';

// Types for WebSocket messages
type WSMessageType = 
  | 'tweet' 
  | 'sentimentUpdate' 
  | 'alert' 
  | 'trendingTopicsUpdate' 
  | 'disasterUpdate' 
  | 'keywordUpdate';

interface WSMessage {
  type: WSMessageType;
  payload: any;
}

// Client connection tracker by disaster ID
const clientsByDisaster = new Map<number, Set<WebSocket>>();

// Setup WebSocket server
export function setupWebSocketServer(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws' });
  
  wss.on('connection', (ws) => {
    log('WebSocket client connected', 'ws');
    let subscribedDisasterId: number | null = null;

    ws.on('message', async (message) => {
      try {
        const data = JSON.parse(message.toString()) as { action: string; disasterId?: number };
        log(`Received message: ${data.action}`, 'ws');

        if (data.action === 'subscribeToDisaster' && data.disasterId) {
          // First, remove from previous subscription if any
          if (subscribedDisasterId) {
            const clients = clientsByDisaster.get(subscribedDisasterId);
            if (clients) {
              clients.delete(ws);
              if (clients.size === 0) {
                clientsByDisaster.delete(subscribedDisasterId);
              }
            }
          }

          // Subscribe to new disaster
          subscribedDisasterId = data.disasterId;
          let clients = clientsByDisaster.get(subscribedDisasterId);
          if (!clients) {
            clients = new Set();
            clientsByDisaster.set(subscribedDisasterId, clients);
          }
          clients.add(ws);

          // Send initial data
          const disaster = await storage.getDisaster(subscribedDisasterId);
          if (disaster) {
            sendToClient(ws, { 
              type: 'disasterUpdate', 
              payload: disaster 
            });

            // Send keywords
            const keywords = await storage.getKeywordsByDisasterId(subscribedDisasterId);
            sendToClient(ws, {
              type: 'keywordUpdate',
              payload: keywords
            });

            // Send recent tweets
            const tweets = await storage.getTweetsByDisasterId(subscribedDisasterId, 10);
            tweets.forEach(tweet => {
              sendToClient(ws, {
                type: 'tweet',
                payload: tweet
              });
            });

            // Send trending topics
            const trendingTopics = await storage.getTrendingTopicsByDisasterId(subscribedDisasterId);
            sendToClient(ws, {
              type: 'trendingTopicsUpdate',
              payload: trendingTopics
            });

            // Send alerts
            const alerts = await storage.getAlertsByDisasterId(subscribedDisasterId);
            sendToClient(ws, {
              type: 'alert',
              payload: alerts
            });
          }
        }
      } catch (error) {
        log(`Error processing WebSocket message: ${error}`, 'ws');
      }
    });

    ws.on('close', () => {
      log('WebSocket client disconnected', 'ws');
      // Clean up subscriptions
      if (subscribedDisasterId) {
        const clients = clientsByDisaster.get(subscribedDisasterId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            clientsByDisaster.delete(subscribedDisasterId);
          }
        }
      }
    });
  });

  return wss;
}

// Send a message to a specific client
export function sendToClient(client: WebSocket, message: WSMessage) {
  if (client.readyState === WebSocket.OPEN) {
    client.send(JSON.stringify(message));
  }
}

// Broadcast to all clients subscribed to a disaster
export function broadcastToDisaster(disasterId: number, message: WSMessage) {
  const clients = clientsByDisaster.get(disasterId);
  if (clients) {
    for (const client of clients) {
      sendToClient(client, message);
    }
  }
}
