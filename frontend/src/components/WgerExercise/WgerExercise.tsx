import React, {useContext, useEffect, useState} from "react";
import { Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap"
import FitlyApi from "../../Api/FitlyApi"
import UserContext from "../../context/UserContext";
import "./WgerExercise.css"


/**
 * Exercise component
 * 
 * State: none
 * 
 * Props: addExercise, exercise
 */

const WgerExercise = ({addExercise, exercise}) => {

    let {currentUser} = useContext(UserContext);
    const [muscleGroups, setMuscleGroups] = useState([]);

    useEffect( () => { 
        const gatherMuscleGroups = async () => {
            let muscleGroups = await FitlyApi.findAllMuscleGroups();
            setMuscleGroups(muscleGroups);
        }
        gatherMuscleGroups();
    }, []);

    let newEquipment;

    // add a new equipment to the Fitly database if it does not currently exist.
    const createNewEquipment = async (muscleGroup) => {
        newEquipment = await FitlyApi.createEquipment({
            "user_id": UserContext.id,
            "name": muscleGroup,
            "systemDefault": false })
        }




        //convert all exercises to enlish
        let englishExercise = null;

        for( let ex of exercise.exercises){
            if(ex.language === 2){
                englishExercise = ex
            } 
        }


    const handleClick = async () => {
        let muscleGroupId;

        for( let muscleGroup of muscleGroups){
            if( muscleGroup.name === exercise.category.name){
                muscleGroupId = muscleGroup.id
            }
        }
        //Map through all of the required equipment for the new exercise being create and see if it is currently in the in Fitly database.
        // If so, create a new exercise using the equipments id.
        // If not, create the new equipment and then create the new exercise using the new equipment's id.

                if(exercise.equipment.length === 0){
                    addExercise({
                        "name": englishExercise.name,
                        "muscle_group": muscleGroupId,
                        "equipment_id": 1
                    })

                } else {

                    let allEquipment = await FitlyApi.findAllEquipments();
                    let equipmentCheck;
                    
                    for( let equipment of allEquipment){
                        if(equipment.name === exercise.equipment[0].name){
                            equipmentCheck = true;
                        } else {
                            equipmentCheck = false;
                        }
                    }    
                    
                    if(equipmentCheck) {
                        addExercise({
                            "name": englishExercise.name,
                            "muscle_group": muscleGroupId,
                            "equipment_id": exercise.equipment[0].id
                        })
                    } else {
                        let newEquipment = await FitlyApi.createEquipment({
                            "user_id": currentUser.id,
                            "name": exercise.equipment[0].name
                        })
    
                        addExercise({
                            "name": englishExercise.name,
                            "muscle_group": muscleGroupId,
                            "equipment_id": newEquipment.id
                        })
                    }
                    
                } 
                
    }

        



        // check if equipment needed for this workout is currently in the fitly database
        // if so proceed
        // if not create new equipment
        //then add new equipment id to newExerciseObject
        

    const equipmentComponents = exercise.equipment.map ( equipment => (
        <CardText>Equipment: {equipment.name}</CardText>
    ))

    const imageComponents = exercise.images.map( image => (
        <Col xs="6">
            <img className="exerciseImage d-flexbox" src={image.image}></img>
        </Col>
    ))

    return (
        <Card className="d-flex flex-column align-items-center pb-3">
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