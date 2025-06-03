// components/dashboard/DashboardTimeHeader.tsx
"use client"; // This directive makes this a Client Component

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button"; // Assuming you have Button component
import { RefreshCw } from "lucide-react"; // Assuming you have lucide-react for icons
import { toast } from "sonner";

interface DashboardTimeHeaderProps {
  onRefresh?: () => void; // Optional callback for refresh action
  isLoading?: boolean; // Optional prop to indicate if data is loading for the refresh button
}

export default function DashboardTimeHeader({ onRefresh, isLoading }: DashboardTimeHeaderProps) {
  const [time, setTime] = useState(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Update the time every 5 seconds (or your preferred interval)
    const interval = setInterval(() => setTime(new Date()), 5000);
    return () => clearInterval(interval); // Clean up the interval when the component unmounts
  }, []);

  // Format the date and time
  const formattedDate = format(time, "PPPP"); // Example: Monday, June 3, 2024
  const formattedTime = format(time, "p"); // Example: 10:30 PM

  const handleButtonClick = async () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    try {
      if (onRefresh) {
        onRefresh();
      }
      toast.success("Refreshing notes...");
    } catch (error) {
      toast.error("Failed to refresh notes");
      console.error("Refresh error:", error);
    } finally {
      // Keep the refreshing state for a bit to show the animation
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <div className="px-4 py-2 flex justify-between items-center">
      <div className="text-sm text-muted-foreground">
        {formattedDate} — {formattedTime}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleButtonClick} // Use the internal handler
        disabled={isRefreshing || isLoading}
        className="flex items-center gap-2"
      >
        <RefreshCw className={`h-4 w-4 ${(isRefreshing || isLoading) ? "animate-spin" : ""}`} />
        Refresh
      </Button>
    </div>
  );
}