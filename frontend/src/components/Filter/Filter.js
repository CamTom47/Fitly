import React, { useState} from "react";
import { Form, FormGroup, Label, Input } from 'reactstrap';
import FilterButton from "../FilterButton/FilterButton";


/**
 * Filter Component
 * 
 * state: none
 * 
 * props: filter => array 
 */

const Filter = ({filters}) => { 

    let filterComponents = filters.map( f => (
        <FilterButton value={f} filter={f.name}/>
    ))
    return (
        <Form>
            <FormGroup switch className="d-flex flex-column row-gap-1">
                {filterComponents}
            </FormGroup>
        </Form>
    )

}

export default Filter