import React, {useCallback, useContext, useEffect, useState} from "react";
import { Card, CardBody, CardText, CardTitle, Col, Row, Button} from "reactstrap"
import UpdateExerciseForm from "../Forms/UpdateExerciseForm/UpdateExerciseForm";
import {equipmentMatch} from "../../helpers/helpers";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {selectMuscleGroups} from '../../slices/muscleGroupsSlice';
import {
    deleteExercise,
    selectExercises
} from '../../slices/exercisesSlice';

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
        <Card className="my-2 d-flex flex-column align-items-center pb-3">
            {(toggleExerciseUpdateForm)
                ?  <UpdateExerciseForm exercise={exercise} toggle={handleEditClick} equipment={equipment}/>
                : (
                    <div className="d-flex flex-column align-items-center">
                        <CardTitle className="fs-3 d-flex">{exercise.name}</CardTitle>
                        <CardBody className="d-flex flex-column align-content-center">
                            <CardText className="d-flex justify content-center">
                                Muscle Group: {muscleGroup.name}
                            </CardText >
                            <CardText className="d-flex justify content-center">
                                Equipment Needed: {equipment.name}
                            </CardText>
                        </CardBody>
                        <div className="d-flex flex-row column-gap-5">
                            <Button className="btn btn-danger" onClick={handleDeleteClick}>Delete Exercise</Button>
                            <Button className="btn btn-secondary" onClick={handleEditClick}>Edit Exercise</Button>
                        </div>
                    </div>
                    )
            }
        </Card>
        )
}


export default ExerciseDetails;

