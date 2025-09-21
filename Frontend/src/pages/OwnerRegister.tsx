import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import {
  Dumbbell,
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  Lock,
  CheckCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../store/index'
import { Badge } from "@/components/ui/badge";
import * as yup from "yup";
import {isGymNameAvailableFeth, registerGymOwnerFeth} from "../store/gymOwnerAuth/gymOwnerAuthThunks"
import { RegisterUserData } from "@/type/gymOwnerTypes";
import { toast } from "sonner";
import validationSchema from "@/validation/ownerRegister";

// Add a verification modal component
const VerificationModal = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  email, 
  isVerifying 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onVerify: (code: string) => void; 
  email: string;
  isVerifying: boolean;
}) => {
  const [verificationCode, setVerificationCode] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    onVerify(verificationCode);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="mx-auto bg-orange-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Mail className="h-8 w-8 text-orange-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Verify Your Email</h3>
          <p className="text-slate-400">
            We've sent a verification code to <span className="text-orange-400">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="verificationCode" className="text-slate-300">
              Verification Code
            </Label>
            <Input
              id="verificationCode"
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 text-center text-lg tracking-widest"
              maxLength={6}
              required
            />
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isVerifying || verificationCode.length !== 6}
            >
              {isVerifying ? "Verifying..." : "Verify Account"}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>

          <div className="text-center text-sm text-slate-400 pt-2">
            Didn't receive the code?{" "}
            <button 
              type="button" 
              className="text-orange-400 hover:text-orange-300"
              onClick={() => toast.info("Resend code functionality would go here")}
            >
              Resend
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function OwnerRegister() {
  const [formData, setFormData] = useState({
    ownerName: "",
    gymName: "",
    phoneNumber: "",
    emailId: "",
    password: "",
    confirmPassword: "",
  });
  const dispatch = useDispatch<AppDispatch>()
  const {isLoading, isGymNameAvailable} = useSelector((state:RootState)=>state.gymOwnerAuth)
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const token=localStorage.getItem("token")
  const isAuthorized=localStorage.getItem("isAuthenticated")
  const [status, setStatus] = useState<"checking" | "available" | "taken">("checking");
  const Navigate=useNavigate()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (field === "gymName") {
      // If user starts typing gym name → set status to checking
      if (value.trim().length > 0) {
        setStatus("checking");
      } else {
        setStatus(null);
      }
    } 
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  
  useEffect(() => {
    if (!formData.gymName.trim()) return;

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await dispatch(isGymNameAvailableFeth(formData.gymName.trim())).unwrap();

        if (res) {
          setStatus("available");
        } else {
          setStatus('taken');
        }
      } catch (err) {
        setStatus(null);
      }
    }, 2000); // 2-second delay
    return () => clearTimeout(delayDebounce);
  }, [formData.gymName, dispatch, isGymNameAvailable]); 
  
  const validateField = async (field: string, value: string) => {
    try {
      await validationSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [field]: error.message }));
      }
    }
  };

  const handleBlur = (field: string) => {
    validateField(field, formData[field as keyof typeof formData]);
  };

  const handleVerification = async (code: string) => {
    setIsVerifying(true);
    try {
      // Here you would typically dispatch a verification thunk
      // For now, we'll simulate a successful verification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Account verified successfully!");
      setShowVerificationModal(false);
      Navigate("/owner/dashboard");
    } catch (error) {
      toast.error("Invalid verification code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    
    if(!isGymNameAvailable){
        toast.info('Gym name should be unique')
        return
    }
    
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      
      if (!agreedToTerms) {
        toast.error("Please agree to the terms and conditions");
        return;
      }

      setIsSubmitting(true);
      
      const ownerData:RegisterUserData={
        ownerName: formData.ownerName,
        gymName: formData.gymName,
        phone: formData.phoneNumber,
        email: formData.emailId,
        password: formData.password,
      }
      
      // Simulate API call
      await dispatch(registerGymOwnerFeth(ownerData)).unwrap()
      
      // Show verification modal instead of redirecting immediately
      setShowVerificationModal(true);
      toast.success("Account created! Please verify your email.");
      
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission with a separate function to ensure preventDefault works
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
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
          <h1 className="text-2xl font-bold text-white mb-2">
            Register Your Gym
          </h1>
          <p className="text-slate-400">Start your 2-month free trial today</p>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-white text-xl">
                Gym Owner Registration
              </CardTitle>
            </div>
            <CardDescription className="text-center text-slate-400">
              Fill in your details to create your gym management account
            </CardDescription>

            {/* Trial Badge */}
            <div className="flex justify-center mt-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="h-4 w-4 mr-1" />2 Months Free Trial
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Owner Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  Owner Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-slate-300">
                      Owner Name *
                    </Label>
                    <Input
                      id="ownerName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.ownerName}
                      onChange={(e) =>
                        handleInputChange("ownerName", e.target.value)
                      }
                      onBlur={() => handleBlur("ownerName")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.ownerName ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.ownerName && (
                      <p className="text-red-400 text-sm">{errors.ownerName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gymName" className="text-slate-300">
                      Gym Name *{" "}
                      <span className="text-sm text-slate-400">
                        (must be unique)
                      </span>
                    </Label>
                    <Input
                      id="gymName"
                      type="text"
                      placeholder="Enter your gym name"
                      value={formData.gymName}
                      onChange={(e) =>
                        handleInputChange("gymName", e.target.value)
                      }
                      onBlur={() => handleBlur("gymName")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.gymName ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {formData.gymName.length>2 && 
                      <div className="flex flex-col gap-2 max-w-md">
                       {status === "checking" && <span className="text-gray-500">Checking...</span>}
                       {status === "available" && <span className="text-green-600">✅ Gym name is available</span>}
                       {status === "taken" && <span className="text-red-600">❌ Gym name is already taken</span>}
                     </div>
                    }
                    {errors.gymName && (
                      <p className="text-red-400 text-sm">{errors.gymName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Phone className="h-5 w-5 text-orange-500" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-slate-300">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      onBlur={() => handleBlur("phoneNumber")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.phoneNumber ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-400 text-sm">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailId" className="text-slate-300">
                      Email ID *
                    </Label>
                    <Input
                      id="emailId"
                      type="email"
                      placeholder="owner@gym.com"
                      value={formData.emailId}
                      onChange={(e) =>
                        handleInputChange("emailId", e.target.value)
                      }
                      onBlur={() => handleBlur("emailId")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.emailId ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.emailId && (
                      <p className="text-red-400 text-sm">{errors.emailId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-orange-500" />
                  Account Security
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      onBlur={() => handleBlur("password")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.password && (
                      <p className="text-red-400 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-300">
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      onBlur={() => handleBlur("confirmPassword")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Trial Information */}
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <h4 className="font-semibold text-white mb-2">
                  What's included in your free trial:
                </h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 2 months completely free</li>
                  <li>• Up to 50 members</li>
                  <li>• QR code entry system</li>
                  <li>• Member management tools</li>
                  <li>• Email notifications</li>
                  <li>• No credit card required</li>
                </ul>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked as boolean)
                  }
                  className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-slate-300 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    Privacy Policy
                  </Link>
                  . I understand that after the 2-month free trial, I will need
                  to subscribe to continue using the service.
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg"
                disabled={!agreedToTerms || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </div>
                ) : "Start Free Trial"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-600 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={handleVerification}
        email={formData.emailId}
        isVerifying={isVerifying}
      />
    </div>
  );
}