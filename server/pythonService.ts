import { log } from './vite';
import { storage } from './storage';
import { InsertTweet, InsertAlert, InsertTrendingTopic } from '@shared/schema';
import { broadcastToDisaster } from './websocket';

// This service simulates communication with a Python sentiment analysis engine
// In a production environment, this would make HTTP requests to the Python service

// Sentiment thresholds for categorization
const SENTIMENT_THRESHOLDS = {
  positive: 0.3,
  negative: -0.3
};

// Keywords for the demo disaster
const DEMO_KEYWORDS = [
  'hurricane', 'flood', 'evacuation', 'damage', 'rescue',
  'HurricaneFlorence', 'NCEvac', 'FloodWarning', 'Emergency'
];

// Locations in North Carolina for demo
const NC_LOCATIONS = [
  { city: 'Charlotte, NC', lat: '35.2271', lng: '-80.8431' },
  { city: 'Raleigh, NC', lat: '35.7796', lng: '-78.6382' },
  { city: 'Wilmington, NC', lat: '34.2104', lng: '-77.8868' },
  { city: 'Greensboro, NC', lat: '36.0726', lng: '-79.7920' },
  { city: 'Durham, NC', lat: '35.9940', lng: '-78.8986' },
  { city: 'Winston-Salem, NC', lat: '36.0999', lng: '-80.2442' },
  { city: 'Fayetteville, NC', lat: '35.0527', lng: '-78.8784' },
  { city: 'Cary, NC', lat: '35.7915', lng: '-78.7811' }
];

// Sample tweet content for simulation
const TWEET_TEMPLATES = [
  { 
    content: "Water levels rising on {street} Street. Anyone know if evacuation centers are open? #HurricaneFlorence #Emergency",
    sentiment: "negative", 
    score: -0.7 
  },
  { 
    content: "Just lost power in {neighborhood} area. Anyone else affected? #PowerOutage #HurricaneFlorence",
    sentiment: "negative", 
    score: -0.5 
  },
  { 
    content: "Emergency responders rescued a family from their flooded home on {street} Avenue. Heroes! #RescueEfforts #HurricaneFlorence",
    sentiment: "positive", 
    score: 0.8 
  },
  { 
    content: "Weather update: Hurricane Florence now downgraded but still dangerous. Stay alert. #WeatherUpdate #HurricaneFlorence",
    sentiment: "neutral", 
    score: -0.1 
  },
  { 
    content: "Volunteers needed at {school} shelter. Bring supplies if possible. #NCEvac #HurricaneFlorence",
    sentiment: "positive", 
    score: 0.6 
  },
  { 
    content: "Road closed due to flooding: {street} between Main and Oak. Seek alternate routes. #FloodWarning #NCTraffic",
    sentiment: "neutral", 
    score: -0.2 
  },
  { 
    content: "Just watched the roof blow off the {building} building downtown. Terrifying. Stay safe everyone. #HurricaneFlorence #Damage",
    sentiment: "negative", 
    score: -0.8 
  },
  { 
    content: "National Guard has arrived in {city} with supplies and equipment. Thank you for the help! #Relief #EmergencyResponse",
    sentiment: "positive", 
    score: 0.75 
  }
];

// Variables to fill in templates
const STREETS = ['Main', 'Oak', 'Pine', 'Maple', 'River', 'Lake', 'Church', 'Washington'];
const NEIGHBORHOODS = ['Downtown', 'Riverside', 'Oakwood', 'Northside', 'Westview', 'Southpark'];
const SCHOOLS = ['Lincoln High', 'Washington Elementary', 'Jefferson Middle', 'Central High', 'Memorial Elementary'];
const BUILDINGS = ['Town Hall', 'Library', 'Police Station', 'Post Office', 'Shopping Center', 'Hospital'];

// Track sentiment data by location
let sentimentByLocation = new Map<string, { positive: number, negative: number, neutral: number }>();

// Current tweet ID counter - use a larger starting number and include timestamp
let tweetIdCounter = 100000000;

// Initialize sentiment data for demo
function initializeSentimentData() {
  NC_LOCATIONS.forEach(location => {
    sentimentByLocation.set(location.city, {
      positive: Math.floor(Math.random() * 100) + 20,
      negative: Math.floor(Math.random() * 100) + 20,
      neutral: Math.floor(Math.random() * 100) + 20
    });
  });
}

