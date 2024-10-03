import { createAsyncThunk, createSlice, PayloadAction, Update } from '@reduxjs/toolkit'
import FitlyApi from '../Api/FitlyApi'

type CircuitState = {
    circuits: {}[],
    selectedCircuit: {}
};

const initialState : CircuitState = {
    circuits: [],
    selectedCircuit: {},
};

type Circuit = {
    id?: number,
    sets: number,
    reps: number,
    weight: number
    restPeriod: number,
    intensity: string,
    exerciseId? : number,
    workoutId? : number
}


export const circuitsSlice = createSlice({
    name: "circuits",
    initialState,
    reducers: {},
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
        .addCase(updateCircuit.fulfilled, (state, action) => {
            state.circuits = [...(state.circuits.filter( (circuit : Circuit) => circuit.id !== action.payload.id)), action.payload]
        })
        .addCase(deleteCircuit.fulfilled, (state, action) => {
            state.circuits = state.circuits.filter( (circuit : Circuit) => circuit.id !== action.payload)
        })
    }
});

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
            let circuit = await FitlyApi.findCircuit({circuitId})
            return circuit
        }
        catch (err){
            return err
        }
    }
)


export const addCircuit = createAsyncThunk(
    "circuits/circuitAdded",
    async (data : Circuit) => {
        try{            

                const { 
                    id,
                    sets,
                    reps,
                    weight,
                    restPeriod,
                    intensity,
                    exerciseId,
                    workoutId
                } = data;

            const  circuit : Circuit = await FitlyApi.addCircuit(data);
            
            await FitlyApi.addExerciseCircuit({circuitId: circuit.id, exerciseId});

            await FitlyApi.addWorkoutCircuit({
                workoutId: workoutId,
                circuitId: circuit.id
            })

            return {...circuit, exerciseId, workoutId};
        }
        catch (err){
            return err
        }
    }
)
interface UpdateCircuit extends Circuit{
    circuitId : number,
    workoutId : number
};

export const updateCircuit = createAsyncThunk(
    "circuits/circuitUpdated",
    async (data : UpdateCircuit
    ) => {
        try{

            console.log(data);
            const { 
                circuitId,
                sets,
                reps,
                weight,
                restPeriod,
                intensity,
                exerciseId,
                workoutId             
            } = data

            let circuit : Circuit = await FitlyApi.updateCircuit(circuitId, {
                                                                    sets,
                                                                    reps,
                                                                    weight,
                                                                    restPeriod,
                                                                    intensity
                                                                });

            await FitlyApi.updateExerciseCircuit({circuitId, exerciseId});
            
            return {...circuit, exerciseId, workoutId};
        }
        catch (err){
            return err
        }
    }
)

export const deleteCircuit = createAsyncThunk(
    "circuits/circuitDeleted",
    async (circuitId : number) => {
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

export default circuitsSlice.reducer;