import React from "react";
import { Formik, Field, ErrorMessage, Form, FormikHelpers, FormikErrors} from "formik";
import { Card } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { addWorkout } from '../../../slices/workoutsSlice';
import { selectCategories } from '../../../slices/categoriesSlice';
import { selectCurrentUser } from "../../../slices/usersSlice";

/**
 * NewWorkoutForm Component => Handles form data and creates a new workout.
 * State: Categories
 * Props: toggleCreateForm
 */

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
    toggleCreateForm? : (() => void) | undefined
}

const NewWorkoutForm = ({toggleCreateForm} : FormProps): React.JSX.Element => {
    const dispatch = useAppDispatch();
    const categories = useAppSelector(selectCategories);
    const currentUser = useAppSelector(selectCurrentUser);

    const categoryComponents : object[] = categories.map( (cat : Category) => (
        <option value={cat.id}>{cat.name}</option>
    ))

    return (
            <div className="FormContainer">
                <h3>New Workout Form</h3>
                <Formik
                    initialValues={{
                        name: '', 
                        category: 1,
                        }}
                    validate={(values: FormValues) => {
                        const errors: FormikErrors<FormValues> = {};
                        if (!values.name){ errors.name = 'Name Required'}
                        return errors
                    }}

                    onSubmit={(values : FormValues, { setSubmitting } : FormikHelpers<FormValues>) => {
                        setTimeout( async () => {
                            dispatch(addWorkout({
                                name: values.name,
                                category: Number(values.category),
                                userId: currentUser.id,
                                favorited: false
                            }))
                            setSubmitting(false);
                            if(toggleCreateForm){
                                toggleCreateForm();
                            }
                        }, 400)
                    }}
                    >
                        {({isSubmitting}) => (
                            <div className="FormContainerInner">
                                <div className="FormContent">
                                    <Form className="FormContentInput">
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
                                            <button className="FormButton" onClick={toggleCreateForm}>Cancel</button>
                                            <button className="FormButton" type='submit' disabled={isSubmitting}>Create Workout</button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        )}
                </Formik>
            </div>
    )
}

export default NewWorkoutForm;