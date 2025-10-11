// src/pages/NotificationsPage.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Check,
  X,
  Settings,
  Mail,
  Calendar,
  Users,
  CreditCard,
  Filter,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "warning" | "error" | "success";
  timestamp: string;
  read: boolean;
  category: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: "New Member Registration",
        message: "John Doe has registered for a Premium membership",
        type: "success",
        timestamp: "2023-06-12T10:30:00",
        read: false,
        category: "members",
      },
      {
        id: 2,
        title: "Payment Failed",
        message: "Payment failed for Jane Smith's membership renewal",
        type: "error",
        timestamp: "2023-06-12T09:15:00",
        read: false,
        category: "billing",
      },
      {
        id: 3,
        title: "Membership Expiring Soon",
        message: "5 memberships are expiring in the next 7 days",
        type: "warning",
        timestamp: "2023-06-11T16:45:00",
        read: true,
        category: "members",
      },
      {
        id: 4,
        title: "System Maintenance",
        message: "Scheduled maintenance on June 15, 2023 from 2:00 AM to 4:00 AM",
        type: "info",
        timestamp: "2023-06-10T14:20:00",
        read: true,
        category: "system",
      },
      {
        id: 5,
        title: "New Feature Released",
        message: "Check out our new reporting dashboard with enhanced analytics",
        type: "success",
        timestamp: "2023-06-09T11:30:00",
        read: true,
        category: "system",
      },
    ];
    setNotifications(mockNotifications);
    setFilteredNotifications(mockNotifications);
  }, []);

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredNotifications(notifications);
    } else if (activeTab === "unread") {
      setFilteredNotifications(notifications.filter(n => !n.read));
    } else {
      setFilteredNotifications(notifications.filter(n => n.category === activeTab));
    }
  }, [activeTab, notifications]);

  const markAsRead = (id: number) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    toast.success("Marked as read");
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true,
    }));
    setNotifications(updatedNotifications);
    toast.success("All notifications marked as read");
  };

  const deleteNotification = (id: number) => {
    const updatedNotifications = notifications.filter(notification => notification.id !== id);
    setNotifications(updatedNotifications);
    toast.success("Notification deleted");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-400" />;
      case "error":
        return <X className="h-5 w-5 text-red-400" />;
      case "warning":
        return <Bell className="h-5 w-5 text-yellow-400" />;
      default:
        return <Bell className="h-5 w-5 text-blue-400" />;
    }
  };

  const getNotificationBadge = (type: string) => {
    switch (type) {
      case "success":
        return <Badge className="bg-green-500/20 text-green-400">Success</Badge>;
      case "error":
        return <Badge className="bg-red-500/20 text-red-400">Error</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500/20 text-yellow-400">Warning</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-400">Info</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Notifications</h1>
            <p className="text-slate-400">Stay updated with your gym activities</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
              className="border-slate-600 text-slate-300"
            >
              Mark All as Read
            </Button>
            <Button 
              variant="outline" 
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
              className="border-slate-600 text-slate-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="all" className="text-slate-300 hover:text-white">
              All
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-orange-500 text-white">{unreadCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-slate-300 hover:text-white">
              Unread
            </TabsTrigger>
            <TabsTrigger value="members" className="text-slate-300 hover:text-white">
              <Users className="h-4 w-4 mr-1" />
              Members
            </TabsTrigger>
            <TabsTrigger value="billing" className="text-slate-300 hover:text-white">
              <CreditCard className="h-4 w-4 mr-1" />
              Billing
            </TabsTrigger>
            <TabsTrigger value="system" className="text-slate-300 hover:text-white">
              <Settings className="h-4 w-4 mr-1" />
              System
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredNotifications.length > 0 ? (
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`bg-slate-800/50 border-slate-700 ${!notification.read ? 'border-l-4 border-l-orange-500' : ''}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-white truncate">
                              {notification.title}
                            </h3>
                            <div className="flex items-center space-x-2">
                              {getNotificationBadge(notification.type)}
                              <span className="text-xs text-slate-400">
                                {formatDate(notification.timestamp)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-slate-300 mt-1">
                            {notification.message}
                          </p>
                          <div className="flex justify-end mt-3 space-x-2">
                            {!notification.read && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-slate-400 hover:text-white"
                              >
                                Mark as Read
                              </Button>
                            )}
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-slate-400 hover:text-white"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-slate-800/50 border-slate-700">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-slate-400 mb-4" />
                  <h3 className="text-lg font-medium text-white mb-2">No notifications</h3>
                  <p className="text-slate-400 text-center max-w-md">
                    {activeTab === "unread" 
                      ? "You have no unread notifications." 
                      : "You have no notifications in this category."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default Notifications;