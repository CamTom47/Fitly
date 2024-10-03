import React, {useContext} from "react";
import {Formik, Form, Field, ErrorMessage, FormikErrors, FormikHelpers} from "formik";
import { Card } from "reactstrap";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import {
    selectCurrentUser,
    updateUser
} from '../../../slices/usersSlice'

interface FormValues{
    firstName: string,
    lastName: string,
    email: string
}

interface FormProps{
    handleUserInfoToggle: () => void
}

const UserAccountForm = ({handleUserInfoToggle}: FormProps): React.JSX.Element => {
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);

    return (
        <div className="d-flex flex-column align-items-center pb-5">
            <h3>User Account Information</h3>
            <Formik
                initialValues={{
                    firstName: currentUser.firstName || "",
                    lastName: currentUser.lastName || "",
                    email: currentUser.email || ""
                    }}
                validate={(values: FormValues) => {
                    const errors: FormikErrors<FormValues>= {};
                    if (values.email){
                        if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)){
                            errors.email = 'Invalid Email Address'
                        }
                    }
                    return errors
                }}

                onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
                    setTimeout(() => {     
                        dispatch(updateUser({username: currentUser.username, formData: values}));           
                        setSubmitting(false);
                        handleUserInfoToggle()
                    }, 400)
                    
                }}
                >
                    {({isSubmitting}) => (
                        <Form className="d-flex flex-column align-items-center">
                            <Card className="d-flex flex-column align-items-left row-gap-4 px-3 py-3">
                                <h5 className="d-flex justify-content-center">Account Information</h5>
                                <div className="d-flex justify-content-between">
                                        <label htmlFor="firstName">First Name:</label>
                                        <Field type='text' name='firstName'/>
                                        <ErrorMessage name='firstName' component='div'/>
                                </div>

                                <div className="d-flex justify-content-between">
                                        <label htmlFor="lastName">Last Name:</label>
                                        <Field type='text' name='lastName'/>
                                        <ErrorMessage name='lastName' component='div'/>
                                </div>

                                <div className="d-flex justify-content-between">
                                        <label htmlFor="email">Email:</label>
                                        <Field type='text' name='email'/>
                                        <ErrorMessage name='email' component='div'/>
                                </div>

                                <div className="d-flex flex-row column-gap-3">
                                    <button className="btn btn-danger" onClick={handleUserInfoToggle}>Cancel</button>
                                    <button className="btn btn-success" type='submit' disabled={isSubmitting}>Update Information</button>
                                </div>
                            </Card>
                        </Form>
                    )}

            </Formik>
        </div>
    )

}

export default UserAccountForm