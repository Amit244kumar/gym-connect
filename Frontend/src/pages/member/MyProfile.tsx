// components/member/memberProfile.tsx
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Shield,
  IndianRupee,
} from "lucide-react";
import { getFullImageUrl } from "@/components/utils/helper"; // Assuming you have this helper
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMemberProfileFeth } from "@/store/memberAuth/memberAuthThunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

// --- INTERFACES ---
// These define the shape of the data the component expects from the API.

export interface MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

// --- PROPS INTERFACE ---
// The component now only needs the memberId to fetch its own data.



export default function memberProfile() {
  // --- STATE MANAGEMENT ---

  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);

  const dispatch = useDispatch<AppDispatch>()
  const {isLoading,memberProfile}=useSelector((state:RootState)=>state.memberAuth)
  console.log('sdfsdsd',memberProfile)
  // --- DATA FETCHING ---
 // Rerun the effect if the memberId changes

  // --- DERIVED STATE ---
  // Find the current plan based on the member's membership type.
  // This will automatically update whenmemberProfile or membershipPlans change.


  // --- HELPER FUNCTIONS ---

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  // --- LOADING STATE ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  console.log("member profile data",memberProfile)
  // --- ERROR STATE (if data failed to load) ---
  if (!memberProfile) {
    return (
      <Card className="bg-slate-800/50 border-slate-700">
        <CardContent className="pt-6">
          <p className="text-center text-slate-400">Could not load member profile.</p>
        </CardContent>
      </Card>
    );
  }

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-orange-400" />
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="personal" className="data-[state=active]:bg-slate-700">
                Personal Information
              </TabsTrigger>
              <TabsTrigger value="membership" className="data-[state=active]:bg-slate-700">
                Membership Details
              </TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-6 pt-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32 border-2 border-slate-600">
                    {memberProfile.memberPhoto ? (
                      <AvatarImage
                        src={getFullImageUrl(memberProfile.memberPhoto)}
                        alt="Profile"
                      />
                    ) : null}
                    <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl">
                      {memberProfile.name}
                    </AvatarFallback>
                  </Avatar>
                </div>

                {/* Personal Information Display */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-slate-300 text-sm">Full Name</div>
                    <div className="p-2 bg-slate-700/30 rounded-md text-white">
                      {memberProfile.name}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-slate-300 text-sm">Email Address</div>
                    <div className="flex items-center p-2 bg-slate-700/30 rounded-md">
                      <Mail className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-white">{memberProfile.email}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-slate-300 text-sm">Phone Number</div>
                    <div className="flex items-center p-2 bg-slate-700/30 rounded-md">
                      <Phone className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-white">{memberProfile.phone}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-slate-300 text-sm">Date of Birth</div>
                    <div className="flex items-center p-2 bg-slate-700/30 rounded-md">
                      <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-white">{formatDate(memberProfile.dateOfBirth)}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-slate-300 text-sm">Gender</div>
                    <div className="p-2 bg-slate-700/30 rounded-md text-white capitalize">
                      {memberProfile.gender}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <div className="text-slate-300 text-sm">Address</div>
                    <div className="flex items-start p-2 bg-slate-700/30 rounded-md">
                      <MapPin className="h-4 w-4 text-slate-400 mr-2 mt-1" />
                      <span className="text-white">{memberProfile.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="membership" className="space-y-6 pt-4">
              <div className="">
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-orange-400" />
                      Current Membership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {memberProfile?.OwnerMembershipPlan ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Plan Name</span>
                          <span className="text-white font-medium">{memberProfile?.OwnerMembershipPlan?.planName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Price</span>
                          <span className="text-white font-medium">
                            {memberProfile?.OwnerMembershipPlan?.price}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Duration</span>
                          <span className="text-white font-medium">{memberProfile?.OwnerMembershipPlan?.duration} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Description</span>
                          <span className="text-white text-right max-w-[60%]">
                            {memberProfile?.OwnerMembershipPlan?.description}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-400">No membership plan found</p>
                    )}
                  </CardContent>
                </Card>

               
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}