import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTweetData } from "@/hooks/useTweetData";
import { Alert } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function AlertFeed() {
  const { alerts } = useTweetData();
  
  const unreadAlerts = alerts.filter(alert => !alert.isRead);

  const getLevelStyles = (level: string) => {
    switch(level) {
      case 'high':
        return {
          wrapperClass: "bg-red-500 bg-opacity-10 text-red-500",
          label: "High Priority",
          icon: "priority_high",
          iconClass: "text-red-500"
        };
      case 'medium':
        return {
          wrapperClass: "bg-amber-500 bg-opacity-10 text-amber-500",
          label: "Medium Priority",
          icon: "notifications", 
          iconClass: "text-amber-500"
        };
      default:
        return {
          wrapperClass: "bg-primary bg-opacity-10 text-primary",
          label: "Information",
          icon: "info",
          iconClass: "text-primary"
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
        <CardTitle className="font-semibold text-neutral-900 text-lg">Alert Feed</CardTitle>
        {unreadAlerts.length > 0 && (
          <span className="bg-secondary text-white text-xs font-medium px-2 py-0.5 rounded-full">
            {unreadAlerts.length} New
          </span>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="divide-y divide-neutral-200 max-h-96 overflow-y-auto">
          {alerts.map((alert: Alert) => {
            const levelStyle = getLevelStyles(alert.level);
            
            return (
              <div key={alert.id} className="p-4 hover:bg-neutral-50">
                <div className="flex">
                  <div className="mr-3 mt-0.5">
                    <span className={`material-icons ${levelStyle.iconClass}`}>{levelStyle.icon}</span>
                  </div>
                  <div>
                    <p className="text-sm mb-1">{alert.message}</p>
                    <div className="flex justify-between items-center">
                      <span className={`text-xs font-medium px-2 py-0.5 ${levelStyle.wrapperClass} rounded-full`}>
                        {levelStyle.label}
                      </span>
                      <span className="text-xs text-neutral-500">{formatTimestamp(alert.timestamp)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          
          {alerts.length === 0 && (
            <div className="p-8 text-center">
              <span className="material-icons text-neutral-400 text-4xl mb-2">notifications_none</span>
              <p className="text-neutral-500">No alerts at this time</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-3 border-t border-neutral-200 bg-neutral-50 justify-center">
        <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium">
          View All Alerts
        </Button>
      </CardFooter>
    </Card>
  );
}
