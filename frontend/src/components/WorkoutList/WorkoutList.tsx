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

import './WorkoutList.css'

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
        <div id="WorkoutListContainer">
            <div className="WorkoutListTitle">
                <h3>Workouts</h3>
            </div>
            <div className="filterworkoutdivider">
                <div className="filterworkoutdividerinner">
                <div className="filtersection">
                    filter placeholder
                </div>
                <div className="workoutsection">
                    <div className="workouthead">
                        <button onClick={toggleCreateForm}>Create New Workout</button>
                        <div className="searchbar">
                            <form>
                                <label htmlFor="">Search:</label>
                                <input type="text" placeholder="Search For Exercise"></input>
                            </form>
                        </div>
                    </div>
                    <div className="workoutbody">
                        {workoutSummaryComponents}
                    </div>
                </div>
                </div>
            </div>           
        </div>
        )
}

export default WorkoutList;

//container
//section title
//filterworkoutdivider
//filterworkoutdividerinner
//filtersection

//workoutsection
//workouthead
//searchbar
//workouthead2
//workoutbody
