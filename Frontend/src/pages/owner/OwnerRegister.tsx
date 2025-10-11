import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";
import {
  Dumbbell,
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  Lock,
  CheckCircle,
  Upload,
  X,
  Camera,
  Loader2,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from '../../store/index';
import { Badge } from "@/components/ui/badge";
import * as yup from "yup";
import { isGymNameAvailableFeth, registerGymOwnerFeth } from "../../store/gymOwnerAuth/gymOwnerAuthThunks";
import { RegisterUserData } from "@/type/gymOwnerTypes";
import { toast } from "sonner";
import validationSchema from "@/validation/ownerRegister";
import { cn } from "@/lib/utils";

export default function OwnerRegister() {
  const [formData, setFormData] = useState({
    ownerName: "",
    gymName: "",
    phoneNumber: "",
    emailId: "",
    password: "",
    confirmPassword: "",
    profileImage: null as File | null,
  });
  const dispatch = useDispatch<AppDispatch>();
  const { isGymNameAvailable, isLoading } = useSelector((state: RootState) => state.gymOwnerAuth);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"checking" | "available" | "taken">("checking");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (field === "gymName") {
      // If user starts typing gym name → set status to checking
      if (value.trim().length > 0) {
        setStatus("checking");
      } else {
        setStatus(null);
      }
    }
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  useEffect(() => {
    if (!formData.gymName.trim()) return;

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await dispatch(isGymNameAvailableFeth(formData.gymName.trim())).unwrap();

        if (res) {
          setStatus("available");
        } else {
          setStatus('taken');
        }
      } catch (err) {
        setStatus(null);
      }
    }, 2000); // 2-second delay
    return () => clearTimeout(delayDebounce);
  }, [formData.gymName, dispatch, isGymNameAvailable]);

  const validateField = async (field: string, value: string) => {
    try {
      await validationSchema.validateAt(field, { ...formData, [field]: value });
      setErrors((prev) => ({ ...prev, [field]: "" }));
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [field]: error.message }));
      }
    }
  };

  const handleBlur = (field: string) => {
    validateField(field, formData[field as keyof typeof formData]);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type and size
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData(prev => ({ ...prev, profileImage: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];

      // Validate file type and size
      if (!file.type.match('image.*')) {
        toast.error("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      setFormData(prev => ({ ...prev, profileImage: file }));

      // Create preview
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
    setUploadProgress(0);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    if (!isGymNameAvailable) {
      toast.info('Gym name should be unique');
      return;
    }

    // Validate profile image
    if (!formData.profileImage) {
      alert("D")
      setErrors(prev => ({ ...prev, profileImage: "Profile image is required" }));
      return;
    }
    console.log("FormsData", formData);
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      if (!agreedToTerms) {
        toast.error("Please agree to the terms and conditions");
        return;
      }

      setIsSubmitting(true);
      setIsUploading(true);

      // Create FormData object to send all data including the file
      const submitData = new FormData();
      submitData.append('ownerName', formData.ownerName);
      submitData.append('gymName', formData.gymName);
      submitData.append('phone', formData.phoneNumber);
      submitData.append('email', formData.emailId);
      submitData.append('password', formData.password);
      
      // Append the profile image file
      if (formData.profileImage) {
        submitData.append('profileImage', formData.profileImage);
      }
      console.log("wsqasrd",submitData);
      const response = await dispatch(registerGymOwnerFeth(submitData)).unwrap();
      
      // Reset upload progress
      setUploadProgress(0);
      setIsUploading(false);
      setIsSubmitting(false);
      
      if(response && response.success){
        // Show success message
      toast.success("Account created! Please verify your email.");
      
      // Navigate to login or dashboard
        navigate('/login');
      }
    } catch (error) {
      // Reset upload progress
      setUploadProgress(0);
      setIsUploading(false);
      setIsSubmitting(false);

      if (error instanceof yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        error.inner.forEach((err) => {
          if (err.path) {
            newErrors[err.path] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  // Handle form submission with a separate function to ensure preventDefault works
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Dumbbell className="h-10 w-10 text-orange-500" />
            <span className="text-3xl font-bold text-white">GymPro</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Register Your Gym
          </h1>
          <p className="text-slate-400">Start your 2-month free trial today</p>
        </div>

        <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-orange-500" />
              <CardTitle className="text-white text-xl">
                Gym Owner Registration
              </CardTitle>
            </div>
            <CardDescription className="text-center text-slate-400">
              Fill in your details to create your gym management account
            </CardDescription>

            {/* Trial Badge */}
            <div className="flex justify-center mt-4">
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle className="h-4 w-4 mr-1" />2 Months Free Trial
              </Badge>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profile Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Camera className="h-5 w-5 text-orange-500" />
                  Profile Photo
                </h3>

                <div className="flex justify-center">
                  <div 
                    className={cn(
                      "relative w-32 h-32 rounded-full overflow-hidden border-4 border-dashed cursor-pointer transition-all",
                      isDragging ? "border-orange-500 bg-slate-700/50" : "border-slate-600 bg-slate-700/30",
                      errors.profileImage ? "border-red-500" : ""
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                  >
                    {previewImage ? (
                      <img 
                        src={previewImage} 
                        alt="Profile preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center w-full h-full text-slate-400">
                        <Camera className="h-10 w-10 mb-2" />
                        <span className="text-xs text-center">Upload Photo</span>
                      </div>
                    )}
                    
                    {/* Remove button */}
                    {previewImage && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-md"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="w-full max-w-xs mx-auto">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-slate-300">Uploading...</span>
                      <span className="text-sm text-slate-300">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                  required
                />

                <div className="text-center text-sm text-slate-400">
                  <p>Click or drag to upload a profile photo</p>
                  <p>JPG, PNG or GIF (max. 5MB)</p>
                  {errors.profileImage && (
                    <p className="text-red-400 text-sm mt-1">{errors.profileImage}</p>
                  )}
                </div>
              </div>

              {/* Owner Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-500" />
                  Owner Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ownerName" className="text-slate-300">
                      Owner Name *
                    </Label>
                    <Input
                      id="ownerName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.ownerName}
                      onChange={(e) =>
                        handleInputChange("ownerName", e.target.value)
                      }
                      onBlur={() => handleBlur("ownerName")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.ownerName ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.ownerName && (
                      <p className="text-red-400 text-sm">{errors.ownerName}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gymName" className="text-slate-300">
                      Gym Name *{" "}
                      <span className="text-sm text-slate-400">
                        (must be unique)
                      </span>
                    </Label>
                    <Input
                      id="gymName"
                      type="text"
                      placeholder="Enter your gym name"
                      value={formData.gymName}
                      onChange={(e) =>
                        handleInputChange("gymName", e.target.value)
                      }
                      onBlur={() => handleBlur("gymName")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.gymName ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {formData.gymName.length>2 && 
                      <div className="flex flex-col gap-2 max-w-md">
                       {status === "checking" && <span className="text-gray-500">Checking...</span>}
                       {status === "available" && <span className="text-green-600">✅ Gym name is available</span>}
                       {status === "taken" && <span className="text-red-600">❌ Gym name is already taken</span>}
                     </div>
                    }
                    {errors.gymName && (
                      <p className="text-red-400 text-sm">{errors.gymName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Phone className="h-5 w-5 text-orange-500" />
                  Contact Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber" className="text-slate-300">
                      Phone Number *
                    </Label>
                    <Input
                      id="phoneNumber"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      onBlur={() => handleBlur("phoneNumber")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.phoneNumber ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.phoneNumber && (
                      <p className="text-red-400 text-sm">{errors.phoneNumber}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emailId" className="text-slate-300">
                      Email ID *
                    </Label>
                    <Input
                      id="emailId"
                      type="email"
                      placeholder="owner@gym.com"
                      value={formData.emailId}
                      onChange={(e) =>
                        handleInputChange("emailId", e.target.value)
                      }
                      onBlur={() => handleBlur("emailId")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.emailId ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.emailId && (
                      <p className="text-red-400 text-sm">{errors.emailId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-orange-500" />
                  Account Security
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-300">
                      Password *
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      onBlur={() => handleBlur("password")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.password ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.password && (
                      <p className="text-red-400 text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-slate-300">
                      Confirm Password *
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        handleInputChange("confirmPassword", e.target.value)
                      }
                      onBlur={() => handleBlur("confirmPassword")}
                      className={`bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus:border-orange-500 ${
                        errors.confirmPassword ? "border-red-500" : ""
                      }`}
                      required
                    />
                    {errors.confirmPassword && (
                      <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Trial Information */}
              <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
                <h4 className="font-semibold text-white mb-2">
                  What's included in your free trial:
                </h4>
                <ul className="text-slate-300 text-sm space-y-1">
                  <li>• 2 months completely free</li>
                  <li>• Up to 50 members</li>
                  <li>• QR code entry system</li>
                  <li>• Member management tools</li>
                  <li>• Email notifications</li>
                  <li>• No credit card required</li>
                </ul>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreedToTerms}
                  onCheckedChange={(checked) =>
                    setAgreedToTerms(checked as boolean)
                  }
                  className="border-slate-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-slate-300 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    to="/terms"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    to="/privacy"
                    className="text-orange-400 hover:text-orange-300"
                  >
                    Privacy Policy
                  </Link>
                  . I understand that after the 2-month free trial, I will need
                  to subscribe to continue using the service.
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg"
                disabled={!agreedToTerms || isSubmitting || isUploading}
              >
                {(isSubmitting || isUploading) ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSubmitting ? "Creating Account..." : "Uploading Image..."}
                  </div>
                ) : "Start Free Trial"}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-600 text-center">
              <p className="text-slate-400 text-sm">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-orange-400 hover:text-orange-300"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}