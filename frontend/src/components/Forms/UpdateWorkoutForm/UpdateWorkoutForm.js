import React, { useState, useEffect, useContext } from "react";
import { Formik, Field, ErrorMessage, Form} from "formik";
import FitlyApi from "../../../Api/FitlyApi";
import UserContext from "../../../context/UserContext";
import { useNavigate } from "react-router";
import { Card } from "reactstrap";

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
        <div className="d-flex justify-content-center py-4">
            <Card className="w-25 d-flex flex-column align-items-center pb-2">
                <h4>Workout Information</h4>
                <hr></hr>
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