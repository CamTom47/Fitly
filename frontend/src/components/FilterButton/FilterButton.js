import React, { useState} from "react";
import { Form, FormGroup, Label, Input } from 'reactstrap';

/**
 * FilterButton component
 * 
 * state: checked => boolean
 * 
 * props: filter => str
 * 
 */

const FilterButton = ({filter}) => { 

    const [checked, setChecked] = useState(false);

    return (
        <div>
            <Input type="switch" 
            role="switch"
            checked={checked}
            onClick={() => { setChecked(!checked)}}
            />
            <Label check>{filter}</Label>
        </div>
    )

}

export default FilterButton