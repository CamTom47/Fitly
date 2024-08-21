import React, {useCallback, useEffect, useState} from "react";
import UpdateCircuitForm from "../Forms/UpdateCircuitForm/UpdateCircuitForm";
import useToggle from "../../hooks/useToggle/useToggle";
import FitlyApi from "../../Api/FitlyApi";
import { Col, Row } from "reactstrap";

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
        <div className="d-flex flex-column align-items-between py-3">
            <div className="d-flex flex-column align-items-between">
            <Row xs="3">
                <Col className="d-flex flex-row justify-content-center column-gap-2">
                    <span>Sets:</span><p>{circuit.sets}</p>
                </Col>
                <Col className="d-flex flex-row justify-content-center column-gap-2">
                    <span>Reps: </span><p>{circuit.reps}</p>
                </Col>
                <Col className="d-flex flex-row justify-content-center column-gap-2">
                    <span>Weight (lbs): </span>
                    <p>{circuit.weight}</p>
                </Col>
            </Row>
            <Row xs="3">
                <div className="d-flex flex-row justify-content-center column-gap-2">
                    <span>Rest (Seconds): </span>
                    <p>{circuit.rest_period}</p>
                </div>
                <div className="d-flex flex-row justify-content-center column-gap-2">
                    <span>Intensity: </span>
                    <p>{circuit.intensity}</p>
                </div>
                <div className="d-flex flex-row justify-content-center">
                    <div className="d-flex flex-row column-gap-2">
                        <span>Exercise:</span>
                        <p>{exercise.name}</p>
                    </div>
                </div>
            </Row>
            <div className="d-flex justify-content-center column-gap-5">
                <button className="btn btn-danger" onClick={handleDelete}>Delete Circuit</button>
                <button className="btn btn-secondary" onClick={toggleShowUpdateCircuitForm}>Update Circuit</button>
            </div>
            </div>
        </div>
    )

}

export default Circuit;