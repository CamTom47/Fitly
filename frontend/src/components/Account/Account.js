import React, { useState, useContext } from "react";
import UserContext from "../../context/UserContext";
import UserAccountForm from "../Forms/UserAccountForm/UserAccountForm";
import UserPasswordForm from "../Forms/UserAccountForm/UserPasswordForm";
import FitlyApi from "../../Api/FitlyApi";

import { hash, compare, getSalt } from "bcryptjs-react"

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
    
    return (
        <div>
            

            {(!editUserToggle) 
            
            ? 
            <div>
                <h5>Username</h5>
                <p>{currentUser.username}</p>
                <h5>Email</h5>
                {
                    (currentUser.email !== null) 
                    ? <p>{currentUser.email}</p>
                    : <p> ---- </p>
                }
                <h5>First Name</h5>
                {
                    (currentUser.firstName !== null) 
                    ? <p>{currentUser.firstName}</p>
                    : <p> ---- </p>
                }
                <h5>Last Name</h5>
                {
                (currentUser.lastName !== null) 
                ? <p>{currentUser.lastName}</p>
                : <p> ---- </p>
                }

                <button onClick={handleUserInfoToggle}>Edit Account Information</button>
            </div>
            : 
            <UserAccountForm handleUserInfoToggle={handleUserInfoToggle}/>}

            <h5>Password</h5>
            {
                (!editPasswordToggle)
                ?
                <div>
                    <p>-</p>
                <button onClick={handleUserPasswordToggle}>Change Password</button>
                </div>
                : <UserPasswordForm handleUserPasswordToggle={handleUserPasswordToggle} />
            }
            
        </div>
    )

}

export default Account