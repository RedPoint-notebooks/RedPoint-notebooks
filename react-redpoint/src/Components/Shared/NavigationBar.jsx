import React from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import logo from "../../placeholder_logo.svg";

const NavigationBar = props => {
  const setDefaultMarkdown = () => {
    props.setDefaultLanguage("markdown");
  };
  const setDefaultJavascript = () => {
    props.setDefaultLanguage("javascript");
  };
  const setDefaultRuby = () => {
    props.setDefaultLanguage("ruby");
  };
  const setDefaultPython = () => {
    props.setDefaultLanguage("python");
  };

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
            <NavDropdown.Item
              as="button"
              onClick={setDefaultMarkdown}
              active={props.state.defaultLanguage === "markdown" ? true : false}
            >
              Markdown
            </NavDropdown.Item>
            <NavDropdown.Item
              as="button"
              onClick={setDefaultJavascript}
              active={
                props.state.defaultLanguage === "javascript" ? true : false
              }
            >
              Javascript
            </NavDropdown.Item>
            <NavDropdown.Item
              as="button"
              onClick={setDefaultRuby}
              active={props.state.defaultLanguage === "ruby" ? true : false}
            >
              Ruby
            </NavDropdown.Item>
            <NavDropdown.Item
              as="button"
              onClick={setDefaultPython}
              active={props.state.defaultLanguage === "python" ? true : false}
            >
              Python
            </NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
export default NavigationBar;
