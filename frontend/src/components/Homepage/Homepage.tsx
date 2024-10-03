import React from "react";
import LoginForm from "../Forms/LoginForm/LoginForm";
import { Card } from "reactstrap";
import { selectCurrentUser } from '../../slices/usersSlice';
import { useAppSelector} from '../../hooks/reduxHooks'

const Homepage = (): React.JSX.Element  => {
    
    const currentUser = useAppSelector(selectCurrentUser);

    return !currentUser ? 
        (
            <div className="d-flex justify-content-center m-5 ">
            <Card className="d-flex flex-column align-items-center p-5">
                <LoginForm></LoginForm>
            </Card>
        </div>
        ) 
    :
        (
            <h1>User Dashboard In Progress</h1>
        )
    
}

export default Homepage;