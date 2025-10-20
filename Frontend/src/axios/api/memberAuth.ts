import { AxiosInstance } from "axios"
import { ApiResponse,MemberQueryParams,memberData } from "@/type/memberTypes"
const baseURL:string="/api/memberAuth"
const memberAuth=(instance:AxiosInstance)=>({
    addMember:async(memberData:memberData)=>{
        console.log("SDfdsf",memberData)
        try {
            const {data}=await instance.post<ApiResponse>(`${baseURL}/addMember`,memberData)
            return data
        } catch (error) {
            return error;
        }
    },
    getAllMembers:async(params:MemberQueryParams)=>{
        try {
            const {data}=await instance.get<ApiResponse>(`${baseURL}/getMembers`,{params})
            return data
        } catch (error) {
            return error;
        }
    }
})

export default memberAuth;