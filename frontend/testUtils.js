import React from "react";
import { MemoryRouter } from "react-router";

const demoUser = {
    username: "testUser",
    first_name: "testF",
    last_name: "testL",
    email: "test@test.com",
}

const UserProvider = ({children}) => (
    <MemoryRouter>
            {children}
    </MemoryRouter>
    );

    export default UserProvider;