import React, {useEffect, useState, useCallback, useContext} from "react";
import FitlyApi from "../../Api/FitlyApi"
import WorkoutSummary  from "../WorkoutSummary/WorkoutSummary"
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import useToggle from "../../hooks/useToggle/useToggle";
import NewWorkoutForm from "../Forms/NewWorkoutForm/NewWorkoutForm";
import { useDispatch, useSelector } from "react-redux";
import { 
    findWorkoutById, 
    findAllWorkouts, 
    updateWorkout, 
    selectWorkout, 
    selectWorkouts,
 } from '../../slices/workoutsSlice';
import {
    selectCurrentUser
} from '../../slices/usersSlice';

import {
    findAllCategories
} from '../../slices/categoriesSlice';

import {
    findAllCircuits
} from '../../slices/circuitsSlice';

const WorkoutList = () => {
    const dispatch = useDispatch();
    const workouts = useSelector(selectWorkouts);
    dispatch(findAllCategories());
    dispatch(findAllCircuits());
    
    const [showCreateWorkoutForm, setShowCreateWorkoutForm] = useToggle();
    const [isLoading, setIsLoading] = useState(true);
    
    const getWorkouts = useCallback(() => {
        dispatch(findAllWorkouts());
        setIsLoading(false);
    }, [showCreateWorkoutForm])

    useEffect(() => { 
        getWorkouts();
    }, [getWorkouts])
    

    const toggleCreateForm = () => { 
        setShowCreateWorkoutForm( showCreateWorkoutForm => !showCreateWorkoutForm)
    }
    
    const workoutSummaryComponents = workouts.map(workout => (
        <WorkoutSummary key={uuid()} workout={workout}/>)
    )
       

    return (isLoading) 
    ? <LoadingComponent/>
    :
    
    (showCreateWorkoutForm)
    ? <NewWorkoutForm toggleCreateForm={toggleCreateForm}/>
    : ( 
        <div className="d-flex justify-content-center">
            <div className="d-flex align-items-center flex-column w-75">
                <h3>Workouts</h3>
                <hr className="w-100"></hr>
                <button className="btn btn-secondary" onClick={toggleCreateForm}>Create New Workout</button>
                <div className="d-flex flex-row justify-content-left flex-wrap column-gap-5 row-gap-5 pt-4">
                    {workoutSummaryComponents}
                </div>
            </div>
        </div>
        )
}

export default WorkoutList;