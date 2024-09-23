import React from "react";
import { } from 'react-redux'

interface Props extends PropsFromRedux
function withErrorHandling(Component) {
    return function WithErrorHandling({ error, ...props }) {
        if(error){
            return <div>Error: {error.message}</div>
        } return <Component {...props}/>
    };
}

export default withErrorHandling;