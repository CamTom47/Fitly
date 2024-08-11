import React, { useContext} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/UserContext";

const LoginForm = ({login}) => { 

    const navigate = useNavigate();

    const user = useContext(UserContext).currentUser;

   if (user !== null) return  navigate('/')

    return (
        <div>
            <h1>Login Form</h1>
            <Formik
                initialValues={{username: '', 
                    password: '', 
                    }}
                validate={values => {
                    const errors = {};
                    if (!values.username){ errors.username = 'Required'}
                    if (!values.password.length > 6){ errors.password = 'Password must be at least 6 characters long'}
                    return errors
                }}

                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {
                        setSubmitting(false);
                        login(values)
                    }, 400)
                }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <label htmlFor="username">Username:</label>
                            <Field type='username' name='username'/>
                            <ErrorMessage name='username' component='div'/>
                            <label htmlFor="password">Password:</label>
                            <Field type='password' name='password'/>
                            <ErrorMessage name='password' component='div'/>
                            <button type='submit' disabled={isSubmitting}>Login</button>
                        </Form>
                    )}

            </Formik>
        </div>
    )
}

export default LoginForm;