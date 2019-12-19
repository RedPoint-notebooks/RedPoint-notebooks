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
  faPlay
} from "@fortawesome/free-solid-svg-icons";
import APIModal from "./APIModal";
import WebhookModal from "./WebhookModal";
import SaveOrCloneModal from "./SaveOrCloneModal";
import TitleForm from "../Cells/TitleForm";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

class NavigationBar extends React.Component {
  state = {
    deleteWarningVisible: false,
    apiModalVisible: false,
    saveOrCloneModalVisible: false,
    webhookModalVisible: false,
    notebookURL: null,
    operation: null,
    titleFormVisible: false
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
        apiModalVisible: !prevState.apiModalVisible
      };
    });
  };

  handleToggleSaveOrCloneForm = () => {
    this.setState(prevState => {
      return {
        saveOrCloneModalVisible: !prevState.saveOrCloneModalVisible
      };
    });
  };

  handleToggleWebhookForm = () => {
    this.setState(prevState => {
      return {
        webhookModalVisible: !prevState.webhookModalVisible
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
    let notebookId;

    if (this.props.isClone) {
      notebookId = uuidv4();
      this.props.onSetNotebookId(notebookId);
      this.props.onRemoveCloneFlag();
    } else {
      notebookId = this.props.notebookId;
    }

    this.handlePersistenceClick("save", notebookId, this.props.title).then(
      () => {
        this.handleToggleSaveOrCloneForm();
      }
    );
  };

  handleCloneClick = e => {
    e.preventDefault();
    if (this.state.saveOrCloneModalVisible === true) {
      this.setState({ saveOrCloneModalVisible: false });
    }
    const notebookId = uuidv4();
    const title = "Clone of " + this.props.title;

    this.handlePersistenceClick("clone", notebookId, title).then(() => {
      this.handleToggleSaveOrCloneForm();
    });
  };

  handlePersistenceClick = (operation, notebookId, title) => {
    return new Promise((resolve, reject) => {
      const notebook = {
        cells: this.props.cells,
        id: notebookId,
        presentation: this.props.presentation,
        isClone: operation === "clone",
        title
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
    const title = this.props.title;
    const emailJSON = JSON.stringify({
      emailAddress,
      operation,
      notebookURL,
      title
    });

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

  handleTitleClick = () => {
    this.setState({ titleFormVisible: true });
  };

  handleTitleSubmit = title => {
    this.setState({ titleFormVisible: false });
    this.props.onTitleSubmit(title);
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
            <span className="logo-text">RedPoint</span>
          </Navbar.Brand>
          <OverlayTrigger
            key="bottom"
            placement="bottom"
            delay={1000}
            trigger="hover"
            overlay={<Tooltip id="tooltip">Click to edit title</Tooltip>}
          >
            <Navbar.Text
              onClick={this.handleTitleClick}
              className="cursor-pointer"
            >
              {this.props.title ? this.props.title : null}
            </Navbar.Text>
          </OverlayTrigger>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown
                title={
                  <span>
                    <span className="dropdown-text-button">File</span>
                    <IconWithTooltip
                      tooltipText="Menu"
                      icon={faCaretDown}
                      placement="bottom"
                    />
                  </span>
                }
                id="basic-nav-dropdown"
                className="file-menu-dropdown"
              >
                <NavDropdown.Item>
                  <SaveOrCloneModal
                    name="Save"
                    onSaveClick={this.handleSaveClick}
                    modalVisible={this.state.saveOrCloneModalVisible}
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
                    modalVisible={this.state.saveOrCloneModalVisible}
                    onToggleModal={this.handleToggleSaveOrCloneForm}
                    notebookURL={this.state.notebookURL}
                    operation={this.state.operation}
                    onEmailSubmit={this.handleEmailSubmit}
                  />
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <APIModal
                    onToggleAPIForm={this.handleToggleAPIForm}
                    modalVisible={this.state.apiModalVisible}
                    onAPISubmit={this.props.onAPISubmit}
                  />
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <WebhookModal
                    onToggleWebhookForm={this.handleToggleWebhookForm}
                    modalVisible={this.state.webhookModalVisible}
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
        {this.state.titleFormVisible ? (
          <TitleForm
            onTitleSubmit={this.handleTitleSubmit}
            title={this.props.title}
          />
        ) : null}
      </React.Fragment>
    );
  }
}
export default NavigationBar;
