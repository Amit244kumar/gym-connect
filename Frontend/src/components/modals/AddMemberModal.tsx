import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";
import '../../assest/css/addMemberModal.css'
import {
  Users,
  X,
  Upload,
  User,
  MapPin,
  Calendar,
  Venus,
  Mars,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addMemberFeth } from "@/store/memberAuth/memberAuthThunk";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

// Define validation schema with Yup
const validationSchema = yup.object().shape({
  name: yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: yup.string()
    .required("Email is required")
    .email("Please enter a valid email address"),
  phone: yup.string()
    .required("Phone number is required")
    .matches(/^[0-9]{10}$/, "Please enter a valid 10-digit phone number"),
  address: yup.string()
    .required("Address is required")
    .min(5, "Address must be at least 5 characters"),
  dateOfBirth: yup.string()
    .required("Date of birth is required")
    .test("is-past-date", "Date of birth must be in the past", function(value) {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part
      return selectedDate <= today;
    }),
  gender: yup.string()
    .required("Please select a gender"),
  plan: yup.string()
    .required("Please select a membership plan"),
  startDate: yup.string()
    .required("Start date is required")
    .test("is-future-date", "Start date must be today or later", function(value) {
      if (!value) return false;
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset time part
      return selectedDate >= today;
    }),
  profileImage: yup.mixed()
    .optional()
    .test("fileSize", "Image size should be less than 5MB", (value) => {
      if (!value) return true; // If no file is provided, skip validation
      return value.size <= 5 * 1024 * 1024; // 5MB
    })
    .test("fileType", "Only JPG, PNG, or GIF images are allowed", (value) => {
      if (!value) return true; // If no file is provided, skip validation
      return ["image/jpeg", "image/png", "image/gif"].includes(value.type);
    })
});

interface memberData {
  name: string
  email: string
  phone: string 
  address: string
  dateOfBirth: string
  gender: string
  plan: string
  startDate: string
  profileImage: File | string
}

