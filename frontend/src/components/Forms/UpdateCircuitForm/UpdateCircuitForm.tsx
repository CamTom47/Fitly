import React from "react";
import { Formik, Field, ErrorMessage, Form, FormikHelpers, FormikErrors } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { updateCircuit } from "../../../slices/circuitsSlice";
import { selectExercises } from "../../../slices/exercisesSlice";
import "./UpdateCircuitForm.css";

interface FormValues {
	sets: number;
	reps: number;
	weight: number;
	restPeriod: number;
	intensity: string;
	exercise: number | undefined;
}

interface FormProps {
	circuit: {
		id: number;
		sets: number;
		reps: number;
		weight: number;
		exerciseId: number;
		restPeriod: number;
		intensity: string;
		workoutId: number;
	};
	toggle: () => void;
}

interface Circuit {
	sets: number;
	reps: number;
	weight: number;
	restPeriod: number;
	intensity: string;
	exercise: number | undefined;
}

const UpdateCircuitForm = ({ toggle, circuit }: FormProps): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const exercises = useAppSelector(selectExercises);
	let exercise = exercises.filter((exercise) => exercise.id === circuit.exerciseId);

	const exerciseOptionComponents = exercises.map((exercise) => <option value={exercise.id}>{exercise.name}</option>);

	return (
		<Formik
			validateOnChange={false}
            validateOnBlur={false}
			initialValues={{
				sets: circuit.sets,
				reps: circuit.reps,
				weight: circuit.weight,
				restPeriod: circuit.restPeriod,
				intensity: circuit.intensity,
				exercise: exercise.id,
			}}
			validate={(values: FormValues) => {
				const errors: FormikErrors<FormValues> = {};
				if (!values.sets) {
					errors.sets = "Sets Required";
				}
				if (!values.reps) {
					errors.reps = "Reps Required";
				}
				if (!values.restPeriod) {
					errors.restPeriod = "restPeriod Required";
				}
				if (!values.intensity) {
					errors.intensity = "Intensity Required";
				}
				if (!values.exercise) {
					errors.exercise = "Exercise Required";
				}
				return errors;
			}}
			onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
				setTimeout(async () => {
					dispatch(
						updateCircuit({
							circuitId: circuit.id,
							sets: values.sets,
							reps: values.reps,
							weight: values.weight,
							restPeriod: values.restPeriod,
							intensity: values.intensity,
							exerciseId: Number(values.exercise),
							workoutId: circuit.workoutId,
						})
					);

					toggle();
					setSubmitting(false);
				}, 400);
			}}>
			{({ isSubmitting }) => (
				<div className='UpdateCircuitForm-container'>
					<div className='UpdateCircuitForm-body'>
						<div className='UpdateCircuitForm-content'>
							<h5>Circuit Information</h5>
							<Form className='FormContentInput'>
								<div className='FormContentInputDiv'>
									<label htmlFor='sets'>Sets:</label>
									<Field className='FormInput' type='number' name='sets' />
									<ErrorMessage name='sets' component='div' />
								</div>
								<div className='FormContentInputDiv'>
									<label htmlFor='reps'>Reps:</label>
									<Field className='FormInput' type='number' name='reps' />
									<ErrorMessage name='reps' component='div' />
								</div>
								<div className='FormContentInputDiv'>
									<label htmlFor='weight'>Weight(lbs):</label>
									<Field className='FormInput' type='number' name='weight' />
									<ErrorMessage name='weight' component='div' />
								</div>
								<div className='FormContentInputDiv'>
									<label htmlFor='restPeriod'>Rest(Seconds):</label>
									<Field className='FormInput' type='number' name='restPeriod' />
									<ErrorMessage name='restPeriod' component='div' />
								</div>
								<div className='FormContentInputDiv'>
									<label htmlFor='intensity'>Intensity:</label>
									<Field className='FormInput' as='select' name='intensity'>
										<option value='low'>Low</option>
										<option value='medium'>Medium</option>
										<option value='high'>High</option>
									</Field>
									<ErrorMessage name='intensity' component='div' />
								</div>
								<div className='FormContentInputDiv'>
									<label htmlFor='exercise'>Exercise:</label>
									<Field className='FormInput' as='select' name='exercise'>
										{exerciseOptionComponents}
									</Field>
									<ErrorMessage name='exercise' component='div' />
								</div>
								<div className='FormContentInputDiv'>
									<button className='FormButton' onClick={toggle}>
										Cancel
									</button>
									<button className='FormButton' type='submit' disabled={isSubmitting}>
										Update Ciruit
									</button>
								</div>
							</Form>
						</div>
					</div>
				</div>
			)}
		</Formik>
	);
};

export default UpdateCircuitForm;
