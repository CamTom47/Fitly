import React, { useState, useContext} from "react";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import FitlyApi from "../../Api/FitlyApi";
import ExerciseContext from "../../context/ExerciseContext";

//custom hooks
import useToggle from "../../hooks/useToggle/useToggle";

/**
 * FilterButton component
 * 
 * state: checked => boolean
 * 
 * props: filter => str
 * 
 */

const FilterButton = ({filter}) => { 

    const [checked, setChecked] = useToggle(false);
    // const [filterValues, setFilterValues] = []

    let getExercises = useContext(ExerciseContext).getExercises;

    const filterExercises = (e) => {
        return({
            muscle_group: e.target.value})
    }
    
    const handleClick = async (e) => { 
        setChecked( checked => !checked)
        if(!checked){
            getExercises(filterExercises(e))
        } 
            
    }


    return (
        <div>
            <Input type="switch" 
            role="switch"
            checked={checked}
            onClick={handleClick}
            value={filter}
            />
            <Label check>{filter}</Label>
        </div>
    )

}

export default FilterButton