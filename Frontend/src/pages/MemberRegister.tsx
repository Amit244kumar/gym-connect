import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Dumbbell, ArrowLeft, QrCode, Users, Phone, Mail } from "lucide-react";

export default function MemberRegister() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Login
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="h-10 w-10 text-orange-500" />
            <span className="text-3xl font-bold text-white">GymPro</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Member Registration
          </h1>
          <p className="text-slate-400">Join your gym through your gym owner</p>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto">
              <QrCode className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-white text-xl">
              How to Register as a Member
            </CardTitle>
            <CardDescription className="text-slate-400">
              Members need to register through their gym owner's unique
              registration link or QR code
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Steps */}
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Contact Your Gym
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Ask your gym owner for the member registration link or QR
                    code
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Scan QR Code or Use Link
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Each gym has a unique registration process for their members
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  3
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">
                    Complete Registration
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Fill in your details and choose your membership plan
                  </p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-blue-400" />
                <h4 className="text-blue-400 font-semibold">
                  Why This Process?
                </h4>
              </div>
              <p className="text-slate-300 text-sm">
                This ensures that only authorized members can join each gym and
                helps gym owners manage their member base effectively.
              </p>
            </div>

            {/* Contact Options */}
            <div className="space-y-3">
              <h4 className="text-white font-semibold">Need Help?</h4>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  variant="outline"
                  className="justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Call Your Gym
                </Button>
                <Button
                  variant="outline"
                  className="justify-start text-slate-300 border-slate-600 hover:bg-slate-700"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Your Gym
                </Button>
              </div>
            </div>

            {/* Back to Login */}
            <div className="pt-4 border-t border-slate-600">
              <Link to="/login">
                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Alternative for Gym Owners */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-sm">
            Are you a gym owner?{" "}
            <Link
              to="/register"
              className="text-orange-400 hover:text-orange-300"
            >
              Register your gym here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
