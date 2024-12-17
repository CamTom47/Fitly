import React, { useEffect, useState, useCallback } from "react";
import $ from "jquery";
import WorkoutSummary from "../WorkoutSummary/WorkoutSummary";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { v4 as uuid } from "uuid";
import useToggle from "../../hooks/useToggle/useToggle";
import NewWorkoutForm from "../Forms/NewWorkoutForm/NewWorkoutForm";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { findAllWorkouts, selectWorkouts } from "../../slices/workoutsSlice";
import { findAllCategories, selectCategories } from "../../slices/categoriesSlice";
import { findAllCircuits } from "../../slices/circuitsSlice";

import "./WorkoutList.css";

import { workoutFilter } from "../../helpers/filters";
import { findAllExercises } from "../../slices/exercisesSlice";

interface WorkoutQuery {
	category?: String;
	favorited?: Boolean;
}
interface WorkoutSortBy {
	name?: String;
	category?: String;
	timesCompleted?: Number;
	lastCompleted?: Date;
}

const WorkoutList = (): React.JSX.Element => {
	const initialQueryState = {};
	const initialSortByState = {};

	const dispatch = useAppDispatch();
	const workoutList = useAppSelector(selectWorkouts);
	const categories = useAppSelector(selectCategories);
	
	const [showCreateWorkoutForm, setShowCreateWorkoutForm] = useToggle();
	const [isLoading, setIsLoading] = useState(true);
	const [filterTerms, setFilterTerms] = useState<WorkoutQuery>(initialQueryState);
	const [searchTerm, setSearchTerm] = useState<String | null>(null);
	const [sortBy, setSortBy] = useState<{}>(initialSortByState);

	dispatch(findAllExercises);

	let workouts = workoutList.filter((workout) => {
		if (searchTerm) return workout.name.toLowerCase().includes(searchTerm.toLowerCase());
		else return workoutList;
	});

	useEffect(() => {
		dispatch(findAllCategories());
		dispatch(findAllCircuits());
	}, []);

	const getWorkoutInfo = useCallback( async () => {
		dispatch(findAllWorkouts({ filterBy: filterTerms, sortBy }));
		setIsLoading(false);
	}, [showCreateWorkoutForm, filterTerms, sortBy]);

	const handleFilter = (e) => {
		$(`input[name=${e.target.name}`).not(`input[value="${e.target.value}"]`).prop("checked", false);
		setFilterTerms(workoutFilter(filterTerms, e));
	};

	useEffect(() => {
		getWorkoutInfo();
	}, [getWorkoutInfo]);

	const toggleCreateForm = () => {
		setShowCreateWorkoutForm();
	};

	const workoutSummaryComponents = workouts.map((workout, idx) => (
		<WorkoutSummary key={uuid()} workoutNumber={idx} workout={workout} />
	));

	const categoryFilterComponents = categories.map((category) => (
		<div className='WorkoutFilterDiv'>
			<label htmlFor='categoryFilter'>{category.name}</label>
			<input
				id={category.id}
				className='filterButton'
				onClick={handleFilter}
				type='checkbox'
				name='categoryFilter'
				value={category.name}
			/>
		</div>
	));

	const favoriteFilterComponent = (
		<div className='WorkoutFilterDiv'>
			<label htmlFor='favoriteFilter'>Favorited</label>
			<input className='filterButton' onClick={handleFilter} type='checkbox' name='favoritedFilter' value='favorited' />
		</div>
	);

	const resetFilter = () => {
		setFilterTerms(initialQueryState);
		$(".filterButton").prop("checked", false);
	};

	const handleSearch = (e) => {
		setSearchTerm(e.target.value);
	};

	const handleSort = (e) => {
		let sortType = e.target.selectedOptions[0].dataset["type"];
		let sortObj = {}
		sortObj[sortType] = e.target.value
		setSortBy(sortObj);
	};

	return isLoading ? (
		<LoadingComponent />
	) : showCreateWorkoutForm ? (
		<NewWorkoutForm toggleCreateForm={toggleCreateForm} />
	) : (
		<div id='WorkoutListContainer'>
			<div className='filterWorkoutDivider'>
				<div className='filterWorkoutDividerInner'>
					<div className='filtersection'>
					{Object.keys(filterTerms).length !== 0 && <button onClick={resetFilter}>Clear Filter</button>}

						<p>Category</p>
						<form className='FilterForm'>{categoryFilterComponents}</form>
						<p>Favorites</p>
						<form className='FilterForm'>{favoriteFilterComponent}</form>
					</div>
					<div className='workoutsection'>
						<div className='workouthead'>
							<div className='searchbar'>
								<form>
									<input type='text' placeholder='Find Workout' onChange={handleSearch}></input>
								</form>
							</div>
							<div>
								<form>
									<select className="sortForm" onChange={handleSort} name='sort'>
										<option value=''>Sort By</option>
										<option data-type="name" value='nameAsc'>Workout Name A-Z</option>
										<option data-type="name" value='nameDesc'>Workout Name Z-A</option>
										<option data-type="category" value='categoryAsc'>Type Of Workout A-Z</option>
										<option data-type="category" value='categoryDesc'>Type Of Workout Z-A</option>
										<option data-type="timesCompleted" value='timeCompletedAsc'>Times Completed 0-9</option>
										<option data-type="timesCompleted" value='timeCompleteDesc'>Times Completed 9-0</option>
										<option data-type="lastCompleted" value='lastCompletedAsc'>Last Completed 0-9</option>
										<option data-type="lastCompleted" value='lastCompletedDesc'>Last Completed 9-0</option>
									</select>
								</form>
							</div>
							<button id='addWorkoutButton' onClick={toggleCreateForm}>
								+
							</button>
						</div>
						<table className='workoutTable'>
							<tr>
								<th></th>
								<th>#</th>
								<th>Workout Name</th>
								<th>Type Of Workout</th>
								<th>Times Completed</th>
								<th>Last Completed</th>
							</tr>
							{workoutSummaryComponents}
						</table>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WorkoutList;
