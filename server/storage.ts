import {
  users, disasters, keywords, tweets, alerts, trendingTopics,
  type User, type InsertUser,
  type Disaster, type InsertDisaster,
  type Keyword, type InsertKeyword,
  type Tweet, type InsertTweet,
  type Alert, type InsertAlert,
  type TrendingTopic, type InsertTrendingTopic
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Disaster operations
  getDisaster(id: number): Promise<Disaster | undefined>;
  getActiveDisasters(): Promise<Disaster[]>;
  createDisaster(disaster: InsertDisaster): Promise<Disaster>;
  updateDisaster(id: number, data: Partial<InsertDisaster>): Promise<Disaster | undefined>;
  
  // Keyword operations
  getKeywordsByDisasterId(disasterId: number): Promise<Keyword[]>;
  createKeyword(keyword: InsertKeyword): Promise<Keyword>;
  updateKeyword(id: number, isActive: boolean): Promise<Keyword | undefined>;
  deleteKeyword(id: number): Promise<boolean>;
  
  // Tweet operations
  getTweetsByDisasterId(disasterId: number, limit?: number): Promise<Tweet[]>;
  createTweet(tweet: InsertTweet): Promise<Tweet>;
  getTweetCount(disasterId: number): Promise<number>;
  
  // Alert operations
  getAlertsByDisasterId(disasterId: number): Promise<Alert[]>;
  createAlert(alert: InsertAlert): Promise<Alert>;
  markAlertAsRead(id: number): Promise<Alert | undefined>;
  
  // Trending topics operations
  getTrendingTopicsByDisasterId(disasterId: number): Promise<TrendingTopic[]>;
  createTrendingTopic(trendingTopic: InsertTrendingTopic): Promise<TrendingTopic>;
  updateTrendingTopic(id: number, count: number, percentageChange: string): Promise<TrendingTopic | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private disasters: Map<number, Disaster>;
  private keywords: Map<number, Keyword>;
  private tweets: Map<number, Tweet>;
  private alerts: Map<number, Alert>;
  private trendingTopics: Map<number, TrendingTopic>;
  
  private currentUserId: number;
  private currentDisasterId: number;
  private currentKeywordId: number;
  private currentTweetId: number;
  private currentAlertId: number;
  private currentTrendingTopicId: number;

  constructor() {
    this.users = new Map();
    this.disasters = new Map();
    this.keywords = new Map();
    this.tweets = new Map();
    this.alerts = new Map();
    this.trendingTopics = new Map();
    
    this.currentUserId = 1;
    this.currentDisasterId = 1;
    this.currentKeywordId = 1;
    this.currentTweetId = 1;
    this.currentAlertId = 1;
    this.currentTrendingTopicId = 1;
    
    // Add demo data
    this.initializeDemoData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Disaster operations
  async getDisaster(id: number): Promise<Disaster | undefined> {
    return this.disasters.get(id);
  }
  
  async getActiveDisasters(): Promise<Disaster[]> {
    return Array.from(this.disasters.values()).filter(
      (disaster) => disaster.status === "active"
    );
  }
  
  async createDisaster(insertDisaster: InsertDisaster): Promise<Disaster> {
    const id = this.currentDisasterId++;
    const disaster: Disaster = { ...insertDisaster, id };
    this.disasters.set(id, disaster);
    return disaster;
  }
  
  async updateDisaster(id: number, data: Partial<InsertDisaster>): Promise<Disaster | undefined> {
    const disaster = this.disasters.get(id);
    if (!disaster) return undefined;
    
    const updatedDisaster: Disaster = { ...disaster, ...data };
    this.disasters.set(id, updatedDisaster);
    return updatedDisaster;
  }
  
  // Keyword operations
  async getKeywordsByDisasterId(disasterId: number): Promise<Keyword[]> {
    return Array.from(this.keywords.values()).filter(
      (keyword) => keyword.disasterId === disasterId
    );
  }
  
  async createKeyword(insertKeyword: InsertKeyword): Promise<Keyword> {
    const id = this.currentKeywordId++;
    const keyword: Keyword = { ...insertKeyword, id };
    this.keywords.set(id, keyword);
    return keyword;
  }
  
  async updateKeyword(id: number, isActive: boolean): Promise<Keyword | undefined> {
    const keyword = this.keywords.get(id);
    if (!keyword) return undefined;
    
    const updatedKeyword: Keyword = { ...keyword, isActive };
    this.keywords.set(id, updatedKeyword);
    return updatedKeyword;
  }
  
  async deleteKeyword(id: number): Promise<boolean> {
    return this.keywords.delete(id);
  }
  
  // Tweet operations
  async getTweetsByDisasterId(disasterId: number, limit = 50): Promise<Tweet[]> {
    const disasterTweets = Array.from(this.tweets.values())
      .filter(tweet => tweet.disasterId === disasterId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    return disasterTweets.slice(0, limit);
  }
  
  async createTweet(insertTweet: InsertTweet): Promise<Tweet> {
    const id = this.currentTweetId++;
    const tweet: Tweet = { ...insertTweet, id };
    this.tweets.set(id, tweet);
    return tweet;
  }
  
  async getTweetCount(disasterId: number): Promise<number> {
    return Array.from(this.tweets.values()).filter(
      tweet => tweet.disasterId === disasterId
    ).length;
  }
  
  // Alert operations
  async getAlertsByDisasterId(disasterId: number): Promise<Alert[]> {
    return Array.from(this.alerts.values())
      .filter(alert => alert.disasterId === disasterId)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
  
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const id = this.currentAlertId++;
    const alert: Alert = { ...insertAlert, id };
    this.alerts.set(id, alert);
    return alert;
  }
  
  async markAlertAsRead(id: number): Promise<Alert | undefined> {
    const alert = this.alerts.get(id);
    if (!alert) return undefined;
    
    const updatedAlert: Alert = { ...alert, isRead: true };
    this.alerts.set(id, updatedAlert);
    return updatedAlert;
  }
  
  // Trending topics operations
  async getTrendingTopicsByDisasterId(disasterId: number): Promise<TrendingTopic[]> {
    return Array.from(this.trendingTopics.values())
      .filter(topic => topic.disasterId === disasterId)
      .sort((a, b) => parseInt(b.percentageChange) - parseInt(a.percentageChange));
  }
  
  async createTrendingTopic(insertTrendingTopic: InsertTrendingTopic): Promise<TrendingTopic> {
    const id = this.currentTrendingTopicId++;
    const trendingTopic: TrendingTopic = { ...insertTrendingTopic, id };
    this.trendingTopics.set(id, trendingTopic);
    return trendingTopic;
  }
  
  async updateTrendingTopic(id: number, count: number, percentageChange: string): Promise<TrendingTopic | undefined> {
    const trendingTopic = this.trendingTopics.get(id);
    if (!trendingTopic) return undefined;
    
    const updatedTrendingTopic: TrendingTopic = { 
      ...trendingTopic, 
      count,
      percentageChange
    };
    this.trendingTopics.set(id, updatedTrendingTopic);
    return updatedTrendingTopic;
  }
  
  // Initialize demo data
  private initializeDemoData() {
    // Create demo user
    const demoUser: InsertUser = {
      username: "jdavis",
      password: "password123", // In a real app, this would be hashed
      fullName: "Jamie Davis",
      role: "Disaster Response Coordinator",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    };
    this.createUser(demoUser);
    
    // Create demo disaster
    const now = new Date();
    const demoDisaster: InsertDisaster = {
      name: "Hurricane Florence",
      type: "hurricane",
      status: "active",
      geographicArea: "North Carolina",
      startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      endDate: null
    };
    this.createDisaster(demoDisaster).then(disaster => {
      // Add keywords for the disaster
      const keywords = [
        { disasterId: disaster.id, keyword: "hurricane", isHashtag: false, isActive: true },
        { disasterId: disaster.id, keyword: "flood", isHashtag: false, isActive: true },
        { disasterId: disaster.id, keyword: "evacuation", isHashtag: false, isActive: true },
        { disasterId: disaster.id, keyword: "damage", isHashtag: false, isActive: true },
        { disasterId: disaster.id, keyword: "rescue", isHashtag: false, isActive: true },
        { disasterId: disaster.id, keyword: "HurricaneFlorence", isHashtag: true, isActive: true },
        { disasterId: disaster.id, keyword: "NCEvac", isHashtag: true, isActive: true },
        { disasterId: disaster.id, keyword: "FloodWarning", isHashtag: true, isActive: true },
      ];
      
      keywords.forEach(k => this.createKeyword(k));
      
      // Add trending topics
      const trendingTopics = [
        { disasterId: disaster.id, topic: "#NCEvac", count: 1245, percentageChange: "245", timestamp: new Date() },
        { disasterId: disaster.id, topic: "#FloodWarning", count: 980, percentageChange: "180", timestamp: new Date() },
        { disasterId: disaster.id, topic: "#RescueEfforts", count: 785, percentageChange: "120", timestamp: new Date() },
        { disasterId: disaster.id, topic: "#PowerOutage", count: 650, percentageChange: "95", timestamp: new Date() },
        { disasterId: disaster.id, topic: "#StaySafe", count: 520, percentageChange: "80", timestamp: new Date() },
      ];
      
      trendingTopics.forEach(t => this.createTrendingTopic(t));
      
      // Add alerts
      const alerts = [
        { 
          disasterId: disaster.id, 
          message: "Significant negative sentiment spike detected in Charlotte area", 
          level: "high", 
          timestamp: new Date(now.getTime() - 10 * 60 * 1000), // 10 minutes ago
          isRead: false
        },
        { 
          disasterId: disaster.id, 
          message: "New evacuation hashtag trending: #NCEvac", 
          level: "medium", 
          timestamp: new Date(now.getTime() - 25 * 60 * 1000), // 25 minutes ago
          isRead: false
        },
        { 
          disasterId: disaster.id, 
          message: "Positive sentiment around rescue efforts increasing", 
          level: "info", 
          timestamp: new Date(now.getTime() - 60 * 60 * 1000), // 1 hour ago
          isRead: false
        }
      ];
      
      alerts.forEach(a => this.createAlert(a));
      
      // Add sample tweets
      const tweets = [
        {
          tweetId: "1001",
          disasterId: disaster.id,
          username: "resident123",
          displayName: "Local Resident",
          content: "The flooding on Main Street is getting worse. Need emergency services ASAP! #HurricaneFlorence #Emergency",
          location: "Charlotte, NC",
          latitude: "35.2271",
          longitude: "-80.8431",
          sentiment: "negative",
          sentimentScore: "-0.75",
          timestamp: new Date(now.getTime() - 2 * 60 * 1000), // 2 minutes ago
          matchedKeywords: ["flood", "HurricaneFlorence"]
        },
        {
          tweetId: "1002",
          disasterId: disaster.id,
          username: "EmergencyInfo",
          displayName: "Emergency Updates",
          content: "Evacuation center at Lincoln High School is now open and accepting residents. Volunteers and supplies on site. #HurricaneFlorence #NCEvac",
          location: "Raleigh, NC",
          latitude: "35.7796",
          longitude: "-78.6382",
          sentiment: "positive",
          sentimentScore: "0.65",
          timestamp: new Date(now.getTime() - 5 * 60 * 1000), // 5 minutes ago
          matchedKeywords: ["evacuation", "HurricaneFlorence", "NCEvac"]
        },
        {
          tweetId: "1003",
          disasterId: disaster.id,
          username: "WeatherUpdates",
          displayName: "Weather Network",
          content: "Hurricane Florence continues to move inland. Expect heavy rainfall and winds up to 75mph in coastal areas over the next 12 hours. #HurricaneFlorence",
          location: "Wilmington, NC",
          latitude: "34.2104",
          longitude: "-77.8868",
          sentiment: "neutral",
          sentimentScore: "0.10",
          timestamp: new Date(now.getTime() - 8 * 60 * 1000), // 8 minutes ago
          matchedKeywords: ["hurricane", "HurricaneFlorence"]
        }
      ];
      
      tweets.forEach(t => this.createTweet(t));
    });
  }
}

// Import the DatabaseStorage
import { DatabaseStorage } from "./databaseStorage";

// Create and export the storage instance
export const storage = new DatabaseStorage();
