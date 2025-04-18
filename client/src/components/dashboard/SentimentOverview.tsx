import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTweetData } from "@/hooks/useTweetData";

export default function SentimentOverview() {
  const { sentimentSummary, tweetCount } = useTweetData();
  
  // Prepare data for the chart
  const sentimentPercentages = {
    positive: sentimentSummary?.positive || 38,
    neutral: sentimentSummary?.neutral || 27,
    negative: sentimentSummary?.negative || 35
  };

  return (
    <Card className="shadow">
      <CardHeader className="border-b border-neutral-200 p-4">
        <CardTitle className="font-semibold text-neutral-900 text-lg">Sentiment Overview</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{sentimentPercentages.positive}%</div>
            <div className="text-sm text-neutral-500">Positive</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-500">{sentimentPercentages.neutral}%</div>
            <div className="text-sm text-neutral-500">Neutral</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{sentimentPercentages.negative}%</div>
            <div className="text-sm text-neutral-500">Negative</div>
          </div>
        </div>
        
        {/* Simple sentiment chart */}
        <div className="h-4 bg-neutral-200 rounded-full overflow-hidden flex mb-4">
          <div 
            className="bg-green-500 h-full" 
            style={{ width: `${sentimentPercentages.positive}%` }}
          ></div>
          <div 
            className="bg-gray-500 h-full" 
            style={{ width: `${sentimentPercentages.neutral}%` }}
          ></div>
          <div 
            className="bg-red-500 h-full" 
            style={{ width: `${sentimentPercentages.negative}%` }}
          ></div>
        </div>
        
        <div className="text-sm text-neutral-500 mb-4">
          Based on <span className="font-medium text-neutral-700">{tweetCount.toLocaleString()}</span> tweets in the last 24 hours
        </div>
        
        <div className="border-t border-neutral-200 pt-4">
          <h3 className="font-medium text-sm mb-2">Sentiment Trend (Last 24h)</h3>
          <div className="chart-container h-[250px]">
            {/* Mock trend chart */}
            <svg width="100%" height="100%" viewBox="0 0 400 100" preserveAspectRatio="none">
              {/* Positive sentiment trend */}
              <polyline 
                points="0,70 50,65 100,60 150,55 200,45 250,50 300,40 350,35 400,38" 
                fill="none" 
                stroke="#4caf50" 
                strokeWidth="2"
              />
              {/* Neutral sentiment trend */}
              <polyline 
                points="0,50 50,55 100,50 150,45 200,50 250,45 300,45 350,40 400,27" 
                fill="none" 
                stroke="#9e9e9e" 
                strokeWidth="2"
              />
              {/* Negative sentiment trend */}
              <polyline 
                points="0,40 50,45 100,50 150,55 200,65 250,60 300,65 350,70 400,35" 
                fill="none" 
                stroke="#f44336" 
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
