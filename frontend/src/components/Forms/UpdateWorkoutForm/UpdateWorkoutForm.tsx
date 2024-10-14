import React from "react";
import { Formik, Field, ErrorMessage, Form, FormikErrors, FormikHelpers} from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { updateWorkout } from '../../../slices/workoutsSlice';
import { selectCategories } from '../../../slices/categoriesSlice';
import '../Forms.css'

interface FormValues {
    name: string,
    category: number
};

interface Category {
    id: number,
    userId: number
    name: string,
    systemdefault: boolean
};

interface FormProps{
    workout: {
        id: number,
        name: string,
        muscleGroup: number
    }
    handleToggle? : (() => void) | undefined
}

const UpdateWorkoutForm = ({workout, handleToggle}: FormProps): React.JSX.Element => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategories);
    const categoryComponents = categories.map( (category: Category) => (
        <option value={category.id}>{category.name}</option>
    ))
    
    return (
            <div className="FormContainer">
                <h4>Workout Information</h4>
                <Formik
                    initialValues={{name: workout.name, 
                        category: 1, 
                        }}
                    validate={(values: FormValues) => {
                        const errors: FormikErrors<FormValues> = {};
                        if (!values.name){ errors.name = 'Name Required'}
                        return errors
                    }}

                    onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
                        setTimeout( async () => {
                            dispatch(updateWorkout({
                                workoutId: workout.id,
                                data: {
                                name: values.name,
                                category: Number(values.category)}
                            }))
                            setSubmitting(false);
                            if(handleToggle){
                                handleToggle();
                            }
                            
                        }, 400)
                    }}
                    >
                        {({isSubmitting}) => (
                            <div className="FormContainerInner">
                                <div className="FormContent">
                                    <Form>                                                                    
                                        <div className="FormContentInputDiv">
                                            <label htmlFor="name">Workout Name:</label>
                                            <Field className="FormInput" type='name' name='name'/>
                                            <ErrorMessage name='name' component='div'/>
                                            
                                        </div>                                            
                                        <div className="FormContentInputDiv">
                                            <label htmlFor="category">Workout Category:</label>
                                            <Field className="FormInput" as='select' name='category'>
                                                {categoryComponents}
                                            </Field>
                                            <ErrorMessage name='category' component='div'/>
                                        </div>                                            
                                                <div className="FormContentInputDiv">
                                                    <button className="FormButton" onClick={handleToggle}>Cancel</button>
                                                    <button className="FormButton" type='submit' disabled={isSubmitting}>Update</button>
                                                </div>
                                    </Form>
                                </div>
                            </div>
                        )}
                </Formik>
            </div>
    )
}

export default UpdateWorkoutForm;