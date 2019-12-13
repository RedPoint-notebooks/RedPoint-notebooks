import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import logo from "../../redpoint-brand-logo.svg";
import { CopyToClipboard } from "react-copy-to-clipboard";

class SaveOrCloneModal extends Component {
  state = {
    emailAddress: "",
    formErrors: { email: "" },
    emailValid: false,
    showFormError: false,
    copied: false
  };

  handleEmailSubmit = e => {
    if (!this.state.emailValid) {
      e.preventDefault();
      this.setState({ showFormError: true });
    } else {
      this.props.onToggleModal();
      this.props.onEmailSubmit(this.state.emailAddress);
    }
  };

  onCopy = () => {
    this.setState({ copied: true });
  };

  validateEmail = value => {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;

    emailValid = !!value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
    fieldValidationErrors.email = emailValid
      ? ""
      : "Please enter a valid email address";

    this.setState({
      formErrors: fieldValidationErrors,
      emailValid: emailValid
    });
  };

  handleFormInput = e => {
    const value = e.target.value;
    this.setState({ emailAddress: value }, () => {
      this.validateEmail(value);
    });
  };

  handleModalToggle = () => {
    this.setState({ showFormError: false, copied: false });
    this.props.onToggleModal();
  };

  render() {
    const operation = this.props.operation;

    return (
      <div>
        <div
          className="navbar-dropdown-clickable"
          onClick={
            this.props.name === "Clone"
              ? this.props.onCloneClick
              : this.props.onSaveClick
          }
        >
          {this.props.name}
        </div>
        <Modal
          show={this.props.modalVisible}
          onHide={this.handleModalToggle}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              <img
                alt=""
                src={logo}
                width="30"
                height="30"
                className="d-inline-block align-top modal-logo"
              />
              <span>{`Your ${this.props.operation}d notebook URL is:`}</span>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="flex-container">
                <a
                  href={`${this.props.notebookURL}`}
                  className="save-url"
                >{`${this.props.notebookURL}`}</a>

                {this.state.copied ? (
                  <p className="copied-text">Copied to clipboard</p>
                ) : (
                  <CopyToClipboard
                    onCopy={this.onCopy}
                    text={this.props.notebookURL}
                  >
                    <Button
                      onClick={this.copyToClipboard}
                      variant="light"
                      className="copy-webhook"
                      size="sm"
                    >
                      Copy
                    </Button>
                  </CopyToClipboard>
                )}
              </div>
              {operation === "save" ? (
                <Form.Text className="text-muted centered">
                  WARNING: Don't share this link with anyone or they will be
                  able to mutate your work. To share a copy, use{" "}
                  <strong
                    onClick={this.props.onCloneClick}
                    className="cursor-pointer"
                  >
                    Clone
                  </strong>{" "}
                  instead.
                </Form.Text>
              ) : (
                <Form.Text className="text-muted centered">
                  Clone makes a replica of your notebook, optimal for sharing.
                </Form.Text>
              )}
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Form.Text className="text-muted">
              Send an email with this URL:
            </Form.Text>
            <Form.Control
              type="API"
              placeholder="Enter an email address"
              onChange={this.handleFormInput}
              className="email-form"
            />
          </Modal.Footer>
          <div className="flex-container save-clone-buttons">
            <Button
              className="load-button"
              onClick={this.handleEmailSubmit}
              variant="primary"
              type="submit"
              size="sm"
            >
              Send
            </Button>
            <Button
              onClick={this.handleModalToggle}
              variant="light"
              className="load-button"
              size="sm"
            >
              Dismiss
            </Button>
          </div>
          <div className="flex-container">
            {this.state.showFormError ? (
              <Form.Text
                type="invalid"
                className="email-address-error save-clone-modal"
              >
                {this.state.formErrors.email}
              </Form.Text>
            ) : null}
          </div>
        </Modal>
      </div>
    );
  }
}

export default SaveOrCloneModal;
