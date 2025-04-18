import React from "react";
import { AlertFeed } from "@/components/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function Alerts() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Alerts & Notifications</h1>
        <p className="text-neutral-600">
          Manage alerts and notification settings for sentiment changes.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AlertFeed />
        </div>
        
        <div>
          <Card className="shadow mb-6">
            <CardHeader className="border-b border-neutral-200 p-4">
              <CardTitle className="font-semibold text-neutral-900 text-lg">Alert Settings</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="negative-alerts" className="font-medium">Negative Sentiment Alerts</Label>
                    <p className="text-sm text-neutral-500">Alert when negative sentiment rises above threshold</p>
                  </div>
                  <Switch id="negative-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="positive-alerts" className="font-medium">Positive Sentiment Alerts</Label>
                    <p className="text-sm text-neutral-500">Alert when positive sentiment rises above threshold</p>
                  </div>
                  <Switch id="positive-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="trending-alerts" className="font-medium">Trending Topic Alerts</Label>
                    <p className="text-sm text-neutral-500">Alert when new topics start trending</p>
                  </div>
                  <Switch id="trending-alerts" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-neutral-500">Receive alerts via email</p>
                  </div>
                  <Switch id="email-notifications" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow">
            <CardHeader className="border-b border-neutral-200 p-4">
              <CardTitle className="font-semibold text-neutral-900 text-lg">Alert Threshold</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="threshold" className="font-medium">Sentiment Change Threshold</Label>
                  <p className="text-sm text-neutral-500 mb-2">Minimum change percentage to trigger an alert</p>
                  <select id="threshold" className="w-full p-2 border border-neutral-300 rounded-md">
                    <option value="5">5% (Very Sensitive)</option>
                    <option value="10">10% (Sensitive)</option>
                    <option value="15" selected>15% (Medium)</option>
                    <option value="20">20% (Less Sensitive)</option>
                    <option value="25">25% (Least Sensitive)</option>
                  </select>
                </div>
                
                <Button className="w-full">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
