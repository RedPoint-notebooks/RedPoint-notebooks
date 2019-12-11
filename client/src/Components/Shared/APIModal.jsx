import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import logo from "../../redpoint-brand-logo.svg";

class APIModal extends Component {
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
      <div>
        <div onClick={this.props.onToggleAPIForm}>API</div>
        <Modal
          show={this.props.modalVisible}
          onHide={this.props.onToggleAPIForm}
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
              Enter An API URL:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formAPI" className="banner-form">
                <Form.Control
                  type="API"
                  placeholder="Enter API URL"
                  onChange={this.handleFormInput}
                  className="api-url-form"
                />
              </Form.Group>
              <div className="flex-container">
                <Form.Text className="text-muted">
                  Make a GET request for JSON data at an API of your choosing
                </Form.Text>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
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
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default APIModal;
