import React from "react";
import { Card, CardBody, CardText, CardTitle, ListGroup, ListGroupItem, Button} from "reactstrap"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faTrash } from '@fortawesome/free-solid-svg-icons'
import FitlyApi from "../../Api/FitlyApi";

import { Link } from "react-router-dom"




const WorkoutSummary = ({workout}) => {


    // Add/remove workout from favorites to allow for filtering 
    const handleFavorite = async () => {
        (workout.favorited === false)
            ? await FitlyApi.updateWorkout(workout.id, {favorited: true})
            : await FitlyApi.updateWorkout(workout.id, {favorited: false})
    }

    return (
        <Card className="my-2">
        <CardTitle>{workout.name}</CardTitle>
        <CardBody>
            <CardText>
                Type of Workout:{workout.category}
            </CardText>
            <CardText>
                Number of Times Completed: {workout.completed_count}
            </CardText>
            <CardText>
                Number of Circuits: 
            </CardText>
            <Button color='dark'>
                <Link to={{ pathname: `/workouts/${workout.id}`}} style={{textDecoration: "none"}}>
                    Workout Details
                </Link>

                {/* <Link to={{ pathname: '/other', state: dataToPass }}>Go to Other Component</Link> */}

            </Button>
        </CardBody>
    </Card>
    )

}

export default WorkoutSummary;