import React, { useCallback, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectEquipments } from "../../slices/equipmentsSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import Timer from "../Timer/Timer";

import "./ActiveWorkout.css";

interface Workout {
	id: number;
	user_id: number;
	name: string;
	category: number;
	favorited: boolean;
}

interface Circuit {
	id: number;
	sets: number;
	reps: number;
	weight: number;
	restPeriod: number;
	intensity: string;
	exerciseId?: number;
	workoutId?: number;
}

interface Exercise {
	id: number;
	name: string;
	muscle_group: number;
	equipmentId: number;
}

interface ActiveWorkoutProps {
	circuit: Circuit;
	exercise: Exercise;
	currentSet: Number;
}

const ActiveWorkout = ({ exercise, circuit, currentSet }: ActiveWorkoutProps): React.JSX.Element => {
	let equipments = useAppSelector(selectEquipments);	
	const equipment = equipments.filter((equipment) => exercise.equipmentId === equipment.id)[0];
	
	const currentComponent = (
		<div className='ActiveWorkout-div'>
				<div>
					<h4>Exercise</h4>
					<p>{exercise.name}</p>
				</div>
				<div>
					<h4>Equipment</h4>
					<p>{equipment.name}</p>
				</div>
				<div>
					<h4>Set</h4>
					<p>{`${currentSet} / ${circuit.sets}`}</p>
				</div>
				<div>
					<h4>Reps</h4>
					<p>{circuit.reps}</p>
				</div>
				<div>
					<h4>Weight</h4>
					<p>{circuit.weight}</p>
				</div>
			</div>
	);

 	return  (
			<div className='ActiveWorkout-section'>{currentComponent}</div>
	)
}

export default ActiveWorkout
