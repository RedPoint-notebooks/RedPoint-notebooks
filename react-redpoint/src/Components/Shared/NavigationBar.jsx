import React from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import logo from "../../placeholder_logo.svg";

const NavigationBar = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">
        <img
          alt=""
          src={logo}
          width="30"
          height="30"
          className="d-inline-block align-top"
        />{" "}
        RedPoint
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#home">Share</Nav.Link>
          <Nav.Link href="#foo">Clone</Nav.Link>
          <Nav.Link href="#link">Delete</Nav.Link>
          <NavDropdown title="Default Language" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Javascript</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Ruby</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Python</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavigationBar;
