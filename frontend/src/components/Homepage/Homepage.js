import React, { useContext} from "react";
import LoginForm from "../Forms/LoginForm/LoginForm";
import UserDashboard from "../UserDashboard/UserDashboard";
import UserContext from "../../context/UserContext";
import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

import { Button, Card, Row, Col, Container } from "reactstrap";

const Homepage = () => {

    const { currentUser, login } = useContext(UserContext);

    if(!currentUser)
    return(
            <div className="container d-flex flex-column align-items-center justify-content-center">
                <Card className="px-5 align-items-center">
                        <h1 className="pb-5">Fitly</h1>
                        <Row className="pb-4">
                            <Col>
                                <LoginForm className="loginComponent"/>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <h5>New to Fitly?</h5>
                                <Nav.Link className="btn btn-success" to="register">Signup Here</Nav.Link>
                            </Col>
                        </Row>
                </Card>
            </div>
    )

    else return (
        <UserDashboard></UserDashboard>

    )
}

export default Homepage;