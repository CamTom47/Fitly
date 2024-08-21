import React, { useContext} from "react";
import LoginForm from "../Forms/LoginForm/LoginForm";
import UserContext from "../../context/UserContext";
import { Card } from "reactstrap";

const Homepage = () => {

    const { currentUser, login } = useContext(UserContext);

    if(!currentUser) 
    return(
        <div className="d-flex justify-content-center m-5 ">
            <Card className="d-flex flex-column align-items-center p-5">
                <LoginForm login={login}></LoginForm>
                <hr className="w-75"></hr>
                <p>New to Fitly?</p><a href="/register">Sign Up Here</a>
            </Card>
        </div>
    )
}

export default Homepage;