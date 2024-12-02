//functionality imports
import React, { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { v4 as uuid } from "uuid";
import $ from "jquery";

//styling imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlay } from "@fortawesome/free-solid-svg-icons";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import "./WorkoutDetail.css";

//component imports
import NewCircuitForm from "../Forms/NewCircuitForm/NewCircuitForm";
import UpdateWorkoutForm from "../Forms/UpdateWorkoutForm/UpdateWorkoutForm";
import FitlyApi from "../../Api/FitlyApi";
import ActiveWorkout from "../ActiveWorkout/ActiveWorkout";
import Timer from "../Timer/Timer";

import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { deleteWorkout, selectWorkouts } from "../../slices/workoutsSlice";
import { selectCircuits } from "../../slices/circuitsSlice";
import { selectCategories } from "../../slices/categoriesSlice";
import { selectExercises } from "../../slices/exercisesSlice";
import useToggle from "../../hooks/useToggle/useToggle";
import "..//Timer/Timer.css";

interface Workout {
	id: number;
	user_id: number;
	name: string;
	category: number;
	favorited: boolean;
}

interface Category {
	id: number;
	name: string;
}

interface Circuit {
	id: number;
	sets: number;
	reps: number;
	weight: number;
	rest_period: number;
	intensity: string;
	exerciseId?: number;
	workoutId?: number;
}

interface Exercise {
	id: number;
	name: string;
	muscle_group: number;
	equipment_id: number;
}

const WorkoutDetail = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	let navigate = useNavigate();
	const workoutId = useParams().workout_id;
	const workouts = useAppSelector(selectWorkouts);
	const workout = workouts.find((workout: Workout) => workout.id === Number(workoutId));
	const circuits = useAppSelector(selectCircuits);
	// .filter((circuit: Circuit) => circuit.workoutId === workout.id);
	const categories = useAppSelector(selectCategories);
	const category = categories.find((category: Category) => category.id === workout.category);
	const exercises = useAppSelector(selectExercises);

	const [showNewCircuitForm, setShowNewCircuitForm] = useState(false);
	const [showWorkoutUpdateForm, setShowWorkoutUpdateForm] = useState(false);
	const [workoutStarted, toggleWorkoutStarted] = useToggle(false);
	const [isLoading, setIsLoading] = useState(false);
	const [currentCircuitIdx, setCurrentCircuitIdx] = useState<number>(0);
	const [currentSet, setCurrentSet] = useState<number>(1);
	const [workoutCompleted, toggleWorkoutCompleted] = useToggle(false);

	//remove a workout for the fitly database
	const removeWorkout = () => {
		dispatch(deleteWorkout(Number(workoutId)));
		navigate("/workouts");
	};

	// Add/remove workout from favorites to allow for filtering
	const handleFavorite = async () => {
		try {
			setIsLoading(true);
			workout.favorited === false
				? await FitlyApi.updateWorkout(workout.id, { favorited: true })
				: await FitlyApi.updateWorkout(workout.id, { favorited: false });
			setIsLoading(false);
		} catch (err) {
			return err;
		}
	};

	const toggleShowWorkoutUpdateForm = (): void => {
		setShowWorkoutUpdateForm((showWorkoutUpdateForm) => !showWorkoutUpdateForm);
	};

	const toggleShowNewCircuitForm = (): void => {
		setShowNewCircuitForm((showNewCircuitForm) => !showNewCircuitForm);
	};

	let circuitComponents = circuits.map((circuit, idx) => {
		let exercise = exercises.find((exercise: Exercise) => exercise.id === circuit.exerciseId);
		return (
			<tr>
				<td>{idx + 1}</td>
				<td>{exercise.name}</td>
				<td>{circuit.sets}</td>
				<td>{circuit.reps}</td>
				<td>{circuit.weight}</td>
				<td>{circuit.restPeriod}</td>
			</tr>
		);
	});

	const activeWorkoutWorkoutCard = circuits.map((circuit) => {
		let exercise = exercises.find((exercise: Exercise) => exercise.id === circuit.exerciseId);
		return <ActiveWorkout circuit={circuit} exercise={exercise} currentSet={currentSet} />;
	});

	const calculateWorkoutTime = () => {
		let time = 0;

		for (let circuit of circuits) {
			time += circuit.reps * 3 * circuit.sets + circuit.sets * circuit.restPeriod;
		}
		return `~ ${Math.floor(time / 60)} Minutes`;
	};

	//Logic for circuit control

	const incrementSet = () => {
		setCurrentSet((currentSet) => currentSet + 1);
	};

	const incrementCircuit = () => {
		setCurrentCircuitIdx((currentCircuitIdx) => currentCircuitIdx + 1);
	};

	const checkCurrentSet = (e) => {
		if (e.target.innerHTML === "Next Set") {
			if (currentSet < circuits[currentCircuitIdx].sets) {
				incrementSet();
			} else {				
				if (currentCircuitIdx !== circuits[currentCircuitIdx].length) {
					console.log('oifhoifohidsaf')
					incrementCircuit();
					setCurrentSet(1);
				} else {
					toggleWorkoutCompleted();
				}
			}
		} else {
			if ((currentCircuitIdx === circuits.length - 1) && (currentSet  === circuits[currentCircuitIdx].sets))
				$("#NextSetButton").toggleClass("none");
		}
	};

	const handleNextSet = (e) => {
		checkCurrentSet(e);

		if (e.target.innerHTML !== "Next Set") e.target.innerHTML = "Next Set";
		else e.target.innerHTML = "Complete Set";
	};

	if (isLoading) {
		return <LoadingComponent />;
	} else if (showWorkoutUpdateForm) {
		return <UpdateWorkoutForm key={uuid()} workout={workout} handleToggle={toggleShowWorkoutUpdateForm} />;
	} else {
		return (
			<div>
				<button className='WorkoutDetailButton'>
					<Link className='LinkElement' to={`/workouts`}>
						Go Back
					</Link>
				</button>
				<button className='WorkoutDetailButton' onClick={removeWorkout}>
					Delete Workout
				</button>
				<div id='WorkoutDetailContainer'>
					<div className='WorkoutDetailContainerInner'>
						<div className='WorkoutDetailContainerHead'>
							<div className='WorkoutHeader'>
								{workout.favorited ? (
									<FontAwesomeIcon className='star' type='button' onClick={handleFavorite} icon={faStar} size='lg' />
								) : (
									<FontAwesomeIcon
										className='favoritedStar'
										type='button'
										onClick={handleFavorite}
										icon={faStar}
										size='lg'
									/>
								)}
								<h5>{workout.name}</h5>
								<button className='WorkoutDetailButton' onClick={toggleShowWorkoutUpdateForm}>
									Edit
								</button>
							</div>
							<div className='dividerSection2'>
								<div>
									<span>Type of Workout</span>
									<p>{category.name}</p>
								</div>
								<div>
									<span>Number of Circuits</span>
									<p>{circuits.length}</p>
								</div>
								<div>
									<span>Estimated Workout Time</span>
									<p>{calculateWorkoutTime()}</p>
								</div>
								<div>
									<span>Number of times Completed</span>
									<p>{workout.timesCompleted}</p>
								</div>
								<div>
									<span>Last Completed</span>
									{workout.lastCompleted ? workout.lastCompleted : "-"}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='LowerSection'>
					<div className='circuitSection'>
						<div className='circuitSectionHeader'>
							<h5>Circuits</h5>
							<button className=' WorkoutDetailButton faIcon' onClick={toggleShowNewCircuitForm}>
								Add New +
							</button>
						</div>
						<div>
							<table className='WorkoutTable'>
								<thead>
									<tr>
										<th>#</th>
										<th>Exercise</th>
										<th>Sets</th>
										<th>Reps</th>
										<th>Weight(lb)</th>
										<th>Rest(s)</th>
									</tr>
								</thead>
							</table>
						</div>
						<div className='tableContainer'>
							<table className='WorkoutTable'>
								<tbody>{circuitComponents}</tbody>
							</table>
						</div>
						{showNewCircuitForm === true && (
							<NewCircuitForm workout={workout} toggleShowNewCircuitForm={toggleShowNewCircuitForm} />
						)}
					</div>
					<div className='ActiveWorkout-Container'>
						{workoutStarted === false && (
							<div className='ActiveWorkout-WorkoutStarter'>
								<p>Start Workout</p>
								<FontAwesomeIcon
									className='playButton'
									type='button'
									onClick={toggleWorkoutStarted}
									icon={faPlay}
									size='xl'
								/>
							</div>
						)}
						{workoutStarted === true && (
							<div className='ActiveWorkout'>
								<Timer restPeriod={circuits[currentCircuitIdx].restPeriod} />
								<div className='ActiveWorkout-buttonContainer'>
									<button id='NextSetButton' className='ActiveWorkout-button' onClick={handleNextSet}>
										Complete Set
									</button>
									<button className='ActiveWorkout-button'>Finish Workout</button>
								</div>
								{activeWorkoutWorkoutCard[currentCircuitIdx]}
							</div>
						)}
					</div>
				</div>
			</div>
		);
	}
};

export default WorkoutDetail;
