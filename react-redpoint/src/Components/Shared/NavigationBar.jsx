import React from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import logo from "../../placeholder_logo.svg";
import * as constants from "../../Constants/constants";
import uuidv4 from "uuid";


class NavigationBar extends React.Component {
  handleSetDefaultLanguage = e => {
    const language = e.target.value;
    this.props.setDefaultLanguage(language);
  };

  render() {
    const navDropDownItems = constants.LOWERCASE_LANGUAGES.map(language => {
      return (
        <NavDropdown.Item
          as="button"
           key={uuidv4()}
          value={language}
          onClick={this.setDefaultLanguage}
          active={
            this.props.state.defaultLanguage === { language } ? true : false
          }
        >
          {constants.capitalizeLanguage(language)}
        </NavDropdown.Item>
      );
    });

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
              {navDropDownItems}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
export default NavigationBar;
