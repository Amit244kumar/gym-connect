import { AxiosInstance } from "axios"
import { ApiResponse,Plan } from "@/type/ownerMemberShipPlan"
const baseURL:string="/api/ownerMembershipPlan"

const ownermembershipPlan=(instance:AxiosInstance)=>({
    createMembershipPlan:async(planData:Plan)=>{
        try {
            const {data}=await instance.post<ApiResponse>(`${baseURL}/createMembershipPlan`,planData)
            return data
        } catch (error) {
            return error;
        }
    },
    updateMembershipPlan:async(planData:Plan)=>{
        try {
            const {data}=await instance.put<ApiResponse>(`${baseURL}/updateMembershipPlan`,planData)
            return data
        } catch (error) {
            return error;
        }
    },
    getMembershipPlans:async()=>{
        try {
            const {data}=await instance.get<ApiResponse>(`${baseURL}/getMembershipPlans`)
            return data
        } catch (error) {
            return error;
        }
    },
    deleteMembershipPlan:async(planId:number)=>{
        try {
            const {data}=await instance.delete<ApiResponse>(`${baseURL}/deleteMembershipPlan/${planId}`)
            return data
        } catch (error) {
            return error;
        }
    },
    disableMembershipPlan:async(planId:number)=>{
        try {
            const {data}=await instance.patch<ApiResponse>(`${baseURL}/disableMembershipPlan/${planId}`)
            return data
        } catch (error) {
            return error;
        }
    }
})

export default ownermembershipPlan