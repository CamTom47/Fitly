import React, { useEffect, useState } from "react";
import UpdateExerciseForm from "../ExerciseRow/ExerciseRow";
import { equipmentMatch } from "../../helpers/helpers";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { selectMuscleGroups } from "../../slices/muscleGroupsSlice";
import { deleteExercise, selectExercises } from "../../slices/exercisesSlice";

import "./ExerciseDetails.css";

/**
 * Exercise component
 *
 * State: toggleExerciseUpdateForm, equipment, muscleGroup
 *
 * Props: updateExercise, exercise
 */

interface Exercise {
	id: number;
	name: string;
	muscleGroup: number;
	equipmentId: number;
}

interface MuscleGroup {
	id: number;
	name: string;
}

interface Equipment {
	id: number | null;
	name: string | null;
}

interface ExerciseDetailProps {
	exercise: Exercise;
	idx: number;
}

const initial_equipment_state: Equipment = {
	id: null,
	name: null,
};

const ExerciseDetails = ({ exercise, idx }: ExerciseDetailProps): React.JSX.Element => {
	const dispatch = useAppDispatch();
	const muscleGroups = useAppSelector(selectMuscleGroups);
	const muscleGroup: MuscleGroup = muscleGroups.filter(
		(muscleGroup: MuscleGroup) => muscleGroup.id === exercise.muscleGroup
	)[0];
	const [toggleExerciseUpdateForm, setToggleExerciseUpdateForm] = useState(false);
	const [equipment, setEquipment] = useState(initial_equipment_state);

	const muscleGroupSelections = muscleGroups.map((muscleGroup: MuscleGroup) => (
		<option value={muscleGroup.id}>{muscleGroup.name}</option>
	));

	//use the exercise equipment id to match a the name of a the respective equipment from the database.
	useEffect(() => {
		const matchEquipment = () => {
			equipmentMatch(exercise.equipmentId)
				.then((data) => {
					setEquipment(data);
				})
				.catch((err) => err);
		};
		matchEquipment();
	}, []);

	const handleEditClick = () => {
		setToggleExerciseUpdateForm((toggleExerciseUpdateForm) => !toggleExerciseUpdateForm);
	};

	const handleDeleteClick = () => {
		dispatch(deleteExercise(exercise.id));
	};

	return (
		<tr className='ExerciseDetail-row'>
			<td>{idx + 1}</td>
			<td>
				<input value={exercise.name} />
			</td>
			<td>
				<select>{muscleGroupSelections}</select>
			</td>
			<td>
				<input value='fjofo' />
			</td>
		</tr>
	);
};

export default ExerciseDetails;

{
	/* {toggleExerciseUpdateForm && (
				<UpdateExerciseForm exercise={exercise} toggle={handleEditClick} equipment={equipment} />
			)} */
}

{
	/* <FontAwesomeIcon
							icon={faPencil}
							id='editButton'
							className='ExerciseDetailIcons'
							onClick={handleEditClick}
						/>
						<FontAwesomeIcon
							icon={faTrash}
							id='deleteButton'
							className='ExerciseDetailIcons'
							onClick={handleDeleteClick}
						/> */
}
