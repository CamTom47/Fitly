import React, { useContext} from "react";
import LoginForm from "../Forms/LoginForm/LoginForm";
import UserDashboard from "../UserDashboard/UserDashboard";
import UserContext from "../../context/UserContext";
import SignupForm from "../Forms/SignupForm/SignupForm";

const Homepage = () => {

    const { currentUser, login } = useContext(UserContext);

    if(!currentUser) 
    return(
        <LoginForm login={login}></LoginForm>
    )

    else return (
        <UserDashboard></UserDashboard>

    )
}

export default Homepage;