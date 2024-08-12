import React, { useContext} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import "reactstrap"

const LoginForm = ({login}) => { 

    const navigate = useNavigate();

    const user = useContext(UserContext).currentUser;

   if (user !== null) return  navigate('/')

//     return (
//         <div className="loginFormContainer">
//             <h3 className="loginFormH3">Login</h3>
//             <Formik 
//                 initialValues={{username: '', 
//                     password: '', 
//                     }}
//                 validate={values => {
//                     const errors = {};
//                     if (!values.username){ errors.username = 'Required'}
//                     if (!values.password.length > 6){ errors.password = 'Password must be at least 6 characters long'}
//                     return errors
//                 }}

//                 onSubmit={(values, { setSubmitting }) => {
//                     setTimeout(() => {
//                         setSubmitting(false);
//                         login(values)
//                     }, 400)
//                 }}
//                 >
//                     {({isSubmitting}) => (
//                         <Form>
//                             <div>
//                                 <div className="loginFormInputDiv">
//                                     <label className="loginFormLabel" htmlFor="username">Username:</label>
//                                     <Field type='username' name='username'/>
//                                     <ErrorMessage name='username' component='div'/>
//                                 </div>
//                                 <div className="loginFormInputDiv">
//                                     <label className="loginFormLabel" htmlFor="password">Password:</label>
//                                     <Field type='password' name='password'/>
//                                     <ErrorMessage name='password' component='div'/> 
//                                 </div>
//                             </div>
//                             <button id="loginFormSubmitButton" type='submit' disabled={isSubmitting}>Login</button>
//                         </Form>
//                     )}

//             </Formik>
//         </div>
//     )
// }

return (
    <div className="d-flex flex-column justify-content-center align-items-center">
        <h3>Login</h3>
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
                    <Form className="d-flex flex-column align-items-center">
                        <div>
                            <label className="fs-4" htmlFor="username">Username:</label>
                            <Field type='username' name='username'/>
                            <ErrorMessage name='username' component='div'/>
                            <label className="fs-4 ps-3" htmlFor="password">Password:</label>
                            <Field type='password' name='password'/>
                            <ErrorMessage name='password' component='div'/> 
                        </div>
                            <button className="my-4" id="loginFormSubmitButton" type='submit' disabled={isSubmitting}>Login</button>
                    </Form>
                )}

        </Formik>
    </div>
)
}

export default LoginForm;