import * as yup from "yup";
// Validation schema for member login
export const memberLoginSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .test(
        "is-email",
        "Please enter a valid email  number",
        (value) => {
          // Check if it's a valid email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(value)) return true;
          return false;
        }
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });
  
// Validation schema for owner login
export const ownerLoginSchema = yup.object({
    email: yup
      .string()
      .required("Email is required")
      .test(
        "is-email",
        "Please enter a valid email",
        (value) => {
          // Check if it's a valid email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (emailRegex.test(value)) return true;
          
          return false;
        }
      ),
    password: yup
      .string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });
  