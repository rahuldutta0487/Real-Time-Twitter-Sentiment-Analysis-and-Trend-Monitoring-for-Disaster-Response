// User types
export interface User {
  id: number;
  username: string;
  password: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
}

// Disaster types
export interface Disaster {
  id: number;
  name: string;
  type: string;
  status: string;
  geographicArea: string;
  startDate: string | Date;
  endDate: string | Date | null;
}

// Keyword types
export interface Keyword {
  id: number;
  disasterId: number;
  keyword: string;
  isHashtag: boolean;
  isActive: boolean;
}

// Tweet types
export interface Tweet {
  id: number;
  tweetId: string;
  disasterId: number;
  username: string;
  displayName: string;
  content: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  sentiment: string;
  sentimentScore: string;
  timestamp: string | Date;
  matchedKeywords: string[];
}

// Alert types
export interface Alert {
  id: number;
  disasterId: number;
  message: string;
  level: 'high' | 'medium' | 'info';
  timestamp: string | Date;
  isRead: boolean;
}

// TrendingTopic types
export interface TrendingTopic {
  id: number;
  disasterId: number;
  topic: string;
  count: number;
  percentageChange: string;
  timestamp: string | Date;
}

// WebSocket message types
export type WSMessageType = 
  | 'tweet' 
  | 'sentimentUpdate' 
  | 'alert' 
  | 'trendingTopicsUpdate' 
  | 'disasterUpdate' 
  | 'keywordUpdate';

export interface WSMessage {
  type: WSMessageType;
  payload: any;
}

// Sentiment data types
export interface SentimentSummary {
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}

export interface SentimentByLocationData {
  location: string;
  positive: number;
  negative: number;
  neutral: number;
  total: number;
}
