import React, { Component } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import logo from "../../redpoint-brand-logo.svg";
import { PROXY_URL } from "../../Constants/constants";
import { CopyToClipboard } from "react-copy-to-clipboard";

class WebhookModal extends Component {
  state = {
    copied: false
  };

  webhookURL = `${PROXY_URL}/webhooks/${this.props.notebookId}`;

  onCopy = () => {
    this.setState({ copied: true });
  };

  onToggleModal = () => {
    this.setState({ copied: false });
    this.props.onToggleWebhookForm();
  };

  render() {
    return (
      <div>
        <div onClick={this.onToggleModal} className="navbar-dropdown-clickable">
          Webhooks
        </div>
        <Modal
          show={this.props.modalVisible}
          onHide={this.onToggleModal}
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
              Use this URL to receive Webhooks:
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div className="flex-container">
                <span className="webhook-url">{this.webhookURL}</span>
                {this.state.copied ? (
                  <p className="copied-text">Copied to clipboard</p>
                ) : (
                  <CopyToClipboard onCopy={this.onCopy} text={this.webhookURL}>
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

              <Form.Text className="text-muted centered">
                <span>
                  Use this URL to configure a webhook provider. When an action
                  triggers a webhook, the JSON payload will appear in a new
                  Javascript cell (on page refresh).
                </span>
              </Form.Text>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={this.onToggleModal}
              variant="light"
              className="load-button"
              size="sm"
            >
              Cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default WebhookModal;
