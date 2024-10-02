import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import {
    selectCurrentUser,
    userLoggedOut
} from '../../slices/usersSlice'


import 'bootstrap/dist/css/bootstrap.min.css';

import { Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    NavItem,
} from "reactstrap";

import { Nav } from "react-bootstrap";
import useToggle from "../../hooks/useToggle/useToggle";

const NavBar = (): React.JSX.Element => {
    const dispatch = useAppDispatch();
    const [collapsed, toggleCollapse] = useToggle(true);
    const currentUser = useAppSelector(selectCurrentUser);

    const handleLogOut = () => {
        localStorage.clear();
        dispatch(userLoggedOut());
    }

    const loggedInNavComponents = (
        <div className="d-flex flex-column align-items-center">
            <NavItem>
                <Nav.Link as={Link} to="/account" onClick={toggleCollapse}>Account</Nav.Link>
            </NavItem>
            <NavItem>
                <Nav.Link as={Link} to="/exercises" onClick={toggleCollapse}>Exercises</Nav.Link>
            </NavItem>

            <NavItem>
                <Nav.Link as={Link} to="/workouts" onClick={toggleCollapse}>Workouts</Nav.Link>
            </NavItem>
            <NavItem>
                <Nav.Link onClick={handleLogOut} as={Link} to="/">Sign Out</Nav.Link>
            </NavItem>
        </div> 
    )

    const nonloggedInNavComponents = (
        <div className="d-flex flex-column align-items-center">
            <NavItem>
                <Nav.Link as={Link} to="/" onClick={toggleCollapse}>Login</Nav.Link>
            </NavItem>
            <NavItem>
                <Nav.Link as={Link} to="/register" onClick={toggleCollapse}>Signup</Nav.Link>
            </NavItem>
        </div>

    )


    return  (currentUser !== null )
    ?   <div>
            <Navbar color="light" >
                <div className="d-flex justify-content-between flex-grow-1">
                    <NavbarBrand tag="a" href="/" className="fs-2 me-5">
                        Fitly
                    </NavbarBrand>
                    <div >
                        <NavbarToggler type="button" onClick={toggleCollapse} className="me-5 d-flex flex-column flex-grow-1"/>
                        <Collapse isOpen={!collapsed} navbar>
                            <Nav>
                                {loggedInNavComponents} 
                            </Nav>  
                        </Collapse>
                    </div>
                </div>
            </Navbar>
        </div>

    : <div>
            <Navbar color="light" >
                <div className="d-flex justify-content-between flex-grow-1">
                    <NavbarBrand tag="a" href="/" className="fs-2 me-5">
                        Fitly
                    </NavbarBrand>
                    <div className="d-flex flex-column align-items-center">
                        <NavbarToggler type="button" onClick={toggleCollapse} className="me-5 d-flex flex-column flex-grow-1"/>
                        <Collapse isOpen={!collapsed} navbar>
                            <Nav>
                                {nonloggedInNavComponents}
                            </Nav>
                        </Collapse>
                    </div>
                </div>
            </Navbar>
        </div>

}

export default NavBar;