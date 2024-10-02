import React from "react";
import { Card, CardBody, CardText, CardTitle, ListGroup, ListGroupItem, Button} from "reactstrap"
import FitlyApi from "../../Api/FitlyApi";
import { Link } from "react-router-dom";
import {useSelector} from 'react-redux'

import {
    selectCategories
} from '../../slices/categoriesSlice'

interface Category {
    id: number,
    name: string
}
const WorkoutSummary = ({workout}) => {

    const categories = useSelector(selectCategories);
    const category = categories.filter( (category: Category) => category.id === workout.category)[0];
    // Add/remove workout from favorites to allow for filtering 
    const handleFavorite = async () => {
        (workout.favorited === false)
            ? await FitlyApi.updateWorkout(workout.id, {favorited: true})
            : await FitlyApi.updateWorkout(workout.id, {favorited: false})
    }

    return (
        <Card className="d-flex pt-3 flex-column align-items-center">
            <CardTitle className="fs-5">{workout.name}</CardTitle>
            <CardBody className="d-flex pt-3 flex-column align-items-center">
                <CardText>
                    Type of Workout:{category.name}
                </CardText>
                    <Link  className="btn btn-secondary" to={{ pathname: `/workouts/${workout.id}`}} style={{textDecoration: "none"}}>
                        Workout Details
                    </Link>
            </CardBody>
        </Card>
    )

}

export default WorkoutSummary;