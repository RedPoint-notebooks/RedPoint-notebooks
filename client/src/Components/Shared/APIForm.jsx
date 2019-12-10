import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

class APIForm extends Component {
  state = {
    api_url: ""
  };

  handleAPISubmit = () => {
    this.props.onToggleAPIForm();
    this.props.onAPISubmit(this.state.api_url);
  };

  handleFormInput = e => {
    this.setState({ api_url: e.target.value });
  };

  render() {
    return (
      <Alert variant="primary">
        <Form>
          <Form.Group controlId="formAPI" className="banner-form">
            <Form.Control
              type="API"
              placeholder="Enter API URL"
              onChange={this.handleFormInput}
              className="api-url-form"
            />
            <div className="flex-container">
              <Button
                className="load-button"
                onClick={this.handleAPISubmit}
                variant="primary"
                type="submit"
                size="sm"
              >
                Submit
              </Button>
              <Button
                onClick={this.props.onToggleAPIForm}
                variant="light"
                className="load-button"
                size="sm"
              >
                Cancel
              </Button>
            </div>
          </Form.Group>
          <div className="flex-container">
            <Form.Text className="text-muted">
              Make a GET request for JSON data at an API of your choosing
            </Form.Text>
          </div>
        </Form>
      </Alert>
    );
  }
}

export default APIForm;
