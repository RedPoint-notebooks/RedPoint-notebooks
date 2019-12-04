import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { CopyToClipboard } from "react-copy-to-clipboard";

class SaveOrCloneForm extends Component {
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
      this.props.onToggleSaveOrCloneForm();
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
    return (
      <Alert variant="primary">
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>
              {`Your ${this.props.operation}d notebook URL is: ${this.props.notebookURL}`}
            </Form.Label>
            <CopyToClipboard onCopy={this.onCopy} text={this.props.notebookURL}>
              <Button
                onClick={this.copyToClipboard}
                variant="light"
                className="copy-webhook"
                size="sm"
              >
                Copy
              </Button>
            </CopyToClipboard>
            {this.state.copied ? (
              <p className="copied-text">Copied to clipboard</p>
            ) : null}
            <Form.Text className="text-muted">
              Send an email with this URL to your email address:
            </Form.Text>
            <Form.Control
              type="API"
              placeholder="Enter an email address"
              onChange={this.handleFormInput}
            />
            {this.state.showFormError ? (
              <Form.Text type="invalid">
                {this.state.formErrors.email}
              </Form.Text>
            ) : null}
          </Form.Group>
          <Button
            className="load-button"
            onClick={this.handleEmailSubmit}
            variant="primary"
            type="submit"
          >
            Send
          </Button>
          <Button
            onClick={this.props.onToggleSaveOrCloneForm}
            variant="light"
            className="load-button"
          >
            Dismiss
          </Button>
        </Form>
      </Alert>
    );
  }
}
export default SaveOrCloneForm;
