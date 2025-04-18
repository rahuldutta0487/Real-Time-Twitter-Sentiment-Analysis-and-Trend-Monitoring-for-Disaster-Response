import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// User account schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  role: text("role").notNull(),
  avatarUrl: text("avatar_url"),
});

export const usersRelations = relations(users, ({ many }) => ({
  disasters: many(disasters),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  role: true,
  avatarUrl: true,
});

// Disaster events schema
export const disasters = pgTable("disasters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // hurricane, earthquake, flood, etc.
  status: text("status").notNull(), // active, inactive
  geographicArea: text("geographic_area").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
});

export const disastersRelations = relations(disasters, ({ many }) => ({
  keywords: many(keywords),
  tweets: many(tweets),
  alerts: many(alerts),
  trendingTopics: many(trendingTopics),
}));

export const insertDisasterSchema = createInsertSchema(disasters).omit({
  id: true,
});

// Keywords schema
export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  disasterId: integer("disaster_id").notNull(),
  keyword: text("keyword").notNull(),
  isHashtag: boolean("is_hashtag").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
});

export const keywordsRelations = relations(keywords, ({ one }) => ({
  disaster: one(disasters, {
    fields: [keywords.disasterId],
    references: [disasters.id],
  }),
}));

export const insertKeywordSchema = createInsertSchema(keywords).omit({
  id: true,
});

// Tweet schema
export const tweets = pgTable("tweets", {
  id: serial("id").primaryKey(),
  tweetId: text("tweet_id").notNull().unique(),
  disasterId: integer("disaster_id").notNull(),
  username: text("username").notNull(),
  displayName: text("display_name").notNull(),
  content: text("content").notNull(),
  location: text("location"),
  latitude: text("latitude"),
  longitude: text("longitude"),
  sentiment: text("sentiment").notNull(), // positive, negative, neutral
  sentimentScore: text("sentiment_score").notNull(),
  timestamp: timestamp("timestamp").notNull(),
  matchedKeywords: json("matched_keywords").notNull().$type<string[]>(),
});

export const tweetsRelations = relations(tweets, ({ one }) => ({
  disaster: one(disasters, {
    fields: [tweets.disasterId],
    references: [disasters.id],
  }),
}));

export const insertTweetSchema = createInsertSchema(tweets).omit({
  id: true,
});

// Alert schema
export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  disasterId: integer("disaster_id").notNull(),
  message: text("message").notNull(),
  level: text("level").notNull(), // high, medium, info
  timestamp: timestamp("timestamp").notNull(),
  isRead: boolean("is_read").notNull().default(false),
});

export const alertsRelations = relations(alerts, ({ one }) => ({
  disaster: one(disasters, {
    fields: [alerts.disasterId],
    references: [disasters.id],
  }),
}));

export const insertAlertSchema = createInsertSchema(alerts).omit({
  id: true,
});

// TrendingTopic schema
export const trendingTopics = pgTable("trending_topics", {
  id: serial("id").primaryKey(),
  disasterId: integer("disaster_id").notNull(),
  topic: text("topic").notNull(),
  count: integer("count").notNull(),
  percentageChange: text("percentage_change").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const trendingTopicsRelations = relations(trendingTopics, ({ one }) => ({
  disaster: one(disasters, {
    fields: [trendingTopics.disasterId],
    references: [disasters.id],
  }),
}));

export const insertTrendingTopicSchema = createInsertSchema(trendingTopics).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Disaster = typeof disasters.$inferSelect;
export type InsertDisaster = z.infer<typeof insertDisasterSchema>;

export type Keyword = typeof keywords.$inferSelect;
export type InsertKeyword = z.infer<typeof insertKeywordSchema>;

export type Tweet = typeof tweets.$inferSelect;
export type InsertTweet = z.infer<typeof insertTweetSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type TrendingTopic = typeof trendingTopics.$inferSelect;
export type InsertTrendingTopic = z.infer<typeof insertTrendingTopicSchema>;
