import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  isGymNameAvailableFeth,
  registerGymOwnerFeth,
  loginGymOwnerFeth,
  getProfilefeth,
  logoutGymOwnerFeth,
  forgetPasswordFeth,
  verifyResetPasswordTokenFeth,
  resetPasswordFeth,
  verifyEmailFeth
} from "./gymOwnerAuthThunks"
import {GymOwner,GymOwnerAuthState,CredentialsPayload} from "../../type/gymOwnerTypes"
import { stat } from 'fs';




// Get initial state from localStorage
// const getInitialState = (): GymOwnerAuthState => {
//   const token = localStorage.getItem('gymOwnerToken');
//   const ownerData = localStorage.getItem('gymOwnerData');
  
//   if (token && ownerData) {
//     try {
//       return {
//         token,
//         owner: JSON.parse(ownerData),
//         isAuthenticated: true,
//         isLoading: false,
//         error: null,
//       };
//     } catch (error) {
//       // Clear invalid data
//       localStorage.removeItem('gymOwnerToken');
//       localStorage.removeItem('gymOwnerData');
//     }
//   }
  
//   return {
//     token: null,
//     owner: null,
//     isAuthenticated: false,
//     isLoading: false,
//     error: null,
//   };
// };

const initialState: GymOwnerAuthState = {
    token:localStorage.getItem("gymOwnerToken")|| null,
    owner: null,
    isAuthenticated: !!localStorage.getItem('isAuthenticated') || false,
    isLoading: false,
    slug:"",
    isGymNameAvailable: false,
    isVerifyingToken:false,
};

const gymOwnerAuthSlice = createSlice({
  name: 'gymOwnerAuth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      const { token, owner } = action.payload;
      state.token = token;
      state.owner = owner;
      state.isAuthenticated = true;
      
      // Save to localStorage
      localStorage.setItem('gymOwnerToken', token);
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

  },
  extraReducers: (builder) => {
    // Register Gym Owner
    builder
      .addCase(registerGymOwnerFeth.pending, (state,action) => {
        state.isLoading = true;
      })
      .addCase(registerGymOwnerFeth.fulfilled, (state,action) => {
        state.isLoading = false;
        state.token=action.payload.token
        state.isAuthenticated=true
        localStorage.setItem("gymOwnerToken", action.payload.token);
        localStorage.setItem("isAuthenticated", 'true');
      })
      .addCase(registerGymOwnerFeth.rejected, (state, action) => {
        state.isLoading = false;
      })
      // isGymNameAvailableFeth
      .addCase(isGymNameAvailableFeth.fulfilled, (state,action) => {
        console.log('sdfsd',action.payload)
        state.isGymNameAvailable = action.payload;
      })
      // Login Gym Owner
      .addCase(loginGymOwnerFeth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginGymOwnerFeth.fulfilled, (state,action) => {
        localStorage.setItem("gymOwnerToken", action.payload.data.token);
        localStorage.setItem("isAuthenticated", 'true');
        localStorage.setItem("gymOwnerSlug", action.payload.data.slug);
        console.log("Login payload:",action.payload)
        state.isLoading = false;
        state.token=action.payload.data.token
        state.slug=action.payload.data.slug  
      })
      .addCase(loginGymOwnerFeth.rejected, (state) => {
        state.isLoading = false;
      })
    // // Get Profile
      .addCase(getProfilefeth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProfilefeth.fulfilled, (state,action) => {
        state.isLoading = false;
        console.log("Profile payload:",action.payload)
        state.owner=action.payload
      })
      .addCase(getProfilefeth.rejected, (state) => {
        state.isLoading = false;
      })
      // Logout
      .addCase(logoutGymOwnerFeth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutGymOwnerFeth.fulfilled, (state) => {
        localStorage.removeItem("gymOwnerToken");
        localStorage.removeItem("isAuthenticated");
        state.isLoading = false;
      })
      .addCase(logoutGymOwnerFeth.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(forgetPasswordFeth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgetPasswordFeth.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgetPasswordFeth.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyResetPasswordTokenFeth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyResetPasswordTokenFeth.fulfilled, (state,action) => {
        if(action.payload?.isVerifyingToken){
            state.isVerifyingToken=true;
        }
        state.isLoading = false;
      })
      .addCase(verifyResetPasswordTokenFeth.rejected, (state) => {  
        state.isVerifyingToken=false;
        state.isLoading = false;
      })
      .addCase(resetPasswordFeth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPasswordFeth.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPasswordFeth.rejected, (state) => {  
        state.isLoading = false;
      })
      .addCase(verifyEmailFeth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyEmailFeth.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyEmailFeth.rejected, (state) => {  
        state.isLoading = false;
      })
    // // Update Profile
    //   .addCase('gymOwnerAuth/updateProfile/pending', (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase('gymOwnerAuth/updateProfile/fulfilled', (state) => {
    //     state.isLoading = false;
    //     state.error = null;
    //   })
    //   .addCase('gymOwnerAuth/updateProfile/rejected', (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload || 'Failed to update profile';
    //   })

    // // Change Password
    //   .addCase('gymOwnerAuth/changePassword/pending', (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase('gymOwnerAuth/changePassword/fulfilled', (state) => {
    //     state.isLoading = false;
    //     state.error = null;
    //   })
    //   .addCase('gymOwnerAuth/changePassword/rejected', (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload || 'Failed to change password';
    //   })

    // // Refresh Token
    //   .addCase('gymOwnerAuth/refreshToken/pending', (state) => {
    //     state.isLoading = true;
    //     state.error = null;
    //   })
    //   .addCase('gymOwnerAuth/refreshToken/fulfilled', (state) => {
    //     state.isLoading = false;
    //     state.error = null;
    //   })
    //   .addCase('gymOwnerAuth/refreshToken/rejected', (state, action) => {
    //     state.isLoading = false;
    //     state.error = action.payload || 'Failed to refresh token';
    //   });
  },
});

export const {
  setCredentials,
  setLoading,
 
} = gymOwnerAuthSlice.actions;

export default gymOwnerAuthSlice.reducer;
