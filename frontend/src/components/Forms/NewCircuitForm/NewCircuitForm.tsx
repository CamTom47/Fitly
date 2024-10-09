import React, { useState } from "react";
import { Formik, Field, ErrorMessage, Form, FormikErrors, FormikHelpers} from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { addCircuit } from '../../../slices/circuitsSlice';
import { selectExercises } from '../../../slices/exercisesSlice';
import '../Forms.css'

interface FormValues {
    sets: number,
    reps: number,
    weight: number,
    restPeriod: number,
    intensity: string,
    exercise: number | undefined,
}

interface FormProps{
    workout: {id: number},
    toggleShowNewCircuitForm: () => void
}

const NewCircuitForm = ({workout, toggleShowNewCircuitForm}: FormProps ): React.JSX.Element => {
    const dispatch = useAppDispatch();
    const exercises = useAppSelector(selectExercises);

    const exerciseOptionComponents = exercises.map(  exercise => (
        <option value={exercise.id}>{exercise.name}</option>
    ))
    
    return (
        <div className="FormContainer">
            <Formik
                initialValues={{
                    sets: 1,
                    reps: 1,
                    weight: 0,
                    restPeriod: 0,
                    intensity: "Low",
                    exercise: undefined
                    }}
                validate={(values: FormValues ) => {
                    const errors: FormikErrors<FormValues> = {};
                    if (!values.sets){ errors.sets = 'Sets Required'}
                    if (!values.reps){ errors.reps = 'Reps Required'}
                    if (!values.restPeriod){ errors.restPeriod = 'Rest Period Required'}
                    if (!values.intensity){ errors.intensity = 'Intensity Required'}
                    if (!values.exercise){ errors.exercise = 'Exercise Required'}
                    return errors
                }}

                onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
                    setTimeout( async () => {

                        dispatch(addCircuit({
                            sets: values.sets,
                            reps: values.reps,
                            weight: values.weight,
                            restPeriod: values.restPeriod,
                            intensity: values.intensity,
                            exerciseId : Number(values.exercise),
                            workoutId: workout.id
                        }))

                        toggleShowNewCircuitForm();
                        setSubmitting(false);
                    }, 400)
                }}
                >
                    {({isSubmitting}) => (
                        <div className="FormContainerInner">
                            <div className="FormContent">
                                <Form className="FormContentInput">
                                    <div className="FormContentInputDiv">
                                        <label htmlFor="sets">Sets:</label>
                                        <Field type='number' name='sets'/>
                                        <ErrorMessage name='sets' component='div'/>
                                    </div>
                                    <div className="FormContentInputDiv">
                                        <label htmlFor="reps">Reps:</label>
                                        <Field type='number' name='reps'/>
                                        <ErrorMessage name='reps' component='div'/>
                                    </div>
                                    <div className="FormContentInputDiv">
                                        <label htmlFor="weight">Weight(lbs):</label>
                                        <Field type='number' name='weight'/>
                                        <ErrorMessage name='weight' component='div'/>
                                    </div>
                                    <div className="FormContentInputDiv">
                                        <label htmlFor="restPeriod">Rest(Seconds):</label>
                                        <Field type='number' name='restPeriod'/>
                                        <ErrorMessage name='restPeriod' component='div'/>
                                    </div>
                                    <div className="FormContentInputDiv">
                                        <label htmlFor="intensity">Intensity:</label>
                                            <Field as='select' name='intensity'>
                                                <option value="low">Low</option>
                                                <option value="medium">Medium</option>
                                                <option value="high">High</option>
                                            </Field>
                                            <ErrorMessage name='intensity' component='div'/>
                                    </div>
                                    <div className="FormContentInputDiv">
                                        <label htmlFor="exercise">Exercise:</label>
                                        <Field as='select' name='exercise'>
                                            <option value=""> - </option>
                                            {exerciseOptionComponents}
                                        </Field>
                                            <ErrorMessage name='exercise' component='div'/>
                                    </div>
                                    <div className="FormContentInputDiv">
                                        <button className="FormButton" onClick={toggleShowNewCircuitForm}>Cancel</button>
                                        <button className="FormButton" type='submit' disabled={isSubmitting}>Add Circuit</button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    )}
            </Formik>
            </div>
    )
}

export default NewCircuitForm;