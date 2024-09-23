import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import FitlyApi from '../Api/FitlyApi';

const initialState = {
    equipments: [],
    selectedEquipment: {}
};

export const equipmentsSlice = createSlice({
    name: "equipments",
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
        .addCase(findAllEquipments.fulfilled, (state, action) => {
            state.equipments = action.payload
        })
        .addCase(findAEquipment.fulfilled, (state, action) => {
            state.selectedEquipment = action.payload
        })
        .addCase(addEquipment.fulfilled, (state, action) => {
            state.equipments.push(action.payload)
        })
        .addCase(updateEquipment.fulfilled, (state, action) => {
            state.selectedEquipment = action.payload
        })
        .addCase(deleteEquipment.fulfilled, (state) => {
            return state
        })
    }

})

export const selectEquipments = state => state.equipments.equipments;
export const selectEquipment = state => state.equipments.selectedEquipment;

export const findAllEquipments = createAsyncThunk(
    "equipments/findAllEquipments",
    async () => {
        try{
            const equipments = await FitlyApi.findAllEquipments();
            return equipments
        }
        catch (err){
            return err
        }
    } 
)
export const findAEquipment = createAsyncThunk(
    "equipments/findAEquipment",
    async (equipmentId) => {
        try{
            const equipment = await FitlyApi.findEquipment({equipment_id: equipmentId});
            return equipment
        }
        catch (err){
            return err
        }
    } 
)
export const addEquipment = createAsyncThunk(
    "equipments/equipmentAdded",
    async (data) => {
        try{
            const equipment = await FitlyApi.createEquipment(data);
            return equipment
        }
        catch (err){
            return err
        }
    } 
)
export const updateEquipment = createAsyncThunk(
    "equipments/equipmentUpdated",
    async (exerciseId, data) => {
        try{
            const exercise = await FitlyApi.updateExercise(exerciseId, data);
            return exercise
        }
        catch (err){
            return err
        }
    } 
)

export const deleteEquipment = createAsyncThunk(
    "equipments/equipmentDelete",
    async (equipmentId) => {
        try{
            const equipment = await FitlyApi.deleteEquipment(equipmentId);
            return equipment
        }
        catch (err){
            return err
        }
    } 
)



export default equipmentsSlice.reducer;

