  // routes.js
  import Index from './Index';
  import Login from './Login';
  import OwnerRegister from './OwnerRegister';
  import OwnerDashboard from './OwnerDashboard';
  import MemberRegister from './MemberRegister';
  import MemberDashboard from './MemberDashboard';
  import NotFound from './NotFound';
  import ProtectedRoute from '../components/ProtectedRoute';
  import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import ResetPassword from './ResetPassword';
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
                
                <Route path="/owner/dashboard/:gymName" element={<OwnerDashboard />}>
                
                </Route>
                <Route path="/member/dashboard"  element={<MemberDashboard />}>
                          
                </Route>  
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
            </>
        )
      )
      return <RouterProvider router={router} />
  }


