"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardTitle,
} from "@/components/ui/card";
import { MagicCard } from "@/components/magicui/magic-card";
import { useTheme } from "next-themes";
import { FileText } from "lucide-react";

function RecentNotes() {
  const { theme } = useTheme();
  
  return (
    <Card className="p-0 w-full shadow-none border-none">
      <MagicCard
        gradientColor={theme === "dark" ? "#262626" : "#D9D9D955"}
        className="p-0"
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center mb-4">
            <div className="rounded-md bg-blue-100 p-2 mr-4">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
            <CardTitle className="text-xl font-medium text-gray-700 dark:text-gray-200">
              Recent Notes
            </CardTitle>
          </div>
          
          <div className="mb-2">
            <span className="text-4xl font-bold text-gray-800 dark:text-gray-100">7</span>
          </div>
          
          <div className="mt-auto pt-4">
            <Button variant="link" className="p-0 text-blue-500 hover:text-blue-600">
              View all
            </Button>
          </div>
        </div>
      </MagicCard>
    </Card>
  );
}

export default RecentNotes;