// Start sentiment data tracking
initializeSentimentData();

// Generate a tweet with random data
async function generateRandomTweet(disasterId: number): Promise<InsertTweet> {
  // Pick random template
  const template = TWEET_TEMPLATES[Math.floor(Math.random() * TWEET_TEMPLATES.length)];
  
  // Replace template variables
  let content = template.content;
  if (content.includes('{street}')) {
    content = content.replace('{street}', STREETS[Math.floor(Math.random() * STREETS.length)]);
  }
  if (content.includes('{neighborhood}')) {
    content = content.replace('{neighborhood}', NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)]);
  }
  if (content.includes('{school}')) {
    content = content.replace('{school}', SCHOOLS[Math.floor(Math.random() * SCHOOLS.length)]);
  }
  if (content.includes('{building}')) {
    content = content.replace('{building}', BUILDINGS[Math.floor(Math.random() * BUILDINGS.length)]);
  }
  if (content.includes('{city}')) {
    content = content.replace('{city}', NC_LOCATIONS[Math.floor(Math.random() * NC_LOCATIONS.length)].city.split(',')[0]);
  }
  
  // Pick random location
  const location = NC_LOCATIONS[Math.floor(Math.random() * NC_LOCATIONS.length)];
  
  // Determine matching keywords
  const matchedKeywords = DEMO_KEYWORDS.filter(keyword => 
    content.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // Add a bit of randomness to the sentiment score
  const sentimentVariation = (Math.random() * 0.2) - 0.1; // -0.1 to 0.1
  const sentimentScore = template.score + sentimentVariation;
  
  // Determine sentiment category
  let sentiment: string;
  if (sentimentScore >= SENTIMENT_THRESHOLDS.positive) {
    sentiment = 'positive';
  } else if (sentimentScore <= SENTIMENT_THRESHOLDS.negative) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  // Update sentiment data for the location
  const locationSentiment = sentimentByLocation.get(location.city);
  if (locationSentiment) {
    locationSentiment[sentiment as keyof typeof locationSentiment]++;
    sentimentByLocation.set(location.city, locationSentiment);
  }
  
  // Create new tweet
  tweetIdCounter++;
  
  // Generate display name and username
  const usernames = ['resident', 'local', 'citizen', 'neighbor', 'reporter', 'eyewitness'];
  const adjectives = ['concerned', 'worried', 'hopeful', 'alert', 'cautious', 'informed'];
  
  const username = `${usernames[Math.floor(Math.random() * usernames.length)]}${Math.floor(Math.random() * 1000)}`;
  const displayName = `${adjectives[Math.floor(Math.random() * adjectives.length)].charAt(0).toUpperCase() + 
                          adjectives[Math.floor(Math.random() * adjectives.length)].slice(1)} ${
                          usernames[Math.floor(Math.random() * usernames.length)].charAt(0).toUpperCase() + 
                          usernames[Math.floor(Math.random() * usernames.length)].slice(1)}`;
  
  // Generate a more unique tweet ID with timestamp to prevent collisions
  const timestamp = new Date().getTime();
  return {
    tweetId: `tw${tweetIdCounter}_${timestamp}`,
    disasterId,
    username,
    displayName,
    content,
    location: location.city,
    latitude: location.lat,
    longitude: location.lng,
    sentiment,
    sentimentScore: sentimentScore.toFixed(2),
    timestamp: new Date(),
    matchedKeywords
  };
}

