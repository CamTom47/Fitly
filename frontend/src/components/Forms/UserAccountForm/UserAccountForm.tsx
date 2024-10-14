import React from 'react';
import {
  Formik,
  Field,
  Form,
  ErrorMessage,
  FormikErrors,
  FormikHelpers,
} from 'formik';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { selectCurrentUser, updateUser } from '../../../slices/usersSlice';
import './UserAccountForm.css';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface FormProps {
  handleUserInfoToggle: () => void;
}

const UserAccountForm = ({
  handleUserInfoToggle,
}: FormProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);

  return (
    <Formik
      initialValues={{
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        email: currentUser.email || '',
      }}
      validate={(values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};
        if (values.email) {
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
            errors.email = 'Invalid Email Address';
          }
        }
        return errors;
      }}
      onSubmit={(
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
      ) => {
        setTimeout(() => {
          dispatch(
            updateUser({ username: currentUser.username, formData: values })
          );
          setSubmitting(false);
          handleUserInfoToggle();
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <div className="UserFormContainer">
          <Form className="UserForm">
            <div className="UserFormContentInputDiv">
              <label htmlFor="firstName">First Name:</label>
              <Field className="UserFormInput" type="text" name="firstName" />
            </div>
            <div className="UserFormContentInputDiv">
              <label htmlFor="lastName">Last Name:</label>
              <Field className="UserFormInput" type="text" name="lastName" />
            </div>
            <div className="UserFormContentInputDiv">
              <label htmlFor="email">Email:</label>
              <Field className="UserFormInput" type="text" name="email" />
            </div>
            <div className="UserFormContentInputDiv">
              <button className="UserFormButton" onClick={handleUserInfoToggle}>
                Cancel
              </button>
              <button
                className="UserFormButton"
                type="submit"
                disabled={isSubmitting}
              >
                Update Information
              </button>
            </div>
              <div className="UserAccountFormErrors">
                <ErrorMessage name="firstName" component="div" />
                <ErrorMessage name="lastName" component="div" />
                <ErrorMessage name="email" component="div" />
              </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default UserAccountForm;
