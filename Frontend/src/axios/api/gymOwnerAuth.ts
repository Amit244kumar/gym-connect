import { RegisterResponse,ApiResponse,RegisterUserData,LoginResponse,LoginCredentials, GymOwner, ProfileUpdateData, checkInStats } from "@/type/gymOwnerTypes";
import { AxiosInstance } from "axios";
const baseURL:string="/api/gymOnwerAuth"

const gymOnwerAuth=(instance:AxiosInstance)=>({
    registerGymOwner:async(ownerData:RegisterUserData)=>{
        try {
            const {data}=await instance.post<ApiResponse<RegisterResponse>>(`${baseURL}/register`,ownerData)
            return data
        } catch (error) {
            return error;
        }
    },
    isGymNameAvailable:async(gymName:string)=>{
        try {
            const {data}=await instance.get<ApiResponse<boolean>>(`${baseURL}/check-gym-name/${gymName}`)
            return data
        } catch (error) {
            return error;
        }
    },
    loginGymOwner:async(LoginCredentials:LoginCredentials)=>{
        try {
            const {data}=await instance.post<ApiResponse<LoginResponse>>(`${baseURL}/login`,LoginCredentials)
            return data
        } catch (error) {
            return error;
        }
    },
    getProfile:async()=>{
        try {
            const {data}=await instance.get<ApiResponse<GymOwner>>(`${baseURL}/owner-profile`)
            return data
        } catch (error) {
            return error;
        }
    },
    
    logout:async()=>{
        try {
            const {data}=await instance.post<ApiResponse>(`${baseURL}/logout`)
            return data
        } catch (error) {
            return error;
        }
    },
    forgetPassword:async(payload)=>{
        try {
            const {data}=await instance.post<ApiResponse>(`${baseURL}/forgot-password`,payload)
            return data
        } catch (error) {
            return error;
        }
    },
    verifyResetPasswordToken:async(token:string)=>{
        try{
            const {data}=await instance.get<ApiResponse>(`${baseURL}/verifyResetToken/${token}`);
            console.log("SDfasd",data);
            return data;
        }catch(error){
            return error;
        }   
    },
    resetPassword:async({token,newPassword}:{token:string,newPassword:string})=>{
        try {
            const {data}=await instance.put<ApiResponse>(`${baseURL}/reset-password/${token}`,{newPassword})
            return data
        } catch (error) {
            return error;
        }   
    },
    resendEmailVerification:async()=>{
        try {
            const {data}=await instance.post<ApiResponse>(`${baseURL}/resend-Email-Verification`)
            return data
        } catch (error) {
            return error;
        }
    },
    verifyEmail:async(code:string)=>{
        try {
            const {data}=await instance.post<ApiResponse>(`${baseURL}/verify-email`,{code})
            return data
        } catch (error) {
            return error;
        }
    },
    updateGymOwnerProfile:async(profileData:ProfileUpdateData)=>{
        try {
            const {data}=await instance.put<ApiResponse<GymOwner>>(`${baseURL}/update-profile`,profileData)
            return data
        } catch (error) {
            return error;
        }
    },
    getCheckInStats:async()=>{
        try {
            const {data}=await instance.get<ApiResponse<checkInStats>>(`${baseURL}/checkins`)
            return data
        } catch (error) {
            return error;
        }
    },
})

export default gymOnwerAuth;
