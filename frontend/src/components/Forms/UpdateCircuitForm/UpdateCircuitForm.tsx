import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, ErrorMessage, Form} from "formik";
import { useNavigate } from "react-router";
import LoadingComponent from "../../LoadingComponent/LoadingComponent";
import { useSelector, useDispatch } from "react-redux";

import {
    updateCircuit
} from '../../../slices/circuitsSlice';

import {
    selectExercises
} from '../../../slices/exercisesSlice';

const UpdateCircuitForm = ({workout, toggleShowUpdateCircuitForm, circuit, exercise}) => {
    const dispatch = useDispatch();    
    const exercises = useSelector(selectExercises)
    const [isLoading, setIsLoading] = useState(true);

    const exerciseOptionComponents = exercises.map(  exercise => (
        <option value={exercise.id}>{exercise.name}</option>
    ))

    return(
        <div className=" d-flex flex-column align-items-center">
            <h5 className="pb-4">Circuit Information</h5>
            <Formik
                initialValues={{
                    sets: circuit.sets,
                    reps: circuit.reps,
                    weight: circuit.weight,
                    rest_period: circuit.rest_period,
                    intensity: circuit.intensity,
                    exercise: exercise.id
                    }}
                validate={values => {
                    const errors = {};
                    if (!values.sets){ errors.sets = 'Sets Required'}
                    if (!values.reps){ errors.reps = 'Reps Required'}
                    if (!values.rest_period){ errors.rest_period = 'Rest_period Required'}
                    if (!values.intensity){ errors.intensity = 'Intensity Required'}
                    if (!values.exercise){ errors.exercise = 'Exercise Required'}
                    return errors
                }}

                onSubmit={(values, { setSubmitting }) => {
                    setTimeout( async () => {
                        dispatch(updateCircuit({
                            circuitId: circuit.id,
                            sets: values.sets,
                            reps: values.reps,
                            weight: values.weight,
                            rest_period: values.rest_period,
                            intensity: values.intensity,
                            exerciseId: values.exercise
                        }))
                        
                        toggleShowUpdateCircuitForm();
                        setSubmitting(false);
                    }, 400)
                }}
                >
                    {({isSubmitting}) => (
                        <Form className="d-flex justify-content-center">
                            <div className="d-flex flex-column align-items-center">
                                <div className="d-flex flex-column row-gap-3">                            
                                    <div className="d-flex justify-content-between column-gap-3">
                                        <label htmlFor="sets">Sets:</label>
                                        <Field type='number' name='sets'/>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='sets' component='div'/>
                                    </div>
                                    <div className="d-flex justify-content-between column-gap-3">
                                        <label htmlFor="reps">Reps:</label>
                                        <Field type='number' name='reps'/>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='reps' component='div'/>
                                    </div>
                                    
                                    <div className="d-flex justify-content-between column-gap-3">
                                        <label htmlFor="weight">Weight(lbs):</label>
                                        <Field type='number' name='weight'/>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='weight' component='div'/>
                                    </div>
                                    
                                    <div className="d-flex justify-content-between column-gap-3">
                                        <label htmlFor="rest_period">Rest(Seconds):</label>
                                        <Field type='number' name='rest_period'/>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='rest_period' component='div'/>
                                    </div>
                                                            
                                    <div className="d-flex justify-content-between column-gap-3">
                                        <label htmlFor="intensity">Intensity:</label>
                                        <Field as='select' name='intensity'>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </Field>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='intensity' component='div'/>
                                    </div>
                                    
                                    <div className="d-flex justify-content-between column-gap-3">
                                        <label htmlFor="exercise">Exercise:</label>
                                        <Field as='select' name='exercise'>
                                            {exerciseOptionComponents}
                                        </Field>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='exercise' component='div'/>
                                    </div>
                                    
                                    <div className="d-flex column-gap-5 pt-3 justify-content-center">
                                        <button className="btn btn-danger" onClick={toggleShowUpdateCircuitForm}>Cancel</button>
                                        <button className="btn btn-success" type='submit' disabled={isSubmitting}>Update Ciruit</button>
                                    </div>
                                </div>
                            </div>

                        </Form>
                    )}

            </Formik>
        </div>
    )
}

export default UpdateCircuitForm;