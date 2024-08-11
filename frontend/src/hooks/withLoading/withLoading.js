import React, { useState } from "react";

const withLoading = (Component) => {
    return function WithLoading({ isLoading, ...props }) {
        if (isLoading){
            return <div>Loading...</div>
        } return <Component {...props}/>;
    };
}

export default withLoading;