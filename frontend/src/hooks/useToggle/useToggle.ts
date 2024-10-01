import { useState } from 'react';

const useToggle = (initialVal: boolean = false) => {
    //call useState, "reserve piece of state"
    const [value, setValue] = useState(initialVal);
    const toggle = () : void => setValue(oldValue => !oldValue);

    //return piece of state and a function to toggle it
    return [value, toggle] as const;
}

export default useToggle;