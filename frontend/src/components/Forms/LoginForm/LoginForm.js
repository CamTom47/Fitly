import React, { useContext} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import "reactstrap";
import { useDispatch, useSelector} from 'react-redux'
import { 
    userLogIn,
    selectCurrentUser
} from '../../../slices/usersSlice'

const LoginForm = () => { 

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector(selectCurrentUser);

   if (user !== null) return  navigate('/')

    return (
        <div className="d-flex flex-column justify-content-center align-items-center">
            <h3>Login</h3>
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
                            </div>
                                <button className="my-4" id="loginFormSubmitButton" type='submit' disabled={isSubmitting}>Login</button>
                        </Form>
                    )}

            </Formik>
        </div>
    )
    }

export default LoginForm;