// Check for sentiment changes and create alerts
async function checkForSentimentAlerts(disasterId: number) {
  // Generate a sentiment alert based on some heuristic
  const locations = Array.from(sentimentByLocation.keys());
  const locationIndex = Math.floor(Math.random() * locations.length);
  const location = locations[locationIndex];
  
  const sentimentData = sentimentByLocation.get(location);
  if (!sentimentData) return;
  
  const total = sentimentData.positive + sentimentData.negative + sentimentData.neutral;
  const negativePercentage = (sentimentData.negative / total) * 100;
  
  // If negative sentiment is high, generate an alert
  if (negativePercentage > 45 && Math.random() < 0.2) {  // 20% chance to generate alert when negative > 45%
    const alert: InsertAlert = {
      disasterId,
      message: `High negative sentiment detected in ${location} area (${negativePercentage.toFixed(1)}%)`,
      level: 'high',
      timestamp: new Date(),
      isRead: false
    };
    
    const createdAlert = await storage.createAlert(alert);
    broadcastToDisaster(disasterId, {
      type: 'alert',
      payload: createdAlert
    });
  }
  
  // Randomly generate other types of alerts with lower probability
  if (Math.random() < 0.1) {  // 10% chance
    const alertTypes = [
      { message: `New evacuation hashtag trending: #${NEIGHBORHOODS[Math.floor(Math.random() * NEIGHBORHOODS.length)]}Evac`, level: 'medium' },
      { message: `Positive sentiment around rescue efforts increasing in ${location}`, level: 'info' },
      { message: `Sudden spike in tweets about power outages in ${location}`, level: 'medium' },
      { message: `Emergency services response mentioned positively in ${Math.floor(sentimentData.positive / 2)} tweets`, level: 'info' }
    ];
    
    const selectedAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    
    const alert: InsertAlert = {
      disasterId,
      message: selectedAlert.message,
      level: selectedAlert.level as 'high' | 'medium' | 'info',
      timestamp: new Date(),
      isRead: false
    };
    
    const createdAlert = await storage.createAlert(alert);
    broadcastToDisaster(disasterId, {
      type: 'alert',
      payload: createdAlert
    });
  }
}

// Update trending topics
async function updateTrendingTopics(disasterId: number) {
  // Get current trending topics
  const currentTopics = await storage.getTrendingTopicsByDisasterId(disasterId);
  
  // Update with random changes
  for (const topic of currentTopics) {
    // Random change between -10% and +30%
    const changePercentage = Math.floor(Math.random() * 40) - 10;
    
    if (changePercentage > 0) {
      const newCount = topic.count + Math.floor(topic.count * (changePercentage / 100));
      const newPercentageChange = (parseInt(topic.percentageChange) + changePercentage).toString();
      
      const updatedTopic = await storage.updateTrendingTopic(
        topic.id,
        newCount,
        newPercentageChange
      );
      
      if (updatedTopic) {
        // Broadcast the update
        broadcastToDisaster(disasterId, {
          type: 'trendingTopicsUpdate',
          payload: await storage.getTrendingTopicsByDisasterId(disasterId)
        });
      }
    }
  }
}

// Start the simulation for a disaster
export async function startSimulation(disasterId: number, interval = 5000) {
  log(`Starting tweet simulation for disaster ${disasterId}`, 'python');
  
  // Generate tweet every few seconds
  setInterval(async () => {
    try {
      const tweet = await generateRandomTweet(disasterId);
      const savedTweet = await storage.createTweet(tweet);
      
      // Broadcast the tweet to all connected clients
      broadcastToDisaster(disasterId, {
        type: 'tweet',
        payload: savedTweet
      });
      
      // Check for sentiment alerts occasionally
      if (Math.random() < 0.15) { // 15% chance with each tweet
        await checkForSentimentAlerts(disasterId);
      }
      
      // Update trending topics occasionally
      if (Math.random() < 0.1) { // 10% chance with each tweet
        await updateTrendingTopics(disasterId);
      }
      
    } catch (error) {
      log(`Error in tweet simulation: ${error}`, 'python');
    }
  }, interval);
  
  // Send sentiment data updates periodically
  setInterval(() => {
    try {
      // Calculate total sentiment across all locations
      let totalPositive = 0;
      let totalNegative = 0;
      let totalNeutral = 0;
      
      for (const sentiment of sentimentByLocation.values()) {
        totalPositive += sentiment.positive;
        totalNegative += sentiment.negative;
        totalNeutral += sentiment.neutral;
      }
      
      const total = totalPositive + totalNegative + totalNeutral;
      
      // Send update to all connected clients
      broadcastToDisaster(disasterId, {
        type: 'sentimentUpdate',
        payload: {
          summary: {
            positive: Math.round((totalPositive / total) * 100),
            negative: Math.round((totalNegative / total) * 100),
            neutral: Math.round((totalNeutral / total) * 100),
            total: total
          },
          byLocation: Array.from(sentimentByLocation.entries()).map(([location, sentiment]) => ({
            location,
            positive: sentiment.positive,
            negative: sentiment.negative,
            neutral: sentiment.neutral,
            total: sentiment.positive + sentiment.negative + sentiment.neutral
          }))
        }
      });
    } catch (error) {
      log(`Error sending sentiment update: ${error}`, 'python');
    }
  }, 10000); // Send updates every 10 seconds
}
