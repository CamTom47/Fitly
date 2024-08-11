import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, ErrorMessage, Form} from "formik";
import FitlyApi from "../../../Api/FitlyApi";
import UserContext from "../../../context/UserContext";
import { useNavigate } from "react-router";

const UpdateWorkoutForm = ({workout, handleToggle, updateWorkout}) => {

    const [categories, setCategories] = useState([]);

    const {currentUser} = useContext(UserContext);

    useEffect( () => {
        const callCategories = async () => {
            let categories = await FitlyApi.findAllCategories();
            setCategories(categories);
        }
        callCategories();
    }, []);

    const navigate = useNavigate();

    const categoryComponents = categories.map( cat => (
        <option value={cat.id}>{cat.name}</option>
    ))

    return (
        <div>
            <h1>Update Workout Form</h1>
            <Formik
                initialValues={{name: workout.name, 
                    category: "1", 
                    }}
                validate={values => {
                    const errors = {};
                    if (!values.name){ errors.name = 'Name Required'}
                    return errors
                }}

                onSubmit={(values, { setSubmitting }) => {
                    setTimeout( async () => {
                        updateWorkout({
                            name: values.name,
                            category: values.category
                        })
                        setSubmitting(false);
                        handleToggle();
                    }, 400)
                }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <label htmlFor="name">Workout Name:</label>
                            <Field type='name' name='name'/>
                            <ErrorMessage name='name' component='div'/>
                            <label htmlFor="category">Workout Category:</label>
                            <Field as='select' name='category'>
                                {categoryComponents}
                            </Field>
                            <ErrorMessage name='category' component='div'/>
                            <button onClick={handleToggle}>Cancel</button>
                            <button type='submit' disabled={isSubmitting}>Update</button>
                        </Form>
                    )}

            </Formik>
        </div>
    )
}

export default UpdateWorkoutForm;