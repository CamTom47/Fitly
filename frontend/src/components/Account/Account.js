import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import UserAccountForm from "../Forms/UserAccountForm/UserAccountForm";
import UserPasswordForm from "../Forms/UserAccountForm/UserPasswordForm";
import FitlyApi from "../../Api/FitlyApi";

import { hash, compare, getSalt } from "bcryptjs-react"
import { Card, InputGroup, InputGroupText, Input } from "reactstrap";
import LoadingComponent from "../LoadingComponent/LoadingComponent";

const Account = () => {

    const [editUserToggle, setEditUserToggle] = useState(false);
    const [editPasswordToggle, setEditPasswordToggle] = useState(false);

    const handleUserInfoToggle = () => {
        setEditUserToggle(!editUserToggle);
    }
    
    const handleUserPasswordToggle = () => {
        setEditPasswordToggle(!editPasswordToggle);
    }
  

    const { currentUser } = useContext(UserContext);

    return (currentUser === null )
    ? <LoadingComponent/> 
    : (
        <Card className="d-flex flex-column align-items-center py-4">
            {(!editUserToggle)  
            ? 
            <div className="d-flex flex-column align-items-center py-4">
                <h3 className="pb-3">User Account Information</h3>
               <InputGroup className="d-inline-flex pb-4">
                    <InputGroupText>Username</InputGroupText>
                    <Input disabled placeholder={currentUser.username}/>
                </InputGroup>
                <InputGroup className="d-inline-flex pb-4">
                    <InputGroupText>Email</InputGroupText>
                    <Input disabled placeholder={currentUser.email || "----"}/>
                </InputGroup>
                <InputGroup className="d-inline-flex pb-4">
                    <InputGroupText>First Name</InputGroupText>
                    <Input disabled placeholder= {currentUser.firstName || "----"}/>
                </InputGroup>
                <InputGroup className="d-inline-flex pb-4">
                    <InputGroupText>Last Name</InputGroupText>
                    <Input disabled placeholder={currentUser.lastName || "----"}/>
                </InputGroup>

                <button className="btn btn-secondary" onClick={handleUserInfoToggle}>Edit Account Information</button>
            </div>
            : 
            <UserAccountForm handleUserInfoToggle={handleUserInfoToggle}/>}

            {
                (!editPasswordToggle)
                ?
                <div className="d-flex flex-column align-items-center">
                    <div >

                        <InputGroup className="d-inline-flex pb-4">
                            <InputGroupText>
                            Password
                            </InputGroupText>
                            <Input disabled placeholder="----"/>
                        </InputGroup>
                    </div>
                    <div>
                        <button className="btn btn-secondary" onClick={handleUserPasswordToggle}>Change Password</button>
                    </div>
                </div>
                : <UserPasswordForm handleUserPasswordToggle={handleUserPasswordToggle} />
            }
            
        </Card>
    )

}

export default Account