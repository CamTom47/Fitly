import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, ErrorMessage, Form} from "formik";
import UserContext from "../../../context/UserContext";
import { equipmentCheckForExerciseUpdate } from "../../../helpers/helpers"

const NewExerciseForm = ({toggle, addExercise, muscleGroups}) => {

    const {currentUser} = useContext(UserContext);

    const muscleGroupComponents = muscleGroups.map( muscleGroup => (
        <option value={muscleGroup.id}>{muscleGroup.name}</option>
    ))
    
    return (
        <div>
            <h1>New Exercise Form</h1>
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

                        addExercise({
                            name: values.name,
                            muscle_group: parseInt(values.muscle_group),
                            equipment_id: equipmentId
                        })
                        
                        toggle();
                    }, 400)}}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <label htmlFor="name">Exercise Name:</label>
                            <Field type='name' name='name'/>
                            <ErrorMessage name='name' component='div'/>
                            <label htmlFor="muscle_group">Muscle Group:</label>
                            <Field as='select' name='muscle_group'>
                                {muscleGroupComponents}
                            </Field>
                            <ErrorMessage name='muscle_group' component='div'/>
                            <label htmlFor="equipment">Equipment:</label>
                            <Field type='equipment' name='equipment'/>
                            <ErrorMessage name='equipment' component='div'/>
                            <button onClick={toggle}>Cancel</button>
                            <button type='submit' disabled={isSubmitting}>Create Exercise</button>
                        </Form>
                    )}

            </Formik>
        </div>
    )
}

export default NewExerciseForm;