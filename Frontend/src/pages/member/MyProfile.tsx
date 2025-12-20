// components/member/MemberProfile.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Camera, 
  Save,
  Edit,
  CreditCard,
  Shield
} from "lucide-react";
import { toast } from "sonner";

interface MemberProfileProps {
  memberId: string;
}

interface MembershipPlan {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
}

interface MemberData {
  id: number;
  name: string;
  email: string;
  phone: string;
  memberPhoto: string;
  address: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  membershipType: number;
  membershipStatus: "active" | "expired" | "suspended";
}

export default function MemberProfile({ memberId }: MemberProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [memberData, setMemberData] = useState<MemberData>({
    id: 0,
    name: "",
    email: "",
    phone: "",
    memberPhoto: "",
    address: "",
    dateOfBirth: "",
    gender: "male",
    membershipType: 0,
    membershipStatus: "active"
  });
  
  const [membershipPlans, setMembershipPlans] = useState<MembershipPlan[]>([]);
  const [currentPlan, setCurrentPlan] = useState<MembershipPlan | null>(null);

  // Mock data fetching - replace with actual API calls
  useEffect(() => {
    const fetchMemberData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock member data
        const mockMemberData: MemberData = {
          id: 1,
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "9876543210",
          memberPhoto: "",
          address: "123 Main Street, City, Country",
          dateOfBirth: "1990-01-15",
          gender: "male",
          membershipType: 1,
          membershipStatus: "active"
        };
        
        // Mock membership plans
        const mockPlans: MembershipPlan[] = [
          { id: 1, name: "Basic Monthly", description: "Access to gym equipment", price: 29.99, duration: 30 },
          { id: 2, name: "Premium Monthly", description: "Access to gym + group classes", price: 49.99, duration: 30 },
          { id: 3, name: "Annual Membership", description: "Full access for 1 year", price: 499.99, duration: 365 }
        ];
        
        setMemberData(mockMemberData);
        setMembershipPlans(mockPlans);
        
        // Find current plan
        const plan = mockPlans.find(p => p.id === mockMemberData.membershipType);
        setCurrentPlan(plan || null);
      } catch (error) {
        toast.error("Failed to load profile data");
        console.error("Error fetching member data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberData();
  }, [memberId]);

  const handleInputChange = (field: keyof MemberData, value: string) => {
    setMemberData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the current plan if membership type changed
      if (memberData.membershipType) {
        const plan = membershipPlans.find(p => p.id === memberData.membershipType);
        setCurrentPlan(plan || null);
      }
      
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Error updating profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset to original data - in a real app, you'd refetch or keep a copy of original data
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/50 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <User className="h-5 w-5 text-orange-400" />
            My Profile
          </CardTitle>
          {!isEditing ? (
            <Button 
              onClick={() => setIsEditing(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleCancelEdit}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveProfile}
                disabled={isSaving}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-700/50">
              <TabsTrigger value="personal" className="data-[state=active]:bg-slate-700">Personal Information</TabsTrigger>
              <TabsTrigger value="membership" className="data-[state=active]:bg-slate-700">Membership Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal" className="space-y-6 pt-4">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Photo */}
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32 border-2 border-slate-600">
                    <AvatarImage src={memberData.memberPhoto} alt="Profile" />
                    <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl">
                      {getInitials(memberData.name)}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700">
                      <Camera className="h-4 w-4 mr-2" />
                      Change Photo
                    </Button>
                  )}
                </div>
                
                {/* Personal Information Form */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={memberData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    ) : (
                      <div className="p-2 bg-slate-700/30 rounded-md text-white">
                        {memberData.name}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                    <div className="flex items-center p-2 bg-slate-700/30 rounded-md">
                      <Mail className="h-4 w-4 text-slate-400 mr-2" />
                      <span className="text-white">{memberData.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={memberData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    ) : (
                      <div className="flex items-center p-2 bg-slate-700/30 rounded-md">
                        <Phone className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-white">{memberData.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-slate-300">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="dateOfBirth"
                        type="date"
                        value={memberData.dateOfBirth}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                      />
                    ) : (
                      <div className="flex items-center p-2 bg-slate-700/30 rounded-md">
                        <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                        <span className="text-white">{formatDate(memberData.dateOfBirth)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-slate-300">Gender</Label>
                    {isEditing ? (
                      <Select 
                        value={memberData.gender} 
                        onValueChange={(value) => handleInputChange('gender', value)}
                      >
                        <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700">
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="p-2 bg-slate-700/30 rounded-md text-white capitalize">
                        {memberData.gender}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="address" className="text-slate-300">Address</Label>
                    {isEditing ? (
                      <Textarea
                        id="address"
                        value={memberData.address}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white min-h-[80px]"
                      />
                    ) : (
                      <div className="flex items-start p-2 bg-slate-700/30 rounded-md">
                        <MapPin className="h-4 w-4 text-slate-400 mr-2 mt-1" />
                        <span className="text-white">{memberData.address}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="membership" className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-orange-400" />
                      Current Membership
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentPlan ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Plan Name</span>
                          <span className="text-white font-medium">{currentPlan.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Price</span>
                          <span className="text-white font-medium">${currentPlan.price.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Duration</span>
                          <span className="text-white font-medium">{currentPlan.duration} days</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300">Description</span>
                          <span className="text-white text-right max-w-[60%]">{currentPlan.description}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-slate-400">No membership plan found</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card className="bg-slate-700/30 border-slate-600">
                  <CardHeader>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Shield className="h-5 w-5 text-orange-400" />
                      Membership Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Status</span>
                      <Badge 
                        className={
                          memberData.membershipStatus === "active" 
                            ? "bg-green-500/20 text-green-400 border-green-500/30" 
                            : memberData.membershipStatus === "expired" 
                              ? "bg-red-500/20 text-red-400 border-red-500/30" 
                              : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                        }
                      >
                        {memberData.membershipStatus.charAt(0).toUpperCase() + memberData.membershipStatus.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="pt-4">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600">
                        Renew Membership
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-slate-700/30 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-lg text-white">Available Membership Plans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {membershipPlans.map(plan => (
                      <Card key={plan.id} className="bg-slate-800/50 border-slate-700">
                        <CardHeader>
                          <CardTitle className="text-white">{plan.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-slate-300 mb-2">{plan.description}</p>
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-xl font-bold text-white">${plan.price.toFixed(2)}</span>
                            <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                              Select
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}