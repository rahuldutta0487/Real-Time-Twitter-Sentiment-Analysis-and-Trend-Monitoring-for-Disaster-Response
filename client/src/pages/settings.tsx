import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDisaster } from "@/context/DisasterContext";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Keyword } from "@/types";

export default function Settings() {
  const { currentDisaster } = useDisaster();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newKeyword, setNewKeyword] = useState('');
  
  // Fetch keywords
  const { data: keywords = [] } = useQuery({
    queryKey: [`/api/disasters/${currentDisaster?.id}/keywords`],
    enabled: !!currentDisaster?.id,
  });
  
  // Add keyword mutation
  const addKeywordMutation = useMutation({
    mutationFn: async (keyword: string) => {
      const isHashtag = keyword.startsWith('#');
      const keywordText = isHashtag ? keyword.substring(1) : keyword;
      
      return apiRequest('POST', `/api/disasters/${currentDisaster?.id}/keywords`, {
        keyword: keywordText,
        isHashtag,
        isActive: true,
        disasterId: currentDisaster?.id
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/disasters/${currentDisaster?.id}/keywords`] });
      setNewKeyword('');
      toast({
        title: "Keyword added",
        description: "The keyword was added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add keyword. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Toggle keyword active state mutation
  const toggleKeywordMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: number, isActive: boolean }) => {
      return apiRequest('PATCH', `/api/keywords/${id}`, {
        isActive
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/disasters/${currentDisaster?.id}/keywords`] });
      toast({
        title: "Keyword updated",
        description: "The keyword status was updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update keyword. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  // Delete keyword mutation
  const deleteKeywordMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest('DELETE', `/api/keywords/${id}`, undefined);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/disasters/${currentDisaster?.id}/keywords`] });
      toast({
        title: "Keyword deleted",
        description: "The keyword was removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete keyword. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const handleAddKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyword.trim()) return;
    
    addKeywordMutation.mutate(newKeyword);
  };
  
  const handleToggleKeyword = (id: number, isActive: boolean) => {
    toggleKeywordMutation.mutate({ id, isActive: !isActive });
  };
  
  const handleDeleteKeyword = (id: number) => {
    if (confirm('Are you sure you want to delete this keyword?')) {
      deleteKeywordMutation.mutate(id);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-2">Settings</h1>
        <p className="text-neutral-600">
          Configure monitoring parameters and system settings.
        </p>
      </div>
      
      <Tabs defaultValue="keywords" className="mb-6">
        <TabsList className="mb-4">
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="filters">Filters</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        
        <TabsContent value="keywords">
          <Card className="shadow">
            <CardHeader className="border-b border-neutral-200 p-4">
              <CardTitle className="font-semibold text-neutral-900 text-lg">Keyword Management</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              <form onSubmit={handleAddKeyword} className="mb-6">
                <div className="flex mb-4">
                  <Input
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    placeholder="Add new keyword or hashtag (e.g. flood or #rescue)"
                    className="rounded-r-none"
                  />
                  <Button 
                    type="submit" 
                    className="rounded-l-none"
                    disabled={addKeywordMutation.isPending}
                  >
                    {addKeywordMutation.isPending ? "Adding..." : "Add Keyword"}
                  </Button>
                </div>
                <p className="text-sm text-neutral-500">
                  Add keywords or hashtags to monitor in social media posts. 
                  Prefix with # to indicate a hashtag.
                </p>
              </form>
              
              <div className="border-t border-neutral-200 pt-4">
                <h3 className="font-medium mb-4">Active Keywords</h3>
                
                {keywords.length === 0 ? (
                  <p className="text-neutral-500 text-center py-4">No keywords configured yet</p>
                ) : (
                  <div className="space-y-3">
                    {keywords.map((keyword: Keyword) => (
                      <div key={keyword.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-md">
                        <div className="flex items-center">
                          <Switch
                            checked={keyword.isActive}
                            onCheckedChange={() => handleToggleKeyword(keyword.id, keyword.isActive)}
                          />
                          <span className="ml-3 font-medium">
                            {keyword.isHashtag ? '#' : ''}{keyword.keyword}
                          </span>
                          {keyword.isHashtag && (
                            <Badge variant="outline" className="ml-2">Hashtag</Badge>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteKeyword(keyword.id)}
                          disabled={deleteKeywordMutation.isPending}
                        >
                          <span className="material-icons text-sm text-neutral-500">delete</span>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="filters">
          <Card className="shadow">
            <CardHeader className="border-b border-neutral-200 p-4">
              <CardTitle className="font-semibold text-neutral-900 text-lg">Filter Rules</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="text-center py-12">
                <span className="material-icons text-5xl text-neutral-300 mb-4">filter_alt</span>
                <h3 className="text-xl font-medium text-neutral-700 mb-2">Advanced Filtering</h3>
                <p className="text-neutral-500 max-w-md mx-auto">
                  Advanced filter configuration will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card className="shadow">
            <CardHeader className="border-b border-neutral-200 p-4">
              <CardTitle className="font-semibold text-neutral-900 text-lg">Notification Settings</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="browser-notifications" className="font-medium">Browser Notifications</Label>
                    <p className="text-sm text-neutral-500">Get notified in your browser</p>
                  </div>
                  <Switch id="browser-notifications" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-neutral-500">Receive alerts via email</p>
                  </div>
                  <Switch id="email-notifications" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sms-notifications" className="font-medium">SMS Notifications</Label>
                    <p className="text-sm text-neutral-500">Receive critical alerts via SMS</p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <Button>Save Notification Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card className="shadow">
            <CardHeader className="border-b border-neutral-200 p-4">
              <CardTitle className="font-semibold text-neutral-900 text-lg">Account Settings</CardTitle>
            </CardHeader>
            
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="font-medium">Full Name</Label>
                  <Input id="name" defaultValue="Jamie Davis" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="email" className="font-medium">Email Address</Label>
                  <Input id="email" type="email" defaultValue="jamie@example.com" className="mt-1" />
                </div>
                
                <div>
                  <Label htmlFor="role" className="font-medium">Role</Label>
                  <Input id="role" defaultValue="Disaster Response Coordinator" className="mt-1" />
                </div>
                
                <div className="pt-4 border-t border-neutral-200">
                  <Button>Save Account Settings</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
