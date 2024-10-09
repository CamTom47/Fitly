
import React, { useState } from "react";
import UserAccountForm from "../Forms/UserAccountForm/UserAccountForm";
import UserPasswordForm from "../Forms/UserAccountForm/UserPasswordForm";
import LoadingComponent from "../LoadingComponent/LoadingComponent";
import { useSelector } from "react-redux";
import {
    selectCurrentUser
} from '../../slices/usersSlice'

import './Account.css';

/**
 * Account Component 
 * State: currentUser
 * Props: none
 */

const Account = () : React.JSX.Element => {
    const currentUser = useSelector(selectCurrentUser);
    const [editUserToggle, setEditUserToggle] = useState(false);
    const [editPasswordToggle, setEditPasswordToggle] = useState(false);

    const handleUserInfoToggle = () => setEditUserToggle(!editUserToggle);
    const handleUserPasswordToggle = () => setEditPasswordToggle(!editPasswordToggle);

    return (currentUser === null )
    ? <LoadingComponent/> 
    : (
        <div className="AccountContainer">
                <h3>User Account Information</h3>
            <div className="AccountContainerInner">
            {(!editUserToggle)  
            ? 
            
            <div className="AccountContent">
               <div className="AccountContentInputDiv">
                    <span>Username</span>
                    <input className="AccountInput" disabled placeholder={currentUser.username}/>
                </div>
                <div className="AccountContentInputDiv">
                    <span>Email</span>
                    <input className="AccountInput" disabled placeholder={currentUser.email || "-"}/>
                </div>
                <div className="AccountContentInputDiv">
                    <span>First Name</span>
                    <input className="AccountInput" disabled placeholder= {currentUser.firstName || "-"}/>
                </div>
                <div className="AccountContentInputDiv">
                    <span>Last Name</span>
                    <input className="AccountInput" disabled placeholder={currentUser.lastName || "-"}/>
                </div>

                <button className="AccountButton" onClick={handleUserInfoToggle}>Edit Account Information</button>
            </div>
            : 
            <UserAccountForm handleUserInfoToggle={handleUserInfoToggle}/>}

            {
                (!editPasswordToggle)
                ?
                <div className="AccountContent">
                    <div >
                        <div className="AccountContentInputDiv">
                            <span>Password</span>
                            <input className="AccountInput" disabled placeholder="-"/>
                        </div>
                    </div>
                    <div>
                        <button className="AccountButton" onClick={handleUserPasswordToggle}>Change Password</button>
                    </div>
                </div>
                : <UserPasswordForm handleUserPasswordToggle={handleUserPasswordToggle} />
            }
            </div>
        </div>
    )
}

/**
 * AccountContainer{ 
 *      display: flex;
 *      flex: column;
 *      align-items: center;
 * }
 */

export default Account