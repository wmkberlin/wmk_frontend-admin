import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    isAuthenticated: !!localStorage.getItem('token'), // Check token in storage
    user: null,
};

const authenticationSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        LOGIN_SUCCESS: (state, action) => {
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        LOGOUT: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            localStorage.removeItem('token');
        }
    }
});

export const { LOGIN_SUCCESS, LOGOUT } = authenticationSlice.actions;
export default authenticationSlice.reducer;
