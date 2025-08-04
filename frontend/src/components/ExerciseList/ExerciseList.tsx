//Hook Imports
import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import useToggle from "../../hooks/useToggle/useToggle";
import { selectExercises, findAllExercises, deleteExercise } from "../../slices/exercisesSlice";
import { findAllMuscleGroups, selectMuscleGroups } from "../../slices/muscleGroupsSlice";
import { findAllEquipments, selectEquipments } from "../../slices/equipmentsSlice";
import $ from "jquery";

//Module Imports
import { v4 as uuid } from "uuid";

//Component Imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import WgerApi from "../../Api/WgerApi";
import WgerExercise from "../WgerExercise/WgerExercise";
import NewExerciseForm from "../Forms/NewExerciseForm/NewExerciseForm";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import ExerciseRow from "../ExerciseRow/ExerciseRow";
import NewEquipmentForm from "../Forms/NewEquipmentForm/NewEquipmentForm";

// Styling Imports
import "./ExerciseList.css";

//Helper Imports
import { exerciseFilter } from "../../helpers/filters";

interface Exercise {
	id: number;
	name: string;
	muscleGroup: number;
	equipmentId: number;
}

interface WgerExercises {
	request: {
		responseURL: string | null;
	};
	data: {
		results: WgerExerciseObject[];
		previous: string;
		next: string;
	};
}

interface WgerExerciseObject {
	next: string;
	results: object;
	previous: string;
}

interface ExerciseQuery {
	equipmentId?: string;
	muscleGroup?: string;
}

/**
 * ExerciseList Component
 * 
 * State: wgerExercises
    showUserExercises
    showWgerExercises
    exerciseFormToggle
    isLoading
    nextWgerCall
    previousWgerCall
    currentWgerCall

    Props: none
 */

