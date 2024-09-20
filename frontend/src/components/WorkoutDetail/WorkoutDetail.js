//functionality imports
import React, { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { createSelector } from 'reselect';
import { v4 as uuid } from 'uuid'

//styling imports
import { Card, CardBody, CardText, CardTitle, ListGroup, ListGroupItem, Button, Container} from "reactstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTrash, faSquarePlus } from '@fortawesome/free-solid-svg-icons'
import LoadingComponent from "../LoadingComponent/LoadingComponent";

//component imports
import NewCircuitForm from "../Forms/NewCircuitForm/NewCircuitForm";
import UpdateWorkoutForm from "../Forms/UpdateWorkoutForm/UpdateWorkoutForm"
import Circuit from "../../components/Circuit/Circuit";
import FitlyApi from "../../Api/FitlyApi";

import { useDispatch,useSelector } from "react-redux";

import { 
    deleteWorkout,
    selectWorkouts,
} from '../../slices/workoutsSlice';
import {
    selectCircuits,
    findAllCircuits

} from '../../slices/circuitsSlice';
import {
    selectCategories,
} from '../../slices/categoriesSlice';

const WorkoutDetail = () => {
    const dispatch = useDispatch();
    let navigate = useNavigate();
    const workoutId = useParams().workout_id;
    const workouts = useSelector(selectWorkouts);
    const workout = workouts.filter( workout => workout.id === +workoutId)[0];
    const circuits = useSelector(selectCircuits);
    const categories = useSelector(selectCategories);
    const category = categories.filter( category => category.id === workout.category)[0];
    
    const [showNewCircuitForm, setShowNewCircuitForm] = useState(false);
    const [showWorkoutUpdateForm, setShowWorkoutUpdateForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const getCircuits = useCallback(() => {
        dispatch(findAllCircuits())
    } , [])

    useEffect(() => {
        getCircuits()
    } , [getCircuits])


   //remove a workout for the fitly database
   const removeWorkout = () => {
        dispatch(deleteWorkout(workoutId))    
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

    const toggleShowWorkoutUpdateForm = () => {
        setShowWorkoutUpdateForm(showWorkoutUpdateForm => !showWorkoutUpdateForm)
    }

    const toggleShowNewCircuitForm = () => {
        setShowNewCircuitForm(showNewCircuitForm => !showNewCircuitForm);
    }

    const circuitComponents = circuits.map( circuit => (
        <div>
            <Circuit key={uuid()} circuitId={circuit.id}/>
        </div>
    ))

    return (isLoading)
    ? <LoadingComponent/>
    : ( 
    (showWorkoutUpdateForm) 
    ? <UpdateWorkoutForm key={uuid()} workout={workout} handleToggle={toggleShowWorkoutUpdateForm}/>
    :(
        <Container className="w-75 pt-3">
        <div>
            <div className="d-flex column-gap-3">
                <Button color='danger'>
                    <Link to={`/workouts`} style={{textDecoration: "none", color: "white"}}>
                        Back to Workouts
                    </Link>
                </Button>
                <Button onClick={toggleShowWorkoutUpdateForm}>
                    Edit Workout Information
                </Button>
            </div>

        <div>        
        <Card className="my-2 p-2 w-25">
            <div className="d-flex flex-row">
                <button className="btn btn-danger" onClick={(removeWorkout)}>Delete Workout</button>
                {
                    (workout.favorited)
                    ? <FontAwesomeIcon type="button" onClick={handleFavorite} icon={faStar} size="lg" style={{color: "#FFD43B"}}/>
                    : <FontAwesomeIcon type="button" onClick={handleFavorite} icon={faStar} size="lg"/>
                }
            </div>   
        <CardTitle className="fs-3" >{workout.name}</CardTitle>  
        <CardBody>
            <CardText>
                Type of Workout:{category.name}
            </CardText>          
        </CardBody>
    </Card>
    </div>
    <Card>
        <CardBody className="d-flex flex-grow-1 flex-column align-item-center row-gap-3">

            <CardText className="d-flex flex-column align-items-center fs-4">
                    Circuits
            </CardText>
            {circuitComponents}
            <div className="d-flex flex-row justify-content-center align-items-center column-gap-3">
                <span>Add A Circuit</span>
                <FontAwesomeIcon type="button" icon={faSquarePlus} onClick={toggleShowNewCircuitForm}></FontAwesomeIcon>
            </div>
            { 
                (showNewCircuitForm)
                ? <NewCircuitForm workout={workout} toggleShowNewCircuitForm={toggleShowNewCircuitForm}/>
                : null
                }
            
        </CardBody>
    </Card>
        </div>
    </Container>
    )
)

}

export default WorkoutDetail;