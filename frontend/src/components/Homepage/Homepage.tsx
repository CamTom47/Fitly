import React from "react";
import LoginForm from "../Forms/LoginForm/LoginForm";
import { Card } from "reactstrap";
import { selectCurrentUser } from '../../slices/usersSlice';
import { useAppSelector} from '../../hooks/reduxHooks'

const Homepage = (): React.JSX.Element  => {
    
    const currentUser = useAppSelector(selectCurrentUser);

    return !currentUser ? 
        (
                <LoginForm></LoginForm>
        ) 
    :
        (
            <h1>User Dashboard In Progress</h1>
        )
    
}

export default Homepage;