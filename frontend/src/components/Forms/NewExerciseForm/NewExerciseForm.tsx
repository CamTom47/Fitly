//Hooks
import React from "react";
import { Formik, Field, ErrorMessage, Form, FormikHelpers, FormikErrors } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { selectCurrentUser } from "../../../slices/usersSlice";
import { addExercise, selectExercises } from "../../../slices/exercisesSlice";
import { selectMuscleGroups } from "../../../slices/muscleGroupsSlice";
import { selectEquipments } from "../../../slices/equipmentsSlice";
import useToggle from "../../../hooks/useToggle/useToggle";

//Functional
import FitlyApi from "../../../Api/FitlyApi";
import $ from "jquery";

//Styling
import "./NewExerciseForm.css";

interface Exercise {
	id: number;
	name: string;
	muscleGroup: number;
	equipmentId: number;
}
interface FormValues {
	name: string;
	muscleGroup: number;
	equipment: string;
}
interface Equipment {
	id: number;
	name: string;
}

interface MuscleGroup {
	id: number;
	name: string;
}

const NewExerciseForm = (): React.JSX.Element => {

	const dispatch = useAppDispatch();
	const muscleGroups = useAppSelector(selectMuscleGroups);
	const equipments = useAppSelector(selectEquipments);

	const checkCanSubmit = (values) => {
		if (values.name != "" && values.muscleGroup != 0 && values.equipment != "") {
			$(".NewExerciseFormButton").click();
		}
	};

	const muscleGroupComponents = muscleGroups.map((muscleGroup: MuscleGroup) => (
		<option value={muscleGroup.id}>{muscleGroup.name}</option>
	));

	const equipmentOptionComponents = equipments.map((equipment: Equipment) => (
		<option value={equipment.name}>{equipment.name}</option>
	));

	return (
		<div>
			<Formik
				validateOnBlur={false}
				validateOnChange={false}
				initialValues={{ name: "", muscleGroup: 0, equipment: "" }}
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

						let equipments: Equipment[] = await FitlyApi.findAllEquipments();
						let equipment = equipments.filter((equipment) => equipment.name === values.equipment)[0];

						dispatch(
							addExercise({
								name: values.name,
								muscleGroup: Number(values.muscleGroup),
								equipmentId: equipment.id,
							})
						);

						values.name = "";
						values.muscleGroup = 0;
						values.equipment = "";
					}, 400);
				}}>
				{({ isSubmitting, values }) => (
					<Form>
						<table className='NewExerciseForm-table'>
							<tr>
								<td className='NewExerciseFormSubmitButton' onClick={checkCanSubmit}>
									Add Exercise +{" "}
								</td>
								<td>
									<Field placeholder='Exercise Name' type='name' name='name' />
									<ErrorMessage className='NewExerciseForm-error' name='name' component='div' />
								</td>
								<td>
									<Field className='customSelect' placeholder='MuscleGroup' as='select' name='muscleGroup'>
										<option selected>Muscle Group</option>
										{muscleGroupComponents}
									</Field>
									<ErrorMessage className='NewExerciseForm-error' name='muscleGroup' component='div' />
								</td>
								<td>
									<Field
										onSelect={checkCanSubmit}
										id='select'
										as='select'
										placeholder='Equipment Name'
										type='equipment'
										name='equipment'>
										<option value=''> Select Equipment </option>
										{equipmentOptionComponents}
									</Field>
									<ErrorMessage className='NewExerciseForm-error' name='equipment' component='div' />
								</td>
							</tr>
							{<button className='NewExerciseFormButton' type='submit' disabled={isSubmitting} />}
						</table>
					</Form>
				)}
			</Formik>
		</div>
	);
};

export default NewExerciseForm;
