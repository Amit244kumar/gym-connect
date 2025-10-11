    // src/pages/CheckInsPage.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  QrCode,
  Users,
  Clock,
  Calendar,
  Search,
  CheckCircle,
  XCircle,
  Plus,
  Download,
} from "lucide-react";
import MainLayout from "../../components/layout/MainLayout";
import { toast } from "sonner";

interface CheckIn {
  id: number;
  memberId: number;
  memberName: string;
  time: string;
  date: string;
  status: "success" | "failed";
}

interface CheckInPageProps {
  mode?: "list" | "generate";
}

const CheckIn = ({ mode = "list" }: CheckInPageProps) => {
  const [todayCheckIns, setTodayCheckIns] = useState<CheckIn[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([]);
  const [isGeneratingQR, setIsGeneratingQR] = useState(false);

  useEffect(() => {
    // Mock data - in a real app, this would come from an API
    const mockTodayCheckIns: CheckIn[] = [
      { id: 1, memberId: 1, memberName: "John Doe", time: "06:30 AM", date: "2023-06-12", status: "success" },
      { id: 2, memberId: 2, memberName: "Jane Smith", time: "07:15 AM", date: "2023-06-12", status: "success" },
      { id: 3, memberId: 3, memberName: "Mike Johnson", time: "08:45 AM", date: "2023-06-12", status: "failed" },
      { id: 4, memberId: 4, memberName: "Sarah Williams", time: "09:20 AM", date: "2023-06-12", status: "success" },
      { id: 5, memberId: 5, memberName: "David Brown", time: "10:05 AM", date: "2023-06-12", status: "success" },
    ];

    const mockRecentCheckIns: CheckIn[] = [
      { id: 6, memberId: 1, memberName: "John Doe", time: "06:30 AM", date: "2023-06-11", status: "success" },
      { id: 7, memberId: 2, memberName: "Jane Smith", time: "07:15 AM", date: "2023-06-11", status: "success" },
      { id: 8, memberId: 4, memberName: "Sarah Williams", time: "09:20 AM", date: "2023-06-11", status: "success" },
      { id: 9, memberId: 5, memberName: "David Brown", time: "10:05 AM", date: "2023-06-11", status: "success" },
      { id: 10, memberId: 3, memberName: "Mike Johnson", time: "08:45 AM", date: "2023-06-11", status: "failed" },
    ];

    setTodayCheckIns(mockTodayCheckIns);
    setRecentCheckIns(mockRecentCheckIns);
  }, []);

  const handleGenerateQR = () => {
    setIsGeneratingQR(true);
    // Simulate API call
    setTimeout(() => {
      setIsGeneratingQR(false);
      toast.success("QR Code generated successfully");
    }, 1500);
  };

  const handleDownloadQR = () => {
    toast.success("QR Code downloaded");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-500/20 text-green-400">Success</Badge>;
      case "failed":
        return <Badge className="bg-red-500/20 text-red-400">Failed</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-400" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-400" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Check-in</h1>
            <p className="text-slate-400">Track member check-in and manage QR codes</p>
          </div>
          <Button onClick={handleGenerateQR} className="bg-orange-500 hover:bg-orange-600">
            <Plus className="h-4 w-4 mr-2" />
            Generate QR Code
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Today's Check-in
              </CardTitle>
              <QrCode className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{todayCheckIns.length}</div>
              <p className="text-xs text-slate-400">Real-time updates</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Successful Check-in
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {todayCheckIns.filter(c => c.status === 'success').length}
              </div>
              <p className="text-xs text-slate-400">
                {Math.round((todayCheckIns.filter(c => c.status === 'success').length / todayCheckIns.length) * 100)}% success rate
              </p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Failed Check-in
              </CardTitle>
              <XCircle className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {todayCheckIns.filter(c => c.status === 'failed').length}
              </div>
              <p className="text-xs text-slate-400">Need attention</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Peak Hour
              </CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">6-7 PM</div>
              <p className="text-xs text-slate-400">Most active time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="today" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="today" className="text-slate-300 hover:text-white">Today's Check-in</TabsTrigger>
            <TabsTrigger value="recent" className="text-slate-300 hover:text-white">Recent Activity</TabsTrigger>
            <TabsTrigger value="qr" className="text-slate-300 hover:text-white">QR Codes</TabsTrigger>
          </TabsList>

          <TabsContent value="today">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Today's Check-in</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayCheckIns.map((checkIn) => (
                    <div key={checkIn.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-slate-600">
                          {getStatusIcon(checkIn.status)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{checkIn.memberName}</p>
                          <p className="text-xs text-slate-400">ID: {checkIn.memberId}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{checkIn.time}</p>
                        <div className="flex justify-end">
                          {getStatusBadge(checkIn.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Recent Check-in Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentCheckIns.map((checkIn) => (
                    <div key={checkIn.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-slate-600">
                          {getStatusIcon(checkIn.status)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{checkIn.memberName}</p>
                          <p className="text-xs text-slate-400">{checkIn.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-white">{checkIn.time}</p>
                        <div className="flex justify-end">
                          {getStatusBadge(checkIn.status)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="qr">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Generate QR Code</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-300">
                    Generate a QR code that members can scan to check in to your gym.
                  </p>
                  <Button onClick={handleGenerateQR} disabled={isGeneratingQR} className="w-full bg-orange-500 hover:bg-orange-600">
                    {isGeneratingQR ? "Generating..." : "Generate New QR Code"}
                  </Button>
                  <div className="flex justify-center p-6 bg-slate-700/50 rounded-lg">
                    <div className="w-48 h-48 bg-slate-600 flex items-center justify-center">
                      <QrCode className="h-24 w-24 text-slate-400" />
                    </div>
                  </div>
                  <Button onClick={handleDownloadQR} variant="outline" className="w-full border-slate-600 text-slate-300">
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Active QR Codes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="font-medium text-white">Main Entrance</p>
                        <p className="text-xs text-slate-400">Created: Jun 1, 2023</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="font-medium text-white">Group Fitness Room</p>
                        <p className="text-xs text-slate-400">Created: May 15, 2023</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                      <div>
                        <p className="font-medium text-white">Locker Room</p>
                        <p className="text-xs text-slate-400">Created: Apr 20, 2023</p>
                      </div>
                      <Badge className="bg-yellow-500/20 text-yellow-400">Expiring Soon</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default CheckIn;