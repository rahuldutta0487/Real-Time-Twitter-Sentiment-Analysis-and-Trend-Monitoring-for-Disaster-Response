import { 
  users, disasters, keywords, tweets, alerts, trendingTopics,
  type User, type InsertUser,
  type Disaster, type InsertDisaster,
  type Keyword, type InsertKeyword,
  type Tweet, type InsertTweet,
  type Alert, type InsertAlert,
  type TrendingTopic, type InsertTrendingTopic
} from "@shared/schema";
import { IStorage } from "./storage";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }
  
  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  // Disaster methods
  async getDisaster(id: number): Promise<Disaster | undefined> {
    const [disaster] = await db.select().from(disasters).where(eq(disasters.id, id));
    return disaster || undefined;
  }
  
  async getActiveDisasters(): Promise<Disaster[]> {
    return await db.select().from(disasters).where(eq(disasters.status, 'active'));
  }
  
  async createDisaster(insertDisaster: InsertDisaster): Promise<Disaster> {
    const [disaster] = await db.insert(disasters).values(insertDisaster).returning();
    return disaster;
  }
  
  async updateDisaster(id: number, data: Partial<InsertDisaster>): Promise<Disaster | undefined> {
    const [disaster] = await db.update(disasters)
      .set(data)
      .where(eq(disasters.id, id))
      .returning();
    return disaster || undefined;
  }
  
  // Keyword methods
  async getKeywordsByDisasterId(disasterId: number): Promise<Keyword[]> {
    return await db.select().from(keywords).where(eq(keywords.disasterId, disasterId));
  }
  
  async createKeyword(insertKeyword: InsertKeyword): Promise<Keyword> {
    const [keyword] = await db.insert(keywords).values(insertKeyword).returning();
    return keyword;
  }
  
  async updateKeyword(id: number, isActive: boolean): Promise<Keyword | undefined> {
    const [keyword] = await db.update(keywords)
      .set({ isActive })
      .where(eq(keywords.id, id))
      .returning();
    return keyword || undefined;
  }
  
  async deleteKeyword(id: number): Promise<boolean> {
    const result = await db.delete(keywords).where(eq(keywords.id, id)).returning();
    return result.length > 0;
  }
  
  // Tweet methods
  async getTweetsByDisasterId(disasterId: number, limit = 50): Promise<Tweet[]> {
    return await db.select()
      .from(tweets)
      .where(eq(tweets.disasterId, disasterId))
      .orderBy(desc(tweets.timestamp))
      .limit(limit);
  }
  
  async createTweet(insertTweet: InsertTweet): Promise<Tweet> {
    const [tweet] = await db.insert(tweets).values(insertTweet).returning();
    return tweet;
  }
  
  async getTweetCount(disasterId: number): Promise<number> {
    const result = await db.select({ count: db.sql`count(*)::int` })
      .from(tweets)
      .where(eq(tweets.disasterId, disasterId));
    return Number(result[0].count);
  }
  
  // Alert methods
  async getAlertsByDisasterId(disasterId: number): Promise<Alert[]> {
    return await db.select()
      .from(alerts)
      .where(eq(alerts.disasterId, disasterId))
      .orderBy(desc(alerts.timestamp));
  }
  
  async createAlert(insertAlert: InsertAlert): Promise<Alert> {
    const [alert] = await db.insert(alerts).values(insertAlert).returning();
    return alert;
  }
  
  async markAlertAsRead(id: number): Promise<Alert | undefined> {
    const [alert] = await db.update(alerts)
      .set({ isRead: true })
      .where(eq(alerts.id, id))
      .returning();
    return alert || undefined;
  }
  
  // Trending topic methods
  async getTrendingTopicsByDisasterId(disasterId: number): Promise<TrendingTopic[]> {
    return await db.select()
      .from(trendingTopics)
      .where(eq(trendingTopics.disasterId, disasterId))
      .orderBy(desc(trendingTopics.count));
  }
  
  async createTrendingTopic(insertTrendingTopic: InsertTrendingTopic): Promise<TrendingTopic> {
    const [trendingTopic] = await db.insert(trendingTopics).values(insertTrendingTopic).returning();
    return trendingTopic;
  }
  
  async updateTrendingTopic(id: number, count: number, percentageChange: string): Promise<TrendingTopic | undefined> {
    const [trendingTopic] = await db.update(trendingTopics)
      .set({ 
        count, 
        percentageChange, 
        timestamp: new Date() 
      })
      .where(eq(trendingTopics.id, id))
      .returning();
    return trendingTopic || undefined;
  }

  // Initialize demo data method - can be called after database setup
  async initializeDemoData() {
    // Create a demo user if it doesn't exist
    const existingUser = await this.getUserByUsername('jdavis');
    if (!existingUser) {
      const demoUser: InsertUser = {
        username: 'jdavis',
        password: '$2a$10$tYOZT5YIxmxiLxL9LCmaeu./XcZa2zq9Rj7UVBn5nL7T1fQeB21ba', // hashed 'password123'
        fullName: 'Jamie Davis',
        role: 'Disaster Response Coordinator',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      };
      await this.createUser(demoUser);
    }
    
    // Create a demo disaster if none exists
    const existingDisasters = await this.getActiveDisasters();
    if (existingDisasters.length === 0) {
      const now = new Date();
      const demoDisaster: InsertDisaster = {
        name: 'Hurricane Florence',
        type: 'hurricane',
        status: 'active',
        geographicArea: 'North Carolina, USA',
        startDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        endDate: null
      };
      const disaster = await this.createDisaster(demoDisaster);
      
      // Create demo keywords
      const keywords = [
        { keyword: 'hurricane', isHashtag: false, isActive: true, disasterId: disaster.id },
        { keyword: 'flooding', isHashtag: false, isActive: true, disasterId: disaster.id },
        { keyword: 'evacuation', isHashtag: false, isActive: true, disasterId: disaster.id },
        { keyword: 'Florence', isHashtag: false, isActive: true, disasterId: disaster.id },
        { keyword: 'HurricaneFlorence', isHashtag: true, isActive: true, disasterId: disaster.id },
        { keyword: 'NCwx', isHashtag: true, isActive: true, disasterId: disaster.id },
        { keyword: 'disaster', isHashtag: false, isActive: false, disasterId: disaster.id }
      ];
      
      for (const keyword of keywords) {
        await this.createKeyword(keyword);
      }
      
      // Create demo trending topics
      const trendingTopics = [
        { topic: '#NCwx', count: 182, percentageChange: '+24%', timestamp: new Date(), disasterId: disaster.id },
        { topic: '#HurricaneFlorence', count: 145, percentageChange: '+18%', timestamp: new Date(), disasterId: disaster.id },
        { topic: 'Wilmington', count: 89, percentageChange: '+12%', timestamp: new Date(), disasterId: disaster.id },
        { topic: 'evacuation', count: 76, percentageChange: '+8%', timestamp: new Date(), disasterId: disaster.id },
        { topic: 'flooding', count: 65, percentageChange: '+5%', timestamp: new Date(), disasterId: disaster.id }
      ];
      
      for (const topic of trendingTopics) {
        await this.createTrendingTopic(topic);
      }
      
      // Create demo alerts
      const alerts = [
        { 
          message: 'Significant increase in negative sentiment detected in Wilmington area',
          level: 'high',
          timestamp: new Date(),
          isRead: false,
          disasterId: disaster.id
        },
        { 
          message: 'New trending topic emerging: "power outage"',
          level: 'medium',
          timestamp: new Date(now.getTime() - 3600000), // 1 hour ago
          isRead: false,
          disasterId: disaster.id
        },
        { 
          message: 'Evacuation sentiment rising in coastal areas',
          level: 'info',
          timestamp: new Date(now.getTime() - 7200000), // 2 hours ago
          isRead: true,
          disasterId: disaster.id
        }
      ];
      
      for (const alert of alerts) {
        await this.createAlert(alert);
      }
      
      // Add sample tweets
      const tweetData = [
        {
          tweetId: "tw10001",
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
          tweetId: "tw10002",
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
          matchedKeywords: ["evacuation", "HurricaneFlorence", "NCwx"]
        },
        {
          tweetId: "tw10003",
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
      
      for (const data of tweetData) {
        // Convert to proper InsertTweet type
        const tweetToInsert: InsertTweet = {
          tweetId: data.tweetId,
          disasterId: data.disasterId,
          username: data.username,
          displayName: data.displayName,
          content: data.content,
          location: data.location,
          latitude: data.latitude,
          longitude: data.longitude,
          sentiment: data.sentiment,
          sentimentScore: data.sentimentScore,
          timestamp: data.timestamp,
          matchedKeywords: data.matchedKeywords
        };
        await this.createTweet(tweetToInsert);
      }
    }
  }
}