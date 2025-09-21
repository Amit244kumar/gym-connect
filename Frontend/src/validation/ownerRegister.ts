import * as yup from "yup";
const validationSchema = yup.object({
    ownerName: yup
      .string()
      .required("Owner name is required")
      .min(2, "Owner name must be at least 2 characters")
      .max(50, "Owner name must be less than 50 characters")
      .matches(/^[a-zA-Z\s]+$/, "Owner name can only contain letters and spaces"),
    
    gymName: yup
      .string()
      .required("Gym name is required")
      .min(3, "Gym name must be at least 3 characters")
      .max(100, "Gym name must be less than 100 characters")
      .matches(/^[a-zA-Z0-9\s\-&.]+$/, "Gym name can only contain letters, numbers, spaces, hyphens, ampersands, and periods"),
    
    phoneNumber: yup
      .string()
      .required("Phone number is required")
      .matches(/^(\+91\s?)?[6-9]\d{9}$/, "Please enter a valid Indian phone number"),
    
    emailId: yup
      .string()
      .required("Email is required")
      .email("Please enter a valid email address")
      .max(100, "Email must be less than 100 characters"),
    
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),
    
    confirmPassword: yup
      .string()
      .required("Please confirm your password")
      .oneOf([yup.ref("password")], "Passwords must match"),
  });

export default validationSchema
  