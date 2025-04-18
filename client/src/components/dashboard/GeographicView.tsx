import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTweetData } from "@/hooks/useTweetData";
import { SentimentByLocationData } from "@/types";

interface MapMarker {
  lat: string;
  lng: string;
  sentiment: "positive" | "negative" | "neutral";
  intensity: number;
}

export default function GeographicView() {
  const { tweetCount, sentimentByLocation } = useTweetData();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);

  // This is a placeholder for actual map integration
  // In a real implementation, we would use Mapbox or Leaflet
  useEffect(() => {
    if (sentimentByLocation) {
      // Generate markers from sentiment data
      const newMarkers: MapMarker[] = [];
      
      sentimentByLocation.forEach(location => {
        // This is simplified logic to determine dominant sentiment
        const total = location.positive + location.negative + location.neutral;
        let sentiment: "positive" | "negative" | "neutral" = "neutral";
        let intensity = 0.5; // Default medium intensity
        
        if (location.positive > location.negative && location.positive > location.neutral) {
          sentiment = "positive";
          intensity = location.positive / total;
        } else if (location.negative > location.positive && location.negative > location.neutral) {
          sentiment = "negative";
          intensity = location.negative / total;
        } else {
          sentiment = "neutral";
          intensity = location.neutral / total;
        }
        
        // Extract coordinates from location data
        // Format: "City, State" - we'd need to geocode this in a real implementation
        const parts = location.location.split(',');
        if (parts.length >= 2) {
          // Mock coordinates for demo (would come from geocoding API in real app)
          const mockCoordinates = {
            "Charlotte": { lat: "35.2271", lng: "-80.8431" },
            "Raleigh": { lat: "35.7796", lng: "-78.6382" },
            "Wilmington": { lat: "34.2104", lng: "-77.8868" },
            "Greensboro": { lat: "36.0726", lng: "-79.7920" },
            "Durham": { lat: "35.9940", lng: "-78.8986" },
            "Winston-Salem": { lat: "36.0999", lng: "-80.2442" },
            "Fayetteville": { lat: "35.0527", lng: "-78.8784" },
            "Cary": { lat: "35.7915", lng: "-78.7811" }
          };
          
          const city = parts[0].trim();
          if (mockCoordinates[city as keyof typeof mockCoordinates]) {
            const coords = mockCoordinates[city as keyof typeof mockCoordinates];
            newMarkers.push({
              lat: coords.lat,
              lng: coords.lng,
              sentiment,
              intensity
            });
          }
        }
      });
      
      setMarkers(newMarkers);
    }
  }, [sentimentByLocation]);

  return (
    <Card className="shadow">
      <CardHeader className="border-b border-neutral-200 flex justify-between items-center p-4">
        <CardTitle className="font-semibold text-neutral-900 text-lg">Geographic Sentiment Analysis</CardTitle>
        <div className="flex space-x-2">
          <button className="p-1 rounded text-neutral-500 hover:bg-neutral-100">
            <span className="material-icons">fullscreen</span>
          </button>
          <button className="p-1 rounded text-neutral-500 hover:bg-neutral-100">
            <span className="material-icons">more_vert</span>
          </button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div 
          ref={mapContainerRef}
          className="h-[400px] relative bg-gray-100"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          {/* Map overlay legend */}
          <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 p-3 rounded-md shadow-md text-sm">
            <h3 className="font-medium mb-2">Sentiment Intensity</h3>
            <div className="flex items-center space-x-2 mb-1">
              <span className="block w-4 h-4 rounded-full bg-red-500"></span>
              <span>Negative</span>
            </div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="block w-4 h-4 rounded-full bg-gray-500"></span>
              <span>Neutral</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="block w-4 h-4 rounded-full bg-green-500"></span>
              <span>Positive</span>
            </div>
          </div>
          
          {/* Tweet volume indicator */}
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-md shadow-md text-sm">
            <div className="flex items-center">
              <span className="pulse-indicator bg-primary"></span>
              <span><span className="font-medium">{tweetCount.toLocaleString()}</span> tweets in view</span>
            </div>
          </div>
          
          {/* Render simple circle markers for demonstration */}
          {markers.map((marker, index) => {
            // Note: This is a simplified visualization - in a real app we'd use a mapping library
            const color = marker.sentiment === "positive" 
              ? "bg-green-500" 
              : marker.sentiment === "negative" 
                ? "bg-red-500" 
                : "bg-gray-500";
                
            const size = Math.max(20, Math.min(50, marker.intensity * 50));
            
            // Simplified positioning based on lat/lng (not accurate)
            // In a real app, we'd use the mapping library's projection
            const left = (parseFloat(marker.lng) + 82) * 50; // simplified positioning
            const top = (38 - parseFloat(marker.lat)) * 50; // simplified positioning
            
            return (
              <div 
                key={index}
                className={`absolute rounded-full opacity-70 ${color}`}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${left}px`,
                  top: `${top}px`
                }}
              />
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
