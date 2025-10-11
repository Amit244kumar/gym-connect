import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  X,
  Upload,
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  Shield,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/index";

// Owner Profile Modal Component
function OwnerProfileModal({ onClose, ownerData, onUpdate }) {
  const [formData, setFormData] = useState({
    ownerName: "",
    email: "",
    phone: "",
    gymName: "",
    profileImage: null,
  });
  
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (ownerData) {
      setFormData({
        ownerName: ownerData.ownerName || "",
        email: ownerData.email || "",
        phone: ownerData.phone || "",
        gymName: ownerData.gymName || "",
        profileImage: null,
      });
      
      if (ownerData.profileImage) {
        setPreviewImage(ownerData.profileImage);
      }
    }
  }, [ownerData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Owner profile data:", formData);
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, profileImage: null }));
    setPreviewImage(null);
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md overflow-hidden flex flex-col"
        style={{ height: '-webkit-fill-available', maxHeight: '90vh' }}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Owner Profile</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="scroll-container">
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Profile Image Upload Section */}
            <div className="flex flex-col items-center space-y-3 pb-4 border-b border-slate-700">
              <div className="relative">
                {previewImage ? (
                  <div className="relative">
                    <img 
                      src={previewImage} 
                      alt="Profile preview" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-600"
                    />
                    {isEditing && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center">
                    <User className="h-12 w-12 text-slate-500" />
                  </div>
                )}
              </div>
              
              {isEditing && (
                <div className="flex flex-col items-center">
                  <Label htmlFor="profileImage" className="text-slate-300 mb-2">
                    Profile Photo
                  </Label>
                  <div className="flex gap-2">
                    <Label
                      htmlFor="profileImage"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md cursor-pointer transition-colors"
                    >
                      <Upload className="h-4 w-4" />
                      <span>Choose Photo</span>
                    </Label>
                    <Input
                      id="profileImage"
                      name="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF (max. 5MB)</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ownerName" className="text-slate-300 flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="ownerName"
                name="ownerName"
                type="text"
                value={formData.ownerName}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
                readOnly={!isEditing}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
                readOnly={!isEditing}
                required
              />
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${ownerData?.isEmailVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-slate-400">
                  {ownerData?.isEmailVerified ? 'Email verified' : 'Email not verified'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300 flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
                readOnly={!isEditing}
                required
              />
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${ownerData?.isPhoneVerified ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs text-slate-400">
                  {ownerData?.isPhoneVerified ? 'Phone verified' : 'Phone not verified'}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="gymName" className="text-slate-300 flex items-center gap-2">
                <Building className="h-4 w-4" />
                Gym Name
              </Label>
              <Input
                id="gymName"
                name="gymName"
                type="text"
                value={formData.gymName}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
                readOnly={!isEditing}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Subscription Information
              </Label>
              <div className="bg-slate-700/50 p-3 rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Plan Type:</span>
                  <span className="text-white capitalize">{ownerData?.subscriptionPlanType}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-slate-400">Status:</span>
                  <span className={`capitalize ${ownerData?.subscriptionStatus === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                    {ownerData?.subscriptionStatus}
                  </span>
                </div>
                {ownerData?.trialInfo && (
                  <>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-400">Trial Days Left:</span>
                      <span className="text-white">{ownerData.trialInfo.daysLeft} days</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-slate-400">Trial Status:</span>
                      <span className={`capitalize ${ownerData.trialInfo.trialStatus === 'active' ? 'text-green-400' : 'text-red-400'}`}>
                        {ownerData.trialInfo.trialStatus}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-slate-300 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Registration Information
              </Label>
              <div className="bg-slate-700/50 p-3 rounded-md">
                <div className="text-sm">
                  <div className="text-slate-400 mb-1">Registration URL:</div>
                  <div className="text-blue-400 text-xs break-all">{ownerData?.registrationUrl}</div>
                </div>
                <div className="flex justify-between text-sm mt-2">
                  <span className="text-slate-400">Member Since:</span>
                  <span className="text-white">
                    {ownerData?.createdAt ? new Date(ownerData.createdAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={toggleEdit}
                className="flex-1 border-slate-600 text-slate-300 hover:text-white"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
              {isEditing ? (
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-slate-700 hover:bg-slate-600"
                >
                  Close
                </Button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default OwnerProfileModal;