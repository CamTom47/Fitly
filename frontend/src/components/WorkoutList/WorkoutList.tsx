import React, { useEffect, useState, useCallback } from "react";
import $ from 'jquery';
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

interface WorkoutQuery {
	category?: string;
	favorited?: boolean;
}

const WorkoutList = (): React.JSX.Element => {
	const initialQueryState = {};
	const dispatch = useAppDispatch();
	const workouts = useAppSelector(selectWorkouts);
	const categories = useAppSelector(selectCategories);
	const [showCreateWorkoutForm, setShowCreateWorkoutForm] = useToggle();
	const [isLoading, setIsLoading] = useState(true);
	const [queryTerms, setQueryTerms] = useState<WorkoutQuery>(initialQueryState);

	useEffect(() => {
		dispatch(findAllCategories());
		dispatch(findAllCircuits());
	}, []);

	const getWorkoutInfo = useCallback(() => {
		dispatch(findAllWorkouts(queryTerms));
		setIsLoading(false);
	}, [showCreateWorkoutForm, queryTerms]);

	const handleFilter = (e) => {
		$('input[name="categoryFilter"').not(`input[value="${e.target.value}"]`).prop('checked', false);
		setQueryTerms(workoutFilter(queryTerms, e));
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
			<label htmlFor='categoryFilter'>Favorited</label>
			<input className='filterButton' onClick={handleFilter} type='checkbox' name='favoritedFilter' value='favorited' />
		</div>
	);

	const resetFilter = () => {
		setQueryTerms(initialQueryState)
		$('.filterButton').prop('checked', false)

	}

	return isLoading ? (
		<LoadingComponent />
	) : showCreateWorkoutForm ? (
		<NewWorkoutForm toggleCreateForm={toggleCreateForm} />
	) : (
		<div id='WorkoutListContainer'>
			<div className='filterWorkoutDivider'>
				<div className='filterWorkoutDividerInner'>
					<div className='filtersection'>
						<p>Category</p>
						<form className='FilterForm'>{categoryFilterComponents}</form>
						<p>Favorites</p>
						<form className='FilterForm'>{favoriteFilterComponent}</form>
					</div>
					<div className='workoutsection'>
						<div className='workouthead'>
							<div className='searchbar'>
								<form>
									<input type='text' placeholder='Find Exercise'></input>
								</form>
							</div>
							{Object.keys(queryTerms).length !== 0 && <button onClick={resetFilter}>Clear Filter</button>}
							<button id='addWorkoutButton' onClick={toggleCreateForm}>
								+
							</button>
						</div>
						<table className='workoutTable'>
							<tr>
								<th></th>
								<th>#</th>
								<th>Exercise Name</th>
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
