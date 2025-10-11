import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
// import { resendPhoneVerificationFetch } from "@/store/gymOwnerAuth/gymOwnerAuthThunks";

const PhoneVerificationModal = ({phone}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleVerifyPhone = (code: string) => {
    // Implement phone verification logic here
    setIsVerifying(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsVerifying(false);
      setIsModalOpen(false);
      toast.success("Phone number verified successfully!");
    }, 1500);
  };

  const resendCode = async () => {
    // Implement resend code logic here
    setIsSending(true);
    try {
      // await dispatch(resendPhoneVerificationFetch());
      toast.success("Verification code resent successfully!");
    } catch (error) {
      toast.error("Failed to resend verification code");
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyPhone(verificationCode);
  };

  return (
    <>
      {/* Top banner */}
      <div className="top-0 left-0 w-full bg-yellow-400 text-gray-800 z-50 shadow-md p-1 flex justify-center">
        <div className="flex-1 flex items-center justify-center gap-2">
          <h2 className="text-lg font-bold">Verify Your Phone Number</h2>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm py-1 h-8"
          >
            Verify Now
          </Button>
        </div>
      </div>

      {/* Phone Verification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-8 w-8 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Verify Your Phone Number</h3>
              <p className="text-slate-400">
                Please enter the code within 5 minutes to verify your phone number.
              </p>
              <p className="text-slate-400">
                We've sent a verification code to <span className="text-blue-400">{phone}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* <div className="space-y-2">
                <Label htmlFor="phoneNumber" className="text-slate-300">
                  Phone Number
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500"
                  required
                />
              </div> */}

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
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-blue-500 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                />
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <Button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                  disabled={isVerifying || verificationCode.length !== 6 }
                >
                  {isVerifying ? "Verifying..." : "Verify Phone Number"}
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
              </div>

              <div className="text-center text-sm text-slate-400 pt-2">
                Didn't receive the code?{" "}
                <button 
                  type="button" 
                  className="text-blue-400 hover:text-blue-300"
                  onClick={resendCode}
                >
                  {isSending ? "Sending..." : "Resend Code"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default PhoneVerificationModal;