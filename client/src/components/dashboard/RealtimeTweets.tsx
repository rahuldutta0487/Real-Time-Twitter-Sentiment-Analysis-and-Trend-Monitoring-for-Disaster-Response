import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTweetData } from "@/hooks/useTweetData";
import { Tweet } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function RealtimeTweets() {
  const { tweets, isPaused, togglePause } = useTweetData();

  const getSentimentStyles = (sentiment: string) => {
    switch(sentiment) {
      case 'positive':
        return {
          wrapperClass: "bg-green-500 bg-opacity-10 text-green-500",
          label: "Positive Sentiment"
        };
      case 'negative':
        return {
          wrapperClass: "bg-red-500 bg-opacity-10 text-red-500",
          label: "Negative Sentiment"
        };
      default:
        return {
          wrapperClass: "bg-gray-500 bg-opacity-10 text-gray-500",
          label: "Neutral Sentiment"
        };
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    try {
      const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (e) {
      return 'Unknown time';
    }
  };

  return (
    <Card className="shadow">
      <CardHeader className="border-b border-neutral-200 p-4 flex justify-between items-center">
        <CardTitle className="font-semibold text-neutral-900 text-lg">Real-time Tweet Analysis</CardTitle>
        <div className="flex items-center space-x-2 text-sm">
          <div className="flex items-center text-primary">
            <span className="pulse-indicator bg-primary animate-pulse"></span>
            <span>Live Feed</span>
          </div>
          <button 
            className="p-1 rounded text-neutral-500 hover:bg-neutral-100"
            onClick={togglePause}
          >
            <span className="material-icons">
              {isPaused ? 'play_arrow' : 'pause'}
            </span>
          </button>
          <button className="p-1 rounded text-neutral-500 hover:bg-neutral-100">
            <span className="material-icons">more_vert</span>
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-neutral-200 max-h-96 overflow-y-auto">
          {tweets.map((tweet: Tweet) => {
            const sentimentStyle = getSentimentStyles(tweet.sentiment);
            
            return (
              <div key={tweet.id} className="p-4 hover:bg-neutral-50 tweet-card transition-transform">
                <div className="flex">
                  <div className="mr-4 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-neutral-200 flex items-center justify-center overflow-hidden">
                      <span className="material-icons text-neutral-500">person</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="font-medium mr-2">{tweet.displayName}</span>
                      <span className="text-neutral-500 text-sm">@{tweet.username}</span>
                      <span className="text-neutral-400 text-xs ml-auto">{formatTimestamp(tweet.timestamp)}</span>
                    </div>
                    <p className="text-sm mb-2">{tweet.content}</p>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className={`text-xs px-2 py-0.5 ${sentimentStyle.wrapperClass} rounded-full`}>
                        {sentimentStyle.label}
                      </span>
                      {tweet.location && (
                        <span className="text-xs px-2 py-0.5 bg-neutral-200 rounded-full">
                          {tweet.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {tweets.length === 0 && (
            <div className="p-8 text-center">
              <span className="material-icons text-neutral-400 text-4xl mb-2">search</span>
              <p className="text-neutral-500">No tweets found with the current filters.</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 border-t border-neutral-200 bg-neutral-50 justify-center">
        <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium">
          Load More Tweets
        </Button>
      </CardFooter>
    </Card>
  );
}
