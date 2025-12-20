import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/axios/index";
import {  memberData, memberlogin, MemberQueryParams } from "@/type/memberTypes";
import { ThunkApiConfig } from "@/type/gymOwnerTypes";
import { toast } from "sonner";

export const addMemberFeth=createAsyncThunk<any,memberData,ThunkApiConfig>(
    "addMemberFetch/addMember",
    async(memberData:memberData,{rejectWithValue})=>{
        try {
            const response=await api.memberAuth.addMember(memberData)
            console.log("redsdsdf",response.data)
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
export const loginMemberFeth=createAsyncThunk<any,memberlogin,ThunkApiConfig>(
    "loginMemberFeth/loginMember",
    async(memberData:memberlogin, {rejectWithValue})=>{
        try {
            const response=await api.memberAuth.loginMember(memberData)
            console.log("resdf",response)
            if(response.success){
                toast.success(response.message)
                return response.data;
            }else{
                toast.error(response.response?.data?.message)
                return rejectWithValue(response.data.message);
            }
        }catch(error){
            const errorMessage = error.response?.data?.message || error.message;
            return rejectWithValue(errorMessage);
        }
    }
)

export const getMemberByIdFeth=createAsyncThunk<any,string,ThunkApiConfig>(
    "getMemberByIdFeth/getMemberById",
    async(memberId:string, {rejectWithValue})=>{
        try {
            const response=await api.memberAuth.getMemberById(memberId)
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
export const getMemberProfileFeth=createAsyncThunk<any,void,ThunkApiConfig>(
    "getMemberProfile/getMemberProfile",
    async(_, {rejectWithValue})=>{
        try {
            const response=await api.memberAuth.getMemberProfile()
            console.log("resdf",response)
            if(response.success){
                return response.data;
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
export const logoutMemberFeth=createAsyncThunk<any,void,ThunkApiConfig>(
    "logoutMemberFeth/logoutMember",
    async(_, {rejectWithValue})=>{
        try {
            const response=await api.memberAuth.memberLogout()
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

export const checkInMemberByQRfeth=createAsyncThunk<any,string,ThunkApiConfig>(
    "checkInMemberByQRfeth/checkInMemberByQR",
    async(qrData:string, {rejectWithValue})=>{
        try {
            const response=await api.memberAuth.checkInMemberByQR(qrData)
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