import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import FitlyApi from '../Api/FitlyApi';

const initialState = {
    workouts: [],
    selected: {}
}

export const workoutsSlice = createSlice({
    name: "workouts",
    initialState,
    reducers: {
        addSelectedWorkout(state, action) {
            state.selected = action.payload;
        }
    },
        extraReducers: builder => {
            builder
            .addCase(findAllWorkouts.fulfilled, (state, action) => {
                state.workouts = action.payload
            })
            .addCase(findWorkoutById.fulfilled, (state, action) => {
                state.selected = action.payload
            })
            .addCase(addWorkout.fulfilled, (state, action) => {
                state.workouts.push(action.payload)
            })
            .addCase(updateWorkout.fulfilled, (state, action) => {
                state.workouts = [...(state.workouts.filter( workout => workout.id !== action.payload.id)), action.payload]
            })
            .addCase(deleteWorkout.fulfilled, (state) => {
                return state
            })
        }
    }
)

export default workoutsSlice.reducer

export const selectWorkouts = state => state.workouts.workouts;
export const selectWorkout = state => state.workouts.selected;

export const findAllWorkouts = createAsyncThunk(
    "workouts/findAllWorkouts",
    async () => {
        try{
            const workouts = await FitlyApi.findAllWorkouts();
            return workouts
        } catch (err){
            return err
        }
    }
)

export const findWorkoutById = createAsyncThunk(
    "workouts/findWorkoutById",
    async (workoutId) => {
        try{
            const workout = await FitlyApi.findWorkout({workoutId});
            return workout
        } 
        catch (err){
            return err
        }
    }
)

export const addWorkout = createAsyncThunk(
    "workouts/workoutAdded",
    async (data) => {
        try{ 
            const workout = await FitlyApi.createWorkout(data);
            return workout
        }   
        catch (err){
            return err
        }
    }
)

export const updateWorkout = createAsyncThunk(
    "workouts/workoutUpdated",
    async(formData) => {
        try{
            const {workoutId, data} = formData
            const workout = await FitlyApi.updateWorkout(workoutId, data)
            return {...workout, id: workoutId}
        } catch (err){
            return err
        }
    }
)

export const deleteWorkout = createAsyncThunk(
    "workouts/workoutDeleted",
    async (workoutId) => {
        try{
            await FitlyApi.deleteWorkout(workoutId);
        }
        catch (err){
            return err
        }
    }
)