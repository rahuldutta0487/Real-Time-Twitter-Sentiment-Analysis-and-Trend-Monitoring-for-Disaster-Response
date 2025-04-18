import React from "react";
import { GeographicView } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Geographic() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Geographic Analysis</h1>
        <p className="text-neutral-600">
          Visualize sentiment data across affected geographical regions.
        </p>
      </div>
      
      <div className="mb-6">
        <GeographicView />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow">
          <CardHeader className="border-b border-neutral-200 p-4">
            <CardTitle className="font-semibold text-neutral-900 text-lg">Regional Sentiment Breakdown</CardTitle>
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="text-center py-12">
              <span className="material-icons text-5xl text-neutral-300 mb-4">pie_chart</span>
              <h3 className="text-xl font-medium text-neutral-700 mb-2">Regional Data</h3>
              <p className="text-neutral-500 max-w-md mx-auto">
                Detailed regional sentiment breakdown will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow">
          <CardHeader className="border-b border-neutral-200 p-4">
            <CardTitle className="font-semibold text-neutral-900 text-lg">Hotspot Detection</CardTitle>
          </CardHeader>
          
          <CardContent className="p-4">
            <div className="text-center py-12">
              <span className="material-icons text-5xl text-neutral-300 mb-4">local_fire_department</span>
              <h3 className="text-xl font-medium text-neutral-700 mb-2">Hotspot Analysis</h3>
              <p className="text-neutral-500 max-w-md mx-auto">
                Auto-detection of emerging sentiment hotspots will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
