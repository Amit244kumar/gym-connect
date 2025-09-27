import {  useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {Mail} from "lucide-react";
import { toast } from "sonner";

const EmailVerificationModal= ({ 
  isOpen, 
  onClose, 
  onVerify, 
  email="a", 
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
           Please enter code witin 5 minutes to verify your email address.
          </p>
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

export default EmailVerificationModal;