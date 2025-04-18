import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { useDisaster } from "@/context/DisasterContext";
import { useTweetData } from "@/hooks/useTweetData";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function KeywordConfiguration() {
  const { currentDisaster } = useDisaster();
  const { refreshData } = useTweetData();
  const { toast } = useToast();
  const [newKeyword, setNewKeyword] = useState('');
  const [updateFrequency, setUpdateFrequency] = useState(5);

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return;
    
    try {
      const isHashtag = newKeyword.startsWith('#');
      const keyword = isHashtag ? newKeyword.substring(1) : newKeyword;
      
      await apiRequest('POST', `/api/disasters/${currentDisaster.id}/keywords`, {
        keyword,
        isHashtag,
        isActive: true,
        disasterId: currentDisaster.id
      });
      
      toast({
        title: "Keyword added",
        description: `"${newKeyword}" has been added to monitoring`,
      });
      
      setNewKeyword('');
      refreshData();
    } catch (error) {
      toast({
        title: "Error adding keyword",
        description: "Failed to add the keyword. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleQuickAdd = (keyword: string) => {
    setNewKeyword(keyword);
  };

  return (
    <Card className="shadow">
      <CardHeader className="border-b border-neutral-200 p-4">
        <CardTitle className="font-semibold text-neutral-900 text-lg">Monitoring Configuration</CardTitle>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="mb-4">
          <label htmlFor="add-keyword" className="block text-sm font-medium text-neutral-700 mb-1">
            Add Keyword or Hashtag
          </label>
          <div className="flex">
            <Input
              id="add-keyword"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              className="rounded-r-none"
              placeholder="Enter keyword..."
            />
            <Button 
              onClick={handleAddKeyword}
              className="rounded-l-none"
            >
              Add
            </Button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="text-sm text-neutral-700 font-medium mr-2">Quick Add:</span>
          <button 
            className="text-xs px-2 py-1 rounded-md border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700"
            onClick={() => handleQuickAdd('#Relief')}
          >
            #Relief
          </button>
          <button 
            className="text-xs px-2 py-1 rounded-md border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700"
            onClick={() => handleQuickAdd('#EmergencyResponse')}
          >
            #EmergencyResponse
          </button>
          <button 
            className="text-xs px-2 py-1 rounded-md border border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700"
            onClick={() => handleQuickAdd('#Weather')}
          >
            #Weather
          </button>
        </div>
        
        <div className="border-t border-neutral-200 pt-4">
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="frequency" className="block text-sm font-medium text-neutral-700">
              Update Frequency
            </label>
            <span className="text-sm text-neutral-500">{updateFrequency} seconds</span>
          </div>
          <Slider 
            id="frequency"
            min={1}
            max={60}
            step={1}
            value={[updateFrequency]}
            onValueChange={(value) => setUpdateFrequency(value[0])}
          />
        </div>
      </CardContent>
      
      <CardFooter className="p-3 border-t border-neutral-200 bg-neutral-50 justify-center">
        <Button variant="link" className="text-primary hover:text-primary-dark text-sm font-medium">
          Advanced Configuration
        </Button>
      </CardFooter>
    </Card>
  );
}
