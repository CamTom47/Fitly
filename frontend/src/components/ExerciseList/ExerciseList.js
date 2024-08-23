import React, { useEffect, useState, useContext, useCallback, useMemo} from "react";

import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import FitlyApi from "../../Api/FitlyApi";
import WgerApi from "../../Api/WgerApi"
import ExerciseDetails from "../ExerciseDetails/ExerciseDetails";
import WgerExercise from "../WgerExercise/WgerExercise";
import UserContext from "../../context/UserContext";
import NewExerciseForm from "../Forms/NewExerciseForm/NewExerciseForm";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { v4 as uuid } from "uuid";

const ExerciseList = () => {
    const [userExercises, setUserExercises] = useState([]);
    const [wgerExercises, setWgerExercises] = useState([]);
    const [showUserExercises, setShowUserExercises] = useState(true);
    const [showWgerExercises, setShowWgerExercises] = useState(false);
    const [exerciseFormToggle, setExerciseFormToggle] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [muscleGroups, setMuscleGroups] = useState([]);
    const [equipments, setEquipments] = useState({});
    const [nextWgerCall, setNextWgerCall] = useState(null);
    const [previousWgerCall, setPreviousWgerCall] = useState(null);
    const [currentWgerCall, setCurrentWgerCall] = useState();


    const currentUser = useContext(UserContext);


    //Create a new exercise and add it to data base sing FitlyApi
    const createNewExercise = async (data) => {
        try{
            setIsLoading(true);
            const newExercise = await FitlyApi.createExercise(data);
            setUserExercises([...userExercises, newExercise])
            getExercises()
            setIsLoading(false);
        } catch(err){
            return err
        }
    };

 //Update an existing exercise. This method will be passed to all children Exercise components
 const updateExercise = async (exerciseId, data) => {
        try{
            setIsLoading(true)
            let updatedExercise = await FitlyApi.updateExercise(exerciseId, data);
            getExercises();
            setIsLoading(false)
        } catch(err){
            return err
        }
 };

 const deleteExercise = async (exercise_id) => {
    try{
        setIsLoading(true);
        await FitlyApi.deleteExercise(exercise_id);
        getExercises();
        setIsLoading(false);
    } catch(err){
        return err
    }
 }

    const getExercises = useCallback(async () => {
        setIsLoading(true);
            if(showUserExercises === true){
                try{
                    const exercises = await FitlyApi.findAllExercises()
                    setUserExercises(exercises);
                    setWgerExercises([]);
                } catch(err){
                    return err
                }
            } else {
                try{
                    //Get a list of exercises not currently in the data base from the Wger Api    
                    if(currentWgerCall === undefined){
                        const exercises = await WgerApi.getAllExercises()
                    setCurrentWgerCall(exercises.request.responseURL)
                    setPreviousWgerCall(exercises.data.previous);
                    setNextWgerCall(exercises.data.next);
                    setWgerExercises(exercises.data.results);

                    } else {
                        const exercises = await WgerApi.getAllExercises(nextWgerCall)
                    setCurrentWgerCall(exercises.request.responseURL)
                    setPreviousWgerCall(exercises.data.previous);
                    setNextWgerCall(exercises.data.next);
                    setWgerExercises(exercises.data.results);
                    }
                    
                    setUserExercises([]);
                } catch(err){
                    return err
                }
            }
            setIsLoading(false);
        }, [createNewExercise, updateExercise, deleteExercise]);

     

    // cache the getExercsies function so that it is the same reference when used in the useEffect hook.
    // Upon component mounting, get userExercises state from FitlyApi and display on page.
    useEffect(() => { 
        getExercises();
    }, [showUserExercises, showWgerExercises, currentUser]);

    let getMuscleGroups = useCallback(async () => { 
        try{
            let muscleGroups = await FitlyApi.findAllMuscleGroups();
            setMuscleGroups(muscleGroups);
        } catch (err) {
            return err
        }
    }, [currentUser])

    useEffect(() => {
        getMuscleGroups();
    }, [currentUser])   

    //Map through userExercises state and create an exercise component from each item
    const userExerciseComponents = userExercises.map(e => (
        <Col xs="4" className="my-3">
            <ExerciseDetails exercise={e} key={uuid()} updateExercise={updateExercise} setEquipments={setEquipments} deleteExercise={deleteExercise}/>
        </Col>
    ))

    //Map through the wgerExercise state and creat an exercise component from each item
    const wgerExerciseComponents = wgerExercises.map( e => (
        <Col xs="4" className="my-3">
            <WgerExercise addExercise={createNewExercise} exercise={e} key={uuid()}>
                </WgerExercise></Col>
    ))

    //toggle state that show's user's workouts and wger API workouts
    const toggleUserExercises = () => {
        setShowWgerExercises(false);
        setShowUserExercises(true);
    }

    const toggleWgerExercises = () => {
        setShowUserExercises(false);
        setShowWgerExercises(true);
    }

    //toggle state that shows exercise update form
    const toggleExerciseFormVisibility = () => {
        setExerciseFormToggle( toggle => !toggle )
    }

    const getNextExercises = async () => {
        if(wgerExercises.next !== null) {
            try{
                const exercises = await WgerApi.getAllExercises(nextWgerCall)
                setPreviousWgerCall(exercises.data.previous);
                setNextWgerCall(exercises.data.next);
                setWgerExercises(exercises.data.results);
            } catch(err){
                return err
            }

        }
    }

    const getPreviousExercises = async () => {
        if(wgerExercises.previous !== null){
            try{
                const exercises = await WgerApi.getAllExercises(previousWgerCall)
                setPreviousWgerCall(exercises.data.previous);
                setNextWgerCall(exercises.data.next);
                setWgerExercises(exercises.data.results);
            }catch(err){
                return err
            }
        }
    }

    if(exerciseFormToggle) return <NewExerciseForm addExercise={createNewExercise} toggle={toggleExerciseFormVisibility} muscleGroups={muscleGroups}/>

    return (
        (isLoading) 
    ? <LoadingComponent/>
    :
        <Container className="d-flex flex-column">
            <Nav>
                <div className="d-flex flex-row justify-content-between align-items-end flex-grow-1">
                    <h1 className="flex-shrink-1">Exercises</h1>
                    <NavItem>
                        <NavLink className="flex-shrink-1" onClick={toggleUserExercises}>
                            Saved Exercises
                        </NavLink>
                    </NavItem>
                    <NavItem>
                        <NavLink className="flex-shrink-sm-0" onClick={toggleWgerExercises}>
                            Find An Exercise
                        </NavLink>
                    </NavItem>
        
                </div>
            </Nav>

            <hr className="mt-0"></hr>
            <Row className="d-flex flex-shrink-1 justify-content-center">
                <button className="w-25 btn btn-secondary mx-0" onClick={toggleExerciseFormVisibility}>
                     Create Custom Exercise
                    </button>
            </Row>

            {
                (showUserExercises)
            ?   <Row >
                    {userExerciseComponents}
                </Row>
            :  <div>
                <Row>

                      {wgerExerciseComponents}
                 </Row>
                 <div className="d-flex justify-content-center column-gap-5">
                    <FontAwesomeIcon type="button" icon={faArrowLeft} onClick={getPreviousExercises}/>
                    <FontAwesomeIcon type="button" icon={faArrowRight} onClick={getNextExercises}/>
                 </div>
            </div> 
            }
        </Container>)
}

export default ExerciseList