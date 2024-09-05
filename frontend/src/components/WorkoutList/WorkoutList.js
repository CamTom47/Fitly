import React, {useEffect, useState, useCallback, useContext} from "react";
import FitlyApi from "../../Api/FitlyApi"
import WorkoutSummary  from "../WorkoutSummary/WorkoutSummary"
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import NewWorkoutForm from "../Forms/NewWorkoutForm/NewWorkoutForm";
import UserContext from "../../context/UserContext";

//custom hooks
import useToggle from "../../hooks/useToggle/useToggle";

/**
 * WorkoutList Component => returns a user's list of workouts
 * 
 * state: workouts => array of workouts
 * 
 * props: none
 */

const WorkoutList = () => {

    const navigate = useNavigate();
    let currentUser = useContext(UserContext).currentUser;

    //Check if user is logged in. If not navigate back to the login page
    // useEffect(() => {
    //     if(currentUser === null) {
    //         navigate('/')
    //     }
    // }, [])
    
    const [workouts, setWorkouts] = useState([]);
    const [showCreateWorkoutForm, setShowCreateWorkoutForm] = useToggle();

    const callWorkouts = useCallback(async () => {
            try{
                    const workouts = await FitlyApi.findAllWorkouts();
                    setWorkouts(workouts);
            } catch(err){
                return err
            }
        } , [showCreateWorkoutForm]
    ) 

    useEffect( () => {
        callWorkouts();
    }, [callWorkouts])
    
    
    const toggleCreateForm = () => { 
        setShowCreateWorkoutForm( showCreateWorkoutForm => !showCreateWorkoutForm)
    }

    return (showCreateWorkoutForm)
    ? <NewWorkoutForm toggleCreateForm={toggleCreateForm}/>
    : ( 
        <div className="d-flex justify-content-center">
            <div className="d-flex align-items-center flex-column w-75">
                <h3>Workouts</h3>
                <hr className="w-100"></hr>
                <button className="btn btn-secondary" onClick={toggleCreateForm}>Create New Workout</button>
                <div className="d-flex flex-row justify-content-left flex-wrap column-gap-5 row-gap-5 pt-4">
                    {workouts.map(workout => (
                        <WorkoutSummary key={uuid()} workout={workout}/>)
                    )}
                </div>
            </div>
        </div>
        )
}

export default WorkoutList;