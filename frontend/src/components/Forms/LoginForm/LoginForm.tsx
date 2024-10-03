import React from "react";
import {Formik, Form, Field, ErrorMessage, FormikHelpers, FormikErrors} from "formik";
import { useNavigate } from "react-router-dom";
import "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { 
    userLogIn,
    selectCurrentUser,
    selectErrorMessage
} from '../../../slices/usersSlice'

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
        <div className="d-flex flex-column justify-content-center align-items-center">
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
                        <Form className="d-flex flex-column align-items-center">
                            <div className="d-flex flex-column align-items-left row-gap-2">
                                <div className="d-flex justify-content-between column-gap-3">
                                    <label className="fs-4" htmlFor="username">Username:</label>
                                    <Field type='username' name='username'/>
                                </div>
                                <div style={{color: "red"}}>
                                    <ErrorMessage name='username' component='div'/>
                                </div>
                                <div className="d-flex justify-content-between column-gap-3">
                                    <label className="fs-4" htmlFor="password">Password:</label>
                                    <Field type='password' name='password'/>
                                </div>
                                <div style={{color: "red"}}>
                                    <ErrorMessage name='password' component='div'/> 
                                </div>
                                <p>{errorMessage}</p>
                            </div>
                                <button className="my-4" id="loginFormSubmitButton" type='submit' disabled={isSubmitting}>Login</button>
                        </Form>
                    )}

            </Formik>
        </div>
    )
    }

export default LoginForm;