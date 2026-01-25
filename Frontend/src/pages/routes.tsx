  // routes.js
  import Index from './Index';
  import Login from './Login';
  import OwnerRegister from './owner/OwnerRegister';
  import OwnerDashboard from './owner/OwnerDashboard';
  import MemberRegister from './member/MemberRegister';
  import MemberDashboard from './member/MemberDashboard';
  import NotFound from './NotFound';
  import ProtectedRoute from '../components/ProtectedRoute';
  import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import MainLayout from '@/components/layout/MainLayout';
import Profile from './owner/Profile';
import Members from './owner/Members';
import CheckIn from './owner/CheckIn';
import MembershipPlan from './owner/MembershipPlan';
import Reports from './owner/Reports';
import Notifications from './owner/Notifications';
import Messages from './owner/Messages';
import Settings from './owner/Settings';
import Help from './owner/Help';
import MemberCheckIn from './owner/memberCheckIn';
import MemberLayout from '@/components/layout/MemberLayout';
import MemberProfile from './member/MyProfile';
import Attendance from './member/Attendance';
  export const AppRouters=()=>{
      const router=createBrowserRouter(
        createRoutesFromElements(
              <>
                {/* Public Routes */}
                <Route element={<ProtectedRoute  requireAuth={false} />}>
                  <Route path="/"  element={<Index />} />
                </Route>
                <Route element={<ProtectedRoute requireAuth={false} />}>
                    <Route path="/login" element={<Login />} />
                </Route>
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route element={<ProtectedRoute requireAuth={false} />} >
                  <Route  path="/owner/register" element ={<OwnerRegister />} />
                </Route>
                <Route element={<ProtectedRoute requireAuth={false} />} >
                  <Route path="/member/register" element={<MemberRegister />} />
                </Route>
                {/* Protected Routes */}
                
                <Route element={<MainLayout />} >
                  <Route path="/owner/dashboard/:gymName" element={<OwnerDashboard />} />
                  <Route path="/owner/members" element={<Members />} />
                  <Route path="/owner/members/checkin" element={<CheckIn />} />
                  <Route path="/owner/membershipPlan" element={<MembershipPlan />} />
                  {/* <Route path="/owner/reports" element={<Reports />} />
                  <Route path="/owner/notifications" element={<Notifications />} /> */}
                  {/* <Route path="/owner/members/checkout" element={<MemberCheckIn />} /> */}
                  {/* <Route path="/owner/messages" element={<Messages />} />
                  <Route path="/owner/settings" element={<Settings />} />
                  <Route path="/owner/help" element={<Help />} />*/}
                  <Route path="/owner/profile/:gymName" element={<Profile />} /> 
                </Route>
                 <Route element={<MemberLayout />}>
                    <Route path="/member/dashboard" element={<MemberDashboard />} />
                    <Route path="/member/profile" element={<MemberProfile />} />
                    <Route path="/member/attendance" element={<Attendance />} />
                    {/*<<Route path="/member/attendance" element={<MemberAttendance />} />
                    <Route path="/member/progress" element={<MemberProgress />} />
                    <Route path="/member/messages" element={<MemberMessages />} />
                    <Route path="/member/settings" element={<MemberSettings />} />
                    <Route path="/member/help" element={<MemberHelp />} /> */}
                  </Route>
                  
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </>
        )
      )
      return <RouterProvider router={router} />
  }


