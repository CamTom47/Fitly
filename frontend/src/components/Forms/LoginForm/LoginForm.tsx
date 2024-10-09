import React from "react";
import {Formik, Form, Field, ErrorMessage, FormikHelpers, FormikErrors} from "formik";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { 
    userLogIn,
    selectCurrentUser,
    selectErrorMessage
} from '../../../slices/usersSlice';

import '../Forms.css'

interface FormValues {
    username: string,
    password: string
}

const LoginForm = (): React.JSX.Element => { 

    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const errorMessage = useAppSelector(selectErrorMessage)
    const user = useAppSelector(selectCurrentUser);

   if (user !== null) navigate('/')

    return (
        <div className="FormContainer">
            <h3>Login</h3>
                <Formik 
                    initialValues={{username: '', 
                        password: '', 
                        }}
                    validate={(values: FormValues) => {
                        const errors: FormikErrors<FormValues> = {};
                        if (!values.username){ errors.username = 'Username Required'}
                        if (!values.password){ errors.password = 'Password Required'}
                        if (Number(!values.password.length) > 6){ errors.password = 'Password must be at least 6 characters long'}
                        return errors
                    }}

                    onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
                        setTimeout(() => {
                            setSubmitting(false);
                            dispatch(userLogIn(values))
                            navigate("/exercises")
                        }, 400)
                    }}
                    >
                        {({isSubmitting}) => (
                            <div className="FormContainerInner">
                                <div className="FormContent">
                                    <Form className="FormContentInput">
                                        <div className="FormContentInputDiv">
                                            <label htmlFor="username">Username:</label>
                                            <Field className="FormInput" type='username' name='username'/>
                                            <ErrorMessage name='username' component='div'/>
                                        </div>
                                        <div className="FormContentInputDiv">
                                            <label htmlFor="password">Password:</label>
                                            <Field className="FormInput" type='password' name='password'/>
                                            <ErrorMessage name='password' component='div'/> 
                                            <p>{errorMessage}</p>
                                        </div>
                                        <div className="FormContentInputDiv">
                                            <button className="FormButton" id="loginFormSubmitButton" type='submit' disabled={isSubmitting}>Login</button>
                                        </div>
                                    </Form>
                                </div>
                            </div>
                        )}

                </Formik>   
            </div>
    )
    }

export default LoginForm;