import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {CredentialsPayload, memberAuthState,Member} from "../../type/memberTypes"
import { addMemberFeth, getAllMembersFeth } from './memberAuthThunk';
const initialState:memberAuthState={
    memberData:[], 
    token:localStorage.getItem("memberToken"),
    isAuthenticated:!!localStorage.getItem('isAuthenticated') || false,
    isLoading:false,
    isAdded:false
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
            state.isAdded=state.isAdded=!state.isAdded
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
        })
        .addCase(getAllMembersFeth.rejected,(state,action)=>{
            state.isLoading=false
        })
    }
})

export const {
    setCredentials
}=memberAuthSlice.actions

export default memberAuthSlice.reducer