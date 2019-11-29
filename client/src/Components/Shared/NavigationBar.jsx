import React from "react";
import Nav from "react-bootstrap/Nav";
import logo from "../../placeholder_logo.svg";
import Navbar from "react-bootstrap/Navbar";
import ConfirmAction from "./ConfirmAction";
import LoadForm from "./LoadForm";
import Spinner from "react-bootstrap/Spinner";

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
        <Navbar bg="dark" variant="dark" sticky="top">
          <Navbar.Brand href="#logo">
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
              <Nav.Link href="#share">Share</Nav.Link>
              <Navbar.Text>|</Navbar.Text>
              <Nav.Link href="#clone">Clone</Nav.Link>
              <Navbar.Text>|</Navbar.Text>
              <Nav.Link href="#save" onClick={this.props.onSaveClick}>
                Save
              </Nav.Link>
              <Navbar.Text>|</Navbar.Text>
              <Nav.Link href="#load" onClick={this.handleLoadClick}>
                Load
              </Nav.Link>
              <Navbar.Text>|</Navbar.Text>
              <Nav.Link href="#delete" onClick={this.toggleDeleteWarning}>
                Delete
              </Nav.Link>
              <Navbar.Text>|</Navbar.Text>
              <Nav.Link
                href="#removeResults"
                onClick={this.handleClearAllResults}
              >
                Clear Results
              </Nav.Link>
              <Navbar.Text>|</Navbar.Text>
              {this.props.awaitingServerResponse() ? (
                <Spinner
                  className="navbar-spinner"
                  animation="border"
                  variant="secondary"
                  size="sm"
                />
              ) : (
                <Nav.Link href="#runAll" onClick={this.props.onRunAllClick}>
                  Run All Cells
                </Nav.Link>
              )}
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
