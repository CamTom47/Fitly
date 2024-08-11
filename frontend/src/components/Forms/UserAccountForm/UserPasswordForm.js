import React, {useContext} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import UserContext from "../../../context/UserContext";


const UserPasswordForm = ({handleUserPasswordToggle}) => {

    const {currentUser, updateUser} = useContext(UserContext);


    return (
        <div>
            <button onClick={handleUserPasswordToggle}>Go Back</button>
            <Formik
                initialValues={{
                    currentPassword: '', 
                    newPassword: '', 
                    confirmedPassword: '', 
                    }}
                validate={values => {
                    const errors = {};
                    if (!values.currentPassword){ errors.currentPassword = 'Current password required'}
                    if (!values.newPassword.length > 6){ errors.newPassword = 'Password must be at least 6 characters long'}
                    if (values.confirmedPassword && values.newPassword !== values.confirmedPassword) {errors.confirmedPassword = 'New passwords do not match'}
                    return errors
                }}

                onSubmit={(values, { setSubmitting }) => {
                    setTimeout(() => {  
                        updateUser({password: values.confirmedPassword});                     
                        setSubmitting(false);
                        handleUserPasswordToggle();
                    }, 400)
                    
                }}
                >
                    {({isSubmitting}) => (
                        <Form>
                            <label htmlFor="currentPassword">Current Password:</label>
                            <Field type='password' name='currentPassword'/>
                            <ErrorMessage name='currentPassword' component='div'/>
                            <label htmlFor="newPassword">New Password:</label>
                            <Field type='password' name='newPassword'/>
                            <ErrorMessage name='newPassword' component='div'/>
                            <label htmlFor="confirmedPassword">Re-enter Password:</label>
                            <Field type='password' name='confirmedPassword'/>
                            <ErrorMessage name='confirmedPassword' component='div'/>
                            <button type='submit' disabled={isSubmitting}>Update Information</button>
                        </Form>
                    )}

            </Formik>
        </div>
    )

}

export default UserPasswordForm