//functionality imports
import React, { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate, Link, useFetcher } from "react-router-dom";
import UserContext from "../../context/UserContext";

//styling imports
import { Card, CardBody, CardText, CardTitle, ListGroup, ListGroupItem, Button} from "reactstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTrash, faSquarePlus } from '@fortawesome/free-solid-svg-icons'

//component imports
import NewCircuitForm from "../Forms/NewCircuitForm/NewCircuitForm";
import UpdateWorkoutForm from "../Forms/UpdateWorkoutForm/UpdateWorkoutForm"
import Circuit from "../../components/Circuit/Circuit";
import FitlyApi from "../../Api/FitlyApi";




const WorkoutDetail = () => {

    let navigate = useNavigate();
    let currentUser = useContext(UserContext).currentUser;

    // useEffect(() => {
    //     if(currentUser === null){
    //         navigate('/');
    //     }
    // })

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
    }, [showNewCircuitForm, showWorkoutUpdateForm]);
    
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
            (workout.favorited === false)
                ? await FitlyApi.updateWorkout(workout.id, {favorited: true})
                : await FitlyApi.updateWorkout(workout.id, {favorited: false})
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
        <Card>
            <Circuit circuitId={circuit.id} updateCircuit={updateCircuit} deleteCircuit={deleteCircuit}/>
        </Card>
    ))

    return (isLoading)
    ? <p>Page is Loading</p>
    : ( 
    (showWorkoutUpdateForm) 
    ? <UpdateWorkoutForm workout={workout} updateWorkout={updateWorkout} handleToggle={toggleShowWorkoutUpdateForm}/>
    :(
        <div>
            <Button color='dark'>
                <Link to={`/workouts`} style={{textDecoration: "none"}}>
                    Back to Workouts
                </Link>
            </Button>
            <Button onClick={toggleShowWorkoutUpdateForm}>
                Edit Workout Information
            </Button>
        <Card className="my-2">
        <CardTitle>{workout.name}</CardTitle>
            <FontAwesomeIcon type="button" onClick={handleFavorite} icon={faStar}/>
            <FontAwesomeIcon type="button" onClick={removeWorkout} icon={faTrash}/>
        <CardBody>
            <CardText>
                Type of Workout:{category.name}
            </CardText>          
        </CardBody>
    </Card>
    <Card>
        <CardBody>

            <CardText>
                    Circuits
            </CardText>
            {circuitComponents}
            <FontAwesomeIcon type="button" icon={faSquarePlus} onClick={toggleShowNewCircuitForm}></FontAwesomeIcon>
            { 
                (showNewCircuitForm)
                ? <NewCircuitForm workout={workout} createCircuit={createCircuit} toggleShowNewCircuitForm={toggleShowNewCircuitForm}/>
                : null
                }
            
        </CardBody>
    </Card>
        </div>
    )
)

}

export default WorkoutDetail;