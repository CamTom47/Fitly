import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, ErrorMessage, Form} from "formik";
import { equipmentCheckForExerciseUpdate } from "../../../helpers/helpers"
import { Card } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import {
    selectCurrentUser,
} from '../../../slices/usersSlice';
import {
    addExercise,
} from '../../../slices/exercisesSlice';
import { 
    selectMuscleGroups
} from '../../../slices/muscleGroupsSlice';

const NewExerciseForm = ({toggle}) => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const muscleGroups = useSelector(selectMuscleGroups);

    const muscleGroupComponents = muscleGroups.map( muscleGroup => (
        <option value={muscleGroup.id}>{muscleGroup.name}</option>
    ))
    
    return (
        <div className="d-flex flex-column align-items-center pt-5">
            <Card className="d-flex flex-column align-items-center py-3">
                <h3>New Exercise Form</h3>
                <Formik
                    initialValues={{name: "", 
                        muscle_group: 1,
                        equipment: "N/A"
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

                            dispatch(addExercise({
                                name: values.name,
                                muscle_group: parseInt(values.muscle_group),
                                equipment_id: equipmentId
                            }))
                            
                            toggle();
                        }, 400)}}
                    >
                        {({isSubmitting}) => (
                            <Form className="d-flex flex-column align-items-center">
                                <div className="d-flex flex-column align-items-center">
                                    <div className="d-flex flex-column justify-content-center p-3 row-gap-4">
                                        <div className="d-flex justify-content-between column-gap-3">
                                            <label htmlFor="name">Exercise Name:</label>
                                            <Field type='name' name='name'/>
                                        </div>
                                        <div style={{color: "red"}}>
                                            <ErrorMessage name='name' component='div'/>
                                </div>
                                        <div className="d-flex justify-content-between column-gap-3">
                                            <label htmlFor="muscle_group">Muscle Group:</label>
                                            <Field as='select' name='muscle_group'>
                                                {muscleGroupComponents}
                                            </Field>
                                        </div>
                                        <div style={{color: "red"}}>
                                            <ErrorMessage name='muscle_group' component='div'/>
                                </div>
                                        <div className="d-flex justify-content-between column-gap-3">
                                            <label htmlFor="equipment">Equipment:</label>
                                            <Field type='equipment' name='equipment'/>
                                        </div>
                                        <div style={{color: "red"}}>
                                            <ErrorMessage name='equipment' component='div'/>
                                </div>
                                        <div className="d-flex justify-content-center column-gap-3">
                                            <button className="btn btn-danger" onClick={toggle}>Cancel</button>
                                            <button className="btn btn-success" type='submit' disabled={isSubmitting}>Create Exercise</button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )}

                </Formik>
            </Card>
        </div>
    )
}

export default NewExerciseForm;