// src/components/admin/ActivityFeed.tsx
import React from "react";
import {
  Clock,
  ShoppingCart,
  UserPlus,
  Package,
  AlertCircle,
} from "lucide-react";

interface Activity {
  id: string;
  type: string;
  user: string;
  action: string;
  amount: string;
  time: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "order":
        return <ShoppingCart size={16} className="text-blue-500" />;
      case "user":
        return <UserPlus size={16} className="text-green-500" />;
      case "product":
        return <Package size={16} className="text-purple-500" />;
      default:
        return <AlertCircle size={16} className="text-gray-500" />;
    }
  };

  const formatTime = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-6">
        <div className="text-gray-400 mb-2">No recent activity</div>
        <p className="text-gray-500 text-sm">Activities will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <div className="p-2 bg-gray-100 rounded-lg">
            {getActivityIcon(activity.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  <span className="font-semibold">{activity.user}</span>{" "}
                  {activity.action}
                </p>
                {activity.amount && (
                  <p className="text-sm font-semibold text-gray-700 mt-1">
                    {activity.amount}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Clock size={12} />
                {formatTime(activity.time)}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
