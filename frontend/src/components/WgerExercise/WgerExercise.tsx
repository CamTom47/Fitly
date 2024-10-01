import React, { useEffect, useState} from "react";
import { Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap"
import FitlyApi from "../../Api/FitlyApi"
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import "./WgerExercise.css";
import { selectCurrentUser } from "../../slices/usersSlice";
import { selectMuscleGroups } from "../../slices/muscleGroupsSlice";
import { selectEquipments } from "../../slices/equipmentsSlice";
import { addExercise } from "../../slices/exercisesSlice";



/**
 * Exercise component
 * 
 * State: none
 * 
 * Props: addExercise, exercise
 */

interface Equipment {
    id?: number,
    name: string,
    user_id: number,
    systemDefault: boolean
};

const WgerExercise = ({exercise, key}): React.JSX.Element => {

    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const muscleGroups = useAppSelector(selectMuscleGroups);
    const equipments = useAppSelector(selectEquipments)

    //convert all exercises languages to enlish
    let englishExercise: string | null = null;

    for( let ex of exercise.exercises){
        if(ex.language === 2){
            englishExercise = ex
        } 
    }


    const handleClick = async () => {
        let muscleGroupId: number;

        for( let muscleGroup of muscleGroups){
            if( muscleGroup.name === exercise.category.name){
                muscleGroupId = muscleGroup.id
            }
        }
        //Map through all of the required equipment for the new exercise being create and see if it is currently in the in Fitly database.
        // If so, create a new exercise using the equipments id.
        // If not, create the new equipment and then create the new exercise using the new equipment's id.

                if(exercise.equipment.length === 0){
                    dispatch(addExercise({
                        "name": exercise.englishExercise.name,
                        "muscle_group": exercise.muscleGroupId,
                        "equipment_id": 1
                    }))

                } else {

                    let equipmentCheck;
                    
                    for( let equipment of equipments){
                        if(equipment.name === exercise.equipment[0].name){
                            equipmentCheck = true;
                        } else {
                            equipmentCheck = false;
                        }
                    }    
                    
                    if(equipmentCheck) {
                        dispatch(addExercise({
                            "name": exercise.englishExercise.name,
                            "muscle_group": exercise.muscleGroupId,
                            "equipment_id": exercise.equipment[0].id
                        }))
                    } else {
                        let newEquipment: {
                            id: number,
                            name: string,
                            user_id: number
                        } = await FitlyApi.createEquipment({
                            "user_id": currentUser.id,
                            "name": exercise.equipment[0].name
                        })
    
                        dispatch(addExercise({
                            "name": exercise.englishExercise.name,
                            "muscle_group": exercise.muscleGroupId,
                            "equipment_id": newEquipment.id
                        }))
                    }
                    
                } 
                
    }

        



        // check if equipment needed for this workout is currently in the fitly database
        // if so proceed
        // if not create new equipment
        //then add new equipment id to newExerciseObject
        

    const equipmentComponents = exercise.equipment.map ( (equipment: Equipment) => (
        <CardText>Equipment: {equipment.name}</CardText>
    ))

    const imageComponents = exercise.images.map( (image:{image: string}) => (
        <Col xs="6">
            <img className="exerciseImage d-flexbox" src={image.image}></img>
        </Col>
    ))

    return (
        <Card key={key} className="d-flex flex-column align-items-center pb-3">
            <CardTitle>Name: {exercise.englishExercise.name}</CardTitle>
            <Row>
                {imageComponents}
            </Row>

            <CardBody>
                <CardText className="d-flex justify-content-center">
                    Type: {exercise.category.name}
                </CardText>
                
                {equipmentComponents}
            </CardBody>
            <button className="btn btn-success" onClick={handleClick}>Add To Saved Exercises</button>
        </Card>
    )
}


export default WgerExercise;