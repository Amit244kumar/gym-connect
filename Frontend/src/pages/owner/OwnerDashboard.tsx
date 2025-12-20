// src/pages/DashboardPage.tsx
import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  QrCode,
  Calendar,
  BarChart3,
  Plus,
  Activity,
  TrendingUp,
  UserCheck,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { getProfilefeth, logoutGymOwnerFeth, verifyEmailFeth } from "@/store/gymOwnerAuth/gymOwnerAuthThunks";
import { AppDispatch, RootState } from "@/store/index";
import { useNavigate } from "react-router-dom";
import RecentMembersTable from "../../components/dashboard/RecentMembersTable";
import MembershipChart from "../../components/dashboard/MembershipChart";
import CheckInActivity from "../../components/dashboard/CheckInActivity";
// import AddMemberModal from "@/components/modals/AddMemberModal";
import OwnerProfileModal from "@/components/modals/OwnerProfileModal";


// Shimmer component for loading state
import Shimmer from "@/components/ui/Shimmer";
import StatCard from "@/components/ui/StatCard";

// Add this to your CSS or in a style tag
const style = document.createElement('style');
style.textContent = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;
document.head.appendChild(style);



// Quick Action Card Component
// const QuickActionCard = ({ title, description, icon: Icon, onClick }: {
//   title: string;
//   description: string;
//   icon: any;
//   onClick: () => void;
// }) => (
//   <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-700/50 transition-all duration-300 cursor-pointer" onClick={onClick}>
//     <CardContent className="p-4">
//       <div className="flex items-start space-x-3">
//         <div className="p-2 rounded-lg bg-orange-500/20">
//           <Icon className="h-5 w-5 text-orange-400" />
//         </div>
//         <div>
//           <h3 className="font-medium text-white">{title}</h3>
//           <p className="text-xs text-slate-400 mt-1">{description}</p>
//         </div>
//       </div>
//     </CardContent>
//   </Card>
// );

