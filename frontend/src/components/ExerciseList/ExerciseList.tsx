import React, { useEffect, useState, useContext, useCallback, useMemo} from "react";
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

import { findAllMuscleGroups, selectMuscleGroups } from '../../slices/muscleGroupsSlice';
import { findAllEquipments } from '../../slices/equipmentsSlice';
import useToggle from "../../hooks/useToggle/useToggle";
import './ExerciseList.css';


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
    const muscleGroups = useAppSelector(selectMuscleGroups);
    
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
        <div>
            <ExerciseDetails exerciseId={e.id} key={uuid()}/>
        </div>
    ))

    //Map through the wgerExercise state and creat an exercise component from each item
    const wgerExerciseComponents = wgerExercises.map( e => (
        <div>
            <WgerExercise exercise={e} key={uuid()}/>
        </div>
    ))

    //toggle state that show's user's workouts and wger API workouts
    const toggleExerciseView = (e) => {
        if(!(e.target.className.includes('active'))){
            toggleShowWgerExercises();
            toggleShowUserExercises();
        }        
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

    // Filter Components
    const muscleGroupFilters = muscleGroups.map( muscleGroup => {
        <div>
            <label htmlFor=""></label>
            <input type="text" />
        </div>
    })

    if(exerciseFormToggle) return <NewExerciseForm toggle={toggleExerciseFormVisibility}/>

    return (
        (isLoading) 
    ? <LoadingComponent/>
    :
        <div id="ExerciseListContainer">
            <div id="exercisesectiontitle">
                <h1>Exercises</h1>
            </div>
            <div id="filterExerciseDivider">
                <div id="filterExerciseDividerInner">
                <div id="filtersection">
                    <p>Filters</p>
                </div>
            <div className="exerciselistsection">
                <div className="test">
                    <div id="ExerciseListHead">
                    <div>
                        <a onClick={toggleExerciseView}>
                            <button className={showUserExercises ? "exercisebutton active" : "exercisebutton"}>
                                Personal Exercises
                            </button>
                        </a>
                        <a onClick={toggleExerciseView}>
                            <button className={showWgerExercises ? "exercisebutton active" : "exercisebutton"}>
                                Find New Exercise
                            </button>
                        </a>  
                        </div>
                        <div className="searchbar">
                            <form>
                                <label htmlFor="">Search:</label>
                                <input type="text" placeholder="Search For Exercise"></input>
                            </form>
                        </div>

            </div>
            <div id="ExerciseListHead2">
                <button id="addexercisebutton" onClick={toggleExerciseFormVisibility}>
                            Create New Exercise
                </button>
            </div>
            {
                (showUserExercises)
                ?   <div className="exerciseListBody">
                    {userExerciseComponents}
                </div>
            :  <div id="wgerexercisesdiv">
                <div className="exerciseListBody">
                      {wgerExerciseComponents}
                 </div>
                 <div>
                    <FontAwesomeIcon className="arrow" type="button" icon={faArrowLeft} onClick={getPreviousExercises}/>
                    <FontAwesomeIcon className="arrow" type="button" icon={faArrowRight} onClick={getNextExercises}/>
                 </div>
            </div> 
            }
            </div>
            </div>
            </div>
            </div>
        </div>)
}

export default ExerciseList;