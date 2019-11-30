import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class APIForm extends Component {
  state = {
    api_url: ""
  };

  handleAPISubmit = () => {
    this.props.onAPISubmit(this.state.api_url);
  };

  handleFormInput = e => {
    this.setState({ api_url: e.target.value });
  };

  render() {
    return (
      <Alert variant="primary">
        <Form>
          <Form.Group controlId="formAPI">
            <Form.Label>API URL:</Form.Label>
            <Form.Control
              type="API"
              placeholder="Enter API URL"
              onChange={this.handleFormInput}
            />
            <Form.Text className="text-muted">
              Make a GET request for JSON data at an API of your choosing
            </Form.Text>
          </Form.Group>
          <Button
            onClick={this.handleAPISubmit}
            variant="primary"
            type="submit"
          >
            Submit
          </Button>
        </Form>
      </Alert>
    );
  }
}

export default APIForm;
