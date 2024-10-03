import React, {useEffect, useState, useCallback} from "react";
import WorkoutSummary  from "../WorkoutSummary/WorkoutSummary"
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { v4 as uuid } from "uuid";
import useToggle from "../../hooks/useToggle/useToggle";
import NewWorkoutForm from "../Forms/NewWorkoutForm/NewWorkoutForm";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { 
    findAllWorkouts, 
    selectWorkouts,
 } from '../../slices/workoutsSlice';
import {findAllCategories} from '../../slices/categoriesSlice';
import {findAllCircuits} from '../../slices/circuitsSlice';

const WorkoutList = (): React.JSX.Element => {
    const dispatch = useAppDispatch();
    const workouts = useAppSelector(selectWorkouts);
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
        setShowCreateWorkoutForm()
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