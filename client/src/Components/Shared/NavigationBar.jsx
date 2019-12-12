import React from "react";
import Nav from "react-bootstrap/Nav";
import logo from "../../redpoint-brand-logo.svg";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import ConfirmAction from "./ConfirmAction";
import Spinner from "react-bootstrap/Spinner";
import PresentationToggle from "./PresentationToggle";
import { PROXY_URL } from "../../Constants/constants";
import uuidv4 from "uuid";
import IconWithTooltip from "./IconWithTooltip";
import {
  faCaretDown,
  faTrash,
  faRedo,
  faPlay,
  faChalkboardTeacher
} from "@fortawesome/free-solid-svg-icons";
import APIModal from "./APIModal";
import WebhookModal from "./WebhookModal";
import SaveOrCloneModal from "./SaveOrCloneModal";

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

  handleSaveClick = e => {
    e.preventDefault();
    const notebookId = this.props.notebookId;

    this.handlePersistenceClick("save", notebookId).then(() => {
      this.handleToggleSaveOrCloneForm();
    });
  };

  handleCloneClick = e => {
    e.preventDefault();
    if (this.state.saveOrCloneFormVisible === true) {
      this.setState({ saveOrCloneFormVisible: false });
    }
    const notebookId = uuidv4();

    this.handlePersistenceClick("clone", notebookId).then(() => {
      this.handleToggleSaveOrCloneForm();
    });
  };

  handlePersistenceClick = (operation, notebookId) => {
    return new Promise((resolve, reject) => {
      const notebook = {
        cells: this.props.cells,
        id: notebookId,
        presentation: this.props.presentation
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
          console.log(`${operation} response: `, data);
          const notebookURL = `${PROXY_URL}/notebooks/${notebookId}`;

          this.setState({
            notebookURL,
            operation
          });
          resolve();
        })
        .catch(err => {
          console.log(
            `Fetch error on POST request. Failed to ${operation} notebook.`
          );
          reject(err);
        });
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

  handleChange = () => {};

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
            <span className="logo-text">RedPoint</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Navbar.Text>File</Navbar.Text>
              <NavDropdown
                title={
                  <IconWithTooltip
                    tooltipText="Menu"
                    icon={faCaretDown}
                    placement="bottom"
                  />
                }
                id="basic-nav-dropdown"
                className="file-menu-dropdown"
              >
                <NavDropdown.Item>
                  <SaveOrCloneModal
                    name="Save"
                    onSaveClick={this.handleSaveClick}
                    modalVisible={this.state.saveOrCloneFormVisible}
                    onToggleModal={this.handleToggleSaveOrCloneForm}
                    notebookURL={this.state.notebookURL}
                    operation={this.state.operation}
                    onEmailSubmit={this.handleEmailSubmit}
                    onCloneClick={this.handleCloneClick}
                  />
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <SaveOrCloneModal
                    name="Clone"
                    onCloneClick={this.handleCloneClick}
                    modalVisible={this.state.saveOrCloneFormVisible}
                    onToggleModal={this.handleToggleSaveOrCloneForm}
                    notebookURL={this.state.notebookURL}
                    operation={this.state.operation}
                    onEmailSubmit={this.handleEmailSubmit}
                  />
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <APIModal
                    onToggleAPIForm={this.handleToggleAPIForm}
                    modalVisible={this.state.apiFormVisible}
                    onAPISubmit={this.props.onAPISubmit}
                  />
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <WebhookModal
                    onToggleWebhookForm={this.handleToggleWebhookForm}
                    modalVisible={this.state.webhookFormVisible}
                    notebookId={this.props.notebookId}
                  />
                </NavDropdown.Item>
              </NavDropdown>
              <Nav.Link onClick={this.toggleDeleteWarning}>
                <IconWithTooltip
                  tooltipText="Delete All Cells"
                  icon={faTrash}
                  placement="bottom"
                />
              </Nav.Link>
              <Nav.Link onClick={this.handleClearAllResults}>
                <IconWithTooltip
                  tooltipText="Clear All Output"
                  icon={faRedo}
                  placement="bottom"
                />
              </Nav.Link>
              {this.props.awaitingServerResponse() ? (
                <Spinner
                  className="navbar-spinner"
                  animation="border"
                  variant="secondary"
                  size="sm"
                />
              ) : (
                <Nav.Link onClick={this.props.onRunAllClick}>
                  <IconWithTooltip
                    tooltipText="Run All Cells"
                    icon={faPlay}
                    placement="bottom"
                  />
                </Nav.Link>
              )}
            </Nav>
            <Nav.Link className="navbar-clean-switch">
              <span className="navbar-text">
                <IconWithTooltip
                  tooltipText="Switch To Presentation View"
                  icon={faChalkboardTeacher}
                  className="clean-mode-icon"
                  placement="bottom"
                />
              </span>
              <PresentationToggle
                onClick={this.props.onToggleView}
                presentation={this.props.presentation}
              />
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
      </React.Fragment>
    );
  }
}
export default NavigationBar;
