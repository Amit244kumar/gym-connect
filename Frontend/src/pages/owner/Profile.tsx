// src/pages/ProfilePage.tsx
import { useState, useEffect, useRef, ChangeEvent, FormEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar, 
  CreditCard, 
  Shield, 
  Edit, 
  Save, 
  X,
  Upload,
  Link,
  Copy,
  Check,
  AlertCircle,
  Clock
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/index";
import { getProfilefeth } from "@/store/gymOwnerAuth/gymOwnerAuthThunks"; //updateProfileFeth
import { AppDispatch } from "@/store/index";
import { toast } from "sonner";
import { getFullImageUrl } from "@/components/utils/helper";
import PhoneVerificationModal from "../../components/modals/PhoneVerificationModal";

const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { owner, isLoading } = useSelector((state: RootState) => state.gymOwnerAuth);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPhoneVerification, setShowPhoneVerification] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    gymName: "",
    profileImage: null as File | null,
  });

  useEffect(() => {
    if (owner) {
      setFormData({
        ownerName: owner.ownerName || "",
        email: owner.email || "",
        phone: owner.phone || "",
        gymName: owner.gymName || "",
        profileImage: null,
      });
      
      if (owner.profileImage) {
        setPreviewImage(owner.profileImage);
      }
    }
  }, [owner]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData(prev => ({ ...prev, profileImage: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('ownerName', formData.ownerName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('gymName', formData.gymName);
      
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      
    //   await dispatch(updateProfileFeth(formDataToSend)).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (owner) {
      setFormData({
        ownerName: owner.ownerName || "",
        email: owner.email || "",
        phone: owner.phone || "",
        gymName: owner.gymName || "",
        profileImage: null,
      });
      
      if (owner.profileImage) {
        setPreviewImage(owner.profileImage);
      } else {
        setPreviewImage(null);
      }
    }
    setIsEditing(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getSubscriptionStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'expired':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600">
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="bg-slate-800/50 border-slate-700">
            <TabsTrigger value="general" className="text-slate-300 hover:text-white">General</TabsTrigger>
            <TabsTrigger value="subscription" className="text-slate-300 hover:text-white">Subscription</TabsTrigger>
            <TabsTrigger value="verification" className="text-slate-300 hover:text-white">Verification</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Picture */}
              <Card className="bg-slate-800/50 border-slate-700 lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-white">Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {previewImage ? (
                      <img 
                        src={getFullImageUrl(previewImage)} 
                        alt="Profile" 
                        className="w-32 h-32 rounded-full object-cover border-4 border-slate-600"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center">
                        <User className="h-16 w-16 text-slate-400" />
                      </div>
                    )}
                    
                    {isEditing && (
                      <>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={handleRemoveImage}
                          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                        
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                        
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-4"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Change Photo
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    JPG, PNG or GIF. Max size of 5MB.
                  </p>
                </CardContent>
              </Card>

              {/* General Information */}
              <Card className="bg-slate-800/50 border-slate-700 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">General Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ownerName" className="text-slate-300">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input
                            id="ownerName"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="bg-slate-700/50 border-slate-600 text-white pl-10"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="bg-slate-700/50 border-slate-600 text-white pl-10"
                          />
                        </div>
                        {owner?.isEmailVerified && (
                          <div className="flex items-center mt-1">
                            <Check className="h-3 w-3 text-green-400 mr-1" />
                            <span className="text-xs text-green-400">Verified</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-300">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="bg-slate-700/50 border-slate-600 text-white pl-10"
                          />
                        </div>
                        {owner?.isPhoneVerified ? (
                          <div className="flex items-center mt-1">
                            <Check className="h-3 w-3 text-green-400 mr-1" />
                            <span className="text-xs text-green-400">Verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center mt-1">
                            <AlertCircle className="h-3 w-3 text-yellow-400 mr-1" />
                            <span className="text-xs text-yellow-400">Not verified</span>
                            <Button 
                              type="button" 
                              variant="link" 
                              className="text-yellow-400 hover:text-yellow-300 p-0 h-auto text-xs ml-2"
                              onClick={() => setShowPhoneVerification(true)}
                            >
                              Verify Now
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gymName" className="text-slate-300">Gym Name</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                          <Input
                            id="gymName"
                            name="gymName"
                            value={formData.gymName}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="bg-slate-700/50 border-slate-600 text-white pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="subscription">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Subscription Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Plan Type</span>
                    <Badge className={getSubscriptionStatusColor(owner?.subscriptionStatus || '')}>
                      {owner?.subscriptionPlanType?.toUpperCase() || 'N/A'}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <Badge className={getSubscriptionStatusColor(owner?.subscriptionStatus || '')}>
                      {owner?.subscriptionStatus?.toUpperCase() || 'N/A'}
                    </Badge>
                  </div>
                  
                  {owner?.trialInfo && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Trial Period</span>
                        <span className="text-white">{owner.trialInfo.totalTrialDays} days</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-400">Days Remaining</span>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-white">{owner.trialInfo.daysLeft} days</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-slate-400">Trial Status</span>
                        <Badge className={owner.trialInfo.isTrialActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}>
                          {owner.trialInfo.trialStatus?.toUpperCase() || 'N/A'}
                        </Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    Important Dates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {owner?.trialStart && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trial Start Date</span>
                      <span className="text-white">{formatDate(owner.trialStart)}</span>
                    </div>
                  )}
                  
                  {owner?.trialEnd && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Trial End Date</span>
                      <span className="text-white">{formatDate(owner.trialEnd)}</span>
                    </div>
                  )}
                  
                  {/* {owner?.createdAt && (
                    <div className="flex justify-between">
                      <span className="text-slate-400">Member Since</span>
                      <span className="text-white">{formatDate(owner.createdAt)}</span>
                    </div>
                  )} */}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="verification">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Verification Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                    <div>
                      <p className="text-white font-medium">Email Verification</p>
                      <p className="text-sm text-slate-400">{owner?.email || 'N/A'}</p>
                    </div>
                    {owner?.isEmailVerified ? (
                      <Badge className="bg-green-500/20 text-green-400">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-yellow-500/20 text-yellow-400">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Pending
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-700/50">
                    <div>
                      <p className="text-white font-medium">Phone Verification</p>
                      <p className="text-sm text-slate-400">{owner?.phone || 'N/A'}</p>
                    </div>
                    {owner?.isPhoneVerified ? (
                      <Badge className="bg-green-500/20 text-green-400">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowPhoneVerification(true)}
                        className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/30"
                      >
                        Verify
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-slate-800/50 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Link className="h-5 w-5 mr-2" />
                    Registration Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-slate-400 mb-2">Registration URL</p>
                    <div className="flex items-center p-3 rounded-lg bg-slate-700/50">
                      <span className="text-sm text-white truncate flex-1">
                        {owner?.registrationUrl || 'N/A'}
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => owner?.registrationUrl && copyToClipboard(owner.registrationUrl)}
                        className="ml-2"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-slate-400 mb-2">Gym Slug</p>
                    <div className="flex items-center p-3 rounded-lg bg-slate-700/50">
                      <span className="text-sm text-white">
                        {owner?.slug || 'N/A'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default Profile;