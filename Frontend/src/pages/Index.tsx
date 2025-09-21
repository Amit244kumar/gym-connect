import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Dumbbell,
  Users,
  QrCode,
  Calendar,
  Bell,
  Shield,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Dumbbell className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-white">GymPro</span>
          </div>
          <div className="flex gap-3">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:bg-slate-700">
                Login
              </Button>
            </Link>
            <Link to="/owner/register">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Register
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 to-slate-800/50 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/33430988/pexels-photo-33430988.jpeg')`,
          }}
        />

        <div className="relative z-20 text-center max-w-4xl mx-auto px-4">
          <div className="animate-fade-in-up">
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 mb-6">
              Next Generation Gym Management
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">
                {" "}
                Gym Business
              </span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Complete gym management solution with member tracking, QR entry
              system, automated membership management, and real-time analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white text-lg px-8 py-6 group"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-slate-900 text-lg px-8 py-6"
              >
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-float">
          <div className="bg-orange-500/20 backdrop-blur-sm rounded-full p-4">
            <Users className="h-8 w-8 text-orange-400" />
          </div>
        </div>
        <div className="absolute top-40 right-10 animate-float-delayed">
          <div className="bg-blue-500/20 backdrop-blur-sm rounded-full p-4">
            <QrCode className="h-8 w-8 text-blue-400" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Everything You Need to Manage Your Gym
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              From member onboarding to advanced analytics, our platform handles
              it all
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: QrCode,
                title: "QR Code Entry System",
                description:
                  "Members scan QR codes for seamless gym entry with real-time tracking",
                color: "text-blue-400",
              },
              {
                icon: Users,
                title: "Member Management",
                description:
                  "Complete member profiles, membership tracking, and automated renewals",
                color: "text-green-400",
              },
              {
                icon: Calendar,
                title: "Membership Tracking",
                description:
                  "Never miss a renewal with automated expiry notifications and alerts",
                color: "text-purple-400",
              },
              {
                icon: Bell,
                title: "Smart Notifications",
                description:
                  "Automated alerts for membership renewals and payment reminders",
                color: "text-yellow-400",
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description:
                  "Bank-grade security with encrypted data and secure payment processing",
                color: "text-red-400",
              },
              {
                icon: Zap,
                title: "Real-time Analytics",
                description:
                  "Track daily visits, peak hours, and member engagement metrics",
                color: "text-orange-400",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-all duration-300 group"
              >
                <CardHeader>
                  <feature.icon
                    className={`h-12 w-12 ${feature.color} group-hover:scale-110 transition-transform`}
                  />
                  <CardTitle className="text-white text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-gradient-to-b from-slate-800 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Start with our free trial and upgrade when you're ready
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* 2 Month Trial */}
            <Card className="bg-slate-800/50 border-slate-600 relative group hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500/20 rounded-full mb-4">
                  <Star className="h-8 w-8 text-green-400" />
                </div>
                <CardTitle className="text-2xl text-white">
                  Free Trial
                </CardTitle>
                <div className="text-4xl font-bold text-white mt-4">
                  ₹0
                  <span className="text-lg text-slate-400 font-normal">
                    /2 months
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Up to 50 members",
                  "QR code entry system",
                  "Basic member management",
                  "Email notifications",
                  "Basic analytics",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white">
                  Start Free Trial
                </Button>
              </CardContent>
            </Card>

            {/* 1 Month Premium */}
            <Card className="bg-orange-500/10 border-orange-500 relative group hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-orange-500 text-white px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/20 rounded-full mb-4">
                  <Zap className="h-8 w-8 text-orange-400" />
                </div>
                <CardTitle className="text-2xl text-white">
                  Premium Monthly
                </CardTitle>
                <div className="text-4xl font-bold text-white mt-4">
                  ₹999
                  <span className="text-lg text-slate-400 font-normal">
                    /month
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Unlimited members",
                  "Advanced QR system",
                  "Complete member management",
                  "SMS & Email notifications",
                  "Advanced analytics",
                  "Custom branding",
                  "Priority support",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-orange-400" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-6 bg-orange-500 hover:bg-orange-600 text-white">
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* 2 Month Premium */}
            <Card className="bg-slate-800/50 border-slate-600 relative group hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-500/20 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-purple-400" />
                </div>
                <CardTitle className="text-2xl text-white">
                  Premium Quarterly
                </CardTitle>
                <div className="text-4xl font-bold text-white mt-4">
                  ₹1899
                  <span className="text-lg text-slate-400 font-normal">
                    /2 months
                  </span>
                </div>
                <div className="text-sm text-green-400 font-medium">
                  Save ₹99
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Everything in Premium",
                  "Advanced reporting",
                  "API access",
                  "White-label solution",
                  "24/7 dedicated support",
                  "Custom integrations",
                  "Training sessions",
                ].map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-purple-400" />
                    <span className="text-slate-300">{feature}</span>
                  </div>
                ))}
                <Button className="w-full mt-6 bg-purple-500 hover:bg-purple-600 text-white">
                  Get Started
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-red-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Transform Your Gym?
          </h2>
          <p className="text-orange-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of gym owners who have streamlined their operations
            with GymPro
          </p>
          <Button
            size="lg"
            className="bg-white text-orange-500 hover:bg-slate-100 text-lg px-8 py-6"
          >
            Start Your Free Trial Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-700">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold text-white">GymPro</span>
          </div>
          <p className="text-slate-400">
            © 2024 GymPro. All rights reserved. Transform your gym business
            today.
          </p>
        </div>
      </footer>
    </div>
  );
}
