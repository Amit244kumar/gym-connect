// src/pages/MessagesPage.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Send,
  Search,
  Plus,
  User,
  Clock,
  Check,
  Paperclip,
  Smile,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface Message {
  id: number;
  sender: string;
  senderId: number;
  content: string;
  timestamp: string;
  read: boolean;
  isOwn: boolean;
}

interface Conversation {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Mock conversations data
    const mockConversations: Conversation[] = [
      {
        id: 1,
        name: "John Doe",
        lastMessage: "Thanks for the workout plan!",
        timestamp: "2023-06-12T10:30:00",
        unread: 0,
        isOnline: true,
      },
      {
        id: 2,
        name: "Jane Smith",
        lastMessage: "When is the next yoga class?",
        timestamp: "2023-06-11T16:45:00",
        unread: 2,
        isOnline: false,
      },
      {
        id: 3,
        name: "Mike Johnson",
        lastMessage: "I need to update my payment method",
        timestamp: "2023-06-10T14:20:00",
        unread: 0,
        isOnline: true,
      },
      {
        id: 4,
        name: "Sarah Williams",
        lastMessage: "The gym looks great! Keep up the good work.",
        timestamp: "2023-06-09T11:30:00",
        unread: 1,
        isOnline: false,
      },
    ];
    setConversations(mockConversations);
    
    // Set first conversation as active by default
    if (mockConversations.length > 0 && !activeConversation) {
      setActiveConversation(mockConversations[0].id);
    }
  }, [activeConversation]);

  useEffect(() => {
    if (activeConversation) {
      // Mock messages data for the active conversation
      const mockMessages: Message[] = [
        {
          id: 1,
          sender: "John Doe",
          senderId: 1,
          content: "Hi, I have a question about my membership plan.",
          timestamp: "2023-06-12T09:15:00",
          read: true,
          isOwn: false,
        },
        {
          id: 2,
          sender: "You",
          senderId: 0,
          content: "Hello! I'd be happy to help with your membership questions. What would you like to know?",
          timestamp: "2023-06-12T09:20:00",
          read: true,
          isOwn: true,
        },
        {
          id: 3,
          sender: "John Doe",
          senderId: 1,
          content: "I'm currently on the Basic plan. Can I upgrade to Premium?",
          timestamp: "2023-06-12T09:25:00",
          read: true,
          isOwn: false,
        },
        {
          id: 4,
          sender: "You",
          senderId: 0,
          content: "Yes, you can upgrade at any time. The Premium plan includes unlimited group classes and 2 personal trainer sessions per month.",
          timestamp: "2023-06-12T09:30:00",
          read: true,
          isOwn: true,
        },
        {
          id: 5,
          sender: "John Doe",
          senderId: 1,
          content: "Thanks for the workout plan!",
          timestamp: "2023-06-12T10:30:00",
          read: false,
          isOwn: false,
        },
      ];
      setMessages(mockMessages);
    }
  }, [activeConversation]);

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const newMsg: Message = {
      id: messages.length + 1,
      sender: "You",
      senderId: 0,
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: true,
      isOwn: true,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
    
    // Update conversation last message
    setConversations(conversations.map(conv => 
      conv.id === activeConversation 
        ? { ...conv, lastMessage: newMessage, timestamp: new Date().toISOString() } 
        : conv
    ));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return "Just now";
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            <p className="text-slate-400">Communicate with your gym members</p>
          </div>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            New Message
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="bg-slate-800/50 border-slate-700 md:w-1/3 flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-white">Conversations</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-slate-700/50 border-slate-600 text-white pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {filteredConversations.length > 0 ? (
                <div className="space-y-1">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      className={`p-3 cursor-pointer hover:bg-slate-700/50 transition-colors ${
                        activeConversation === conversation.id ? 'bg-slate-700/50' : ''
                      }`}
                      onClick={() => setActiveConversation(conversation.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                            <User className="h-5 w-5 text-slate-300" />
                          </div>
                          {conversation.isOnline && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-white truncate">{conversation.name}</h3>
                            <span className="text-xs text-slate-400">{formatDate(conversation.timestamp)}</span>
                          </div>
                          <p className="text-sm text-slate-400 truncate">{conversation.lastMessage}</p>
                        </div>
                        {conversation.unread > 0 && (
                          <Badge className="bg-orange-500 text-white flex-shrink-0">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full p-4">
                  <MessageSquare className="h-12 w-12 text-slate-400 mb-2" />
                  <p className="text-slate-400 text-center">No conversations found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages Area */}
          <Card className="bg-slate-800/50 border-slate-700 md:w-2/3 flex flex-col">
            {activeConversation ? (
              <>
                <CardHeader className="pb-3 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center">
                          <User className="h-5 w-5 text-slate-300" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></div>
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {conversations.find(c => c.id === activeConversation)?.name}
                        </h3>
                        <p className="text-xs text-slate-400">Online now</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                        <DropdownMenuItem className="text-white hover:bg-slate-700 cursor-pointer">
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-slate-700 cursor-pointer">
                          Mark as Unread
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-slate-700 cursor-pointer">
                          Block User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                            message.isOwn
                              ? 'bg-orange-500 text-white rounded-tr-none'
                              : 'bg-slate-700 text-white rounded-tl-none'
                          }`}
                        >
                          <p>{message.content}</p>
                          <div
                            className={`text-xs mt-1 ${
                              message.isOwn ? 'text-orange-200' : 'text-slate-400'
                            }`}
                          >
                            {formatDate(message.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                
                <div className="p-4 border-t border-slate-700">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                      <Smile className="h-5 w-5" />
                    </Button>
                    <div className="flex-1">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim()}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex flex-col items-center justify-center h-full">
                <MessageSquare className="h-16 w-16 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">Select a conversation</h3>
                <p className="text-slate-400 text-center max-w-md">
                  Choose a conversation from the list to start messaging or view previous messages.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
  );
};

export default Messages;