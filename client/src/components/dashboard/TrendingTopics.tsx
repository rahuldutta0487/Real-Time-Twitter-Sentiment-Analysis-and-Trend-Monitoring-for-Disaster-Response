import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTweetData } from "@/hooks/useTweetData";
import { TrendingTopic } from "@/types";

export default function TrendingTopics() {
  const { trendingTopics } = useTweetData();

  return (
    <Card className="shadow">
      <CardHeader className="border-b border-neutral-200 p-4">
        <CardTitle className="font-semibold text-neutral-900 text-lg">Trending Topics</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="space-y-4">
          {trendingTopics.map((topic: TrendingTopic) => (
            <div key={topic.id} className="flex items-center">
              <div className="w-full">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{topic.topic}</span>
                  <span className="text-sm text-neutral-500">+{topic.percentageChange}%</span>
                </div>
                <div className="h-2 bg-neutral-200 rounded-full">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ 
                      width: `${Math.min(parseInt(topic.percentageChange) / 3, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
          
          {trendingTopics.length === 0 && (
            <div className="py-4 text-center">
              <span className="material-icons text-neutral-400 text-3xl mb-2">trending_up</span>
              <p className="text-neutral-500">No trending topics found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
