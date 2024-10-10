import React, { useContext } from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  withFormik,
  FormikProps,
  FormikErrors,
  FormikHelpers,
} from 'formik';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser, signup } from '../../../slices/usersSlice';
import { useAppSelector, useAppDispatch } from '../../../hooks/reduxHooks';

import './SignupForm.css';

/**
 * SignupForm Component: Validates a user's input and registers them in Fitly's database
 * State: currentUser
 * Props: none
 */

interface FormValues {
  username: string;
  password: string;
}

const SignupForm = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUser = useAppSelector(selectCurrentUser);

  if (currentUser !== null) navigate('/');

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      validate={(values: FormValues) => {
        let errors: FormikErrors<FormValues> = {};
        if (!values.username) {
          errors.username = 'Username Required';
        }
        if (!values.password) {
          errors.password = 'Password Required';
        }
        if (Number(!values.password.length) > 6) {
          errors.password = 'Password must be at least 6 characters long';
        }
        return errors;
      }}
      onSubmit={(
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
      ) => {
        setTimeout(() => {
          dispatch(signup(values));
          setSubmitting(false);
          localStorage.setItem('isAuthenticated', 'true');
          navigate('/');
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <div id="SignupFormContainer">
          <h3>Sign up today with just a username and password</h3>
          <Form className="SignupForm">
            <div className="FormContent">
              <div className="InputSection">
                <label htmlFor="username">Username:</label>
                <Field className="SignupFormInput" type="username" name="username" />
              </div>
              <div className="InputSection">
                <label htmlFor="password">Password:</label>
                <Field className="SignupFormInput" type="password" name="password" />
              </div>
              <div className="InputSection">
                <button type="submit" disabled={isSubmitting}>
                  Sign Up
                </button>
              </div>
              <div className="ErrorSection">
                <ErrorMessage className='SignupFormError' name="username" component="div" />
                <ErrorMessage className='SignupFormError' name="password" component="div" />
              </div>
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default SignupForm;
