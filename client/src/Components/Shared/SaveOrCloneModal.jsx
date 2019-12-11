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

  render() {
    const operation = this.props.operation;

    return (
      <div>
        <div
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
          onHide={this.props.onToggleModal}
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
              {operation === "clone" ? "Clone" : "Save"} this notebook:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formEmail" className="banner-form">
                <Form.Label className="flex-container">
                  <span>{`Your ${this.props.operation}d notebook URL is:`}</span>
                  <a
                    href={`${this.props.notebookURL}`}
                    className="save-url"
                  >{`${this.props.notebookURL}`}</a>
                </Form.Label>

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
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <div className="flex-container">
              <Form.Control
                type="API"
                placeholder="Enter an email address"
                onChange={this.handleFormInput}
                className="email-form"
              />
              <Form.Text className="text-muted">
                Send an email with this URL to your email address:
              </Form.Text>
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
                onClick={this.props.onToggleModal}
                variant="light"
                className="load-button"
                size="sm"
              >
                Dismiss
              </Button>
              {this.state.showFormError ? (
                <div className="flex-container">
                  <Form.Text type="invalid" className="email-address-error">
                    {this.state.formErrors.email}
                  </Form.Text>
                </div>
              ) : null}
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default SaveOrCloneModal;
