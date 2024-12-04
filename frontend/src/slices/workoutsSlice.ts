import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import FitlyApi from '../Api/FitlyApi';

interface WorkoutState {
    workouts: {}[],
    selectedWorkout: {}
}
const initialState : WorkoutState = {
    workouts: [],
    selectedWorkout: {}
}

interface Workout {
    id? : number,
    userId : number,
    name : string,
    category : number,
    favorited : boolean
};

export const workoutsSlice = createSlice({
    name: "workouts",
    initialState,
    reducers: {
        addSelectedWorkout(state, action) {
            state.selectedWorkout = action.payload;
        }
    },
        extraReducers: builder => {
            builder
            .addCase(findAllWorkouts.fulfilled, (state, action) => {
                state.workouts = action.payload
            })
            .addCase(findWorkoutById.fulfilled, (state, action) => {
                state.selectedWorkout = action.payload
            })
            .addCase(addWorkout.fulfilled, (state, action) => {
                state.workouts.push(action.payload)
            })
            .addCase(updateWorkout.fulfilled, (state, action) => {
                state.workouts = [...(state.workouts.filter( (workout : Workout ) => workout.id !== action.payload.id)), action.payload]
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

interface WorkoutRequest {
    queries?: {
        category?: String,
        favorited?: Boolean
    };
    sortBy?: {
        name?: String;
    }
  }

export const findAllWorkouts = createAsyncThunk(
    "workouts/findAllWorkouts",
    async (data: WorkoutRequest | undefined) => {
        try{
            console.log('data is ', data)
            const workouts = await FitlyApi.findAllWorkouts({...data});
            return workouts
        } catch (err){
            return err
        }
    }
)

export const findWorkoutById = createAsyncThunk(
    "workouts/findWorkoutById",
    async (workoutId : number) => {
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
    async (data : Workout) => {
        try{ 
            const workout = await FitlyApi.createWorkout(data);
            return workout
        }   
        catch (err){
            return err
        }
    }
)

interface WorkoutUpdate { 
    workoutId: number,
    data: {
    }
}
export const updateWorkout = createAsyncThunk(
    "workouts/workoutUpdated",
    async(formData : WorkoutUpdate) => {
        try{
            const {workoutId, data } = formData
            const workout : Workout = await FitlyApi.updateWorkout(workoutId, data)
            return {...workout, id: workoutId}
        } catch (err){
            return err
        }
    }
)

export const deleteWorkout = createAsyncThunk(
    "workouts/workoutDeleted",
    async (workoutId : number) => {
        try{
            await FitlyApi.deleteWorkout(workoutId);
        }
        catch (err){
            return err
        }
    }
)