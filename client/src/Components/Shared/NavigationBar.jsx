import React from "react";
import Nav from "react-bootstrap/Nav";
import logo from "../../placeholder_logo.svg";
import Navbar from "react-bootstrap/Navbar";
import ConfirmAction from "./ConfirmAction";
import LoadForm from "./LoadForm";

class NavigationBar extends React.Component {
  state = {
    deleteWarningVisible: false,
    loadFormVisible: false
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

  handleClearAllResults = e => {
    e.preventDefault();
    this.props.onClearAllResults();
  };

  handleLoadClick = e => {
    e.preventDefault();
    this.handleToggleLoadForm();
  };

  handleToggleLoadForm = () => {
    this.setState(prevState => {
      return {
        loadFormVisible: !prevState.loadFormVisible
      };
    });
  };

  render() {
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
              <Nav.Link href="#load" onClick={this.handleLoadClick}>
                Load
              </Nav.Link>
              <Nav.Link href="#link" onClick={this.toggleDeleteWarning}>
                Delete
              </Nav.Link>
              <Nav.Link
                href="#removeResults"
                onClick={this.handleClearAllResults}
              >
                Clear Results
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        {this.state.deleteWarningVisible ? (
          <ConfirmAction
            id="confirm-delete-all"
            warningMessage={"Are you sure you want to delete all cells?"}
            onYesClick={this.handleDeleteAllClick}
            onNoClick={this.toggleDeleteWarning}
          />
        ) : null}
        {this.state.loadFormVisible ? (
          <LoadForm
            onLoadClick={this.props.onLoadClick}
            onToggleLoadForm={this.handleToggleLoadForm}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
export default NavigationBar;
