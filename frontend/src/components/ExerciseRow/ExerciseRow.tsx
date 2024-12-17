import React, { useCallback, useEffect, useState } from "react";
import { Formik, Field, ErrorMessage, Form, FormikHelpers, FormikErrors, FormikBag } from "formik";
import { equipmentCheckForExerciseUpdate } from "../../helpers/helpers";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { selectCurrentUser } from "../../slices/usersSlice";
import { updateExercise, selectExercises, findAllExercises } from "../../slices/exercisesSlice";
import { selectMuscleGroups } from "../../slices/muscleGroupsSlice";
import { findAllEquipments, selectEquipments } from "../../slices/equipmentsSlice";
import $ from "jquery";
import "./ExerciseRow.css";

interface Exercise {
	id: number;
	name: string;
	muscleGroup: number;
	equipmentId: number;
}
interface Equipment {
	id: number;
	name: string;
}

interface FormProps {
	exercise: Exercise;
	idx: number;
	select: (e) => void;
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

const ExerciseRow = ({ exercise, idx, select}: FormProps): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const equipments = useAppSelector(selectEquipments);
	const muscleGroups = useAppSelector(selectMuscleGroups);

	const muscleGroupSelections = muscleGroups.map((muscleGroup: MuscleGroup) => (
		<option value={muscleGroup.id}>{muscleGroup.name}</option>
	));

	const handleBlur = (e) => {
		if (e.target.value !== initialValues[e.target.name]) $(`#${exercise.id}SubmitButton`).click();
	};

	let equipment = equipments.filter((equipment) => equipment.id === exercise.equipmentId)[0]

	let initialValues = {
		name: exercise.name,
		muscleGroup: exercise.muscleGroup,
		equipment: equipment.name
	};

	return (
		<Formik
			initialValues={initialValues}
			validate={(values: FormValues) => {
				const errors: FormikErrors<FormValues> = {};
				if (!values.name) {
					errors.name = "Name Required";
				}
				if (!values.muscleGroup) {
					errors.muscleGroup = "Muscle Group Required";
				}
				if (!values.equipment) {
					errors.equipment = "Equipment Required";
				}
				return errors;
			}}
			onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
				setTimeout(async () => {
					setSubmitting(false);

					dispatch(
						updateExercise({
							exerciseId: exercise.id,
							name: values.name,
							muscleGroup: Number(values.muscleGroup),
							equipmentId: equipment.id,
						})
					);
				}, 400);
			}}>
			{({ isSubmitting }) => (
				<Form>
					<table className='UpdateExerciseRow-table'>
						<tr id={String(exercise.id)} onClick={select}>
							<td>{idx + 1}</td>
							<td>
								<Field onBlur={handleBlur} type='name' name='name' />
								<ErrorMessage className='UpdateExerciseRow-error' name='name' component='div' />
							</td>
							<td>
								<Field onBlur={handleBlur} as='select' name='muscleGroup'>
									{muscleGroupSelections}
								</Field>
								<ErrorMessage className='UpdateExerciseRow-error' name='muscleGroup' component='div' />
							</td>
							<td>
								<Field onBlur={handleBlur} type='equipment' name='equipment' />
								<ErrorMessage className='UpdateExerciseRow-error' name='equipment' component='div' />
							</td>
						</tr>
						<button type='submit' id={`${exercise.id}SubmitButton`} className='submitButton'></button>
					</table>
				</Form>
			)}
		</Formik>
	);
};

export default ExerciseRow;
