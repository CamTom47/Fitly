import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, ErrorMessage, Form} from "formik";
import FitlyApi from "../../../Api/FitlyApi";
import UserContext from "../../../context/UserContext";
import { useNavigate } from "react-router";
import LoadingComponent from "../../LoadingComponent/LoadingComponent";

//custom hooks
import useToggle from "../../../hooks/useToggle/useToggle";

const NewCircuitForm = ({workout, toggleShowNewCircuitForm, createCircuit}) => {

    const {currentUser} = useContext(UserContext);
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useToggle(true);

    const navigate = useNavigate();

    useEffect( () => {
        setIsLoading(true);
            const getExercises = async () => {
                try{
                    const exercises = await FitlyApi.findAllExercises()
                    setExercises(exercises);
                }
                catch(err){
                    return err
                }  
            }
        getExercises()
        setIsLoading(false);
    } , []);

    const exerciseOptionComponents = exercises.map(  exercise => (
        <option value={exercise.id}>{exercise.name}</option>
    ))

    return (isLoading)
    ? <LoadingComponent/>
    : (
        <div className="pt-3">
            <Formik
                initialValues={{
                    sets: 1,
                    reps: 1,
                    weight: 0,
                    rest_period: 0,
                    intensity: "Low",
                    exercise: ""
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

                        createCircuit({
                            sets: values.sets,
                            reps: values.reps,
                            weight: values.weight,
                            rest_period: values.rest_period,
                            intensity: values.intensity
                        }, values.exercise)

                        toggleShowNewCircuitForm();
                        setSubmitting(false);
                    }, 400)
                }}
                >
                    {({isSubmitting}) => (
                        <Form className="d-flex justify-content-center">
                            <div className="d-flex flex-column align-items-center">
                                <div className="d-flex flex-column row-gap-3" >

                                
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
                                    <option value=""> - </option>
                                    {exerciseOptionComponents}
                                </Field>
                                </div>
                                <div style={{color: "red"}}>
                                    <ErrorMessage name='exercise' component='div'/>
                                </div>
                            </div>
                            
                            <div className="d-flex column-gap-5 pt-3">
                                <button className="btn btn-danger" onClick={toggleShowNewCircuitForm}>Cancel</button>
                                <button className="btn btn-success" type='submit' disabled={isSubmitting}>Add Ciruit</button>
                            </div>
                        </div>

                        </Form>
                    )}

            </Formik>
        </div>
    )
}

export default NewCircuitForm;