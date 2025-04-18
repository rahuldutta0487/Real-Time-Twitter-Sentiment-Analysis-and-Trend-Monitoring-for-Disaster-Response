import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useDisaster } from '@/context/DisasterContext';
import useWebSocket from './useWebSocket';
import { Tweet, Alert, TrendingTopic, SentimentSummary, SentimentByLocationData } from '@/types';

export function useTweetData() {
  const { currentDisaster } = useDisaster();
  const queryClient = useQueryClient();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [sentimentSummary, setSentimentSummary] = useState<SentimentSummary | null>(null);
  const [sentimentByLocation, setSentimentByLocation] = useState<SentimentByLocationData[]>([]);
  const [tweetCount, setTweetCount] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Fetch initial tweet data
  const { data: initialTweets } = useQuery<Tweet[]>({
    queryKey: [`/api/disasters/${currentDisaster?.id}/tweets`],
    enabled: !!currentDisaster?.id,
  });

  // Fetch initial alerts
  const { data: initialAlerts } = useQuery<Alert[]>({
    queryKey: [`/api/disasters/${currentDisaster?.id}/alerts`],
    enabled: !!currentDisaster?.id,
  });

  // Fetch initial trending topics
  const { data: initialTrendingTopics } = useQuery<TrendingTopic[]>({
    queryKey: [`/api/disasters/${currentDisaster?.id}/trending-topics`],
    enabled: !!currentDisaster?.id,
  });

  // Fetch tweet count
  const { data: countData } = useQuery<{ count: number }>({
    queryKey: [`/api/disasters/${currentDisaster?.id}/tweets/count`],
    enabled: !!currentDisaster?.id,
  });

  // Initialize with fetched data
  useEffect(() => {
    if (initialTweets) {
      setTweets(initialTweets);
    }
  }, [initialTweets]);

  useEffect(() => {
    if (initialAlerts) {
      setAlerts(initialAlerts);
    }
  }, [initialAlerts]);

  useEffect(() => {
    if (initialTrendingTopics) {
      setTrendingTopics(initialTrendingTopics);
    }
  }, [initialTrendingTopics]);

  useEffect(() => {
    if (countData) {
      setTweetCount(countData.count);
    }
  }, [countData]);

  // WebSocket message handler
  const handleWebSocketMessage = useCallback((data: any) => {
    if (isPaused) return;

    switch (data.type) {
      case 'tweet':
        // Add new tweet to the beginning of the list
        setTweets(prevTweets => {
          // Filter out tweet if it already exists (by tweetId)
          const filteredTweets = prevTweets.filter(t => t.tweetId !== data.payload.tweetId);
          // Add new tweet at the beginning and limit to 50
          return [data.payload, ...filteredTweets].slice(0, 50);
        });
        // Increase tweet count
        setTweetCount(prev => prev + 1);
        break;
      
      case 'sentimentUpdate':
        // Update sentiment summary
        setSentimentSummary(data.payload.summary);
        // Update sentiment by location
        setSentimentByLocation(data.payload.byLocation);
        break;
      
      case 'alert':
        // For array of alerts
        if (Array.isArray(data.payload)) {
          setAlerts(data.payload);
        } else {
          // For single alert
          setAlerts(prevAlerts => {
            // Check if alert already exists
            const alertExists = prevAlerts.some(a => a.id === data.payload.id);
            if (alertExists) {
              return prevAlerts.map(a => a.id === data.payload.id ? data.payload : a);
            } else {
              return [data.payload, ...prevAlerts];
            }
          });
        }
        break;
      
      case 'trendingTopicsUpdate':
        setTrendingTopics(data.payload);
        break;
      
      default:
        console.log('Unknown message type:', data.type);
    }
  }, [isPaused]);

  // Connect to WebSocket
  const { isConnected, sendMessage } = useWebSocket('/ws', {
    onMessage: handleWebSocketMessage,
    onOpen: () => {
      // Subscribe to the current disaster's data stream when connected
      if (currentDisaster) {
        sendMessage({ action: 'subscribeToDisaster', disasterId: currentDisaster.id });
      }
    }
  });

  // Subscribe to disaster data when disaster changes
  useEffect(() => {
    if (isConnected && currentDisaster) {
      sendMessage({ action: 'subscribeToDisaster', disasterId: currentDisaster.id });
      
      // Reset data for new disaster
      setTweets([]);
      setAlerts([]);
      setTrendingTopics([]);
      setSentimentSummary(null);
      setSentimentByLocation([]);
      setTweetCount(0);
    }
  }, [isConnected, currentDisaster, sendMessage]);

  // Function to toggle pause state
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  // Function to refresh data (for use after mutations)
  const refreshData = useCallback(() => {
    if (currentDisaster) {
      queryClient.invalidateQueries({ queryKey: [`/api/disasters/${currentDisaster.id}/tweets`] });
      queryClient.invalidateQueries({ queryKey: [`/api/disasters/${currentDisaster.id}/alerts`] });
      queryClient.invalidateQueries({ queryKey: [`/api/disasters/${currentDisaster.id}/trending-topics`] });
      queryClient.invalidateQueries({ queryKey: [`/api/disasters/${currentDisaster.id}/tweets/count`] });
    }
  }, [queryClient, currentDisaster]);

  return {
    tweets,
    alerts,
    trendingTopics,
    sentimentSummary,
    sentimentByLocation,
    tweetCount,
    isPaused,
    togglePause,
    isConnected,
    refreshData
  };
}

export default useTweetData;
