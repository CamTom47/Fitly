import React, {useCallback, useEffect, useState} from "react";
import UpdateCircuitForm from "../Forms/UpdateCircuitForm/UpdateCircuitForm";
import useToggle from "../../hooks/useToggle/useToggle";
import FitlyApi from "../../Api/FitlyApi";

const Circuit = ({circuitId, updateCircuit, deleteCircuit}) => {

    const [showUpdateCircuitForm, setShowUpdateCircuitForm ] = useToggle();
    const [circuit, setCircuit] = useState({});
    const [exercise, setExercise] = useState({});

    const getCircuitAndExercise = useCallback( async () => {
        const circuit = await FitlyApi.findCircuit({
            circuit_id: circuitId
        })
        setCircuit(circuit);
        const exercise = await FitlyApi.findExercise({
            exercise_id: circuit.exercise_id
        })
        setExercise(exercise);
    }, [showUpdateCircuitForm])

    useEffect(() => {
        getCircuitAndExercise();
    }, [getCircuitAndExercise])

    const handleDelete = () => {
        deleteCircuit({
            "circuit_id": circuit.id
        })

    }

    const toggleShowUpdateCircuitForm = () => {
        setShowUpdateCircuitForm(showUpdateCircuitForm => !showUpdateCircuitForm);
    }

    return (showUpdateCircuitForm)
    ? <UpdateCircuitForm circuit={circuit} updateCircuit={updateCircuit} exercise={exercise} toggleShowUpdateCircuitForm={toggleShowUpdateCircuitForm}/>
    : (
        <div>
            <p>Sets: {circuit.sets}</p>
            <p>Reps: {circuit.reps}</p>
            <p>Weight (lbs): {circuit.weight}</p>
            <p>Rest (Seconds): {circuit.rest_period}</p>
            <p>Intensity: {circuit.intensity}</p>
            <h2>{exercise.name}</h2>
            <button onClick={toggleShowUpdateCircuitForm}>Update Circuit</button>
            <button onClick={handleDelete}>Delete Circuit</button>
        </div>
    )

}

export default Circuit;