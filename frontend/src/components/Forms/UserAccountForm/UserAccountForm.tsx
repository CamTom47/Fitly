import React from "react";
import {Formik, Field, Form, ErrorMessage, FormikErrors, FormikHelpers} from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { selectCurrentUser, updateUser } from '../../../slices/usersSlice'
import '../Forms.css'

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
                            <div className="FormContent">
                                <Form className="FormContentInput">
                                    <div className="FormContentInputDiv">
                                            <label htmlFor="firstName">First Name:</label>
                                            <Field className="FormInput" type='text' name='firstName'/>
                                            <ErrorMessage name='firstName' component='div'/>
                                    </div>

                                    <div className="FormContentInputDiv">
                                            <label htmlFor="lastName">Last Name:</label>
                                            <Field className="FormInput" type='text' name='lastName'/>
                                            <ErrorMessage name='lastName' component='div'/>
                                    </div>

                                    <div className="FormContentInputDiv">
                                            <label htmlFor="email">Email:</label>
                                            <Field className="FormInput" type='text' name='email'/>
                                            <ErrorMessage name='email' component='div'/>
                                    </div>

                                    <div className="FormContentInputDiv">
                                        <button className="FormButton" onClick={handleUserInfoToggle}>Cancel</button>
                                        <button className="FormButton" type='submit' disabled={isSubmitting}>Update Information</button>
                                    </div>
                                </Form>
                            </div>
                    )}
            </Formik>
    )

}

export default UserAccountForm