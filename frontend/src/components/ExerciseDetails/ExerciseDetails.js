import React, {useContext, useEffect, useState} from "react";
import { Card, CardBody, CardText, CardTitle, Col, Row, Button} from "reactstrap"
import FitlyApi from "../../Api/FitlyApi"
import UpdateExerciseForm from "../Forms/UpdateExerciseForm/UpdateExerciseForm";
import {equipmentMatch} from "../../helpers/helpers";

import UserContext from "../../context/UserContext";

/**
 * Exercise component
 * 
 * State: toggleExerciseUpdateForm, equipment, muscleGroup
 * 
 * Props: updateExercise, exercise
 */

const ExerciseDetails = ({exercise, updateExercise, deleteExercise}) => {
    let {currentUser} = useContext(UserContext);
    const [toggleExerciseUpdateForm, setToggleExerciseUpdateForm] = useState(false);
    const [equipment, setEquipment] = useState({});
    const [muscleGroup, setMuscleGroup] = useState({});

    
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
    
    
    //use the exercise musclegroup id to match a the name of a the respective musclegroup from the database.
    useEffect(() => { 
        const getMuscleGroup = async () => {
            let muscle = await FitlyApi.findMuscleGroup({"muscleGroupId": exercise.muscle_group});
            setMuscleGroup(muscle);
        }
        getMuscleGroup();
    }, []);

    const handleEditClick = () => {
        setToggleExerciseUpdateForm ( toggleExerciseUpdateForm => !toggleExerciseUpdateForm)
    }

    const handleDeleteClick = () => {
        deleteExercise({"exercise_id": exercise.id})
    }



    return (
        <Card className="my-2">
            {(toggleExerciseUpdateForm)
                ?  <UpdateExerciseForm exercise={exercise} toggle={handleEditClick} equipment={equipment} updateExercise={updateExercise} />
                : (<div>
                    <CardTitle>{exercise.name}</CardTitle>
                <CardBody>
                    <CardText>
                        Muscle Group: {muscleGroup.name}
                    </CardText>
                    <CardText>
                        Equipment Needed: {equipment.name}
                    </CardText>
                </CardBody>
                <Button onClick={handleEditClick}>Edit Exercise</Button>
                <Button onClick={handleDeleteClick}>Delete Exercise</Button>
                    </div>)

            }
        </Card>
        )
}


export default ExerciseDetails;

