import React, { useContext} from "react";
import {Formik, Form, Field, ErrorMessage, withFormik, FormikProps, FormikErrors, FormikHelpers} from "formik";
import { useNavigate } from "react-router-dom";
import { Card } from "reactstrap";
import {
    selectCurrentUser,
    signup
} from '../../../slices/usersSlice';

import { useAppSelector, useAppDispatch } from "../../../hooks/reduxHooks";

/**
 * SignupForm Component: Validates a user's input and registers them in Fitly's database
 * State: currentUser
 * Props: none
 */

interface FormValues {
    username: string,
    password: string
};

const SignupForm = () : React.JSX.Element => { 
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const currentUser = useAppSelector(selectCurrentUser);

   if (currentUser !== null) navigate('/')

    return (
        <div className="d-flex justify-content-center">
            <Card className="d-flex flex-column align-items-center py-3 w-25">
                <h5>Signup Form</h5>
                <Formik
                    initialValues={{
                        username: '', 
                        password: '', 
                        }}
                    validate = {(values : FormValues) => {
                        let errors: FormikErrors<FormValues> = {};
                        if (!values.username){ errors.username = 'Username Required'}
                        if (!values.password){ errors.password = 'Password Required'}
                        if (Number(!values.password.length) > 6){ errors.password = 'Password must be at least 6 characters long'}
                        return errors
                    }}

                    onSubmit={(values : FormValues, { setSubmitting } : FormikHelpers<FormValues>) => {
                        setTimeout(() => { 
                            dispatch(signup(values));
                            setSubmitting(false);
                            localStorage.setItem('isAuthenticated', "true");
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