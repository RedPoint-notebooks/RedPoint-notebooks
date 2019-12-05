import React from "react";
import Nav from "react-bootstrap/Nav";
import logo from "../../placeholder_logo.svg";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ConfirmAction from "./ConfirmAction";
import Spinner from "react-bootstrap/Spinner";
import APIForm from "./APIForm";
import SaveOrCloneForm from "./SaveOrCloneForm";
import WebhookForm from "./WebhookForm";
import { PROXY_URL } from "../../Constants/constants";
import uuidv4 from "uuid";

class NavigationBar extends React.Component {
  state = {
    deleteWarningVisible: false,
    apiFormVisible: false,
    saveOrCloneFormVisible: false,
    webhookFormVisible: false,
    notebookURL: null,
    operation: null
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

  handleToggleAPIForm = () => {
    this.setState(prevState => {
      return {
        apiFormVisible: !prevState.apiFormVisible
      };
    });
  };

  handleToggleSaveOrCloneForm = () => {
    this.setState(prevState => {
      return {
        saveOrCloneFormVisible: !prevState.saveOrCloneFormVisible
      };
    });
  };

  handleToggleWebhookForm = () => {
    this.setState(prevState => {
      return {
        webhookFormVisible: !prevState.webhookFormVisible
      };
    });

    const notebook = {
      cells: this.props.cells,
      id: this.props.notebookId
    };

    notebook.cells = notebook.cells.map(cell => {
      cell.results = { stdout: [], error: "", return: "" };
      return cell;
    });

    const serializedNotebook = JSON.stringify(notebook);
    console.log(`Notebook save request sent`);

    fetch(`/save`, {
      method: "post",
      mode: "cors",
      cache: "no-cache",
      body: serializedNotebook,
      headers: { "Content-Type": "text/plain" }
    })
      .then(res => {
        return res.text();
      })
      .then(data => {
        console.log(`Save response: `, data);
      })
      .catch(err => {
        console.log(`Fetch error on POST request. Failed to save.`);
      });
  };

  handleSaveOrCloneClick = e => {
    e.preventDefault();
    const operation = e.target.name;

    const isSaveClick = operation === "save";
    const cloneId = uuidv4();
    const notebookId = isSaveClick ? this.props.notebookId : cloneId;

    const notebook = {
      cells: this.props.cells,
      id: notebookId
    };

    notebook.cells = notebook.cells.map(cell => {
      cell.results = { stdout: [], error: "", return: "" };
      return cell;
    });

    const serializedNotebook = JSON.stringify(notebook);
    console.log(`Notebook ${operation} request sent`);

    fetch(`/${operation}`, {
      method: "post",
      mode: "cors",
      cache: "no-cache",
      body: serializedNotebook,
      headers: { "Content-Type": "text/plain" }
    })
      .then(res => {
        return res.text();
      })
      .then(data => {
        this.handleToggleSaveOrCloneForm();

        this.setState({
          notebookURL: `${PROXY_URL}/notebooks/${notebookId}`,
          operation
        });
        console.log(`${operation} response: `, data);
      })
      .catch(err => {
        console.log(`Fetch error on POST request. Failed to ${operation}.`);
      });
  };

  handleEmailSubmit = emailAddress => {
    const operation = this.state.operation;
    const notebookURL = this.state.notebookURL;
    const emailJSON = JSON.stringify({ emailAddress, operation, notebookURL });

    fetch(`${PROXY_URL}/email`, {
      method: "post",
      mode: "cors",
      cache: "no-cache",
      body: emailJSON,
      headers: { "Content-Type": "text/plain" }
    })
      .then(res => {
        return res.text();
      })
      .then(data => {
        console.log(`Response to POST request to /email: `, data);
      })
      .catch(err => {
        console.log(
          "Fetch error on POST request to /email. Failed to send email."
        );
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
                <NavDropdown.Item
                  onClick={this.handleSaveOrCloneClick}
                  name="save"
                >
                  Save
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={this.handleSaveOrCloneClick}
                  name="clone"
                >
                  Clone
                </NavDropdown.Item>
                <NavDropdown.Item onClick={this.handleLoadClick}>
                  Load
                </NavDropdown.Item>
                <NavDropdown.Item onClick={this.handleToggleAPIForm}>
                  API
                </NavDropdown.Item>
                <NavDropdown.Item onClick={this.handleToggleWebhookForm}>
                  Webhooks
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={this.toggleDeleteWarning}>Delete</Nav.Link>
              <Nav.Link onClick={this.handleClearAllResults}>Clear</Nav.Link>
              {this.props.awaitingServerResponse() ? (
                <Spinner
                  className="navbar-spinner"
                  animation="border"
                  variant="secondary"
                  size="sm"
                />
              ) : (
                <Nav.Link onClick={this.props.onRunAllClick}>Run All</Nav.Link>
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
        {this.state.apiFormVisible ? (
          <APIForm
            onAPISubmit={this.props.onAPISubmit}
            onToggleAPIForm={this.handleToggleAPIForm}
          ></APIForm>
        ) : null}
        {this.state.saveOrCloneFormVisible ? (
          <SaveOrCloneForm
            notebookURL={this.state.notebookURL}
            operation={this.state.operation}
            onEmailSubmit={this.handleEmailSubmit}
            onToggleSaveOrCloneForm={this.handleToggleSaveOrCloneForm}
          ></SaveOrCloneForm>
        ) : null}
        {this.state.webhookFormVisible ? (
          <WebhookForm
            notebookId={this.props.notebookId}
            onToggleWebhookForm={this.handleToggleWebhookForm}
          ></WebhookForm>
        ) : null}
      </React.Fragment>
    );
  }
}
export default NavigationBar;
