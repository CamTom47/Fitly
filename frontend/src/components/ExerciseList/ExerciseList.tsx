import React, { useEffect, useState, useContext, useCallback, useMemo} from "react";

import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";
import WgerApi from "../../Api/WgerApi"
import ExerciseDetails from "../ExerciseDetails/ExerciseDetails";
import WgerExercise from "../WgerExercise/WgerExercise";
import NewExerciseForm from "../Forms/NewExerciseForm/NewExerciseForm";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight,faArrowLeft } from '@fortawesome/free-solid-svg-icons'

import { v4 as uuid } from "uuid";

import {
    selectExercises,
    findAllExercises
} from '../../slices/exercisesSlice'

import { findAllMuscleGroups } from '../../slices/muscleGroupsSlice';
import { findAllEquipments } from '../../slices/equipmentsSlice';
import useToggle from "../../hooks/useToggle/useToggle";

interface WgerExercises {
    request: {
        responseURL: string | null;
    }, data:{
        results: WgerExerciseObject[],
        previous: string,
        next: string;
    }
}

interface WgerExerciseObject {
    next: string,
    results: object,
    previous: string
}

const ExerciseList = (): React.JSX.Element => {
    const dispatch = useAppDispatch();
    const userExercises = useAppSelector(selectExercises);
    const [wgerExercises, setWgerExercises] = useState<WgerExerciseObject[]>([]);
    const [showUserExercises, toggleShowUserExercises] = useToggle(true);
    const [showWgerExercises, toggleShowWgerExercises] = useToggle(false);
    const [exerciseFormToggle, toggleExerciseFormToggle] = useToggle(false);
    const [isLoading, toggleIsLoading] = useToggle(false);
    const [nextWgerCall, setNextWgerCall] = useState<string | undefined>(undefined);
    const [previousWgerCall, setPreviousWgerCall] = useState<string | undefined>(undefined);
    const [currentWgerCall, setCurrentWgerCall] = useState<string | null>(null);
    
    const getExerciseListInfo = useCallback( async () => { 
        dispatch(findAllMuscleGroups());
        dispatch(findAllEquipments());
    }, []);

    useEffect(() => {
        getExerciseListInfo()
    }, [getExerciseListInfo])
    
    const getExercises = useCallback(async () => {
        toggleIsLoading();
            if(showUserExercises === true){
                try{
                    dispatch(findAllExercises())
                    setWgerExercises([]);
                } catch(err){
                    return err
                }
            } else {
                try{
                    //Get a list of exercises not currently in the data base from the Wger Api    
                    if(currentWgerCall === null){
                        const exercises = await WgerApi.getAllExercises();
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
                    
                } catch(err){
                    return err
                }
            }
            toggleIsLoading();
        }, [showUserExercises, showWgerExercises]);

     

    // cache the getExercsies function so that it is the same reference when used in the useEffect hook.
    // Upon component mounting, get userExercises state from FitlyApi and display on page.
    useEffect(() => { 
        getExercises();
    }, [getExercises]);

    //Map through userExercises state and create an exercise component from each item
    const userExerciseComponents = userExercises.map(e => (
        <Col xs="4" className="my-3">
            <ExerciseDetails exerciseId={e.id} key={uuid()}/>
        </Col>
    ))

    //Map through the wgerExercise state and creat an exercise component from each item
    const wgerExerciseComponents = wgerExercises.map( e => (
        <Col xs="4" className="my-3">
            <WgerExercise exercise={e} key={uuid()}/>
        </Col>
    ))

    //toggle state that show's user's workouts and wger API workouts
    const toggleUserExercises = () => {
        toggleShowWgerExercises();
        toggleShowUserExercises();
    }

    const toggleWgerExercises = () => {
        toggleShowUserExercises();
        toggleShowWgerExercises();
    }

    //toggle state that shows exercise update form
    const toggleExerciseFormVisibility = () => {
        toggleExerciseFormToggle()
    }

    const getNextExercises = async () => {
        if(nextWgerCall !== null) {
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
        if(previousWgerCall !== null){
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

    if(exerciseFormToggle) return <NewExerciseForm toggle={toggleExerciseFormVisibility}/>

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

export default ExerciseList;