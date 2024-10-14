import React, {useEffect, useState} from "react";
import UpdateExerciseForm from "../Forms/UpdateExerciseForm/UpdateExerciseForm";
import {equipmentMatch} from "../../helpers/helpers";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {selectMuscleGroups} from '../../slices/muscleGroupsSlice';
import {
    deleteExercise,
    selectExercises
} from '../../slices/exercisesSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faPencil } from "@fortawesome/free-solid-svg-icons";

import './ExerciseDetails.css'

/**
 * Exercise component
 * 
 * State: toggleExerciseUpdateForm, equipment, muscleGroup
 * 
 * Props: updateExercise, exercise
*/

interface Exercise {
    id: number,
    name: string,
    muscleGroup: number,
    equipmentId: number
};

interface MuscleGroup {
    id: number,
    name: string
};

interface Equipment { 
    id: number | null,
    name: string | null
};

interface ExerciseDetailProps { 
    exerciseId: number,
};

const initial_equipment_state : Equipment = {
    id: null,
    name: null
};

const ExerciseDetails = ({exerciseId}: ExerciseDetailProps) : React.JSX.Element => {
    const dispatch = useAppDispatch();
    const exercises = useAppSelector(selectExercises);
    const exercise : Exercise = exercises.find( (exercise : Exercise) => exercise.id === exerciseId);
    const muscleGroups = useAppSelector(selectMuscleGroups);
    const muscleGroup : MuscleGroup = muscleGroups.find((muscleGroup: MuscleGroup) => muscleGroup.id === exercise.muscleGroup);
    const [toggleExerciseUpdateForm, setToggleExerciseUpdateForm] = useState(false);
    const [equipment, setEquipment] = useState(initial_equipment_state);

    //use the exercise equipment id to match a the name of a the respective equipment from the database.
    useEffect(() => {
        const matchEquipment = () => {
            equipmentMatch(exercise.equipmentId)
            .then( data =>  {
                setEquipment(data)
            })
            .catch(err => err)
        }
        matchEquipment();
    }, []);

    const handleEditClick = () => {
        setToggleExerciseUpdateForm ( toggleExerciseUpdateForm => !toggleExerciseUpdateForm)
    }

    const handleDeleteClick = () => {
        dispatch(deleteExercise(exercise.id))
    }

    return (
        <div id="ExerciseDetailsContainer">
            {(toggleExerciseUpdateForm)
                ?  <UpdateExerciseForm exercise={exercise} toggle={handleEditClick} equipment={equipment}/>
                : (
                    <div className="exerciseDetailsContent">
                        <div className="ExerciseDetailsContentHead">
                        <h5>{exercise.name}</h5>
                        <div>
                            <FontAwesomeIcon icon={faPencil} id="editButton" className="ExerciseDetailIcons" onClick={handleEditClick}/>
                            <FontAwesomeIcon icon={faTrash} id="deleteButton"  className="ExerciseDetailIcons" onClick={handleDeleteClick}/>
                        </div>
                        </div>
                        <div className="exerciseDetailsContentBody">
                            <div>
                                <span>
                                Muscle Group: 
                                </span>
                                <p>
                                    {muscleGroup.name}
                                </p>
                            </div>
                            <div>
                            <span>
                            Equipment Needed: 
                            </span>
                            <p>
                                {equipment.name}
                            </p>

                            </div>
                        </div>
                        
                    </div>
                    )
            }
        </div>
        )
}


export default ExerciseDetails;

