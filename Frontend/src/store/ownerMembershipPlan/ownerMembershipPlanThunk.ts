import { createAsyncThunk } from '@reduxjs/toolkit';
import api from "../../axios/index"
import { Plan } from '@/type/ownerMemberShipPlan';
import { toast } from 'sonner';
import { ThunkApiConfig } from '@/type/gymOwnerTypes';

export const createMembershipPlanfeth = createAsyncThunk<any,Plan,ThunkApiConfig>(
    'ownerMembershipPlan/createMembershipPlanfeth',
    async (planData: Plan, { rejectWithValue }) => {
        try {
            const response = await api.ownermembershipPlan.createMembershipPlan(planData);
            if (response.success) {
                toast.success("Membership plan created successfully");
                return response.data;
            } else {
                toast.error(response?.data.message || "Failed to create membership plan");
                return rejectWithValue(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while creating the membership plan");
            return rejectWithValue(error);
        }
    }
);
export const updateMembershipPlanfeth = createAsyncThunk<any,Plan,ThunkApiConfig>(
    'ownerMembershipPlan/updateMembershipPlanfeth',
    async (planData: Plan, { rejectWithValue }) => { 
        try {
            const response = await api.ownermembershipPlan.updateMembershipPlan(planData);
            if (response.success) {
                toast.success("Membership plan updated successfully");
                return response.data;
            }
            else {
                toast.error(response?.data.message || "Failed to update membership plan");
                return rejectWithValue(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while updating the membership plan");
            return rejectWithValue(error);
        }
    }
);
export const deleteMembershipPlanfeth = createAsyncThunk<any,number,ThunkApiConfig>(
    'ownerMembershipPlan/deleteMembershipPlanfeth',
    async (planId: number, { rejectWithValue }) => {
        try {
            const response = await api.ownermembershipPlan.deleteMembershipPlan(planId);
            if (response.success) {
                toast.success("Membership plan deleted successfully");
                console.log("respdata",response.data);
                return response.data;
            } else {
                toast.error(response?.data.message || "Failed to delete membership plan");
                return rejectWithValue(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while deleting the membership plan");
            return rejectWithValue(error);
        }
    }
);
export const disableMembershipPlanfeth = createAsyncThunk<any,number,ThunkApiConfig>(
    'ownerMembershipPlan/disableMembershipPlanfeth',
    async (planId: number, { rejectWithValue }) => {
        try {
            const response = await api.ownermembershipPlan.disableMembershipPlan(planId);
            if (response.success) {
                toast.success(response?.message );
                return response.data;
            } else {
                toast.error(response?.data.message || "Failed to disable membership plan");
                return rejectWithValue(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while disabling the membership plan");
            return rejectWithValue(error);
        }
    }
);
export const getMembershipPlansfeth = createAsyncThunk<any,void,ThunkApiConfig>(
    'ownerMembershipPlan/getMembershipPlansfeth',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.ownermembershipPlan.getMembershipPlans();
            if (response.success) {
                return response.data;
            } else {
                toast.error(response?.data.message || "Failed to fetch membership plans");
                return rejectWithValue(response.message);
            }
        } catch (error) {
            toast.error("An error occurred while fetching the membership plans");
            return rejectWithValue(error);
        }
    }
);