import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import '../../assest/css/addMemberModal.css'
import {
  Users,
  QrCode,
  Calendar,
  Bell,
  Settings,
  BarChart3,
  Plus,
  Search,
  X,
  Upload,
  User,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import "./AddMemberModal.css"; // Import the CSS file

// Add Member Modal Component
function AddMemberModal({ onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "",
    startDate: "",
    profileImage: null,
  });
  
  const [previewImage, setPreviewImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log("Member data:", formData);
    onClose(); // Close the modal after submission
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
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

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div 
        className="bg-slate-800 border border-slate-700 rounded-lg w-full max-w-md overflow-hidden flex flex-col"
        style={{ height: '-webkit-fill-available', maxHeight: '90vh' }}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Add New Member</h2>
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center">
                    <User className="h-12 w-12 text-slate-500" />
                  </div>
                )}
              </div>
              
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter member's full name"
                value={formData.name}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-slate-300">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="plan" className="text-slate-300">
                Membership Plan
              </Label>
              <Select 
                onValueChange={(value) => setFormData(prev => ({ ...prev, plan: value }))}
                value={formData.plan}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="basic">Basic (1 Month)</SelectItem>
                  <SelectItem value="standard">Standard (3 Months)</SelectItem>
                  <SelectItem value="premium">Premium (6 Months)</SelectItem>
                  <SelectItem value="annual">Annual (12 Months)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-slate-300">
                Membership Start Date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                className="bg-slate-700 border-slate-600 text-white"
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-slate-600 text-slate-300 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                Add Member
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMemberModal;