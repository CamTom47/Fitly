import React,{useContext, useState} from "react";
import { Link } from "react-router-dom";


import 'bootstrap/dist/css/bootstrap.min.css';

import { Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
} from "reactstrap";

import { Nav } from "react-bootstrap";

import UserContext from "../../context/UserContext";

const NavBar = () => {

    const [collapsed, setCollapsed] = useState(true);

    const toggleNavbar = () => setCollapsed(!collapsed);

    const {currentUser, signout} = useContext(UserContext)

    const collapseComponents = (
        <div>
                <Nav.Link as={Link} to="/account">Account</Nav.Link>
                <Nav.Link as={Link} to="/exercises">Exercises</Nav.Link>

                <Nav.Link as={Link} to="/workouts">Workouts</Nav.Link>
                <Nav.Link onClick={signout} as={Link} to="/">Sign Out</Nav.Link>
        </div> 
    )

    const nonCollapseComponents = (
        <div>
            <Nav.Link as={Link} to="/">Login</Nav.Link>
            <Nav.Link as={Link} to="register">Signup</Nav.Link>
        </div>

    )


    return(
        <div>
            <Navbar>
                <NavbarToggler onClick={toggleNavbar} className="me-2"/>
                {
                    (currentUser) ? 
                    <div>
                    <div>
                    <Collapse isOpen={!collapsed} navbar>
                        <Nav navbar>
                        {collapseComponents} 
                        </Nav>
                        
                    </Collapse>
                    <NavbarBrand href="/" className="me-auto">
                Fitly
            </NavbarBrand>
                    </div>
                    <div>
                    </div>
                   </div>
                : 
                
                    <Nav navbar>
                        <NavbarBrand href="/" className="me-auto">
                Fitly
            </NavbarBrand>
                        {nonCollapseComponents}
                    </Nav>
                }
                
            

            </Navbar>
        </div>
    )

}

export default NavBar;