import React from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikHelpers,
  FormikErrors,
} from 'formik';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import {
  userLogIn,
  selectCurrentUser,
  selectErrorMessage,
} from '../../../slices/usersSlice';

import './LoginForm.css';

interface FormValues {
  username: string;
  password: string;
}

const LoginForm = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(selectErrorMessage);
  const user = useAppSelector(selectCurrentUser);

  if (user !== null) navigate('/');

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validate={(values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};
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
          setSubmitting(false);
          dispatch(userLogIn(values));
          navigate('/');
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <Form className="LoginForm">
          <div className="LoginFormInputDiv">
            <label htmlFor="username">Username:</label>
            <Field className="LoginFormInput" type="username" name="username" />
          </div>
          <div className="LoginFormErrorDiv"></div>
          <div className="LoginFormInputDiv">
            <label htmlFor="password">Password:</label>
            <Field className="LoginFormInput" type="password" name="password" />
          </div>

          <div className="LoginFormInputDiv">
            <button
              className="LoginFormButton"
              type="submit"
              disabled={isSubmitting}
            >
              Login
            </button>
          </div>
          <div className="LoginFormErrorDiv">
            <ErrorMessage
              className="ErrorMessage"
              name="username"
              component="div"
            />
            <ErrorMessage
              className="ErrorMessage"
              name="password"
              component="div"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
