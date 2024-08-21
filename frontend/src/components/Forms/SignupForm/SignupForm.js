import React, { useContext} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import { Card } from "reactstrap";

const SignupForm = ({signup}) => { 

    const navigate = useNavigate();

    const user = useContext(UserContext).currentUser;

   if (user !== null) return  navigate('/')

    return (
        <div className="d-flex justify-content-center">
            <Card className="d-flex flex-column align-items-center py-3 w-25">
                <h5>Signup Form</h5>
                <Formik
                    initialValues={{username: '', 
                        password: '', 
                        }}
                    validate={values => {
                        const errors = {};
                        if (!values.username){ errors.username = 'Username Required'}
                        if (!values.password){ errors.password = 'Password Required'}
                        if (!values.password.length > 6){ errors.password = 'Password must be at least 6 characters long'}
                        return errors
                    }}

                    onSubmit={(values, { setSubmitting }) => {
                        setTimeout(() => { 
                            signup(values); 
                            setSubmitting(false);
                            navigate("/exercises")

                        }, 400)
                        
                    }}
                    >
                        {({isSubmitting}) => (
                                <Form className="d-flex flex-column align-items-center row-gap-3">
                                    <div className="d-flex flex-column align-items-between row-gap-2">
                                        <div className="d-flex justify-content-between column-gap-3">
                                            <label htmlFor="username">Username:</label>
                                            <Field type='username' name='username'/>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <ErrorMessage name='username' component='div'/>
                                        </div>
                                        <div className="d-flex justify-content-between column-gap-3">
                                            <label htmlFor="password">Password:</label>
                                            <Field type='password' name='password'/>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <ErrorMessage name='password' component='div'/>
                                        </div>
                                    </div>
                                        <button className="btn btn-success" type='submit' disabled={isSubmitting}>Sign Up</button>
                                </Form>

                        )}

                </Formik>
            </Card>
        </div>

    )
}

export default SignupForm