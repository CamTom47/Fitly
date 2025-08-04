import React, {useEffect, useCallback}from "react";
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { findAllExercises } from "../../slices/exercisesSlice";

//Styling
import './UserDashboard.css';

const UserDashboard = (): React.JSX.Element => {

    return (
        <div>
            <div>Start Workout</div>
            <p>fhoidafio</p>
        </div>
    )
}

export default UserDashboard