// src/components/layout/MemberLayout.tsx
import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MemberSidebar from "../layout/memberSidebar";
import QRScanner from "../../pages/member/QRScanner";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { getMemberProfileFeth } from "@/store/memberAuth/memberAuthThunk";

interface MemberLayoutProps {
  // Add any props you need
}

export default function MemberLayout({}: MemberLayoutProps) {
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>()
  
  const handleScanSuccess = (result: string) => {
    setScanResult(result);
    console.log("QR Code scanned:", result);
    setShowScanner(false);
  };

  const closeScanner = () => {
    setShowScanner(false);
  };

  const toggleSidebar = () => {
    console.log("SDasd", isSidebarOpen);
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(()=>{
   const fetchMemberProfile=async()=>{
       try {
          await dispatch(getMemberProfileFeth()).unwrap() ;
       } catch (error) {
        console.error("Error fetching member profile:", error);
       }
    }
    fetchMemberProfile();
  },[])
  // Set active tab based on current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("/member/dashboard")) {
      setActiveTab("dashboard");
    } else if (path.includes("/member/profile")) {
      setActiveTab("profile");
    } else if (path.includes("/member/membership")) {
      setActiveTab("membership");
    } else if (path.includes("/member/attendance")) {
      setActiveTab("attendance");
    } else if (path.includes("/member/progress")) {
      setActiveTab("progress");
    } else if (path.includes("/member/messages")) {
      setActiveTab("messages");
    } else if (path.includes("/member/settings")) {
      setActiveTab("settings");
    } else if (path.includes("/member/help")) {
      setActiveTab("help");
    }
  }, [location.pathname]);

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isSidebarOpen && window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Custom scrollbar styles */}
      <style>{`
        /* Custom scrollbar for WebKit browsers */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.8);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.8);
        }
        
        /* Custom scrollbar for Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.8) rgba(30, 41, 59, 0.5);
        }
        
        /* Main content scrollbar */
        .main-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.3);
          border-radius: 4px;
        }
        
        .main-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #64748b, #475569);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .main-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #94a3b8, #64748b);
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Member Sidebar Component */}
        <MemberSidebar
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setShowScanner={setShowScanner}
        />

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content - with left margin for desktop */}
        <div className="md:ml-64 min-h-screen">
            <header className="md:hidden sticky top-0 z-30 bg-slate-800/90 backdrop-blur-sm border-b border-slate-700 p-4">
            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-slate-400 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-xl font-bold text-white">GymHub</h1>
              <div className="w-9"></div> {/* Spacer for alignment */}
            </div>
          </header>
          {/* Page Content */}
          <main className="p-6 md:pt-32 main-scrollbar overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess} 
          onClose={closeScanner} 
        />
      )}
    </>
  );
}
