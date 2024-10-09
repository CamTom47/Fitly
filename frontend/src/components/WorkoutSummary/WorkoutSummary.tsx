import React from "react";
import FitlyApi from "../../Api/FitlyApi";
import { Link } from "react-router-dom";
import {useSelector} from 'react-redux'

import {
    selectCategories
} from '../../slices/categoriesSlice';

import './WorkoutSummary.css'

interface Category {
    id: number,
    name: string
}
const WorkoutSummary = ({workout}) => {

    const categories = useSelector(selectCategories);
    const category = categories.find( (category: Category) => category.id === workout.category);
    // Add/remove workout from favorites to allow for filtering 
    const handleFavorite = async () => {
        (workout.favorited === false)
            ? await FitlyApi.updateWorkout(workout.id, {favorited: true})
            : await FitlyApi.updateWorkout(workout.id, {favorited: false})
    }

    return (
        <div id="WorkoutSummaryContainer">
            <div className="WorkoutSummaryContent">
                <div className="WorkoutSummaryContentHead">
                    <h5>{workout.name}</h5>
                </div>
                <div className="WorkoutSummaryContentBody">
                    <span>Type of Workout:</span>
                    <p>{category.name}</p>
                    <Link to={`/workouts/${workout.id}`}>
                        <button>Workout Details</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default WorkoutSummary;