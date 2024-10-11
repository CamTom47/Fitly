import React, { useState } from 'react';
import { Formik, Field, ErrorMessage, Form, FormikErrors, FormikHelpers } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { addCircuit } from '../../../slices/circuitsSlice';
import { selectExercises } from '../../../slices/exercisesSlice';
import './NewCircuitForm.css';

interface FormValues {
  sets: number;
  reps: number;
  weight: number;
  restPeriod: number;
  intensity: string;
  exercise: number | undefined;
}

interface FormProps {
  workout: { id: number };
  toggleShowNewCircuitForm: () => void;
}

const NewCircuitForm = ({ workout, toggleShowNewCircuitForm }: FormProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const exercises = useAppSelector(selectExercises);

  const exerciseOptionComponents = exercises.map((exercise) => <option value={exercise.id}>{exercise.name}</option>);

  return (
    <Formik
      initialValues={{
        sets: 1,
        reps: 1,
        weight: 0,
        restPeriod: 0,
        intensity: 'Low',
        exercise: undefined,
      }}
      validate={(values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};
        if (!values.sets) {
          errors.sets = 'Sets Required';
        }
        if (!values.reps) {
          errors.reps = 'Reps Required';
        }
        if (!values.restPeriod) {
          errors.restPeriod = 'Rest Period Required';
        }
        if (!values.intensity) {
          errors.intensity = 'Intensity Required';
        }
        if (!values.exercise) {
          errors.exercise = 'Exercise Required';
        }
        return errors;
      }}
      onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
        setTimeout(async () => {
          dispatch(
            addCircuit({
              sets: values.sets,
              reps: values.reps,
              weight: values.weight,
              restPeriod: values.restPeriod,
              intensity: values.intensity,
              exerciseId: Number(values.exercise),
              workoutId: workout.id,
            })
          );

          toggleShowNewCircuitForm();
          setSubmitting(false);
        }, 400);
      }}>
      {({ isSubmitting }) => (
        <div className='FormModal'>
          <Form className='NewCircuitForm'>
            <div className='NewCircuitFormInputDiv'>
              <label htmlFor='sets'>Sets:</label>
              <Field className='NewCircuitFormInput' type='number' name='sets' />
            </div>
            <div className='NewCircuitFormInputDiv'>
              <label htmlFor='reps'>Reps:</label>
              <Field className='NewCircuitFormInput' type='number' name='reps' />
            </div>
            <div className='NewCircuitFormInputDiv'>
              <label htmlFor='weight'>Weight(lbs):</label>
              <Field className='NewCircuitFormInput' type='number' name='weight' />
            </div>
            <div className='NewCircuitFormInputDiv'>
              <label htmlFor='restPeriod'>Rest(Seconds):</label>
              <Field className='NewCircuitFormInput' type='number' name='restPeriod' />
            </div>
            <div className='NewCircuitFormInputDiv'>
              <label htmlFor='intensity'>Intensity:</label>
              <Field className='NewCircuitFormInput' as='select' name='intensity'>
                <option value='low'>Low</option>
                <option value='medium'>Medium</option>
                <option value='high'>High</option>
              </Field>
            </div>
            <div className='NewCircuitFormInputDiv'>
              <label htmlFor='exercise'>Exercise:</label>
              <Field className='NewCircuitFormInput' as='select' name='exercise'>
                <option value=''> - </option>
                {exerciseOptionComponents}
              </Field>
            </div>
            <div className='NewCircuitFormInputDiv'>
              <button className='FormButton' onClick={toggleShowNewCircuitForm}>
                Cancel
              </button>
              <button className='FormButton' type='submit' disabled={isSubmitting}>
                Add Circuit
              </button>
            </div>
            <div className='NewCircuitFormErrorDiv'>
              <ErrorMessage className='ErrorMessage' name='sets' component='div' />
              <ErrorMessage className='ErrorMessage' name='reps' component='div' />
              <ErrorMessage className='ErrorMessage' name='weight' component='div' />
              <ErrorMessage className='ErrorMessage' name='restPeriod' component='div' />
              <ErrorMessage className='ErrorMessage' name='intensity' component='div' />
              <ErrorMessage className='ErrorMessage' name='exercise' component='div' />
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default NewCircuitForm;
