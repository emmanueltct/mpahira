// components/RecentActivity.tsx
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Bell } from "lucide-react";

interface Activity {
  id: number;
  message: string;
  time: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  return (
    <Card className="p-4 w-full rounded-2xl shadow-md">
      <CardContent>
        <div className="flex items-center gap-2 mb-4 text-lg font-semibold">
          <Bell className="h-5 w-5" />
          Recent Activity
        </div>
        <ul className="space-y-3 text-sm">
          {activities.map((activity) => (
            <li key={activity.id} className="border-b pb-2 last:border-none">
              <div>{activity.message}</div>
              <div className="text-gray-500 text-xs">{activity.time}</div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};
