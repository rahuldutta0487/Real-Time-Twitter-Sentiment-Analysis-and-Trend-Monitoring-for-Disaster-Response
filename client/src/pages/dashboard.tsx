import React from "react";
import { 
  GeographicView,
  RealtimeTweets,
  SentimentOverview,
  TrendingTopics,
  AlertFeed,
  KeywordConfiguration
} from "@/components/dashboard";

export default function Dashboard() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column with map and tweets */}
        <div className="lg:col-span-2 space-y-6">
          <GeographicView />
          <RealtimeTweets />
        </div>
        
        {/* Sidebar with analytics and alerts */}
        <div className="space-y-6">
          <SentimentOverview />
          <TrendingTopics />
          <AlertFeed />
          <KeywordConfiguration />
        </div>
      </div>
    </div>
  );
}
