import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Trends from "@/pages/trends";
import Geographic from "@/pages/geographic";
import Alerts from "@/pages/alerts";
import Settings from "@/pages/settings";
import DashboardLayout from "./layouts/DashboardLayout";
import { DisasterProvider } from "./context/DisasterContext";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/trends" component={Trends} />
      <Route path="/geographic" component={Geographic} />
      <Route path="/alerts" component={Alerts} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DisasterProvider>
        <TooltipProvider>
          <Toaster />
          <DashboardLayout>
            <Router />
          </DashboardLayout>
        </TooltipProvider>
      </DisasterProvider>
    </QueryClientProvider>
  );
}

export default App;
