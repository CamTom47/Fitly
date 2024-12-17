import { createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import FitlyApi from '../Api/FitlyApi';

interface ExerciseState {
    exercises: {}[],
    selectedExercise: {}
}
const initialState : ExerciseState = {
    exercises: [],
    selectedExercise: {}
};

export const exerciseSlice = createSlice({
    name: "exercises",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(findAllExercises.fulfilled, (state, action) => {
            state.exercises = action.payload
        })
        .addCase(findAExercise.fulfilled, (state, action) => {
            state.selectedExercise = action.payload
        })
        .addCase(addExercise.fulfilled, (state, action) => {
            state.exercises.push(action.payload.exercise)
        })
        .addCase(updateExercise.fulfilled, (state, action) => {
            state.exercises = [...(state.exercises.filter( (exercise : Exercise) => exercise.id !== action.payload.id)), action.payload]
        })
        .addCase(deleteExercise.fulfilled, (state, action) => {
            state.exercises = state.exercises.filter( (exercise : Exercise) => exercise.id !== action.payload)
        })
    }
})

export const selectExercises = state => state.exercises.exercises;
export const selectExercise = state => state.exercises.selectedExercise;


interface Exercise {
    id?: number,
    name: string,
    muscleGroup: number,
    equipmentId?: number
};

interface ExerciseRequest {
   filterBy?: {
       muscleGroup?: string,
       equipmentId?: string
   };
   sortBy?: {};
}

export const findAllExercises = createAsyncThunk(
    "exercises/findAllExercises",
    async (data: ExerciseRequest | undefined) => {
        try{
            const exercises = await FitlyApi.findAllExercises({...data});
            return exercises
        }
        catch (err){
            return err
        }
    } 
)

export const findAExercise = createAsyncThunk(
    "exercises/findAExercise",
    async (exerciseId: number) => {
        try{
            const exercise = await FitlyApi.findExercise({exerciseId});
            return exercise
        }
        catch (err){
            return err
        }
    } 
)
export const addExercise = createAsyncThunk(
    "exercises/exerciseAdded",
    async (data : Exercise) => {
        try{
            console.log(data)
            const exercise = await FitlyApi.createExercise(data);
            return exercise
        }
        catch (err){
            return err
        }
    } 
)

interface UpdateExercise extends Exercise {
    exerciseId : number
};

export const updateExercise = createAsyncThunk(
    "exercises/exerciseUpdated",
    async (data : UpdateExercise ) => {
        try{
            const { exerciseId, name, muscleGroup, equipmentId } = data;
            const exercise : Exercise = await FitlyApi.updateExercise(exerciseId, {name, muscleGroup, equipmentId});
            return {...exercise, equipmentId}
        }
        catch (err){
            return err
        }
    } 
)

export const deleteExercise = createAsyncThunk(
    "exercises/exerciseDeleted",
    async (exerciseId : number) => {
        try{
            await FitlyApi.deleteExercise({exerciseId});
            return exerciseId
        }
        catch (err){
            return err
        }
    } 
)



export default exerciseSlice.reducer;

