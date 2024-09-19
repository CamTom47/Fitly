import React, {useCallback, useEffect, useState} from "react";
import UpdateCircuitForm from "../Forms/UpdateCircuitForm/UpdateCircuitForm";
import useToggle from "../../hooks/useToggle/useToggle";
import { v4 as uuid } from 'uuid';
import { Col, Row } from "reactstrap";
import { 
    selectCircuit,
    selectCircuits,
    deleteCircuit,
    findAllCircuits,
    selectCircuitStatus
} from '../../slices/circuitsSlice';
import { 
    selectExercise,
    selectExercises,
} from '../../slices/exercisesSlice';

import { useDispatch, useSelector } from "react-redux";

const Circuit = ({circuitId}) => {
    const dispatch = useDispatch();

    const circuits = useSelector(selectCircuits);
    const circuit = circuits.filter( circuit => circuit.id === circuitId)[0];
    let status = useSelector(selectCircuitStatus)
    const exercises = useSelector(selectExercises);
    let exercise = exercises.filter( exercise => exercise.id === circuit.exercise_id)[0];
    const [showUpdateCircuitForm, setShowUpdateCircuitForm ] = useToggle();

    const getCircuits = useCallback(() => {
        dispatch(findAllCircuits())
    } , [status])

    useEffect(() => {
        getCircuits()
    } , [getCircuits])

    const handleDelete = () => {
        dispatch(deleteCircuit(circuitId))
    }

    const toggleShowUpdateCircuitForm = () => {
        setShowUpdateCircuitForm(showUpdateCircuitForm => !showUpdateCircuitForm);
    }

    return (showUpdateCircuitForm)
    ? <UpdateCircuitForm key={uuid()} circuit={circuit} exercise={exercise} toggleShowUpdateCircuitForm={toggleShowUpdateCircuitForm}/>
    :   (
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