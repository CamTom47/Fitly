import React, { useContext} from "react";
import LoginForm from "../Forms/LoginForm/LoginForm";
import UserContext from "../../context/UserContext";
import { Card } from "reactstrap";
import { useSelector } from "react-redux";
import {
    selectCurrentUser
} from '../../slices/usersSlice'

const Homepage = () => {
    
    const currentUser = useSelector(selectCurrentUser);

    if(!currentUser) 
    return(
        <div className="d-flex justify-content-center m-5 ">
            <Card className="d-flex flex-column align-items-center p-5">
                <LoginForm></LoginForm>
            </Card>
        </div>
    )
}

export default Homepage;