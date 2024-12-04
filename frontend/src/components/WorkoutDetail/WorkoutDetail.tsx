//Hook imports
import React, { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { deleteWorkout, selectWorkouts, updateWorkout } from "../../slices/workoutsSlice";
import { selectCircuits } from "../../slices/circuitsSlice";
import { selectCategories } from "../../slices/categoriesSlice";
import { selectExercises } from "../../slices/exercisesSlice";
import useToggle from "../../hooks/useToggle/useToggle";

//Functional Imports
import $ from "jquery";
import moment from "moment";
import { v4 as uuid } from "uuid";

//Component imports
import NewCircuitForm from "../Forms/NewCircuitForm/NewCircuitForm";
import UpdateWorkoutForm from "../Forms/UpdateWorkoutForm/UpdateWorkoutForm";
import ActiveWorkout from "../ActiveWorkout/ActiveWorkout";
import Timer from "../Timer/Timer";

//Styling imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlay } from "@fortawesome/free-solid-svg-icons";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import "./WorkoutDetail.css";
import "..//Timer/Timer.css";
import ConfirmationCard from "../ConfirmationCard/ConfirmationCard";

interface Workout {
	id: number;
	user_id: number;
	name: string;
	category: number;
	favorited: boolean;
	lastCompleted: Date;
	timesCompleted: number;
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
	restPeriod: number;
	intensity: string;
	exerciseId?: number;
	workoutId?: number;
}

interface Exercise {
	id: number;
	name: string;
	muscleGroup: number;
	equipmentId: number;
}

const WorkoutDetail = (): React.JSX.Element => {
	const dispatch = useAppDispatch();
	let navigate = useNavigate();
	const workoutId = useParams().workout_id;
	const workouts = useAppSelector(selectWorkouts);
	const workout = workouts.filter((workout: Workout) => workout.id === Number(workoutId))[0];
	const circuits = useAppSelector(selectCircuits).filter((circuit: Circuit) => circuit.workoutId === workout.id);
	const categories = useAppSelector(selectCategories);
	const category = categories.find((category: Category) => category.id === workout.category);
	const exercises = useAppSelector(selectExercises);

	const [showNewCircuitForm, toggleShowNewCircuitForm] = useToggle();
	const [showWorkoutUpdateForm, toggleShowWorkoutUpdateForm] = useToggle();
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
			workout.favorited === false
				? dispatch(updateWorkout({ workoutId: workout.id, data: { favorited: true } }))
				: dispatch(updateWorkout({ workoutId: workout.id, data: { favorited: false } }));
		} catch (err) {
			return err;
		}
	};

	const calculateWorkoutTime = (circuits: Circuit[]) => {
		let time = 0;

		for (let circuit of circuits) {
			time += circuit.reps * 3 * circuit.sets + circuit.sets * circuit.restPeriod;
		}
		return `${Math.floor(time / 60)} Minutes`;
	};

	//Logic for circuit control

	const incrementSet = () => setCurrentSet((currentSet) => currentSet + 1);
	const incrementCircuit = () => setCurrentCircuitIdx((currentCircuitIdx) => currentCircuitIdx + 1);

	const checkCurrentSet = (e) => {
		//If #NextSetButton's text is Next Set, increment the current set if it is less than circuit set, else  increment circuit and set sets to 1
		if (e.target.innerHTML === "Next Set") {
			if (currentSet < circuits[currentCircuitIdx].sets) incrementSet();
			else {
				if (currentCircuitIdx !== circuits[currentCircuitIdx].length) {
					incrementCircuit();
					setCurrentSet(1);
				}
			}



			//if the user is on the last set of the last circuit hide the #NextSetButton and toggle workout completed state, adjusting the Timer UI.
		} else if (currentCircuitIdx === circuits.length - 1 && currentSet === circuits[currentCircuitIdx].sets) {
			$("#NextSetButton").toggleClass("none");
			toggleWorkoutCompleted();
		}
	};

	//Increment the set of the current circuit and change the innerHTML of the #NextSetButton, triggering the restTimer to start
	const handleNextSet = (e) => {
		checkCurrentSet(e);
		if (e.target.innerHTML !== "Next Set") e.target.innerHTML = "Next Set";
		else e.target.innerHTML = "Complete Set";
	};

	//When a user is completed with a workout, increment the number of times they've completed it and set a new lastCompleted date
	const recordWorkout = async () => {
		dispatch(
			updateWorkout({
				workoutId: workout.id,
				data: { lastCompleted: new Date(), timesCompleted: workout.timesCompleted + 1 },
			})
		);
		toggleWorkoutStarted();
	};

	//JSX Components

	const activeWorkoutWorkoutCard = circuits.map((circuit: Circuit) => {
		const exercise = exercises.find((exercise: Exercise) => exercise.id === circuit.exerciseId);
		return <ActiveWorkout key={uuid()} circuit={circuit} exercise={exercise} currentSet={currentSet} />;
	});

	const circuitComponents = circuits.map((circuit: Circuit, idx: number) => {
		const exercise: Exercise = exercises.find((exercise: Exercise) => exercise.id === circuit.exerciseId);
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
							<div className='WorkoutHeader-1'>
								{workout.favorited ? (
									<FontAwesomeIcon
										key={uuid()}
										className='star'
										type='button'
										onClick={handleFavorite}
										icon={faStar}
										size='lg'
									/>
								) : (
									<FontAwesomeIcon
										key={uuid()}
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
							<div className='WorkoutHeader-2'>
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
									<p>{calculateWorkoutTime(circuits)}</p>
								</div>
								<div>
									<span>Number of times Completed</span>
									<p>{workout.timesCompleted}</p>
								</div>
								<div>
									<span>Last Completed</span>
									{workout.lastCompleted ? moment(workout.lastCompleted).format("MM-DD-YYYY") : "-"}
								</div>
						</div>
				</div>

				<div className='LowerSection'>
					<div className='circuitSection'>
						<div className='circuitSectionHeader'>
							<h5>Circuits</h5>
							<button className=' WorkoutDetailButton' onClick={toggleShowNewCircuitForm}>
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
								<tbody>{circuitComponents}</tbody>
							</table>
						</div>
						{showNewCircuitForm === true && (
							<NewCircuitForm key={uuid()} workout={workout} toggleShowNewCircuitForm={toggleShowNewCircuitForm} />
						)}
					</div>
					<div className='ActiveWorkout-Container'>
						{workoutStarted === false && (
							<button className='ActiveWorkout-button' onClick={toggleWorkoutStarted}>
								Start Workout
							</button>
						)}
						{workoutStarted === true && (
							<div className='ActiveWorkout'>
								<Timer workoutCompleted={workoutCompleted} restPeriod={circuits[currentCircuitIdx].restPeriod} />
								<div className='ActiveWorkout-buttonContainer'>
									<button id='NextSetButton' className='ActiveWorkout-button' onClick={handleNextSet}>
										Complete Set
									</button>
									<button className='ActiveWorkout-button' onClick={toggleWorkoutCompleted}>
										Finish Workout
									</button>
								</div>
								{activeWorkoutWorkoutCard[currentCircuitIdx]}
							</div>
						)}
						{workoutCompleted === true && (
							<ConfirmationCard toggle={toggleWorkoutCompleted} confirm={recordWorkout} message={"Complete Workout?"} />
						)}
					</div>
				</div>
			</div>
		);
	}
};

export default WorkoutDetail;
