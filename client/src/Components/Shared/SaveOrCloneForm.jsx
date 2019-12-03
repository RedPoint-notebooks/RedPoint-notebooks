import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class SaveOrCloneForm extends Component {
  state = {
    emailAddress: ""
  };

  handleEmailSubmit = () => {
    this.props.onToggleSaveOrCloneForm();
    this.props.onEmailSubmit(this.state.emailAddress);
  };

  handleFormInput = e => {
    this.setState({ emailAddress: e.target.value });
  };

  render() {
    return (
      <Alert variant="primary">
        <Form>
          <Form.Group controlId="formEmail">
            <Form.Label>
              {`Your ${this.props.operation}d notebook URL is: ${this.props.notebookURL}`}
            </Form.Label>
            <Form.Text className="text-muted">
              Send an email with this URL to your email address:
            </Form.Text>
            <Form.Control
              type="API"
              placeholder="Enter an email address"
              onChange={this.handleFormInput}
            />
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
