import React from "react";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Nav from "react-bootstrap/Nav";
import logo from "../../placeholder_logo.svg";

class NavigationBar extends React.Component {
  setDefaultLanguage = e => {
    const language = e.target.value;
    this.props.setDefaultLanguage(language);
  };

  render() {
    const capitalized = string => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };
    // TODO: pull language options from a config file
    const navDropDownItems = ["markdown", "javascript", "ruby", "python"].map(
      language => {
        return (
          <NavDropdown.Item
            as="button"
            value={language}
            onClick={this.setDefaultLanguage}
            active={
              this.props.state.defaultLanguage === { language } ? true : false
            }
          >
            {capitalized(language)}
          </NavDropdown.Item>
        );
      }
    );

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
