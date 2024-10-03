import React, { useEffect, useState} from "react";
import { Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap"
import FitlyApi from "../../Api/FitlyApi"
import { useAppSelector, useAppDispatch } from "../../hooks/reduxHooks";
import "./WgerExercise.css";
import { selectCurrentUser } from "../../slices/usersSlice";
import { selectMuscleGroups } from "../../slices/muscleGroupsSlice";
import { selectEquipments, addEquipment } from "../../slices/equipmentsSlice";
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
    userId: number,
    systemDefault: boolean
};

interface EnglishExercise {
    name: string,
    language: number
}


const WgerExercise = ({exercise, key}): React.JSX.Element => {

    const dispatch = useAppDispatch();
    const currentUser = useAppSelector(selectCurrentUser);
    const muscleGroups = useAppSelector(selectMuscleGroups);
    const muscleGroup = muscleGroups.find( muscleGroup => muscleGroup.name === exercise.category.name)
    const equipments = useAppSelector(selectEquipments)

    //convert all exercises languages to enlish
     const englishExercise: EnglishExercise = exercise.exercises.find( exercise => exercise.language === 2);
     
     
     const handleClick = async () => {
        if (exercise.equipment.length === 0 || exercise.equipment[0].name.includes('none')){
            dispatch(addExercise({
                "name": englishExercise.name,
                "muscleGroup": muscleGroup.id,
                "equipmentId": 1
            }))
        }
        else {
            if(!equipments.includes(exercise.equipment[0].name)){
                const newEquipment: Equipment = await FitlyApi.createEquipment({
                    "userId": currentUser.id,
                    "name": exercise.equipment[0].name
                })
                dispatch(addExercise({
                    "name": englishExercise.name,
                    "muscleGroup": muscleGroup.id,
                    "equipmentId": newEquipment.id
                }))
            } else {
                    const exerciseEquipment: Equipment  = equipments.find( equipment => equipment.name === exercise.equipment[0].name)
                    dispatch(addExercise({
                            "name": englishExercise.name,
                            "muscleGroup": muscleGroup.id,
                            "equipmentId": exerciseEquipment.id
                        }))
                    }
    }
    }
        
       
        //Map through all of the required equipment for the new exercise being create and see if it is currently in the in Fitly database.
        // If so, create a new exercise using the equipments id.
        // If not, create the new equipment and then create the new exercise using the new equipment's id.
        
       

        



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
            <CardTitle>Name: {englishExercise.name}</CardTitle>
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