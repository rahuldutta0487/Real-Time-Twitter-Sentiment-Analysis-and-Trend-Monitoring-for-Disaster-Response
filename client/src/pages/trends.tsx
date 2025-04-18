import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingTopics, SentimentOverview } from "@/components/dashboard";

export default function Trends() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Trend Analysis</h1>
        <p className="text-neutral-600">
          Analyze social media trends and sentiment patterns over time.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SentimentOverview />
        <TrendingTopics />
      </div>
      
      <Card className="shadow">
        <CardHeader className="border-b border-neutral-200 p-4">
          <CardTitle className="font-semibold text-neutral-900 text-lg">Extended Trend Analysis</CardTitle>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="text-center py-12">
            <span className="material-icons text-5xl text-neutral-300 mb-4">trending_up</span>
            <h3 className="text-xl font-medium text-neutral-700 mb-2">Extended Trend Analysis</h3>
            <p className="text-neutral-500 max-w-md mx-auto">
              Advanced trend visualization and pattern recognition will be available in a future update.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
