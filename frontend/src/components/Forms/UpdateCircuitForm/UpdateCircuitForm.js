import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, ErrorMessage, Form} from "formik";
import FitlyApi from "../../../Api/FitlyApi";
import UserContext from "../../../context/UserContext";
import { useNavigate } from "react-router";

const UpdateCircuitForm = ({workout, toggleShowUpdateCircuitForm, circuit, updateCircuit, exercise}) => {

    const {currentUser} = useContext(UserContext);
    const [exercises, setExercises] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

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
    ? <p> Is Loading... </p>
    : (
        <div>
            <button onClick={toggleShowUpdateCircuitForm}>Cancel</button>
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

                        //update new circuit
                        const updatedCircuit = await FitlyApi.updateCircuit(circuit.id,
                            {
                            sets: values.sets,
                            reps: values.reps,
                            weight: values.weight,
                            rest_period: values.rest_period,
                            intensity: values.intensity
                        })

                        // update exercise and circuit relationship
                        await FitlyApi.updateExerciseCircuit(circuit.id,
                            {
                            exercise_id: values.exercise
                        });

                        toggleShowUpdateCircuitForm();
                        setSubmitting(false);
                    }, 400)
                }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <label htmlFor="sets">Sets:</label>
                            <Field type='number' name='sets'/>
                            <ErrorMessage name='sets' component='div'/>
                            
                            <label htmlFor="reps">Reps:</label>
                            <Field type='number' name='reps'/>
                            <ErrorMessage name='reps' component='div'/>
                            
                            <label htmlFor="weight">Weight(lbs):</label>
                            <Field type='number' name='weight'/>
                            <ErrorMessage name='weight' component='div'/>
                            
                            <label htmlFor="rest_period">Rest(Seconds):</label>
                            <Field type='number' name='rest_period'/>
                            <ErrorMessage name='rest_period' component='div'/>
                                                       
                            <label htmlFor="intensity">Intensity:</label>
                            <Field as='select' name='intensity'>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </Field>
                            <ErrorMessage name='intensity' component='div'/>
                            
                            <label htmlFor="exercise">Exercise:</label>
                            <Field as='select' name='exercise'>
                                {exerciseOptionComponents}
                            </Field>
                            <ErrorMessage name='exercise' component='div'/>
                            
                            <button type='submit' disabled={isSubmitting}>Update Ciruit</button>
                        </Form>
                    )}

            </Formik>
        </div>
    )
}

export default UpdateCircuitForm;