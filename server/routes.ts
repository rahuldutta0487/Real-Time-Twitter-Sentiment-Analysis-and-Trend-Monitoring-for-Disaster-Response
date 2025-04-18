import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupWebSocketServer } from "./websocket";
import { startSimulation } from "./pythonService";
import { z } from "zod";
import { insertKeywordSchema } from "@shared/schema";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup WebSocket server
  const wss = setupWebSocketServer(httpServer);
  
  // API routes
  app.get('/api/disasters', async (req, res) => {
    try {
      const disasters = await storage.getActiveDisasters();
      res.json(disasters);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch disasters' });
    }
  });
  
  app.get('/api/disasters/:id', async (req, res) => {
    try {
      const disasterId = parseInt(req.params.id);
      if (isNaN(disasterId)) {
        return res.status(400).json({ message: 'Invalid disaster ID' });
      }
      
      const disaster = await storage.getDisaster(disasterId);
      if (!disaster) {
        return res.status(404).json({ message: 'Disaster not found' });
      }
      
      res.json(disaster);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch disaster' });
    }
  });
  
  // Keywords for a disaster
  app.get('/api/disasters/:id/keywords', async (req, res) => {
    try {
      const disasterId = parseInt(req.params.id);
      if (isNaN(disasterId)) {
        return res.status(400).json({ message: 'Invalid disaster ID' });
      }
      
      const keywords = await storage.getKeywordsByDisasterId(disasterId);
      res.json(keywords);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch keywords' });
    }
  });
  
  // Add a new keyword
  app.post('/api/disasters/:id/keywords', async (req, res) => {
    try {
      const disasterId = parseInt(req.params.id);
      if (isNaN(disasterId)) {
        return res.status(400).json({ message: 'Invalid disaster ID' });
      }
      
      const disaster = await storage.getDisaster(disasterId);
      if (!disaster) {
        return res.status(404).json({ message: 'Disaster not found' });
      }
      
      // Validate request body
      const result = insertKeywordSchema.safeParse({
        ...req.body,
        disasterId
      });
      
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid keyword data', errors: result.error });
      }
      
      const keyword = await storage.createKeyword(result.data);
      res.status(201).json(keyword);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create keyword' });
    }
  });
  
  // Toggle keyword active state
  app.patch('/api/keywords/:id', async (req, res) => {
    try {
      const keywordId = parseInt(req.params.id);
      if (isNaN(keywordId)) {
        return res.status(400).json({ message: 'Invalid keyword ID' });
      }
      
      // Validate request body
      const schema = z.object({
        isActive: z.boolean()
      });
      
      const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: 'Invalid request body', errors: result.error });
      }
      
      const keyword = await storage.updateKeyword(keywordId, result.data.isActive);
      if (!keyword) {
        return res.status(404).json({ message: 'Keyword not found' });
      }
      
      res.json(keyword);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update keyword' });
    }
  });
  
  // Delete a keyword
  app.delete('/api/keywords/:id', async (req, res) => {
    try {
      const keywordId = parseInt(req.params.id);
      if (isNaN(keywordId)) {
        return res.status(400).json({ message: 'Invalid keyword ID' });
      }
      
      const success = await storage.deleteKeyword(keywordId);
      if (!success) {
        return res.status(404).json({ message: 'Keyword not found' });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete keyword' });
    }
  });
  
  // Get tweets for a disaster
  app.get('/api/disasters/:id/tweets', async (req, res) => {
    try {
      const disasterId = parseInt(req.params.id);
      if (isNaN(disasterId)) {
        return res.status(400).json({ message: 'Invalid disaster ID' });
      }
      
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      
      const tweets = await storage.getTweetsByDisasterId(disasterId, limit);
      res.json(tweets);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tweets' });
    }
  });
  
  // Get tweet count for a disaster
  app.get('/api/disasters/:id/tweets/count', async (req, res) => {
    try {
      const disasterId = parseInt(req.params.id);
      if (isNaN(disasterId)) {
        return res.status(400).json({ message: 'Invalid disaster ID' });
      }
      
      const count = await storage.getTweetCount(disasterId);
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch tweet count' });
    }
  });
  
  // Get alerts for a disaster
  app.get('/api/disasters/:id/alerts', async (req, res) => {
    try {
      const disasterId = parseInt(req.params.id);
      if (isNaN(disasterId)) {
        return res.status(400).json({ message: 'Invalid disaster ID' });
      }
      
      const alerts = await storage.getAlertsByDisasterId(disasterId);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch alerts' });
    }
  });
  
  // Mark an alert as read
  app.patch('/api/alerts/:id/read', async (req, res) => {
    try {
      const alertId = parseInt(req.params.id);
      if (isNaN(alertId)) {
        return res.status(400).json({ message: 'Invalid alert ID' });
      }
      
      const alert = await storage.markAlertAsRead(alertId);
      if (!alert) {
        return res.status(404).json({ message: 'Alert not found' });
      }
      
      res.json(alert);
    } catch (error) {
      res.status(500).json({ message: 'Failed to mark alert as read' });
    }
  });
  
  // Get trending topics for a disaster
  app.get('/api/disasters/:id/trending-topics', async (req, res) => {
    try {
      const disasterId = parseInt(req.params.id);
      if (isNaN(disasterId)) {
        return res.status(400).json({ message: 'Invalid disaster ID' });
      }
      
      const trendingTopics = await storage.getTrendingTopicsByDisasterId(disasterId);
      res.json(trendingTopics);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch trending topics' });
    }
  });
  
  // Start the simulation for the demo disaster
  startSimulation(1).catch(error => {
    log(`Failed to start simulation: ${error}`, 'error');
  });

  return httpServer;
}
