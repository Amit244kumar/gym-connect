import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  QrCode,
  Calendar,
  Bell,
  Settings,
  BarChart3,
  Plus,
  Search,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import AddMemberModal from "@/components/modals/AddMemberModal";
import { useSelector, useDispatch } from "react-redux";
import { getProfilefeth, logoutGymOwnerFeth } from "@/store/gymOwnerAuth/gymOwnerAuthThunks";
import { AppDispatch, RootState } from '../store/index'
import { useNavigate } from "react-router-dom";
export default function OwnerDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { owner, token, isAuthenticated } = useSelector((state: RootState) => state.gymOwnerAuth)
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate=useNavigate();
  console.log("Owner data in dashboard:", isAuthenticated, token);
  const handleCloseModal = () => {
    setIsAddMemberModalOpen(false)
  }
  
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Close profile dropdown when mobile menu is toggled
    if (isProfileDropdownOpen) {
      setIsProfileDropdownOpen(false);
    }
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        const response = await dispatch(getProfilefeth()).unwrap();
        console.log("Profile response:", response)
      }else(
        navigate('/login')
      )
    }
    fetchProfile()
  }, [token, dispatch]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);
  const handleLogout=async()=>{  
    await dispatch(logoutGymOwnerFeth()).unwrap();
    navigate('/');
    setIsProfileDropdownOpen(false)
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {isAddMemberModalOpen && <AddMemberModal onClose={handleCloseModal} />}
      
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white">Welcome Back,{owner?.ownerName}</h1>
            <p className="text-slate-400 ml-2 hidden sm:inline">Dashboard</p>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-3 items-center">
            <Button size="sm" onClick={() => setIsAddMemberModalOpen(true)} className="bg-orange-500 hover:bg-orange-600">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
            
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-0 h-10 w-10 overflow-hidden border-2 border-slate-600"
                onClick={toggleProfileDropdown}
              >
                {owner?.profileImage ? (
                  <img 
                    src={owner?.profileImage} 
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
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-slate-700"
                      onClick={() => setIsProfileDropdownOpen(false)}
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
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="md:hidden rounded-full p-2 h-10 w-10"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 text-white" />
            ) : (
              <Menu className="h-5 w-5 text-white" />
            )}
          </Button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 bg-slate-800/90 backdrop-blur-sm border border-slate-700 rounded-lg p-4 z-20">
            <div className="flex flex-col gap-3">
              <Button 
                size="sm" 
                onClick={() => {
                  setIsAddMemberModalOpen(true);
                  setIsMobileMenuOpen(false);
                }} 
                className="bg-orange-500 hover:bg-orange-600 justify-start"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-slate-700 justify-start"
                onClick={() => {
                  setIsProfileDropdownOpen(!isProfileDropdownOpen);
                }}
              >
                {owner?.profileImage ? (
                  <img 
                    src={owner?.profileImage} 
                    alt="Profile" 
                    className="h-6 w-6 rounded-full mr-2 object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 mr-2" />
                )}
                Profile
              </Button>
              
              {isProfileDropdownOpen && (
                <div className="ml-6 mt-2 bg-slate-800 border border-slate-700 rounded-md shadow-lg">
                  <div className="py-1">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-slate-700"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-slate-700"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    <div className="border-t border-slate-700 my-1"></div>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-slate-700"
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        setIsMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
      
      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Total Members
              </CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">128</div>
              <p className="text-xs text-slate-400">+12% from last month</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Today's Check-ins
              </CardTitle>
              <QrCode className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">45</div>
              <p className="text-xs text-slate-400">Real-time updates</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Expiring Soon (
                  {owner?.subscriptionPlanType === "trial" && "Trial"}
                  {owner?.subscriptionPlanType === "basic" && "Basic"}
                  {owner?.subscriptionPlanType === "premium" && "Premium"}
                  )
              </CardTitle>
              <Calendar className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">8</div>
              <p className="text-xs text-slate-400">Next 7 days</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-300">
                Monthly Revenue
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">₹2,45,000</div>
              <p className="text-xs text-slate-400">+8% from last month</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center py-20">
          <div className="max-w-md mx-auto">
            <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Settings className="h-12 w-12 text-slate-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Dashboard Under Construction
            </h2>
            <p className="text-slate-400 mb-6">
              The full gym owner dashboard with member management, QR code
              generation, membership tracking, and analytics is being built.
            </p>
            <p className="text-slate-300 text-sm">
              Continue prompting to build out specific features like:
              <br />• Member management system
              <br />• QR code generation for gym entry
              <br />• Membership renewal notifications
              <br />• Real-time analytics and reports
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}