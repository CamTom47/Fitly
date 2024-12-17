//Hooks
import React, { useRef } from "react";
import { Formik, Field, ErrorMessage, Form, FormikHelpers, FormikErrors } from "formik";
import { useAppDispatch, useAppSelector } from "../../../hooks/reduxHooks";
import { addEquipment } from "../../../slices/equipmentsSlice";
import { selectCurrentUser } from "../../../slices/usersSlice";

//Functional
import { equipmentCheckForExerciseUpdate } from "../../../helpers/helpers";

//Components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";

//Styling
import "./NewEquipmentForm.css";

interface FormValues {
	name: string;
}

interface FormProps {
	toggle: () => void;
}

const NewEquipmentForm = ({ toggle }: FormProps): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const currentUser = useAppSelector(selectCurrentUser);

	return (
		<Formik
			validateOnBlur={false}
			validateOnChange={false}
			initialValues={{ name: "" }}
			validate={(values: FormValues) => {
				const errors: FormikErrors<FormValues> = {};
				if (!values.name) {
					errors.name = "Name Required";
				}
				return errors;
			}}
			onSubmit={(values: FormValues, { setSubmitting }: FormikHelpers<FormValues>) => {
				setTimeout(async () => {
					const match = await equipmentCheckForExerciseUpdate(values.name, currentUser.id);
					console.log(match)

					if (match !== true) {
						dispatch(addEquipment({ name: values.name, userId: currentUser.id }));
						toggle();
					} else {
						alert(`Equipment with name of ${values.name} already exists`);
						toggle();
						}
				}, 400);
			}}
			onReset={(e) => {
				console.log(e);
			}}>
			{({ isSubmitting }) => (
				<Form className='NewEquipmentForm'>
					<Field placeholder='New Equipment Name' type='name' name='name' />
					<ErrorMessage className='NewEquipmentForm-error' name='name' component='div' />
					<div>
						<button onClick={toggle}>
							<FontAwesomeIcon type='button' icon={faX} />
						</button>
						<button>
							<FontAwesomeIcon type='button' icon={faCheck} />
						</button>
					</div>
				</Form>
			)}
		</Formik>
	);
};

export default NewEquipmentForm;
