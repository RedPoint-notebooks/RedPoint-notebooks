import React from "react";
import Nav from "react-bootstrap/Nav";
import logo from "../../placeholder_logo.svg";
import * as constants from "../../Constants/constants";
import uuidv4 from "uuid";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ConfirmAction from "./ConfirmAction";

class NavigationBar extends React.Component {
  state = {
    deleteWarningVisible: false
  };

  handleSetDefaultLanguage = e => {
    const language = e.target.value;
    this.props.setDefaultLanguage(language);
  };

  toggleDeleteWarning = () => {
    this.setState(prevState => {
      return {
        deleteWarningVisible: !prevState.deleteWarningVisible
      };
    });
  };

  handleDeleteAllClick = e => {
    e.preventDefault();
    this.props.deleteAllCells();
    this.toggleDeleteWarning();
  };

  render() {
    const navDropDownItems = constants.LANGUAGES.map(language => {
      return (
        <NavDropdown.Item
          as="button"
          key={uuidv4()}
          value={language}
          onClick={this.handleSetDefaultLanguage}
          active={this.props.state.defaultLanguage === language ? true : false}
        >
          {language}
        </NavDropdown.Item>
      );
    });

    return (
      <React.Fragment>
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
              <Nav.Link href="#save" onClick={this.props.onSaveClick}>
                Save
              </Nav.Link>
              <Nav.Link href="#link" onClick={this.toggleDeleteWarning}>
                Delete
              </Nav.Link>
              <NavDropdown title="Default Language" id="basic-nav-dropdown">
                {navDropDownItems}
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.state.deleteWarningVisible ? (
          <ConfirmAction
            warningMessage={"Are you sure you want to delete all cells?"}
            onYesClick={this.onDeleteAllClick}
            onNoClick={this.toggleDeleteWarning}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
export default NavigationBar;
