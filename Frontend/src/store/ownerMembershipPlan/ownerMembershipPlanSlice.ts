import { Plan,OwnerMembershipPlanState } from '@/type/ownerMemberShipPlan';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createMembershipPlanfeth, deleteMembershipPlanfeth, disableMembershipPlanfeth, getMembershipPlansfeth, updateMembershipPlanfeth } from './ownerMembershipPlanThunk';

const initialState:OwnerMembershipPlanState = {
   plans:null,
   isLoading: false,
   isCreated: false,
};

const ownerMembershipPlanSlice = createSlice({
    name: 'ownerMembershipPlan',
    initialState,
    reducers: {
        setMembershipPlan: (state, action: PayloadAction<OwnerMembershipPlanState>) => {
            return action.payload; 
        },
        clearMembershipPlan: () => {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        // Add any async actions if needed in the future
        builder
        .addCase(createMembershipPlanfeth.fulfilled, (state, action) => {
            console.log("action.payload",action.payload);
           state.plans =[...state.plans,action.payload];
           state.isCreated = !state.isCreated;
           state.isLoading = false;
        })
        .addCase(createMembershipPlanfeth.pending, (state) => {
           state.isLoading = true;
        })
        .addCase(createMembershipPlanfeth.rejected, (state) => {    
            state.isLoading = false;
        })
        .addCase(updateMembershipPlanfeth.fulfilled, (state, action) => {
            state.plans = state.plans.map(plan => 
                plan.id === action.payload.id ? action.payload : plan
            );
            state.isCreated = !state.isCreated;
            state.isLoading = false;
        })
        .addCase(updateMembershipPlanfeth.pending, (state) => {
              state.isLoading = true;
        })
        .addCase(updateMembershipPlanfeth.rejected, (state) => {    
             state.isLoading = false;
        })
        .addCase(getMembershipPlansfeth.fulfilled, (state, action) => {
           state.plans = action.payload;
           state.isLoading = false;
        })
        .addCase(getMembershipPlansfeth.pending, (state) => {
           state.isLoading = true;
        })
        .addCase(getMembershipPlansfeth.rejected, (state) => {    
            state.isLoading = false;
        })
        .addCase(disableMembershipPlanfeth.fulfilled, (state, action) => {
            state.plans = state.plans.map(plan => 
                plan.id === action.payload.id ? action.payload : plan
            );
            // state.isCreated = !state.isCreated;
            // state.isLoading = false;
        })
        .addCase(deleteMembershipPlanfeth.fulfilled, (state, action) => {
            state.plans = state.plans.filter(plan => {
                plan.id !== action.payload.id
         });
        });
        
    }
});


export const { setMembershipPlan, clearMembershipPlan } = ownerMembershipPlanSlice.actions;
export default ownerMembershipPlanSlice.reducer;