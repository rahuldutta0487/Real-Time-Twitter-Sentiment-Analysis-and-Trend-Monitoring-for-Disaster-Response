import { useState, useEffect, useRef, useCallback } from 'react';

type MessageHandler = (data: any) => void;

interface UseWebSocketOptions {
  onMessage?: MessageHandler;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnectInterval?: number;
  reconnectAttempts?: number;
}

export function useWebSocket(path: string, options: UseWebSocketOptions = {}) {
  const [isConnected, setIsConnected] = useState(false);
  const [reconnectCount, setReconnectCount] = useState(0);
  const socketRef = useRef<WebSocket | null>(null);

  const {
    onMessage,
    onOpen,
    onClose,
    onError,
    reconnectInterval = 3000,
    reconnectAttempts = 5
  } = options;

  const connect = useCallback(() => {
    // Close existing socket if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    // Determine the protocol based on current window protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}${path}`;

    // Create new WebSocket connection
    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    socket.onopen = () => {
      setIsConnected(true);
      setReconnectCount(0);
      if (onOpen) onOpen();
    };

    socket.onclose = () => {
      setIsConnected(false);
      if (onClose) onClose();

      // Attempt to reconnect if not exceeding reconnect attempts
      if (reconnectCount < reconnectAttempts) {
        setTimeout(() => {
          setReconnectCount(prev => prev + 1);
          connect();
        }, reconnectInterval);
      }
    };

    socket.onerror = (error) => {
      if (onError) onError(error);
    };

    socket.onmessage = (event) => {
      if (onMessage) {
        try {
          const parsedData = JSON.parse(event.data);
          onMessage(parsedData);
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      }
    };
  }, [path, onMessage, onOpen, onClose, onError, reconnectInterval, reconnectAttempts, reconnectCount]);

  // Initialize WebSocket connection
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [connect]);

  // Function to send message
  const sendMessage = useCallback((data: any) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  return { isConnected, sendMessage };
}

export default useWebSocket;
