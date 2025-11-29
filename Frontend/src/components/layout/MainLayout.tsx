// src/components/layout/MainLayout.tsx
import { useState, useRef, ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Users,
  QrCode,
  Bell,
  Settings,
  BarChart3,
  Plus,
  User,
  LogOut,
  Menu,
  X,
  Home,
  Activity,
  CreditCard,
  MessageSquare,
  HelpCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/index";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import {  logoutGymOwnerFeth,getProfilefeth, verifyEmailFeth } from "@/store/gymOwnerAuth/gymOwnerAuthThunks";
import { cn } from "@/lib/utils";
import AddMemberModal from "../modals/AddMemberModal";
import { config } from "@/axios/config";
import EmailVerificationModal from "../modals/EmailVerificationModal";
import { toast } from "sonner";
import { getFullImageUrl } from "../utils/helper";
import PhoneVerificationModal from "../modals/PhoneVerificationModal";
const MainLayout = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { owner,token,isLoading } = useSelector((state: RootState) => state.gymOwnerAuth);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  // const dropdownRef = useRef<HTMLDivElement>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [logout,setLogout]=useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const slug=localStorage.getItem("gymOwnerSlug")

  // Close sidebar when route changes on mobile
  useEffect(() => {
    if (window.innerWidth < 768) { // 768px is the md breakpoint
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  
  useEffect(() => {
      const fetchProfile = async () => {
        if (token) {
          try {
            const response = await dispatch(getProfilefeth()).unwrap();
            console.log("Profile response:", response)
            setShowVerificationModal(!response.isEmailVerified);
          } catch (error) {
            console.error("Error fetching profile:", error);
            // navigate('/login');
          }
        } else {
          navigate('/login');
        }
      }
      fetchProfile()
    }, []);
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

  const handleAddMember = () => {
    setIsAddMemberModalOpen(true);
  };

  const handleCloseAddMemberModal = () => {
    setIsAddMemberModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const handleVerification = async (code: string) => {
    try {
      await dispatch(verifyEmailFeth(code)).unwrap();
      setShowVerificationModal(false);
    } catch (error) {
      toast.error("Invalid verification code. Please try again.");
    }
  };
  // const toggleProfileDropdown = () => {
  //   setIsProfileDropdownOpen(!isProfileDropdownOpen);
  // };

  const handleLogout = async() => {
    setLogout(true);
    await dispatch(logoutGymOwnerFeth()).unwrap();
    navigate('/login');
    window.location.reload(); 
  };
 

  // const handleProfileClick = () => {
  //   navigate('/profile');
  // };

  const menuItems = [
    { name: 'Dashboard', icon: Home, path: `/owner/dashboard/${slug}` },
    { name: 'Members', icon: Users, path: '/owner/members' },
    { name: 'Check-in', icon: QrCode, path: '/owner/members/checkin' },
    { name: 'Membership Plans', icon: CreditCard, path: 'owner/membershipPlan' },
    { name: 'Reports', icon: BarChart3, path: '/owner/reports' },
    { name: 'Notifications', icon: Bell, path: '/owner/notifications' },
    { name:'member checkout',icon:Activity,path:'/owner/members/checkout'},
    { name: 'Messages', icon: MessageSquare, path: '/owner/messages' },
    { name: 'Settings', icon: Settings, path: 'owner/settings' },
    { name: 'Help & Support', icon: HelpCircle, path: '/Owner/help' },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Check if the current path matches the menu item path
  const isActive = (path: string) => {
    return location.pathname === path;
  };

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
        
        /* Sidebar specific scrollbar */
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
      {!owner?.isPhoneVerified && owner?.phone && <PhoneVerificationModal phone={owner.phone} />}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {/* Fixed Sidebar */}
        <div
          className={cn(
            "fixed top-0 left-0 z-50 h-screen w-64 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col sidebar-scrollbar",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 flex-shrink-0">
            <h2 className="text-xl font-bold text-white">GymHub</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          {/* <img src={getFullImageUrl(owner?.profileImage)} alt="Logo" className="h-12 w-12 mx-auto my-2"/> */}
          {/* User Profile Section */}
          <div className="p-4 border-b border-slate-700 flex-shrink-0">
            <div className="flex items-center space-x-3">
              {owner?.ownerPhoto ? (
                <img
                  src={getFullImageUrl(owner.ownerPhoto)}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-slate-600"
                  // crossOrigin="anonymous"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
                  <User className="h-5 w-5 text-slate-300" />
                </div>
              )}
              <div>
                <p className="font-medium text-white truncate max-w-[120px]">{owner?.ownerName || 'Gym Owner'}</p>
                <p className="text-xs text-slate-400 truncate max-w-[120px]">{owner?.gymName || 'Your Gym'}</p>
              </div>
              
            </div>
          </div>

          {/* Navigation Menu - Scrollable area */}
          <nav className="flex-1 overflow-y-auto py-4 sidebar-scrollbar">
            <ul className="space-y-1 px-2">
              {menuItems.map((item) => (
                <li key={item.name}>
                  <button
                    onClick={() => handleNavigation(item.path)}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      isActive(item.path)
                        ? "bg-slate-700 text-white"
                        : "text-slate-300 hover:bg-slate-700 hover:text-white"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-slate-700 flex-shrink-0">
            <div className="space-y-2">
              <Link
                to={`/owner/profile/${slug}`}
                className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <User className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">My Profile</span>
              </Link>
              <button
                disabled={logout}
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <LogOut className="mr-3 h-5 w-5 flex-shrink-0" />
                <span className="truncate">{logout?'logging out':'log out'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Main Content - with left margin for desktop */}
        <div className="md:ml-64 min-h-screen">
          {/* Fixed Header */}
          <header className="sticky top-0 z-30 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center space-x-4">
                {/* Mobile Menu Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-slate-400 hover:text-white"
                  onClick={toggleSidebar}
                >
                  <Menu className="h-5 w-5" />
                </Button>

                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold text-white">Welcome Back to Dashboard</h1>
                  <p className="text-slate-400 ml-2 hidden sm:inline">
                    Here's what's happening with your gym today
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                {/* Add Member Button - Mobile only */}
                <Button size="sm" onClick={handleAddMember} className="md:hidden bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>

                {/* Add Member Button - Desktop */}
                <Button size="sm" onClick={handleAddMember} className="hidden md:flex bg-orange-500 hover:bg-orange-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Button>

                {/* Profile Dropdown */}
                {/* <div className="relative" ref={dropdownRef}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full p-0 h-10 w-10 overflow-hidden border-2 border-slate-600"
                    onClick={toggleProfileDropdown}
                  >
                    {owner?.profileImage ? (
                      <img
                        src={owner.profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-700 flex items-center justify-center">
                        <User className="h-5 w-5 text-slate-300" />
                      </div>
                    )}
                  </Button>

                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10">
                      <div className="py-1">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-slate-700"
                          onClick={handleProfileClick}
                        >
                          <User className="h-4 w-4 mr-2" />
                          My Profile
                        </button>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-slate-700"
                          onClick={() => navigate('/settings')}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Settings
                        </button>
                        <div className="border-t border-slate-700 my-1"></div>
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-slate-700"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div> */}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="p-6 main-scrollbar overflow-y-auto">
            <Outlet  />
          </main>
        </div>
      </div>

      {isAddMemberModalOpen && <AddMemberModal onClose={handleCloseAddMemberModal} />}
      <EmailVerificationModal
        isOpen={showVerificationModal}
        onVerify={handleVerification}
        email={owner?.email || ''}
        isVerifying={isLoading}
      />
    </>
  );
};

export default MainLayout;