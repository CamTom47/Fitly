import React from "react";
import { Formik, Field, ErrorMessage, Form, FormikHelpers, FormikErrors} from "formik";
import { equipmentCheckForExerciseUpdate } from "../../../helpers/helpers"
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { selectCurrentUser } from '../../../slices/usersSlice';
import { addExercise } from '../../../slices/exercisesSlice';
import { selectMuscleGroups } from '../../../slices/muscleGroupsSlice';

import '../Forms.css'


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
        <div className="FormContainer">
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

                            const equipmentId = await equipmentCheckForExerciseUpdate(values.equipment, currentUser.id);

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
                            <div className="FormContainerInner">
                                <div className="FormContent">                          
                                    <Form className="FormContentInput">
                                        <div className="FormContentInputDiv">
                                                    <label className="FormInput" htmlFor="name">Exercise Name:</label>
                                                    <Field className="FormInput" type='name' name='name'/>
                                            
                                        </div>
                                        <div className="FormContentInputDiv">
                                                    <label className="FormInput" htmlFor="muscleGroup">Muscle Group:</label>
                                                    <Field className="FormInput" as='select' name='muscleGroup'>
                                                        {muscleGroupComponents}
                                                    </Field>

                                        </div>
                                        <div className="FormContentInputDiv">
                                                    <label className="FormInput" htmlFor="equipment">Equipment:</label>
                                                    <Field className="FormInput" type='equipment' name='equipment'/>

                                        </div>
                                        <div className="FormContentInputDiv">
                                                    <button className="FormButton" onClick={toggle}>Cancel</button>
                                                    <button className="FormButton" type='submit' disabled={isSubmitting}>Create Exercise</button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        )}

                </Formik>
            </div>
    )
}

export default NewExerciseForm;