// src/pages/CheckInsPage.tsx
import { useState, useEffect, useRef } from "react";
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
import QRCode from "qrcode";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";

interface CheckIn {
  id: number;
  memberId: number;
  memberName: string;
  time: string;
  date: string;
  status: "success" | "failed";
}

interface QRCodeData {
  id: string;
  name: string;
  location: string;
  createdAt: string;
  expiresAt: string;
  isActive: boolean;
}

interface CheckInPageProps {
  mode?: "list" | "generate";
}

const CheckIn = ({ mode = "list" }: CheckInPageProps) => {
  const [todayCheckIns, setTodayCheckIns] = useState<CheckIn[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckIn[]>([]);
  const [qrCodeValue, setQrCodeValue] = useState<string>("");
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [selectedQR, setSelectedQR] = useState<QRCodeData | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { owner, isLoading } = useSelector((state: RootState) => state.gymOwnerAuth);

  const generateQRCodeImage = async (id: string) => {
    try {
      setIsGenerating(true);
      
      // Generate QR code as data URL directly instead of using canvas
      const dataUrl = await QRCode.toDataURL(id, {
        width: 192,
        margin: 2,
        color: {
          dark: '#ffffff',
          light: '#1e293b'
        }
      });
      
      console.log('Generated QR Code Data URL:', dataUrl);
      setQrCodeImage(dataUrl);
      setIsGenerating(false);
      return dataUrl;
    } catch (err) {
      console.error('Failed to generate QR code', err);
      toast.error("Failed to generate QR code");
      setIsGenerating(false);
      return null;
    }
  };

  useEffect(() => {
    // Generate QR code with owner ID when component mounts
    const generateQR = async () => {
      if (owner) {
        const ownerId = owner.id.toString();
        setQrCodeValue(ownerId);
        
        // Create a QR code data object
        const newQR: QRCodeData = {
          id: ownerId,
          name: `Gym Owner QR Code`,
          location: "Main Entrance",
          createdAt: new Date().toISOString().split('T')[0],
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 90 days from now
          isActive: true
        };
        
        setQrCodes([newQR]);
        setSelectedQR(newQR);
        
        // Generate the QR code image
        await generateQRCodeImage(ownerId);
      }
    };
    
    generateQR();
  }, [owner]);

  // Force regeneration when component becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && owner && !qrCodeImage) {
        generateQRCodeImage(owner.id.toString());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [owner, qrCodeImage]);

  const handleDownloadQR = () => {
    if (!qrCodeImage) return;
    
    const downloadLink = document.createElement("a");
    downloadLink.href = qrCodeImage;
    downloadLink.download = `gym-qr-${selectedQR?.name || 'checkin'}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
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
              {todayCheckIns.length > 0 ? Math.round((todayCheckIns.filter(c => c.status === 'success').length / todayCheckIns.length) * 100) : 0}% success rate
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
                {todayCheckIns.length > 0 ? (
                  todayCheckIns.map((checkIn) => (
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
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-4">No check-ins today</p>
                )}
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
                {recentCheckIns.length > 0 ? (
                  recentCheckIns.map((checkIn) => (
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
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-4">No recent check-in activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="qr">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Gym Check-in QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">
                This QR code contains your gym owner ID. Members can scan it to check in to your gym.
              </p>
              
              {isGenerating ? (
                <div className="flex justify-center p-6 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-400">Generating QR code...</p>
                </div>
              ) : qrCodeImage ? (
                <>
                  <div className="flex justify-center p-6 bg-slate-700/50 rounded-lg">
                    <img 
                      src={qrCodeImage} 
                      alt="QR Code" 
                      className="w-48 h-48"
                      key={qrCodeImage} // Force re-render when image changes
                    />
                  </div>
                  
                  <Button onClick={handleDownloadQR}  className="w-full border-slate-600 text-slate-300">
                    <Download className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                </>
              ) : (
                <div className="flex justify-center p-6 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-400">No QR code available</p>
                </div>
              )}
              
              {/* Hidden canvas for QR generation (kept for compatibility) */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CheckIn;