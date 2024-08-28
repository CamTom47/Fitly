import React, {useContext, useEffect, useState} from "react";
import { Card, CardBody, CardText, CardTitle, Col, Row, Button} from "reactstrap"
import FitlyApi from "../../Api/FitlyApi"
import UpdateExerciseForm from "../Forms/UpdateExerciseForm/UpdateExerciseForm";
import {equipmentMatch} from "../../helpers/helpers";

import UserContext from "../../context/UserContext";
import "./ExerciseTableRow.css"

/**
 * Exercise component
 * 
 * State: toggleExerciseUpdateForm, equipment, muscleGroup
 * 
 * Props: updateExercise, exercise
 */

const ExerciseTableRow = ({exercise, updateExercise, deleteExercise}) => {
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



    // return (
    //     <Card className="my-2 d-flex flex-column align-items-center pb-3">
    //         {(toggleExerciseUpdateForm)
    //             ?  <UpdateExerciseForm exercise={exercise} toggle={handleEditClick} equipment={equipment} updateExercise={updateExercise} />
    //             : (
    //                 <div className="d-flex flex-column align-items-center">
    //                     <CardTitle className="fs-3 d-flex">{exercise.name}</CardTitle>
    //                     <CardBody className="d-flex flex-column align-content-center">
    //                         <CardText className="d-flex justify content-center">
    //                             Muscle Group: {muscleGroup.name}
    //                         </CardText >
    //                         <CardText className="d-flex justify content-center">
    //                             Equipment Needed: {equipment.name}
    //                         </CardText>
    //                     </CardBody>
    //                     <div className="d-flex flex-row column-gap-5">
    //                         <Button className="btn btn-danger" onClick={handleDeleteClick}>Delete Exercise</Button>
    //                         <Button className="btn btn-secondary" onClick={handleEditClick}>Edit Exercise</Button>
    //                     </div>
    //                 </div>
    //                 )
    //         }
    //     </Card>
    //     )

    return (
        <tr className="TableRow">
            <td className="TableRow-td">{exercise.name}</td>
            <td className="TableRow-td">{muscleGroup.name}</td>
            <td className="TableRow-td">{equipment.name}</td>
        </tr>
        // <Card className="my-2 d-flex flex-column align-items-center pb-3">
        //     {(toggleExerciseUpdateForm)
        //         ?  <UpdateExerciseForm exercise={exercise} toggle={handleEditClick} equipment={equipment} updateExercise={updateExercise} />
        //         : (
        //             <div className="d-flex flex-column align-items-center">
        //                 <CardTitle className="fs-3 d-flex">{exercise.name}</CardTitle>
        //                 <CardBody className="d-flex flex-column align-content-center">
        //                     <CardText className="d-flex justify content-center">
        //                         Muscle Group: {muscleGroup.name}
        //                     </CardText >
        //                     <CardText className="d-flex justify content-center">
        //                         Equipment Needed: {equipment.name}
        //                     </CardText>
        //                 </CardBody>
        //                 <div className="d-flex flex-row column-gap-5">
        //                     <Button className="btn btn-danger" onClick={handleDeleteClick}>Delete Exercise</Button>
        //                     <Button className="btn btn-secondary" onClick={handleEditClick}>Edit Exercise</Button>
        //                 </div>
        //             </div>
        //             )
        //     }
        // </Card>
        )
}


export default ExerciseTableRow;