const OwnerDashboard = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [isOwnerProfileModalOpen, setIsOwnerProfileModalOpen] = useState(false);
  const { owner, isLoading } = useSelector((state: RootState) => state.gymOwnerAuth)
  const [recentMembers, setRecentMembers] = useState([]);
  const [checkInData, setCheckInData] = useState([]);
  const [membershipData, setMembershipData] = useState([]);
  // const [showVerificationModal, setShowVerificationModal] = useState(false);
  const navigate = useNavigate();

  // Mock data for demonstration
  useEffect(() => {
    // In a real app, this would come from an API
    if (owner?.recentMembers && Array.isArray(owner.recentMembers)) {
        setRecentMembers(owner.recentMembers);
    } else {
      setRecentMembers([]);
      console.log("No recent members data found or invalid format");
    }
    
    setCheckInData([
      { time: '6 AM', count: 12 },
      { time: '8 AM', count: 35 },
      { time: '10 AM', count: 28 },
      { time: '12 PM', count: 15 },
      { time: '2 PM', count: 20 },
      { time: '4 PM', count: 32 },
      { time: '6 PM', count: 45 },
      { time: '8 PM', count: 18 },
    ]);
    
    setMembershipData([
      { name: 'Basic', value: 45, color: '#3b82f6' },
      { name: 'Standard', value: 30, color: '#8b5cf6' },
      { name: 'Premium', value: 25, color: '#ec4899' },
    ]);
  }, [owner]);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     if (token) {
  //       try {
  //         const response = await dispatch(getProfilefeth()).unwrap();
  //         console.log("Profile response:", response)
  //         setShowVerificationModal(!response.isEmailVerified);
  //       } catch (error) {
  //         console.error("Error fetching profile:", error);
  //         navigate('/login');
  //       }
  //     } else {
  //       navigate('/login');
  //     }
  //   }
  //   fetchProfile()
  // }, [token, dispatch, navigate]);

  // const handleCloseAddMemberModal = () => {
  //   setIsAddMemberModalOpen(false)
  // }

  const handleCloseOwnerProfileModal = () => {
    setIsOwnerProfileModalOpen(false)
  }

  // const handleLogout = async () => {
  //   await dispatch(logoutGymOwnerFeth()).unwrap();
  //   navigate('/');
  //   window.location.reload();
  // }

  // const handleVerification = async (code: string) => {
  //   try {
  //     await dispatch(verifyEmailFeth(code)).unwrap();
  //     setShowVerificationModal(false);
  //   } catch (error) {
  //     toast.error("Invalid verification code. Please try again.");
  //   }
  // };

  

  const handleViewAllMembers = () => {
    navigate('/owner/members');
  };

  // const handleViewReports = () => {
  //   navigate('/reports');
  // };

  // Helper function to get subscription plan type text
  const getSubscriptionPlanType = () => {
    if (!owner?.subscriptionPlanType) return "";

    switch (owner?.subscriptionPlanType) {
      case "trial": return "Trial";
      case "basic": return "Basic";
      case "premium": return "Premium";
      default: return "";
    }
  };
  console.log("Ownesdfsda",owner);
  console.log("fsqwwrxv",recentMembers)
  return (
    <>
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Members" 
              value={owner ? owner?.totalMembers : isLoading ? '' : '--'  } 
              change="+12% from last month" 
              icon={Users} 
              iconColor="bg-blue-500/20" 
            />
            <StatCard 
              title="Today's Check-ins" 
              value={owner ? owner?.totalCheckInsToday : isLoading ? '' : '--' } 
              change="Real-time updates" 
              icon={QrCode} 
              iconColor="bg-green-500/20" 
            />
            <StatCard 
              title={isLoading ? (
                <Shimmer width="120px" height="16px" />
              ) : (
                `Expiring in (${getSubscriptionPlanType()})`
              )}
              value={isLoading ? '' : (owner?.trialInfo?.daysLeft !== null ? owner?.trialInfo?.daysLeft : '--')}
              change="in next 7 days" 
              icon={Calendar} 
              iconColor="bg-yellow-500/20" 
              changeType="negative"
              isLoading={isLoading}
            />
            <StatCard 
              title="Monthly Revenue" 
              value="₹2,45,000" 
              change="+8% from last month" 
              icon={BarChart3} 
              iconColor="bg-purple-500/20" 
            />
          </div>
          
          

          {/* Charts and Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MembershipChart data={membershipData} />
            <CheckInActivity data={checkInData} />
          </div>

          {/* Recent Members and Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg font-medium text-white">Recent Members</CardTitle>
                  <Button 
                   
                    size="sm" 
                    className="text-orange-400 hover:text-orange-300"
                    onClick={handleViewAllMembers}
                  >
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <RecentMembersTable members={recentMembers} />
                </CardContent>
              </Card>
            </div>
            
              {/* <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Quick Actions</h3>
                <div className="space-y-3">
                  <QuickActionCard 
                    title="Add New Member"
                    description="Register a new gym member"
                    icon={Plus}
                    onClick={handleAddMember}
                  />
                  <QuickActionCard 
                    title="Generate QR Code"
                    description="Create entry pass for members"
                    icon={QrCode}
                    onClick={() => navigate('/checkins/generate')}
                  />
                  <QuickActionCard 
                    title="View Reports"
                    description="Check analytics and insights"
                    icon={BarChart3}
                    onClick={handleViewReports}
                  />
                </div>
              </div> */}
          </div>

          {/* Alerts and Notifications */}
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-white flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-yellow-400" />
                Important Notifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start p-3 rounded-lg bg-slate-700/50">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-white">Membership Renewal Reminder</h4>
                    <p className="text-xs text-slate-400 mt-1">5 members have memberships expiring in the next 7 days</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-yellow-400 hover:text-yellow-300 p-0 h-auto text-xs"
                    >
                      Send Renewal Notifications
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-start p-3 rounded-lg bg-slate-700/50">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-white">System Update</h4>
                    <p className="text-xs text-slate-400 mt-1">New features have been added to your dashboard</p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-blue-400 hover:text-blue-300 p-0 h-auto text-xs"
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
     

      {/* Modals */}
      {/* {isAddMemberModalOpen && <AddMemberModal onClose={handleCloseAddMemberModal} />} */}
      {isOwnerProfileModalOpen && <OwnerProfileModal 
        onClose={handleCloseOwnerProfileModal} 
        ownerData={owner} 
        onUpdate={() => {}} 
      />}
      
      {/* <EmailVerificationModal
        isOpen={showVerificationModal}
        onVerify={handleVerification}
        email={owner?.email || ''}
        isVerifying={isLoading}
      /> */}
    </>
  );
};

export default OwnerDashboard;