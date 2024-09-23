import React from "react";
import UserContext from "./src/context/UserContext";
import { MemoryRouter } from "react-router";

const demoUser = {
    username: "testUser",
    first_name: "testF",
    last_name: "testL",
    email: "test@test.com",
}

const UserProvider = ({children, currentUser = demoUser}) => (
    <MemoryRouter>
        <UserContext.Provider value={{currentUser}}>
            {children}
        </UserContext.Provider>
    </MemoryRouter>
    );

    export default UserProvider;