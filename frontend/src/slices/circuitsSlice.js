import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import FitlyApi from '../Api/FitlyApi'

const initialState = {
    circuits: [],
    selectedCircuit: {},
    status: 'static'
}

export const circuitsSlice = createSlice({
    name: "circuits",
    initialState,
    reducer: {},
    extraReducers: builder => {
        builder
        .addCase(findAllCircuits.fulfilled, (state, action) => {
            state.circuits = action.payload
        })
        .addCase(findACircuit.fulfilled, (state, action) => {
            state.selectedCircuit = action.payload
        })
        .addCase(addCircuit.fulfilled, (state, action) => {
            state.circuits.push(action.payload)
        })
        .addCase(updateCircuit.pending, (state) => {
            state.status = 'pending';
        })
        .addCase(updateCircuit.fulfilled, (state, action) => {
            state.circuits = [...(state.circuits.filter( circuit => circuit.id !== action.payload.id)), action.payload]
            state.status = 'success';
        })
        .addCase(deleteCircuit.fulfilled, (state, action ) => {
        })
    }
});

export const findWorkoutCircuits = createAsyncThunk(
    "circuits/findAllCircuits",
    async () => {
        try{
            let circuits = await FitlyApi.findAllCircuits();
            return circuits;
        }
        catch (err){
            return err
        }
    }
)

export const findAllCircuits = createAsyncThunk(
    "circuits/findAllCircuits",
    async () => {
        try{
            let circuits = await FitlyApi.findAllCircuits();
            return circuits;
        }
        catch (err){
            return err
        }
    }
)

export const findACircuit = createAsyncThunk(
    "circuits/findACircuit",
    async (circuitId) => {
        try{
            let circuit = await FitlyApi.findCircuit({circuit_id: circuitId})
            return circuit
        }
        catch (err){
            return err
        }
    }
)

export const addCircuit = createAsyncThunk(
    "circuits/circuitAdded",
    async (data) => {
        try{
            const {
                sets,
                reps,
                weight,
                rest_period,
                intensity,
                exerciseId,
                workoutId
            } = data
            
            let circuit = await FitlyApi.addCircuit({
                sets,
                reps,
                weight,
                rest_period,
                intensity
            });
            
            await FitlyApi.addExerciseCircuit({
                circuitId: circuit.id, 
                exerciseId
            });

            await FitlyApi.addWorkoutCircuit({
                workoutId,
                circuitId: circuit.id
            })

            return {...circuit, exercise_id: +exerciseId};
        }
        catch (err){
            return err
        }
    }
)

export const updateCircuit = createAsyncThunk(
    "circuits/circuitUpdated",
    async (data) => {
        try{
            console.log(data)

            const { 
                circuitId,
                sets,
                reps,
                weight,
                rest_period,
                intensity,
                exerciseId                
            } = data

            let circuit = await FitlyApi.updateCircuit(circuitId, {
                                                                    sets,
                                                                    reps,
                                                                    weight,
                                                                    rest_period,
                                                                    intensity
                                                                });

            await FitlyApi.updateExerciseCircuit({circuitId, exerciseId});
            
            return circuit;
        }
        catch (err){
            return err
        }
    }
)

export const deleteCircuit = createAsyncThunk(
    "circuits/circuitDeleted",
    async (circuitId) => {
        try{
            await FitlyApi.deleteCircuit(circuitId);
            return circuitId
        }
        catch (err){
            return err
        }
    }
)

export const selectCircuits = state => state.circuits.circuits;
export const selectCircuit = state => state.circuits.selectedCircuit;
export const selectCircuitStatus = state => state.circuits.status;

export default circuitsSlice.reducer;