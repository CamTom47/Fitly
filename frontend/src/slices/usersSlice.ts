import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import FitlyApi from '../Api/FitlyApi'
import { decodeToken } from 'react-jwt';
import { ErrorMessage } from 'formik';

interface UserState {
    users: {}[],
    selectedUser: {},
    currentUser: {} | null,
    token: string | null,
    isAuthenticated: boolean,
    errorMessage : string | null


}
const initialState : UserState = {
    users: [],
    selectedUser: {},
    currentUser: null,
    token: null,
    isAuthenticated: false,
    errorMessage : null
}

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
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
            if(action.payload.token){
                state.currentUser = action.payload.currentUser;
                state.token = action.payload.token;
                state.isAuthenticated = true;
            } else {
                state.errorMessage = action.payload[0]
            }
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
    }
});

export const { userLoggedOut } = usersSlice.actions;


export const userCheckLoggedIn = createAsyncThunk(
    "users/userCheckLoggedIn",
    async () =>  {
        try{
            let token = localStorage.getItem('token');
            if(token) {
                FitlyApi.token = token;
                const username : string | null = await decodeToken(token);
                if(username){
                    const currentUser  = await FitlyApi.findUser(username)
                    const results = { token, currentUser }
                    return results
                }
            } 
        } catch (err){
            return err
        }
})

export const userLogIn = createAsyncThunk(
    "users/userLoggedIn",
    async (data : {username: string, password: string}) => {
        try{
            const token : string = await FitlyApi.login(data)
            if(token){
                FitlyApi.token = token;
                localStorage.setItem('token', token);
                const username : string | null = await decodeToken(token);
                if (username){
                    const currentUser = await FitlyApi.findUser(username)
                    const results = { token , currentUser }
                    return results
                }
            }
        }
        catch (err){
            return err
        }
    }
)

export const findAUser = createAsyncThunk(
    "users/findAUser",
    async (username : string) => {
        try{
            let user = await FitlyApi.findUser(username)
            return user
        }
        catch (err){
            return err
        }
    }
)

export const addUser = createAsyncThunk(
    "users/userAdded",
    async (data : {username: string, password: string}) => {
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
    async (data : { username: string, formData: {
        username: string,
        firstName: string,
        lastName? : string
        email? : string,
        password? : string,
        confirmedPassword? : string
    }}) => {
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

export const selectUsers = state => state.users.users;
export const selectuser = state => state.users.selecteduser;
export const selectCurrentUser = state => state.users.currentUser;
export const selectToken = state => state.users.token;
export const selectAuthenticated = state => state.users.isAuthenticated;
export const selectErrorMessage = state => state.users.errorMessage;

export default usersSlice.reducer;