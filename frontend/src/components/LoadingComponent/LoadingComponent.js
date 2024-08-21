import React from "react";
import { Spinner } from "reactstrap";

const LoadingComponent = () => {
    return (
        <div className="position-absolute start-50 top-50 translate-middle d-flex justify-content-center align-items-bottom column-gap-2">
            <Spinner/>
            <p>Page Is Loading...</p>
        </div>
    )
}

export default LoadingComponent