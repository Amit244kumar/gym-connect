// pages/MemberDashboard.tsx
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  User,
  Calendar,
  Clock,
  Settings,
  Smartphone,
} from "lucide-react";
import QRScanner from "./QRScanner";

export default function MemberDashboard() {
  const [showScanner, setShowScanner] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const handleScanSuccess = (result: string) => {
    // Here you would typically process the QR code result
    // For example, check the member in, etc.
    setResult(result);
    console.log("QR Code scanned:", result);
    // You could add additional logic here, like showing a success message
    // or sending the result to your backend
  };

  const closeScanner = () => {
    setShowScanner(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">John Doe</h1>
              <p className="text-slate-400">Member ID: #MB001</p>
            </div>
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            Active Member
          </Badge>
        </div>
      </header>

      <div className="p-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Membership Status
              </CardTitle>
              <Calendar className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white">
                Premium Monthly
              </div>
              <p className="text-xs text-slate-400">Expires: March 15, 2024</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                This Month
              </CardTitle>
              <Clock className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-white">18 Visits</div>
              <p className="text-xs text-slate-400">Last visit: Today</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Quick Entry
              </CardTitle>
              <QrCode className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <Button 
                onClick={() => setShowScanner(true)}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                <QrCode className="h-4 w-4 mr-2" />
                Scan QR Code
              </Button>
            </CardContent>
          </Card>
        </div>
        {result && (
           <div className="mb-6 p-4 bg-green-800/30 border border-green-700 rounded-lg text-green-200">
            QR Code Scanned Successfully: <strong>{result}</strong>
          </div>  
        )
        }
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Smartphone className="h-12 w-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Member Dashboard Under Construction
            </h2>
            <p className="text-slate-400 mb-6">
              The full member dashboard with QR code scanning, profile
              management, membership tracking, and visit history is being built.
            </p>
            <p className="text-slate-300 text-sm">
              Continue prompting to build out specific features like:
              <br />• QR code scanner for gym entry
              <br />• Profile management and editing
              <br />• Membership renewal notifications
              <br />• Visit history and workout tracking
            </p>
          </div>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess} 
          onClose={closeScanner} 
        />
      )}
    </div>
  );
}