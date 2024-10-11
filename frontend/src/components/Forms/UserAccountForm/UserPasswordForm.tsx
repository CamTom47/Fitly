import React from 'react';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
  FormikErrors,
  FormikHelpers,
} from 'formik';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { selectCurrentUser, updateUser } from '../../../slices/usersSlice';
import '../Forms.css';

interface FormValues {
  currentPassword: string;
  newPassword: string;
  confirmedPassword?: string;
}

interface FormProps {
  handleUserPasswordToggle: () => void;
}

const UserPasswordForm = ({
  handleUserPasswordToggle,
}: FormProps): React.JSX.Element => {
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={{
        currentPassword: '',
        newPassword: '',
        confirmedPassword: '',
      }}
      validate={(values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};
        if (!values.currentPassword) {
          errors.currentPassword = 'Current password required';
        }
        if (Number(!values.newPassword.length) > 6) {
          errors.newPassword = 'Password must be at least 6 characters long';
        }
        if (
          values.confirmedPassword &&
          values.newPassword !== values.confirmedPassword
        ) {
          errors.confirmedPassword = 'New passwords do not match';
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
          handleUserPasswordToggle();
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <div className="UserFormContent">
          <Form className="UserForm">
            <div className="UserFormContentInputDiv">
              <label htmlFor="currentPassword">Current Password:</label>
              <Field
                className="UserFormInput"
                type="password"
                name="currentPassword"
              />
            </div>
            <div style={{ color: 'red' }}></div>
            <div className="UserFormContentInputDiv">
              <label htmlFor="newPassword">New Password:</label>
              <Field
                className="UserFormInput"
                type="password"
                name="newPassword"
              />
            </div>
            <div style={{ color: 'red' }}></div>
            <div className="UserFormContentInputDiv">
              <label htmlFor="confirmedPassword">Re-enter Password:</label>
              <Field
                className="UserFormInput"
                type="password"
                name="confirmedPassword"
              />
            </div>
            <div style={{ color: 'red' }}></div>
            <div className="UserFormContentInputDiv">
              <button className="FormButton" onClick={handleUserPasswordToggle}>
                Cancel
              </button>
              <button
                className="FormButton"
                type="submit"
                disabled={isSubmitting}
              >
                Update Information
              </button>
            </div>
            <div className="UserAccountFormErrors">
              <ErrorMessage name="currentPassword" component="div" />
              <ErrorMessage name="newPassword" component="div" />
              <ErrorMessage name="confirmedPassword" component="div" />
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default UserPasswordForm;
