import React from 'react';
import {
  Formik,
  Field,
  ErrorMessage,
  Form,
  FormikHelpers,
  FormikErrors,
} from 'formik';
import { equipmentCheckForExerciseUpdate } from '../../../helpers/helpers';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import { selectCurrentUser } from '../../../slices/usersSlice';
import { updateExercise } from '../../../slices/exercisesSlice';
import { selectMuscleGroups } from '../../../slices/muscleGroupsSlice';
import './UpdateExerciseForm.css';

interface FormProps {
  toggle?: (() => void) | undefined;
  exercise: {
    id: number;
    name: string;
    muscleGroup: number;
  };
  equipment: {
    id: number | null;
    name: string | null;
  };
}

interface FormValues {
  name: string;
  muscleGroup: number;
  equipment: string;
}

interface MuscleGroup {
  id: number;
  name: string;
}

const UpdateExerciseForm = ({
  toggle,
  exercise,
  equipment,
}: FormProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(selectCurrentUser);
  const muscleGroups = useAppSelector(selectMuscleGroups);

  const muscleGroupSelections = muscleGroups.map((muscleGroup: MuscleGroup) => (
    <option value={muscleGroup.id}>{muscleGroup.name}</option>
  ));

  return (
    <Formik
      initialValues={{
        name: exercise.name,
        muscleGroup: exercise.muscleGroup,
        equipment: equipment.name,
      }}
      validate={(values: FormValues) => {
        const errors: FormikErrors<FormValues> = {};
        if (!values.name) {
          errors.name = 'Name Required';
        }
        if (!values.muscleGroup) {
          errors.muscleGroup = 'Muscle Group Required';
        }
        if (!values.equipment) {
          errors.equipment = 'Equipment Required';
        }
        return errors;
      }}
      onSubmit={(
        values: FormValues,
        { setSubmitting }: FormikHelpers<FormValues>
      ) => {
        setTimeout(async () => {
          setSubmitting(false);

          let equipmentId = await equipmentCheckForExerciseUpdate(
            values.equipment,
            currentUser.id
          );
          dispatch(
            updateExercise({
              exerciseId: exercise.id,
              name: values.name,
              muscleGroup: Number(values.muscleGroup),
              equipmentId: equipmentId,
            })
          );
          if (toggle) {
            toggle();
          }
        }, 400);
      }}
    >
      {({ isSubmitting }) => (
        <div className="FormModal">
          <Form className="UpdateExerciseForm">
            <div className="UpdateExerciseInputDiv">
              <label htmlFor="name">Exercise Name:</label>
              <Field
                className="UpdateExerciseFormInput"
                type="name"
                name="name"
              />
            </div>
            <div className="UpdateExerciseInputDiv">
              <label htmlFor="muscleGroup">Muscle Group:</label>
              <Field
                className="UpdateExerciseFormInput"
                as="select"
                name="muscleGroup"
              >
                {muscleGroupSelections}
              </Field>
            </div>
            <div className="UpdateExerciseInputDiv">
              <label htmlFor="equipment">Equipment:</label>
              <Field
                className="UpdateExerciseFormInput"
                type="equipment"
                name="equipment"
              />
            </div>
            <div className="UpdateExerciseInputDiv">
              <button className="FormButton" onClick={toggle}>
                Cancel
              </button>
              <button
                className="FormButton"
                type="submit"
                disabled={isSubmitting}
              >
                Register
              </button>
            </div>
            <div className="UpdateExerciseInputDiv">
              <ErrorMessage
                className="ErrorMessage"
                name="name"
                component="div"
              />
              <ErrorMessage
                className="ErrorMessage"
                name="muscleGroup"
                component="div"
              />
              <ErrorMessage
                className="ErrorMessage"
                name="equipment"
                component="div"
              />
            </div>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default UpdateExerciseForm;
