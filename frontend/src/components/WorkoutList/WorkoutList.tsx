import React, { useEffect, useState, useCallback } from 'react';
import WorkoutSummary from '../WorkoutSummary/WorkoutSummary';
import LoadingComponent from '../LoadingComponent/LoadingComponent';
import { v4 as uuid } from 'uuid';
import useToggle from '../../hooks/useToggle/useToggle';
import NewWorkoutForm from '../Forms/NewWorkoutForm/NewWorkoutForm';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { findAllWorkouts, selectWorkouts } from '../../slices/workoutsSlice';
import {
  findAllCategories,
  selectCategories,
} from '../../slices/categoriesSlice';
import { findAllCircuits } from '../../slices/circuitsSlice';

import './WorkoutList.css';

const WorkoutList = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const workouts = useAppSelector(selectWorkouts);
  const categories = useAppSelector(selectCategories);
  const [showCreateWorkoutForm, setShowCreateWorkoutForm] = useToggle();
  const [isLoading, setIsLoading] = useState(true);

  const getWorkoutInfo = useCallback(() => {
    dispatch(findAllWorkouts());
    dispatch(findAllCategories());
    dispatch(findAllCircuits());
    setIsLoading(false);
  }, [showCreateWorkoutForm]);

  useEffect(() => {
    getWorkoutInfo();
  }, [getWorkoutInfo]);

  const toggleCreateForm = () => {
    setShowCreateWorkoutForm();
  };

  const workoutSummaryComponents = workouts.map((workout) => (
    <WorkoutSummary key={uuid()} workout={workout} />
  ));

  const categoryFilterComponents = categories.map((category) => (
    <div className="WorkoutFilterDiv">
      <label htmlFor="CategoryFilter">{category.name}</label>
      <input
        className="filterButton"
        type="checkbox"
        name="CategoryFilter"
        value={category.name}
      />
    </div>
  ));

  return isLoading ? (
    <LoadingComponent />
  ) : showCreateWorkoutForm ? (
    <NewWorkoutForm toggleCreateForm={toggleCreateForm} />
  ) : (
    <div id="WorkoutListContainer">
      <div className="filterWorkoutDivider">
        <div className="filterWorkoutDividerInner">
          <div className="filtersection">
            <p>Category</p>
            <form className="FilterForm">{categoryFilterComponents}</form>
          </div>
          <div className="workoutsection">
            <div className="workouthead">
            <div className="searchbar">
                <form>
                  <label htmlFor="">Search:</label>
                  <input type="text" placeholder="Search For Exercise"></input>
                </form>
              </div>
              <button id="addWorkoutButton" onClick={toggleCreateForm}>+</button>
            </div>
            <div className="workoutbody">{workoutSummaryComponents}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkoutList;
