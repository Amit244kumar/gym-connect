// components/layout/MemberSidebar.tsx
import { cn } from "@/lib/utils";
import {
  User,
  CreditCard,
  Activity,
  BarChart3,
  MessageSquare,
  Settings,
  HelpCircle,
  Home,
  LogOut,
  QrCode,
  // Menu, // No longer needed here
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { logoutMemberFeth } from "@/store/memberAuth/memberAuthThunk";
import { getFullImageUrl } from "../utils/helper";

interface MemberSidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowScanner: (show: boolean) => void;
}

const menuItems = [
  { name: 'Dashboard', icon: Home, id: 'dashboard', path: '/member/dashboard' },
  { name: 'My Profile', icon: User, id: 'profile', path: '/member/profile' },
  // { name: 'Membership', icon: CreditCard, id: 'membership', path: '/member/membership' },
  { name: 'Attendance', icon: Activity, id: 'attendance', path: '/member/attendance' },
  // { name: 'Progress', icon: BarChart3, id: 'progress', path: '/member/progress' },
  // { name: 'Messages', icon: MessageSquare, id: 'messages', path: '/member/messages' },
  // { name: 'Settings', icon: Settings, id: 'settings', path: '/member/settings' },
  // { name: 'Help & Support', icon: HelpCircle, id: 'help', path: '/member/help' },
];

export default function MemberSidebar({
  isSidebarOpen,
  toggleSidebar,
  activeTab,
  setActiveTab,
  setShowScanner,
}: MemberSidebarProps) {
  console.log("SDfdsfsdsd",toggleSidebar)
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {memberProfile}=useSelector((state:RootState)=>state.memberAuth)
  const handleLogout =async () => {
    try {
      await dispatch(logoutMemberFeth()).unwrap();
      navigate('/login');
      window.location.reload(); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <>
      {/* Custom scrollbar styles */}
      <style>{`
        .sidebar-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 4px;
        }
        
        .sidebar-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(203, 213, 225, 0.6);
        }
      `}</style>

      {/* 
        SIDEBAR CONTAINER
        - Increased z-index to 50 to ensure it's on top of other elements.
        - The rest of the logic for sliding in/out remains the same.
      */}
      <div
        className={cn(
          "fixed top-0 left-0 z-50 h-screen w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col sidebar-scrollbar",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header - Fixed so it doesn't scroll */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">GymHub</h2>
          {/* Close Button - Only visible on mobile when sidebar is open */}
          {/* <button
            onClick={toggleSidebar}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button> */}
        </div>

        {/* Mobile Header with QR Button - Fixed so it doesn't scroll */}
        <div className="md:hidden p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex flex-col space-y-3">
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-white">Member Dashboard</h1>
              <p className="text-slate-400 text-sm">
                Welcome back, John!
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                size="sm" 
                onClick={() => setShowScanner(true)} 
                className="bg-orange-500 hover:bg-orange-600 w-full justify-center"
              >
                <QrCode className="h-4 w-4 mr-2"/>
                Scan QR Code
              </Button>
            </div>
          </div>
        </div>

        {/* User Profile Section - Fixed so it doesn't scroll */}
        <div className="p-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center border-2 border-slate-600">
              
              {memberProfile ? (
                <img
                  src={getFullImageUrl(memberProfile?.memberPhoto)}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                crossOrigin="anonymous"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                 <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
            <div>
              <p className="font-medium text-white">{memberProfile?.name || "John Doe"}</p>
              <p className="text-xs text-slate-400">Member ID: {memberProfile?.id || "MB001"}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Menu - This is the only scrollable part */}
        <nav className="flex-1 overflow-y-auto py-4 sidebar-scrollbar">
          <ul className="space-y-1 px-2">
            {menuItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Close sidebar on mobile after navigation
                    if (window.innerWidth < 768) {
                      toggleSidebar();
                    }
                  }}
                  className={cn(
                    "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    activeTab === item.id
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                  <span className="truncate">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer - Fixed to the bottom */}
        <div className="p-4 border-t border-slate-700 flex-shrink-0">
          <button 
            className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md
           text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
           onClick={handleLogout}
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="truncate">Log Out</span>
          </button>
        </div>
      </div>

      {/* 
        DESKTOP HEADER
        - This is part of the sidebar component but renders outside the fixed sidebar container.
        - It uses 'left-64' to position itself correctly next to the sidebar.
        - It's hidden on mobile ('hidden md:block').
      */}
      <div className="hidden md:block fixed top-0 left-64 right-0 z-40">
        <header className="sticky top-0 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
          <div className="flex flex-wrap justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold text-white">Member Dashboard</h1>
                <p className="text-slate-400 ml-2 hidden sm:inline">
                  Welcome back, Here's your fitness overview
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                size="sm" 
                onClick={() => setShowScanner(true)} 
                className="bg-orange-500 hover:bg-orange-600"
              >
                <QrCode className="h-4 w-4 mr-2"/>
                Scan QR Code
              </Button>
            </div>
          </div>
        </header>
      </div>
    </>
  );
}