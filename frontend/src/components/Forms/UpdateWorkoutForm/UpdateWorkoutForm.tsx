import React from "react";
import { Formik, Field, ErrorMessage, Form, FormikErrors, FormikHelpers} from "formik";
import { Card } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import {
    updateWorkout
} from '../../../slices/workoutsSlice';
import {
    selectCategories,
} from '../../../slices/categoriesSlice';

interface FormValues {
    name: string,
    category: number
};

interface Category {
    id: number,
    user_id: number
    name: string,
    systemdefault: boolean
};

interface FormProps{
    workout: {
        id: number,
        name: string,
        muscle_group: number
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
        <div className="d-flex justify-content-center py-4">
            <Card className="w-25 d-flex flex-column align-items-center pb-2">
                <h4>Workout Information</h4>
                <hr></hr>
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
                                category: values.category}
                            }))
                            setSubmitting(false);
                            if(handleToggle){
                                handleToggle();
                            }
                            
                        }, 400)
                    }}
                    >
                        {({isSubmitting}) => (
                            <Form>
                                <div className="d-flex flex-column align-items-center">
                                    <div className="d-flex flex-column align-items-between row-gap-3">
                                        <div className="d-flex justify-content-between column-gap-5">
                                            <label htmlFor="name">Workout Name:</label>
                                            <Field type='name' name='name'/>
                                            <ErrorMessage name='name' component='div'/>
                                        </div>
                                        
                                        <div className="d-flex justify-content-between column-gap-5">
                                            <label htmlFor="category">Workout Category:</label>
                                            <Field as='select' name='category'>
                                                {categoryComponents}
                                            </Field>
                                            <ErrorMessage name='category' component='div'/>
                                        </div>
                                        <div className="d-flex justify-content-center column-gap-5">
                                            <button className="btn btn-danger" onClick={handleToggle}>Cancel</button>
                                            <button className="btn btn-success" type='submit' disabled={isSubmitting}>Update</button>
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

export default UpdateWorkoutForm;