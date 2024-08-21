import React, {useContext} from "react";
import {Formik, Form, Field, ErrorMessage} from "formik";
import UserContext from "../../../context/UserContext";
import { Card } from "reactstrap";


const UserPasswordForm = ({handleUserPasswordToggle}) => {

    const {currentUser, updateUser} = useContext(UserContext);


    return (
        <div>
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
                        <Card className="d-flex flex-column justify-content-center px-3 py-2">
                            <h5 className="d-flex justify-content-center">Password Information</h5>
                            <Form className="d-flex flex-column align-items-center row-gap-4 pt-2">
                                <div className="d-flex flex-column align-items-left row-gap-4">
                                    <div className="d-flex justify-content-between column-gap-3">
                                        <label htmlFor="currentPassword">Current Password:</label>
                                        <Field type='password' name='currentPassword'/>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='currentPassword' component='div'/>
                                    </div>
                                    <div className="d-flex justify-content-between column-gap-3">
                                        <label htmlFor="newPassword">New Password:</label>
                                        <Field type='password' name='newPassword'/>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='newPassword' component='div'/>
                                    </div>
                                    <div className="d-flex justify-content-between column-gap-3">
                                        <label htmlFor="confirmedPassword">Re-enter Password:</label>
                                        <Field type='password' name='confirmedPassword'/>
                                    </div>
                                    <div style={{color: "red"}}>
                                        <ErrorMessage name='confirmedPassword' component='div'/>
                                    </div>
                                    <div className="d-flex flex-row column-gap-3 justify-content-center">
                                        <button className="btn btn-danger" onClick={handleUserPasswordToggle}>Cancel</button>
                                        <button className="btn btn-success" type='submit' disabled={isSubmitting}>Update Information</button>
                                    </div>
                                </div>
                            </Form>
                        </Card>
                    )}

            </Formik>
        </div>
    )

}

export default UserPasswordForm