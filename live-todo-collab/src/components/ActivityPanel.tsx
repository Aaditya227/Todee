import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowRight, 
  User, 
  Clock,
  X,
  ChevronRight,
  Filter
} from "lucide-react";

interface ActivityLog {
  id: string;
  action: "created" | "updated" | "deleted" | "moved" | "assigned";
  taskTitle: string;
  user: string;
  timestamp: Date;
  details: string;
  fromStatus?: string;
  toStatus?: string;
}

export const ActivityPanel = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activities, setActivities] = useState<ActivityLog[]>([
    {
      id: "1",
      action: "created",
      taskTitle: "Design user interface",
      user: "Sarah Chen",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      details: "Created a new task for UI design"
    },
    {
      id: "2",
      action: "moved",
      taskTitle: "Implement authentication",
      user: "John Doe",
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      details: "Moved task from Todo to In Progress",
      fromStatus: "todo",
      toStatus: "inProgress"
    },
    {
      id: "3",
      action: "assigned",
      taskTitle: "Set up database",
      user: "Mike Johnson",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      details: "Assigned task to Emily Rodriguez"
    },
    {
      id: "4",
      action: "updated",
      taskTitle: "Create project structure",
      user: "Sarah Chen",
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
      details: "Updated task description and priority"
    },
    {
      id: "5",
      action: "deleted",
      taskTitle: "Old task placeholder",
      user: "John Doe",
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      details: "Removed outdated task"
    }
  ]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "created": return <Plus className="h-4 w-4 text-success" />;
      case "updated": return <Edit className="h-4 w-4 text-warning" />;
      case "deleted": return <Trash2 className="h-4 w-4 text-destructive" />;
      case "moved": return <ArrowRight className="h-4 w-4 text-primary" />;
      case "assigned": return <User className="h-4 w-4 text-accent" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "created": return "border-l-success";
      case "updated": return "border-l-warning";
      case "deleted": return "border-l-destructive";
      case "moved": return "border-l-primary";
      case "assigned": return "border-l-accent";
      default: return "border-l-muted";
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  if (!isOpen) {
    return (
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="h-12 w-12 rounded-full shadow-lg bg-background border-2"
        >
          <Activity className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 border-l border-border bg-background/95 backdrop-blur-sm">
      <Card className="h-full border-0 rounded-none">
        <CardHeader className="border-b border-border">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              Activity Feed
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Filter className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Recent changes to your board
          </p>
        </CardHeader>
        
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="p-4 space-y-4">
              {activities.map((activity, index) => (
                <div 
                  key={activity.id}
                  className={`activity-item ${getActionColor(activity.action)} slide-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(activity.action)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          {activity.user}
                        </span>
                        <Badge 
                          variant="outline" 
                          className="text-xs capitalize"
                        >
                          {activity.action}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-foreground font-medium mb-1">
                        {activity.taskTitle}
                      </p>
                      
                      <p className="text-xs text-muted-foreground mb-2">
                        {activity.details}
                      </p>
                      
                      {activity.fromStatus && activity.toStatus && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                          <span className="capitalize">{activity.fromStatus}</span>
                          <ChevronRight className="h-3 w-3" />
                          <span className="capitalize">{activity.toStatus}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {formatTimestamp(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {activities.length === 0 && (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No recent activity</p>
                  <p className="text-sm text-muted-foreground">
                    Activity will appear here as you work on tasks
                  </p>
                </div>
              )}
              
              <div className="pt-4 border-t border-border">
                <Button variant="outline" className="w-full text-sm">
                  Load More Activity
                </Button>
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};