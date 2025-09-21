import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { X } from "lucide-react";
import { useSelector,useDispatch } from "react-redux";
import { forgetPasswordFeth } from "@/store/gymOwnerAuth/gymOwnerAuthThunks";

// Schema for email validation
const forgotPasswordSchema = yup.object({
  email: yup.string()
    .email("Please enter a valid email address")
      .matches(
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address"
      )
      .required("Email is required"),
});

type ForgotPasswordForm = yup.InferType<typeof forgotPasswordSchema>;

interface ForgetPasswordProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ForgetPassword({ isOpen, onClose }: ForgetPasswordProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const {isLoading}=useSelector((state:any)=>state.gymOwnerAuth)
  const dispatch=useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordForm>({
    resolver: yupResolver(forgotPasswordSchema) as any,
    mode: "onSubmit",
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsSubmitting(isLoading);
    console.log("Form Data:", data);
    try {       
      // Here you would typically make an API call to your backend
      // to send a password reset email
      console.log("Password reset request for:", data.email);
      
      // Simulate API call
      await dispatch<any>(forgetPasswordFeth(data));
      
      // Show success message
      setIsSuccess(isLoading);
      
      // Reset form
      reset();
    } catch (error) {
      console.error("Password reset request failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset state when closing
    setIsSuccess(false);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md relative">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
            <p className="text-slate-400">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>
          
          {isSuccess ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Email Sent!</h3>
              <p className="text-slate-400 mb-6">
                We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
              </p>
              <Button
                onClick={handleClose}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              >
                Back to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500"
                />
                {errors.email && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>
              
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Remember your password?{" "}
              <button
                onClick={handleClose}
                className="text-orange-400 hover:text-orange-300"
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}