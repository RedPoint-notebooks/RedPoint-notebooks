import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

class LoadForm extends Component {
  state = {
    notebookId: ""
  };

  handleChange = e => {
    this.setState({ notebookId: e.target.value });
  };

  handleLoadClick = () => {
    this.props.onLoadClick(this.state.notebookId);
    this.setState({ notebookId: "" });
    this.props.onToggleLoadForm();
  };

  render() {
    return (
      <Form>
        <Form.Group controlId="loadNotebook.ControlInput1">
          <Form.Control
            onChange={this.handleChange}
            type="notebookId"
            placeholder="Enter the Notebook ID:"
          />
        </Form.Group>
        <div className="load-notebook-container">
          <Button
            variant="light"
            className="load-button"
            onClick={this.handleLoadClick}
          >
            Load
          </Button>
          <Button variant="secondary" onClick={this.props.onToggleLoadForm}>
            Cancel
          </Button>
        </div>
        <Form.Group controlId="exampleForm.ControlInput1"></Form.Group>
      </Form>
    );
  }
}

export default LoadForm;
