import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, ErrorMessage, Form} from "formik";
import FitlyApi from "../../../Api/FitlyApi";
import UserContext from "../../../context/UserContext";
import { useNavigate } from "react-router";
import { Card } from "reactstrap";

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
        <div className="d-flex justify-content-center">
            <Card className="w-25 d-flex flex-column align-items-center pb-3">
                <h3>New Workout Form</h3>
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
                            <Form>
                                <div className="d-flex flex-column align-items-center row-gap-3">    
                                    <div className="d-flex flex-column align-items-between row-gap-3">

                                    <div className="d-flex flex-row justify-content-between">
                                        <label htmlFor="name">Workout Name:</label>
                                        <Field type='name' name='name'/>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='name' component='div'/>
                                </div>
                                    <div className="d-flex flex-row justify-content-between">
                                        <label htmlFor="category">Workout Category:</label>
                                        <Field as='select' name='category'>
                                            {categoryComponents}
                                        </Field>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='category' component='div'/>
                                </div>
                                    </div>
                                    <div className="d-flex flex-row column-gap-5">
                                        <button className="btn btn-danger" onClick={toggleCreateForm}>Cancel</button>
                                        <button className="btn btn-success" type='submit' disabled={isSubmitting}>Create Workout</button>
                                    </div>
                                </div>
                            </Form>
                            </div>
                        )}

                </Formik>
            </Card>
        </div>
    )
}

export default NewWorkoutForm;