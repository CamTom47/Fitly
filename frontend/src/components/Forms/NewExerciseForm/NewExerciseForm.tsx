import React from "react";
import { Formik, Field, ErrorMessage, Form, FormikHelpers, FormikErrors} from "formik";
import { equipmentCheckForExerciseUpdate } from "../../../helpers/helpers"
import { Card } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import {
    selectCurrentUser,
} from '../../../slices/usersSlice';
import {
    addExercise,
} from '../../../slices/exercisesSlice';
import { 
    selectMuscleGroups
} from '../../../slices/muscleGroupsSlice';


interface FormProps{
    toggle?: (() => void) | undefined
}

interface FormValues {
    name: string,
    muscleGroup: number,
    equipment: string
}

interface MuscleGroup{
    id: number,
    name: string
}

const NewExerciseForm = ({toggle} : FormProps): React.JSX.Element => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const muscleGroups = useAppSelector(selectMuscleGroups);

    const muscleGroupComponents =  muscleGroups.map( (muscleGroup : MuscleGroup) => (
        <option value={muscleGroup.id}>{muscleGroup.name}</option>
    ))
    
    return (
        <div className="d-flex flex-column align-items-center pt-5">
            <Card className="d-flex flex-column align-items-center py-3">
                <h3>New Exercise Form</h3>
                <Formik
                    initialValues={{name: "", 
                        muscleGroup: 1,
                        equipment: ""
                        }}
                    validate={(values: FormValues) => {
                        const errors: FormikErrors<FormValues> = {};
                        if (!values.name){ errors.name = 'Name Required'}
                        if (!values.muscleGroup){ errors.muscleGroup = 'Muscle Group Required'}
                        if (!values.equipment){ errors.equipment = 'Equipment Required'}
                        return errors
                    }}

                    onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
                        setTimeout( async () => {
                            setSubmitting(false);

                            let equipmentId = await equipmentCheckForExerciseUpdate(values.equipment, currentUser.id);

                            dispatch(addExercise({
                                name: values.name,
                                muscleGroup: Number(values.muscleGroup),
                                equipmentId
                            }))
                            if(toggle){
                                toggle();
                            }
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
                                            <label htmlFor="muscleGroup">Muscle Group:</label>
                                            <Field as='select' name='muscleGroup'>
                                                {muscleGroupComponents}
                                            </Field>
                                        </div>
                                        <div style={{color: "red"}}>
                                            <ErrorMessage name='muscleGroup' component='div'/>
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