// Add Member Modal Component
function AddMemberModal({ onClose }) {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { isLoading, memberData } = useSelector((state: RootState) => state.memberAuth);
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      gender: "",
      plan: "",
      startDate: "",
      profileImage: "",
    }
  });

  const planValue = watch("plan");
  const startDateValue = watch("startDate");
  const genderValue = watch("gender");

  // Calculate membership end date for display purposes
  const calculateMembershipEnd = () => {
    if (!planValue || !startDateValue) return null;
    
    const date = new Date(startDateValue);
    switch(planValue) {
      case "basic":
        date.setMonth(date.getMonth() + 1);
        break;
      case "standard":
        date.setMonth(date.getMonth() + 3);
        break;
      case "premium":
        date.setMonth(date.getMonth() + 6);
        break;
      case "annual":
        date.setFullYear(date.getFullYear() + 1);
        break;
      default:
        return null;
    }
    
    return date;
  };

  const onSubmit = async (data: memberData) => {
    // Create FormData to handle file upload
    const formData = new FormData();
    
    // Append all form fields to FormData
    formData.append('name', data.name);
    formData.append('email', data.email);
    formData.append('phone', data.phone);
    formData.append('address', data.address);
    formData.append('dateOfBirth', data.dateOfBirth);
    formData.append('gender', data.gender);
    formData.append('plan', data.plan);
    formData.append('startDate', data.startDate);
    
    // Append profile image if it exists
    if (data.profileImage && typeof data.profileImage !== 'string') {
      formData.append('profileImage', data.profileImage);
    }
    
    // Dispatch with FormData
    const res=await dispatch(addMemberFeth(formData)).unwrap();
    console.log("Membersddcfsy:", res);
    reset(); // Reset form after submission
    onClose(); // Close the modal after submission
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("profileImage", file, { shouldValidate: true });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setValue("profileImage", null, { shouldValidate: true });
    setPreviewImage(null);

    // Reset the file input to allow selecting the same file again
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // Custom date input component with better UI
  const CustomDateInput = ({ id, label, value, onChange, error, icon, required = false }) => (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-slate-300 font-medium flex items-center gap-2">
        {icon}
        {label}
        {required && <span className="text-red-400">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type="date"
          value={value}
          onChange={onChange}
          className="bg-slate-700/70 border-slate-600 text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all pl-10"
        />
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
      </div>
      {error && (
        <p className="text-red-400 text-sm mt-1">{error.message}</p>
      )}
    </div>
  );

  // Gender selection component
  const GenderSelector = () => (
    <div className="space-y-2">
      <Label className="text-slate-300 font-medium flex items-center gap-2">
        {/* <Gender className="h-4 w-4" /> */}
        Gender
        <span className="text-red-400">*</span>
      </Label>
      <div className="grid grid-cols-3 gap-2">
        <div 
          className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
            genderValue === 'male' 
              ? 'bg-blue-500/20 border-blue-500 text-blue-400' 
              : 'bg-slate-700/70 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
          }`}
          onClick={() => setValue("gender", "male", { shouldValidate: true })}
        >
          <Mars className="h-6 w-6 mb-1" />
          <span className="text-sm font-medium">Male</span>
        </div>
        
        <div 
          className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
            genderValue === 'female' 
              ? 'bg-pink-500/20 border-pink-500 text-pink-400' 
              : 'bg-slate-700/70 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
          }`}
          onClick={() => setValue("gender", "female", { shouldValidate: true })}
        >
          <Venus className="h-6 w-6 mb-1" />
          <span className="text-sm font-medium">Female</span>
        </div>
        
        <div 
          className={`flex flex-col items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
            genderValue === 'other' 
              ? 'bg-purple-500/20 border-purple-500 text-purple-400' 
              : 'bg-slate-700/70 border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
          }`}
          onClick={() => setValue("gender", "other", { shouldValidate: true })}
        >
          {/* <Gender className="h-6 w-6 mb-1" /> */}
          <span className="text-sm font-medium">Other</span>
        </div>
      </div>
      {errors.gender && (
        <p className="text-red-400 text-sm mt-1">{errors.gender.message}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
      <div 
        className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md overflow-hidden flex flex-col shadow-2xl transform transition-all duration-300 scale-95 animate-in fade-in-90 zoom-in-90"
        style={{ height: '-webkit-fill-available', maxHeight: '90vh' }}
      >
        <div className="flex justify-between items-center p-6 border-b border-slate-700 flex-shrink-0 bg-slate-800/95 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-500" />
            Add New Member
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="scroll-container overflow-y-auto">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
            {/* Profile Image Upload Section */}
            <div className="flex flex-col items-center space-y-4 pb-5 border-b border-slate-700">
              <div className="relative group">
                {previewImage ? (
                  <div className="relative">
                    <img 
                      src={previewImage} 
                      alt="Profile preview" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-slate-600 shadow-lg group-hover:border-orange-500 transition-colors"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full h-7 w-7 shadow-md transition-all duration-200 hover:scale-110"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-slate-700 border-4 border-slate-600 flex items-center justify-center group-hover:border-orange-500 transition-colors">
                    <User className="h-12 w-12 text-slate-500" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col items-center">
                <Label htmlFor="profileImage" className="text-slate-300 mb-2 font-medium">
                  Profile Photo
                </Label>
                <div className="flex gap-2">
                  <Label
                    htmlFor="profileImage"
                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md cursor-pointer transition-colors shadow-sm hover:shadow-md"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Choose Photo</span>
                  </Label>
                  <Input
                    id="profileImage"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">JPG, PNG or GIF (max. 5MB)</p>
                {errors.profileImage && (
                  <p className="text-red-400 text-sm mt-1">{errors.profileImage.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300 font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter member's full name"
                  className="bg-slate-700/70 border-slate-600 text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all"
                />
                {errors.name && (
                  <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-300 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    {...register("email")}
                    placeholder="Enter email address"
                    className="bg-slate-700/70 border-slate-600 text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-300 font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    {...register("phone")}
                    placeholder="Enter phone number"
                    className="bg-slate-700/70 border-slate-600 text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all"
                  />
                  {errors.phone && (
                    <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CustomDateInput
                  id="dateOfBirth"
                  label="Date of Birth"
                  value={watch("dateOfBirth")}
                  onChange={(e) => setValue("dateOfBirth", e.target.value, { shouldValidate: true })}
                  error={errors.dateOfBirth}
                  icon={<Calendar className="h-4 w-4" />}
                  required={true}
                />
                
                <GenderSelector />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address" className="text-slate-300 font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <textarea
                  id="address"
                  {...register("address")}
                  placeholder="Enter address"
                  className="w-full min-h-[80px] px-3 py-2 bg-slate-700/70 border border-slate-600 text-white rounded-md focus:border-orange-500 focus:ring-orange-500/20 transition-all resize-none"
                />
                {errors.address && (
                  <p className="text-red-400 text-sm mt-1">{errors.address.message}</p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="plan" className="text-slate-300 font-medium">
                    Membership Plan
                  </Label>
                  <Select 
                    onValueChange={(value) => setValue("plan", value, { shouldValidate: true })}
                    value={planValue}
                  >
                    <SelectTrigger className="bg-slate-700/70 border-slate-600 text-white focus:border-orange-500 focus:ring-orange-500/20 transition-all">
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="basic">Basic (1 Month)</SelectItem>
                      <SelectItem value="standard">Standard (3 Months)</SelectItem>
                      <SelectItem value="premium">Premium (6 Months)</SelectItem>
                      <SelectItem value="annual">Annual (12 Months)</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.plan && (
                    <p className="text-red-400 text-sm mt-1">{errors.plan.message}</p>
                  )}
                </div>
                
                <CustomDateInput
                  id="startDate"
                  label="Membership Start Date"
                  value={startDateValue}
                  onChange={(e) => setValue("startDate", e.target.value, { shouldValidate: true })}
                  error={errors.startDate}
                  icon={<Calendar className="h-4 w-4" />}
                  required={true}
                />
              </div>
              
              {planValue && startDateValue && (
                <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Membership Duration</span>
                  </div>
                  <p className="text-slate-400 text-xs mt-1">
                    {planValue === "basic" && "1 month membership"}
                    {planValue === "standard" && "3 months membership"}
                    {planValue === "premium" && "6 months membership"}
                    {planValue === "annual" && "12 months membership"}
                    {` from ${new Date(startDateValue).toLocaleDateString()} to ${calculateMembershipEnd()?.toLocaleDateString()}`}
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  onClose();
                }}
                className="flex-1 border-slate-600 hover:bg-slate-700/50 hover:text-white transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-orange-500 hover:bg-orange-600 transition-all shadow-md hover:shadow-lg active:scale-95"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </div>
                ) : "Add Member"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddMemberModal;