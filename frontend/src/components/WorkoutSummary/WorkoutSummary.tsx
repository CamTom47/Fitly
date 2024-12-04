import React from "react";
import moment from "moment";
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

interface WorkoutSummaryProps{
    workout: {};
    workoutNumber: Number;
}
const WorkoutSummary = ({workout, workoutNumber}) => {

    const categories = useSelector(selectCategories);
    const category = categories.find( (category: Category) => category.id === workout.category);
    // Add/remove workout from favorites to allow for filtering 
    const handleFavorite = async () => {
        (workout.favorited === false)
            ? await FitlyApi.updateWorkout(workout.id, {favorited: true})
            : await FitlyApi.updateWorkout(workout.id, {favorited: false})
    }

    return (
        <tr className="WorkoutSummary-row">
                    <td>
                    <Link to={`/workouts/${workout.id}`}>
                        <button id="WorkoutDetailButton">Details</button>
                    </Link>
                    </td>
                    <td>{workoutNumber + 1}</td>
                    <td>{workout.name}</td>
                    <td>{category.name}</td>
                    <td>{workout.timesCompleted}</td>
                    <td>{moment(workout.lastCompleted).format("MM-DD-YYYY")}</td>
        </tr>
    )
}


export default WorkoutSummary;