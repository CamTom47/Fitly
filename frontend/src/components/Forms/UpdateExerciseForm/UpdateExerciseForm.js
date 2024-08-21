import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, ErrorMessage, Form} from "formik";
import FitlyApi from "../../../Api/FitlyApi";
import UserContext from "../../../context/UserContext";
import {equipmentCheckForExerciseUpdate}  from "../../../helpers/helpers";

const UpdateExerciseForm = ({toggle, updateExercise, exercise, equipment}) => {

    const {currentUser} = useContext(UserContext);
    const [muscleGroups, setMuscleGroups] = useState([]);

    useEffect( () => { 
        const gatherMuscleGroups = async () => {
            let muscleGroups = await FitlyApi.findAllMuscleGroups();
            setMuscleGroups(muscleGroups);
        }
        gatherMuscleGroups();
    }, []);

    const muscleGroupComponents = muscleGroups.map( muscleGroup => (
        <option value={muscleGroup.id}>{muscleGroup.name}</option>
    ))



    return (
        <div className="d-flex flex-column align-items-center">
            <h3>Exercise Information</h3>
            <Formik
                initialValues={{name: exercise.name, 
                    muscle_group: exercise.muscle_group,
                    equipment: equipment.name
                    }}
                validate={values => {
                    const errors = {};
                    if (!values.name){ errors.name = 'Name Required'}
                    if (!values.muscle_group){ errors.muscle_group = 'Muscle Group Required'}
                    if (!values.equipment){ errors.equipment = 'Equipment Required'}
                    return errors
                }}

                onSubmit={(values, { setSubmitting }) => {
                    setTimeout( async () => {
                        setSubmitting(false);
                                    
                        let equipmentId = await equipmentCheckForExerciseUpdate(values.equipment, currentUser.id);
                                updateExercise( 
                                    exercise.id, 
                                    {
                                    name: values.name,
                                    muscle_group: parseInt(values.muscle_group),
                                    equipment_id: equipmentId
                                })
                        toggle();
                    }, 400)
                }}
                >
                    {({isSubmitting}) => (
                            <Form className="d-flex flex-column align-items-center">
                                <div className="d-flex flex-column align-items-center">
                                    <div className="d-flex flex-column justify-content-center p-3 row-gap-4">
                                        <div className="d-flex justify-content-between column-gap-3">
                                            <label htmlFor="name">Exercise Name:</label>
                                            <Field type='name' name='name'/>
                                            <ErrorMessage name='name' component='div'/>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <label htmlFor="muscle_group">Muscle Group:</label>
                                            <Field as='select' name='muscle_group'>
                                                {muscleGroupComponents}
                                            </Field>
                                            <ErrorMessage name='muscle_group' component='div'/>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <label htmlFor="equipment">Equipment:</label>
                                            <Field type='equipment' name='equipment'/>
                                            <ErrorMessage name='equipment' component='div'/>
                                        </div>
                                    </div>
                                    <div className="d-flex column-gap-5">
                                        <button className="btn btn-danger" onClick={toggle}>Cancel</button>
                                        <button className="btn btn-success" type='submit' disabled={isSubmitting}>Register</button>
                                    </div>
                                </div>
                            </Form>
                    )}

            </Formik>
        </div>
    )
}

export default UpdateExerciseForm;