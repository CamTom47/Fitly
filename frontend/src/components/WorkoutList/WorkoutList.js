import React, {useEffect, useState, useCallback, useContext} from "react";
import FitlyApi from "../../Api/FitlyApi"
import WorkoutSummary  from "../WorkoutSummary/WorkoutSummary"
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import useToggle from "../../hooks/useToggle/useToggle";
import NewWorkoutForm from "../Forms/NewWorkoutForm/NewWorkoutForm";
import UserContext from "../../context/UserContext";

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
        <>
            <button onClick={toggleCreateForm}>Create New Workout</button>
            
            {workouts.map(workout => (
                <WorkoutSummary key={uuid()} workout={workout}/>)
            )}

        </>
        )
}

export default WorkoutList;