import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {CredentialsPayload, memberAuthState,Member} from "../../type/memberTypes"
import { addMemberFeth, checkInMemberByQRfeth, getAllMembersFeth, getMemberProfileFeth, loginMemberFeth, logoutMemberFeth } from './memberAuthThunk';
import { stat } from 'fs';

const initialState:memberAuthState={
    memberData:[], 
    token:localStorage.getItem("memberToken"),
    isAuthenticated:!!localStorage.getItem('isAuthenticated') || false,
    isLoading:false,
    isAdded:false,
    memberProfile:{},
    totalMembers:0
}

const memberAuthSlice=createSlice({
    name:'memberAuth',
    initialState,
    reducers:{
        setCredentials:(state,action:PayloadAction<CredentialsPayload>)=>{
            state.token=action.payload.token
            localStorage.setItem("memberToken",action.payload.token)
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(addMemberFeth.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(addMemberFeth.fulfilled,(state,action)=>{
            state.isLoading=false
            console.log("actiofsdf",action.payload)
            state.isAdded=!state.isAdded
        })
        .addCase(addMemberFeth.rejected,(state,action)=>{
            state.isLoading=false
        })
        .addCase(getAllMembersFeth.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(getAllMembersFeth.fulfilled,(state,action)=>{
            state.isLoading=false
            console.log("actiofsdf",action.payload)
            state.memberData=action.payload?.data?.members
            state.totalMembers=action.payload?.data?.totalMembers
        })
        .addCase(getAllMembersFeth.rejected,(state,action)=>{
            state.isLoading=false
        })
        .addCase(loginMemberFeth.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(loginMemberFeth.fulfilled,(state,action)=>{
            localStorage.setItem("memberToken",action.payload)
            localStorage.setItem("isAuthenticated","true")
            state.isLoading=false
            state.isAuthenticated=true
            state.token=action.payload
        })
        .addCase(loginMemberFeth.rejected,(state,action)=>{
            state.isLoading=false
        })
        .addCase(logoutMemberFeth.fulfilled,(state,action)=>{
            state.isAuthenticated=false
            state.token=null
            localStorage.removeItem("memberToken")
            localStorage.removeItem("isAuthenticated")
        })
        .addCase(logoutMemberFeth.rejected,(state,action)=>{
            // Handle logout failure if needed
            state.isAuthenticated=false
        })
        .addCase(logoutMemberFeth.pending,(state,action)=>{
            // You can set a loading state if needed
            state.isLoading=true
        })
        .addCase(getMemberProfileFeth.pending,(state,action)=>{
            state.isLoading=true
        })
        .addCase(getMemberProfileFeth.fulfilled,(state,action)=>{
            state.isLoading=false
            console.log("member profile",action.payload)
            state.memberProfile=action.payload
        })
        .addCase(getMemberProfileFeth.rejected,(state,action)=>{
            state.isLoading=false
        })
        .addCase(checkInMemberByQRfeth.fulfilled,(state,action)=>{
            state.isLoading=false
            console.log("Member check-in successful:", action.payload);
        })
        .addCase(checkInMemberByQRfeth.rejected,(state,action)=>{
            state.isLoading=false
        })
        .addCase(checkInMemberByQRfeth.pending,(state,action)=>{
            state.isLoading=true
        })
    }
})

export const {
    setCredentials
}=memberAuthSlice.actions

export default memberAuthSlice.reducer