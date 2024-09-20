import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import FitlyApi from '../Api/FitlyApi'
import { decodeToken } from 'react-jwt';

const initialState = {
    users: [],
    selectedUser: {},
    currentUser: null,
    token: null,
    isAuthenticated: false
}

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducer: {
        userLoggedOut(state) {
            state = initialState;
        }
    },
    extraReducers: builder => {
        builder
        .addCase(userCheckLoggedIn.fulfilled, (state, action) => {
            state.currentUser = state.currentUser
            state.token = state.token
        })
        .addCase(userLogIn.fulfilled, (state, action) => {
            state.currentUser = action.payload.currentUser;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        })
        .addCase(findAUser.fulfilled, (state, action) => {
            state.selectedUser = action.payload;
        })
        .addCase(addUser.fulfilled, (state, action) => {
            state.users.push(action.payload);
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.currentUser = action.payload;
        })
        .addCase(deleteUser.fulfilled, (state) => {
            return state;
        })
    }
});

export const { userLoggedOut } = usersSlice.actions;


export const userCheckLoggedIn = createAsyncThunk(
    "users/userCheckLoggedIn",
    async () =>  {
        let token = localStorage.getItem('token');
    if(token) {
        FitlyApi.token = token;
        const { username } = await decodeToken(token);
        const currentUser  = await FitlyApi.findUser(username)
        const results = { token, currentUser }
        return results
    }
})

export const userLogIn = createAsyncThunk(
    "users/userLoggedIn",
    async (data) => {
        try{
            const token = await FitlyApi.login(data)
            FitlyApi.token = token;
            localStorage.setItem('token', token);
            const { username } = await decodeToken(token);
            const currentUser = await FitlyApi.findUser(username)
            const results = { token , currentUser }
            return results
        }
        catch (err){
            return err
        }
    }
)

export const findAUser = createAsyncThunk(
    "users/findAUser",
    async (user_id) => {
        try{
            let user = await FitlyApi.findUser({user_id: user_id})
            return user
        }
        catch (err){
            return err
        }
    }
)

export const addUser = createAsyncThunk(
    "users/userAdded",
    async (data) => {
        try{
            let user = await FitlyApi.signup(data);
            return user;
        }
        catch (err){
            return err
        }
    }
)

export const updateUser = createAsyncThunk(
    "users/userUpdated",
    async (data) => {
        try{
            const {username , formData} = data
            if(formData.confirmedPassword){
                let user = await FitlyApi.updateUser(username, {"password": formData.confirmedPassword});
                return user;
            } else {
                let user = await FitlyApi.updateUser(username, formData);
                return user;
            }
        }
        catch (err){
            return err
        }
    }
)

export const deleteUser = createAsyncThunk(
    "users/userDeleted",
    async (user_id, data) => {
        try{
            await FitlyApi.updateUser(user_id, data);
        }
        catch (err){
            return err
        }
    }
)

export const selectUsers = state => state.users.users;
export const selectuser = state => state.users.selecteduser;
export const selectCurrentUser = state => state.users.currentUser;
export const selectToken = state => state.users.token;
export const selectAuthenticated = state => state.users.isAuthenticated;

export default usersSlice.reducer;