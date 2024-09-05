import React,{useContext, useState} from "react";
import { Link } from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.min.css';

import { Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    NavItem,
} from "reactstrap";

import { Nav } from "react-bootstrap";

import UserContext from "../../context/UserContext";

//custom hooks
import useToggle from "../../hooks/useToggle/useToggle";

/**
 * NavBar Component
 * 
 * state: collapse
 * 
 * props: none
 */

const NavBar = () => {

    const [collapsed, setCollapsed] = useToggle(true);

    const toggleNavbar = () => setCollapsed(!collapsed);

    const {currentUser, signout} = useContext(UserContext)

    const loggedInNavComponents = (
        <div className="d-flex flex-column align-items-center">
            <NavItem>
                <Nav.Link as={Link} to="/account" onClick={toggleNavbar}>Account</Nav.Link>
            </NavItem>
            <NavItem>
                <Nav.Link as={Link} to="/exercises" onClick={toggleNavbar}>Exercises</Nav.Link>
            </NavItem>

            <NavItem>
                <Nav.Link as={Link} to="/workouts" onClick={toggleNavbar}>Workouts</Nav.Link>
            </NavItem>
            <NavItem>
                <Nav.Link onClick={signout} as={Link} to="/">Sign Out</Nav.Link>
            </NavItem>
        </div> 
    )

    const nonloggedInNavComponents = (
        <div className="d-flex flex-column align-items-center">
            <NavItem>
                <Nav.Link as={Link} to="/" onClick={toggleNavbar}>Login</Nav.Link>
            </NavItem>
            <NavItem>
                <Nav.Link as={Link} to="/register" onClick={toggleNavbar}>Signup</Nav.Link>
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
                        <NavbarToggler type="button" onClick={toggleNavbar} className="me-5 d-flex flex-column flex-grow-1"/>
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
                        <NavbarToggler type="button" onClick={toggleNavbar} className="me-5 d-flex flex-column flex-grow-1"/>
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