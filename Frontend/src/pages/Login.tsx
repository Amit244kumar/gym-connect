import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDispatch} from "react-redux";
import { AppDispatch} from '../store/index'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Dumbbell, User, Building2, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import  * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import {memberLoginSchema,ownerLoginSchema} from "../validation/login"
import { loginGymOwnerFeth } from "@/store/gymOwnerAuth/gymOwnerAuthThunks";
import { useNavigate } from "react-router-dom";
import { LoginCredentials } from "@/type/gymOwnerTypes";
// Import the new ForgetPassword component
import ForgetPassword from "../components/modals/ForgetPassword";

type MemberLoginForm = yup.InferType<typeof memberLoginSchema>;
type OwnerLoginForm = yup.InferType<typeof ownerLoginSchema>;

export default function Login() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate=useNavigate()
  // State for ForgetPassword modal
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  
   // Member form
   const {
    register: registerMember,
    handleSubmit: handleMemberSubmit,
    formState: { errors: memberErrors },
  } = useForm<MemberLoginForm>({
    resolver: yupResolver(memberLoginSchema) as any,
    mode: "onSubmit",
  });

   // Owner form
  const {
    register: registerOwner,
    handleSubmit: handleOwnerSubmit,
    formState: { errors: ownerErrors },
  } = useForm<OwnerLoginForm>({
    resolver: yupResolver(ownerLoginSchema) as any,
    mode: "onSubmit",
  });
  const [isSubmitting,setIsSubmitting]=useState(false)
  const onMemberSubmit = (data: MemberLoginForm) => {
    // Handle member login
    console.log("Member login:", data);
  };

  const onOwnerSubmit = async(data: OwnerLoginForm, e?: React.BaseSyntheticEvent) => {
    // Prevent default form submission which causes page reload
    if (e) {
      e.preventDefault();
    }
    
    setIsSubmitting(true);
    
    try {
      const res = await dispatch(loginGymOwnerFeth(data as LoginCredentials)).unwrap();
      console.log("Login response:", res);
      
      if(res && res.success){
        console.log("Login successful:", res.data.slug);
        navigate(`/owner/dashboard/${res.data.slug}`);
      }
    } catch (error) {
      console.error("Login failed:", error);
      // Error is already handled in the thunk with toast notifications
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="h-10 w-10 text-orange-500" />
            <span className="text-3xl font-bold text-white">GymPro</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-slate-400">Sign in to your account</p>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-white text-center">
              Choose Login Type
            </CardTitle>
            <CardDescription className="text-center text-slate-400">
              Are you a gym member or gym owner?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="member" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-700">
                <TabsTrigger
                  value="member"
                  className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  <User className="h-4 w-4" />
                  Member
                </TabsTrigger>
                <TabsTrigger
                  value="owner"
                  className="flex items-center gap-2 data-[state=active]:bg-orange-500 data-[state=active]:text-white"
                >
                  <Building2 className="h-4 w-4" />
                  Gym Owner
                </TabsTrigger>
              </TabsList>

              {/* Member Login */}
              <TabsContent value="member">
                <form onSubmit={handleMemberSubmit(onMemberSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="member-email" className="text-slate-300">
                      Email or Phone Number
                    </Label>
                    <Input
                      id="member-email"
                      type="text"
                      placeholder="Enter your email"
                      {...registerMember("email")}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                    />
                    {memberErrors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {memberErrors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="member-password" className="text-slate-300">
                      Password
                    </Label>
                    <Input
                      id="member-password"
                      type="password"
                      placeholder="Enter your password"
                      {...registerMember("password")}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                    />
                    {memberErrors.password && (
                      <p className="text-red-400 text-sm mt-1">
                        {memberErrors.password.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    Sign In as Member
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-slate-400 text-sm">
                    Don't have an account?{" "}
                    <Link
                      to="/member-register"
                      className="text-orange-400 hover:text-orange-300"
                    >
                      Contact your gym owner
                    </Link>
                  </p>
                </div>
              </TabsContent>

              {/* Owner Login */}
              <TabsContent value="owner">
                <form onSubmit={handleOwnerSubmit(onOwnerSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="owner-email" className="text-slate-300">
                      Email
                    </Label>
                    <Input
                      id="owner-email"
                      type="text" 
                      placeholder="Enter your email"
                      {...registerOwner("email")}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                    />
                    {ownerErrors.email && (
                      <p className="text-red-400 text-sm mt-1">
                        {ownerErrors.email.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="owner-password" className="text-slate-300">
                      Password
                    </Label>
                    <Input
                      id="owner-password"
                      type="password"
                      placeholder="Enter your password"
                      {...registerOwner("password")}
                      className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                    />
                    {ownerErrors.password && (
                      <p className="text-red-400 text-sm mt-1">
                        {ownerErrors.password.message}
                      </p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
                  >
                    {isSubmitting ? "Signing In..." : "Sign In as Gym Owner"}
                  </Button>
                </form>
                <div className="mt-4 text-center">
                  <p className="text-slate-400 text-sm">
                    Don't have a gym account?{" "}
                    <Link
                      to="/owner-register"
                      className="text-orange-400 hover:text-orange-300"
                    >
                      Register your gym
                    </Link>
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-4 border-t border-slate-600">
              <p className="text-center text-slate-400 text-sm">
                Forgot your password?{" "}
                {/* Change the link to a button that opens the modal */}
                <button
                  onClick={() => setShowForgetPassword(true)}
                  className="text-orange-400 hover:text-orange-300"
                >
                  Reset it here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Forget Password Modal */}
      <ForgetPassword 
        isOpen={showForgetPassword} 
        onClose={() => setShowForgetPassword(false)} 
      />
    </div>
  );
}