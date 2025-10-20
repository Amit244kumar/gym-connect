import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/index";
import { memberData, MemberQueryParams } from "@/type/memberTypes";
import { ThunkApiConfig } from "@/type/gymOwnerTypes";
import { toast } from "sonner";

export const addMemberFeth=createAsyncThunk<any,memberData,ThunkApiConfig>(
    "addMemberFetch/addMember",
    async(memberData:memberData,{rejectWithValue})=>{
        try {
            const response=await api.memberAuth.addMember(memberData)
            console.log("resdf",response)
            if(response.success){
                toast.success(response.message)
                return response;
            }else{
              toast.error(response.response?.data?.message)
              return rejectWithValue(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            return rejectWithValue(errorMessage);
        }
    }
)

export const getAllMembersFeth=createAsyncThunk<any,MemberQueryParams,ThunkApiConfig>(
    "getAllMembersFeth/getAllMembers",
    async(params:MemberQueryParams, {rejectWithValue})=>{
        try {
            const response=await api.memberAuth.getAllMembers(params)
            console.log("resdf",response)
            if(response.success){
                return response;
            }else{
              toast.error(response.response?.data?.message)
              return rejectWithValue(response.data.message);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            return rejectWithValue(errorMessage);
        }
    }
)