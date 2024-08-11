import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, ErrorMessage, Form} from "formik";
import FitlyApi from "../../../Api/FitlyApi";
import UserContext from "../../../context/UserContext";
import { useNavigate } from "react-router";

const NewWorkoutForm = ({toggleCreateForm, createWorkout}) => {

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
            <h1>New Workout Form</h1>
            <Formik
                initialValues={{name: '', 
                    category: "1", 
                    }}
                validate={values => {
                    const errors = {};
                    if (!values.name){ errors.name = 'Name Required'}
                    return errors
                }}

                onSubmit={(values, { setSubmitting }) => {
                    setTimeout( async () => {
                        await FitlyApi.createWorkout({
                            user_id: currentUser.id,
                            name: values.name,
                            category: values.category
                        })
                        setSubmitting(false);
                        toggleCreateForm();
                    }, 400)
                }}
                >
                    {({isSubmitting}) => (
                        <div>

                            <button onClick={toggleCreateForm}>Cancel</button>
                        <Form>
                            <label htmlFor="name">Workout Name:</label>
                            <Field type='name' name='name'/>
                            <ErrorMessage name='name' component='div'/>
                            <label htmlFor="category">Workout Category:</label>
                            <Field as='select' name='category'>
                                {categoryComponents}
                            </Field>
                            <ErrorMessage name='category' component='div'/>
                            <button type='submit' disabled={isSubmitting}>Create Workout</button>
                        </Form>
                        </div>
                    )}

            </Formik>
        </div>
    )
}

export default NewWorkoutForm;