import React from "react";
import Nav from "react-bootstrap/Nav";
import logo from "../../placeholder_logo.svg";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ConfirmAction from "./ConfirmAction";
import LoadForm from "./LoadForm";
import Spinner from "react-bootstrap/Spinner";
import APIForm from "./APIForm";

class NavigationBar extends React.Component {
  state = {
    deleteWarningVisible: false,
    loadFormVisible: false,
    apiFormVisible: false
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

  handleToggleAPIForm = () => {
    this.setState(prevState => {
      return {
        apiFormVisible: !prevState.apiFormVisible
      };
    });
  };

  render() {
    return (
      <React.Fragment>
        <Navbar bg="dark" variant="dark" sticky="top">
          <Navbar.Brand>
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
              <NavDropdown title="Notebook" id="basic-nav-dropdown">
                <NavDropdown.Item onClick={this.props.onSaveClick} name="save">
                  Save
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={this.props.onCloneClick}
                  name="clone"
                >
                  Clone
                </NavDropdown.Item>
                <NavDropdown.Item onClick={this.handleLoadClick}>
                  Load
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={this.toggleDeleteWarning}>Delete</Nav.Link>
              <Navbar.Text>|</Navbar.Text>
              <Nav.Link onClick={this.handleClearAllResults}>
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
                <Nav.Link onClick={this.props.onRunAllClick}>
                  Run All Cells
                </Nav.Link>
              )}
              <Navbar.Text>|</Navbar.Text>
            </Nav>
            <Nav.Link href="#api" onClick={this.handleToggleAPIForm}>
              API
            </Nav.Link>
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
        {this.state.apiFormVisible ? (
          <APIForm
            onAPISubmit={this.props.onAPISubmit}
            onToggleAPIForm={this.handleToggleAPIForm}
          ></APIForm>
        ) : null}
      </React.Fragment>
    );
  }
}
export default NavigationBar;
