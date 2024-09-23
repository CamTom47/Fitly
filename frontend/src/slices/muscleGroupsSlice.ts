import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import FitlyApi from '../Api/FitlyApi'

const initialState = {
    muscleGroups: [],
    selectedMuscleGroup: {}
}

export const muscleGroupsSlice = createSlice({
    name: "muscleGroups",
    initialState,
    reducer: {},
    extraReducers: builder => {
        builder
        .addCase(findAllMuscleGroups.fulfilled, (state, action) => {
            state.muscleGroups = (action.payload)
        })
        .addCase(findAMuscleGroup.fulfilled, (state, action) => {
            state.selectedMuscleGroup = action.payload
        })
        // .addCase(addMuscleGroup.fulfilled, (state, action) => {
        //     state.muscleGroups.push(action.payload)
        // })
        // .addCase(updateMuscleGroup.fulfilled, (state, action) => {
        //     state = [...state, action.payload]
        // })
        // .addCase(deleteMuscleGroup.fulfilled, (state) => {
        //     return state
        // })
    }
});

export const findAllMuscleGroups = createAsyncThunk(
    "muscleGroups/findAllMuscleGroups",
    async () => {
        try{
            let muscleGroups = await FitlyApi.findAllMuscleGroups();
            return muscleGroups;
        }
        catch (err){
            return err
        }
    }
)

export const findAMuscleGroup = createAsyncThunk(
    "muscleGroups/findAMuscleGroup",
    async (muscleGroupId) => {
        try{
            let muscleGroup = await FitlyApi.findMuscleGroup({muscleGroup_id: muscleGroupId})
            return muscleGroup
        }
        catch (err){
            return err
        }
    }
)


// ----- Placeholders for future functionality ----------//


// export const addMuscleGroup = createAsyncThunk(
//     "muscleGroups/muscleGroupAdded",
//     async (data) => {
//         try{
//             let muscleGroup = await FitlyApi.c(data);
//             return muscleGroup;
//         }
//         catch (err){
//             return err
//         }
//     }
// )

// export const updateMuscleGroup = createAsyncThunk(
//     "muscleGroups/muscleGroupUpdated",
//     async (muscleGroupId, data) => {
//         try{
//             let muscleGroup = await FitlyApi.updateMuscleGroup(muscleGroupId, data);
//             return muscleGroup;
//         }
//         catch (err){
//             return err
//         }
//     }
// )

// export const deleteMuscleGroup = createAsyncThunk(
//     "muscleGroups/muscleGroupDeleted",
//     async (muscleGroupId, data) => {
//         try{
//             await FitlyApi.deleteMuscleGroup(muscleGroupId, data);
//         }
//         catch (err){
//             return err
//         }
//     }
// )

export const selectMuscleGroups = state => state.muscleGroups.muscleGroups;
export const selectMuscleGroup = state => state.muscleGroups.selectedMuscleGroup;

export default muscleGroupsSlice.reducer;