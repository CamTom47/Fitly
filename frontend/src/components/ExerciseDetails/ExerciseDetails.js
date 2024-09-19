import React, {useContext, useEffect, useState} from "react";
import { Card, CardBody, CardText, CardTitle, Col, Row, Button} from "reactstrap"
import FitlyApi from "../../Api/FitlyApi"
import UpdateExerciseForm from "../Forms/UpdateExerciseForm/UpdateExerciseForm";
import {equipmentMatch} from "../../helpers/helpers";

import { useDispatch, useSelector } from "react-redux";
import {
    selectCurrentUser
} from '../../slices/usersSlice';

import {
    selectMuscleGroup,
    selectMuscleGroups,
    // findAMuscleGroup,
    findAllMuscleGroups
} from '../../slices/muscleGroupsSlice';

import {
    deleteExercise
} from '../../slices/exercisesSlice';

import {
    findAEquipment
} from '../../slices/equipmentsSlice';
/**
 * Exercise component
 * 
 * State: toggleExerciseUpdateForm, equipment, muscleGroup
 * 
 * Props: updateExercise, exercise
*/

const ExerciseDetails = ({exercise, updateExercise}) => {
    const dispatch = useDispatch();
    const muscleGroups = useSelector(selectMuscleGroups);
    const muscleGroup = muscleGroups.find( muscleGroup => muscleGroup.id === exercise.muscle_group);
    const currentUser = useSelector(selectCurrentUser);
    
    const [toggleExerciseUpdateForm, setToggleExerciseUpdateForm] = useState(false);
    const [equipment, setEquipment] = useState({});
    
    //use the exercise equipment id to match a the name of a the respective equipment from the database.
    useEffect(() => {
        const matchEquipment = () => {
            equipmentMatch({equipment_id: exercise.equipment_id})
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
        dispatch(deleteExercise({"exercise_id": exercise.id}))
    }



    return (
        <Card className="my-2 d-flex flex-column align-items-center pb-3">
            {(toggleExerciseUpdateForm)
                ?  <UpdateExerciseForm exercise={exercise} toggle={handleEditClick} equipment={equipment} updateExercise={updateExercise} />
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

