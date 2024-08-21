//functionality imports
import React, { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, Link, useFetcher } from "react-router-dom";
import UserContext from "../../context/UserContext";

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




const WorkoutDetail = () => {

    let navigate = useNavigate();
    let currentUser = useContext(UserContext).currentUser;

    const [workout, setWorkout] = useState({});
    const [circuits, setCircuits] = useState([]);
    const [showNewCircuitForm, setShowNewCircuitForm] = useState(false);
    const [showWorkoutUpdateForm, setShowWorkoutUpdateForm] = useState(false);
    const [category, setCategory] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    //parse the url to get the workout parameter that will be used to find the workout using the Fitly API
    //...workouts/2 => 2

    let urlArray = (((window.location.pathname).split('/')));
    let workoutId = parseInt(urlArray[urlArray.length-1])

    const getWorkoutAndCircuits = useCallback( async () => { 
        try{
            let workout = await FitlyApi.findWorkout({
                workout_id: workoutId
            });
            setWorkout(workout);

            let circuits = await FitlyApi.findAllCircuits({
                workout_id: workout.id});
                let filteredCircuits = circuits.filter( circuit => circuit.workout_id === workout.id)
                setCircuits(filteredCircuits)

                
            } catch (err){
                return err
            }
    }, [showNewCircuitForm, showWorkoutUpdateForm, isLoading]);
    
    useEffect( () => {
        setIsLoading(true);
        getWorkoutAndCircuits();
        findCategory();
        setIsLoading(false);
    }, [getWorkoutAndCircuits]);
    
    
        
    
    //function that updates the workouts in the data base. formData is passed as a arugment from the newCircuitForm.
    const updateWorkout = async (formData) => {
        try{
            await FitlyApi.updateWorkout(workout.id, formData)
            getWorkoutAndCircuits();
        } catch (err) {
            return err
        }
    }

   //remove a workout for the fitly database
   const removeWorkout = async () => {
        try{
            await FitlyApi.deleteWorkout(workout.id);
            navigate('/workouts')
        } catch(err){
            return err
        }
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

    //Circuit Methods

    const createCircuit = async (formData, exerciseId) => {

        //create new circuit
        const circuit = await FitlyApi.addCircuit(formData);
         
         // add exercise to new circuit
         await FitlyApi.addExerciseCircuit({
             circuit_id: circuit.id, 
             exercise_id: exerciseId
         });

         // //add circuit to workout
         await FitlyApi.addWorkoutCircuit({
             workout_id: workout.id,
             circuit_id: circuit.id
         });

         getWorkoutAndCircuits();
     }

    const updateCircuit = 
        async (formData) => {
            try{
                await FitlyApi.updateCircuit(formData);
                getWorkoutAndCircuits();
            } catch (err){
                return err
            }
        }

    const deleteCircuit = async (formData) => {
        try{
            await FitlyApi.deleteCircuit(formData);
            getWorkoutAndCircuits();
        } catch (err) {
            return err
        }
    }

    const findCategory = useCallback(async () => {
        try{
            let category = await FitlyApi.findCategory({category_id: workout.category});
            setCategory(category)
        } catch(err){
            return err
        }
}, [workout])

useEffect( () => {
    setIsLoading(true);
    findCategory();
    setIsLoading(false);
}, [findCategory]);


    const circuitComponents = circuits.map( circuit => (
        <div>
            <Circuit circuitId={circuit.id} updateCircuit={updateCircuit} deleteCircuit={deleteCircuit}/>
            <hr></hr>
        </div>
    ))

    return (isLoading)
    ? <LoadingComponent/>
    : ( 
    (showWorkoutUpdateForm) 
    ? <UpdateWorkoutForm workout={workout} updateWorkout={updateWorkout} handleToggle={toggleShowWorkoutUpdateForm}/>
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
                <button className="btn btn-danger" onClick={removeWorkout}>Delete Workout</button>
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
                    <hr className="w-100 mt-0"></hr>
            </CardText>
            {circuitComponents}
            <div className="d-flex flex-row justify-content-center align-items-center column-gap-3">
                <span>Add A Circuit</span>
                <FontAwesomeIcon type="button" icon={faSquarePlus} onClick={toggleShowNewCircuitForm}></FontAwesomeIcon>
            </div>
            { 
                (showNewCircuitForm)
                ? <NewCircuitForm workout={workout} createCircuit={createCircuit} toggleShowNewCircuitForm={toggleShowNewCircuitForm}/>
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