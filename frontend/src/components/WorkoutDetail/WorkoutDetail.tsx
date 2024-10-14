//functionality imports
import React, { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { v4 as uuid } from 'uuid'

//styling imports
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTrash, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import './WorkoutDetail.css'

//component imports
import NewCircuitForm from "../Forms/NewCircuitForm/NewCircuitForm";
import UpdateWorkoutForm from "../Forms/UpdateWorkoutForm/UpdateWorkoutForm"
import Circuit from "../Circuit/Circuit";
import FitlyApi from "../../Api/FitlyApi";

import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { deleteWorkout, selectWorkouts } from '../../slices/workoutsSlice';
import { selectCircuits, findAllCircuits } from '../../slices/circuitsSlice';
import { selectCategories } from '../../slices/categoriesSlice';


interface Workout{
    id: number,
    user_id: number,
    name: string,
    category: number,
    favorited: boolean,
}

interface Category{
    id: number,
    name: string
}

interface CircuitType {
    id: number,
    sets: number,
    reps: number,
    weight: number
    rest_period: number,
    intensity: string,
    exerciseId? : number,
    workoutId? : number
}

const WorkoutDetail = (): React.JSX.Element => {
    const dispatch = useAppDispatch();
    let navigate = useNavigate();
    const workoutId = useParams().workout_id;
    const workouts = useAppSelector(selectWorkouts);
    const workout = workouts.find( (workout: Workout) => workout.id === Number(workoutId));
    const circuits = useAppSelector(selectCircuits).filter( (circuit: CircuitType) => circuit.workoutId === workout.id);
    const categories = useAppSelector(selectCategories);
    const category = categories.find( (category: Category) => category.id === workout.category);
    const [showNewCircuitForm, setShowNewCircuitForm] = useState(false);
    const [showWorkoutUpdateForm, setShowWorkoutUpdateForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    //remove a workout for the fitly database
   const removeWorkout = () => {
        dispatch(deleteWorkout(Number(workoutId)))    
        navigate('/workouts')
    }

    // Add/remove workout from favorites to allow for filtering 
    const handleFavorite = async () => {
        try{
            setIsLoading(true);
            (workout.favorited === false)
                ? await FitlyApi.updateWorkout(workout.id, {favorited: true})
                : await FitlyApi.updateWorkout(workout.id, {favorited: false})
                setIsLoading(false);
        } catch(err){
            return err
        }
    }

    const toggleShowWorkoutUpdateForm = () : void =>{
        setShowWorkoutUpdateForm(showWorkoutUpdateForm => !showWorkoutUpdateForm)
    }

    const toggleShowNewCircuitForm = () : void => {
        setShowNewCircuitForm(showNewCircuitForm => !showNewCircuitForm);
    }

    const circuitComponents = circuits.map( circuit => (
            <Circuit key={uuid()} circuitId={circuit.id}/>
    ))

    return (isLoading)
    ? <LoadingComponent/>
    : ( 
    (showWorkoutUpdateForm) 
    ? <UpdateWorkoutForm key={uuid()} workout={workout} handleToggle={toggleShowWorkoutUpdateForm}/>
    :(
        <div  id="WorkoutDetailContainer">
            <div className="WorkoutDetailContainerInner">
                <div className="WorkoutDetailContainerHead">
                    <button>
                        <Link className="LinkElement" to={`/workouts`}>Back to Workouts</Link>
                    </button>
                    <div>
                        <button onClick={toggleShowWorkoutUpdateForm}>Edit Workout Information</button>
                        <button onClick={(removeWorkout)}>Delete Workout</button>
                    </div>
                </div>
                <div className="WorkoutDetailDivider">
                    <div className="dividerSection1">
                        { (workout.favorited)
                            ? <FontAwesomeIcon type="button" onClick={handleFavorite} icon={faStar} size="lg" style={{color: "#FFD43B"}}/>
                            : <FontAwesomeIcon type="button" onClick={handleFavorite} icon={faStar} size="lg"/>
                        }
                        <h3>{workout.name}</h3>  
                        <div className="dividerSection2">
                            <span>Type of Workout:</span>
                            <p>{category.name}</p>          
                        </div>
                    </div>

                </div>
                <div className="circuitSection">
                    <div className="dividerSection1">
                        <h3>Circuits</h3>
                        <FontAwesomeIcon className="faIcon" size="xl" type="button" icon={faSquarePlus} onClick={toggleShowNewCircuitForm}></FontAwesomeIcon>
                    </div>
                    { (showNewCircuitForm)
                    ? <NewCircuitForm workout={workout} toggleShowNewCircuitForm={toggleShowNewCircuitForm}/>
                    : null
                    }
                    <div className="CircuitList">
                        {circuitComponents}
                    </div>
                
                </div>
                
        </div>
    </div >
    )
)

}

export default WorkoutDetail;