const ExerciseList = (): React.JSX.Element => {
	const initialQueryState = {};
	const initialSortByState = {};

	const dispatch = useAppDispatch();

	const [wgerExercises, setWgerExercises] = useState<WgerExerciseObject[]>([]);
	const [showUserExercises, toggleShowUserExercises] = useToggle(true);
	const [showWgerExercises, toggleShowWgerExercises] = useToggle(false);
	const [exerciseFormToggle, toggleExerciseFormToggle] = useToggle(false);
	const [isLoading, toggleIsLoading] = useToggle(false);
	const [nextWgerCall, setNextWgerCall] = useState<string | undefined>(undefined);
	const [previousWgerCall, setPreviousWgerCall] = useState<string | undefined>(undefined);
	const [currentWgerCall, setCurrentWgerCall] = useState<string | null>(null);
	const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
	const [creatingEquipment, toggleCreatingEquipment] = useToggle(false);
	const [filterBy, setFilterBy] = useState<ExerciseQuery>(initialQueryState);
	const [searchTerm, setSearchTerm] = useState<String | null>(null);
	const [sortBy, setSortBy] = useState<{}>(initialSortByState);

	let userExercises = useAppSelector(selectExercises);
	const muscleGroups = useAppSelector(selectMuscleGroups);
	const equipments = useAppSelector(selectEquipments);

	if (searchTerm !== null) {
		userExercises = userExercises.filter((exercise) => exercise.name.toLowerCase().includes(searchTerm?.toLowerCase()));
	}

	const getExerciseListInfo = useCallback(async () => {
		dispatch(findAllMuscleGroups());
		dispatch(findAllEquipments());
	}, [userExercises, filterBy, sortBy]);

	useEffect(() => {
		getExerciseListInfo();
	}, [getExerciseListInfo]);

	const getExercises = useCallback(async () => {
		toggleIsLoading();
		if (showUserExercises === true) {
			dispatch(findAllExercises({ filterBy, sortBy }));
			setWgerExercises([]);
		} else {
			try {
				//Get a list of exercises not currently in the data base from the Wger Api
				if (currentWgerCall === null) {
					const exercises = await WgerApi.getAllExercises();
					setCurrentWgerCall(exercises.request.responseURL);
					setPreviousWgerCall(exercises.data.previous);
					setNextWgerCall(exercises.data.next);
					setWgerExercises(exercises.data.results);
				} else {
					const exercises = await WgerApi.getAllExercises(nextWgerCall);
					setCurrentWgerCall(exercises.request.responseURL);
					setPreviousWgerCall(exercises.data.previous);
					setNextWgerCall(exercises.data.next);
					setWgerExercises(exercises.data.results);
				}
			} catch (err) {
				return err;
			}
		}
		toggleIsLoading();
	}, [showUserExercises, showWgerExercises, filterBy]);

	// cache the getExercsies function so that it is the same reference when used in the useEffect hook.
	// Upon component mounting, get userExercises state from FitlyApi and display on page.
	useEffect(() => {
		getExercises();
	}, [getExercises]);

	//Map through the wgerExercise state and creat an exercise component from each item
	const wgerExerciseComponents = wgerExercises.map((e) => (
		<div key={uuid()}>
			<WgerExercise exercise={e} key={uuid()} />
		</div>
	));

	//toggle state that show's user's workouts and wger API workouts
	const toggleExerciseView = (e) => {
		if (!e.target.className.includes("active")) {
			toggleShowWgerExercises();
			toggleShowUserExercises();
		}
	};

	//toggle state that shows exercise update form
	const toggleExerciseFormVisibility = () => {
		toggleExerciseFormToggle();
	};

	const getNextExercises = async () => {
		if (nextWgerCall !== null) {
			try {
				const exercises = await WgerApi.getAllExercises(nextWgerCall);
				setPreviousWgerCall(exercises.data.previous);
				setNextWgerCall(exercises.data.next);
				setWgerExercises(exercises.data.results);
			} catch (err) {
				return err;
			}
		}
	};

	const getPreviousExercises = async () => {
		if (previousWgerCall !== null) {
			try {
				const exercises = await WgerApi.getAllExercises(previousWgerCall);
				setPreviousWgerCall(exercises.data.previous);
				setNextWgerCall(exercises.data.next);
				setWgerExercises(exercises.data.results);
			} catch (err) {
				return err;
			}
		}
	};

	// Filter Components

	const handleFilter = (e) => {
		$(`input[name=${e.target.name}`).not(`input[value="${e.target.value}"]`).prop("checked", false);
		setFilterBy(exerciseFilter(filterBy, e));
	};

	const muscleGroupFilters = muscleGroups.map((muscleGroup) => (
		<div className='ExerciseFilterDiv'>
			<label htmlFor='muscleGroupFilter'>{muscleGroup.name}</label>
			<input
				id={muscleGroup.id}
				data-type=''
				onClick={handleFilter}
				className='filterButton'
				type='checkbox'
				name='muscleGroupFilter'
				value={muscleGroup.name}
			/>
		</div>
	));
	const equipmentFilters = equipments.map((equipment) => (
		<div className='ExerciseFilterDiv'>
			<label htmlFor='equipmentFilter'>{equipment.name}</label>
			<input
				id={equipment.id}
				onClick={handleFilter}
				className='filterButton'
				type='checkbox'
				name='equipmentFilter'
				value={equipment.name}
			/>
		</div>
	));

	const handleSelect = (e) => {
		setSelectedExercise(null);
		$(".selected").removeClass("selected");
		$(e.target.parentElement).addClass("selected");
		let test = userExercises.find((exercise: Exercise) => exercise.id == +e.target.parentElement.id);
		setSelectedExercise(test);
	};

	const handleDelete = () => {
		if (selectedExercise !== null) {
			dispatch(deleteExercise(selectedExercise.id));
			setSelectedExercise(null);
		}
	};

	const resetFilter = () => {
		setFilterBy(initialQueryState);
		$(".filterButton").prop("checked", false);
	};

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSort = (e) => {
		let sortType = e.target.selectedOptions[0].dataset["type"];
		let sortObj = {};
		sortObj[sortType] = e.target.value;
		setSortBy(sortObj);
	};

	const userExerciseComponents = userExercises.map((exercise: Exercise, idx: number) => (
		<ExerciseRow key={uuid()} exercise={exercise} idx={idx} select={handleSelect} />
	));

	return isLoading ? (
		<LoadingComponent />
	) : (
		<div className='ExerciseListContainer'>
			<div className='filterExerciseDivider'>
				<div className='filterExerciseDividerInner'>
					<div className='filtersection'>
						{Object.keys(filterBy).length !== 0 && <button onClick={resetFilter}>Clear Filters</button>}
						<p>Muscle Group</p>
						<form className='FilterForm'>{muscleGroupFilters}</form>
						<p>Equipment</p>
						<form className='FilterForm'>{equipmentFilters}</form>
					</div>
					<div className='exercisesection'>
						<div className='exercisehead'>
							<div className='searchbar'>
								<form onChange={handleSearch}>
									<input type='text' placeholder='Find Exercise'></input>
								</form>
							</div>
							<div>
								<div>
									<a onClick={toggleExerciseView}>
										<button className={showUserExercises ? "exercisebutton active" : "exercisebutton"}>
											Personal Exercises
										</button>
									</a>
									<a onClick={toggleExerciseView}>
										<button className={showWgerExercises ? "exercisebutton active" : "exercisebutton"}>
											Find New Exercise
										</button>
									</a>
								</div>
								<div>
									<form >
									<select className="sortForm" onChange={handleSort} name='sort'>
										<option value=''>Sort By</option>
										<option data-type="name" value='nameAsc'>Exercise Name A-Z</option>
										<option data-type="name" value='nameDesc'>Exercise Name Z-A</option>
									</select>
								</form>
								</div>

								<div className='ExerciseList-button-div'>
									{selectedExercise !== null && (
										<button className='ExerciseList-button' onClick={handleDelete}>
											Delete Exercise
										</button>
									)}
									{!creatingEquipment ? (
										<button className='ExerciseList-button' onClick={toggleCreatingEquipment}>
											Add Equipment
										</button>
									) : (
										<NewEquipmentForm toggle={toggleCreatingEquipment} />
									)}
								</div>
							</div>
						</div>

						{showUserExercises ? (
							<div>
								<table className='exerciseTable'>
									<tr>
										<th>#</th>
										<th>Exercise Name</th>
										<th>Muscle Group</th>
										<th>Equipment</th>
									</tr>
								</table>
								<NewExerciseForm />
								<div className='exerciselist-table-lower'>{userExerciseComponents}</div>
							</div>
						) : (
							<div id='wgerexercisesdiv'>
								<div className='exerciseTable'>{wgerExerciseComponents}</div>
								<div>
									<FontAwesomeIcon className='arrow' type='button' icon={faArrowLeft} onClick={getPreviousExercises} />
									<FontAwesomeIcon className='arrow' type='button' icon={faArrowRight} onClick={getNextExercises} />
								</div>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExerciseList;
