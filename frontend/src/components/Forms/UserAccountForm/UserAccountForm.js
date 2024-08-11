import React, {useContext} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import UserContext from "../../../context/UserContext";


const UserAccountForm = ({handleUserInfoToggle}) => {

    const {currentUser, updateUser} = useContext(UserContext);

    return (
        <div>
            <h1>Account Information</h1>
            <button onClick={handleUserInfoToggle}>Go Back</button>
            <Formik
                initialValues={{
                    first_name: currentUser.firstName,
                    last_name: currentUser.lastName,
                    email: currentUser.email
                    }}
                validate={values => {
                    const errors = {};
                    if (values.email){
                        if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)){
                            errors.email = 'Invalid Email Address'
                        }
                    }
                    return errors
                }}

                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {     
                        updateUser(values);                
                        setSubmitting(false);
                        handleUserInfoToggle()
                    }, 400)
                    
                }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <label htmlFor="first_name">First Name:</label>
                            <Field type='text' name='first_name'/>
                            <ErrorMessage name='first_name' component='div'/>
                            <label htmlFor="last_name">Last Name:</label>
                            <Field type='text' name='last_name'/>
                            <ErrorMessage name='last_name' component='div'/>
                            <label htmlFor="email">Email:</label>
                            <Field type='text' name='email'/>
                            <ErrorMessage name='email' component='div'/>
                            <button type='submit' disabled={isSubmitting}>Update Information</button>
                        </Form>
                    )}

            </Formik>
        </div>
    )

}

export default UserAccountForm