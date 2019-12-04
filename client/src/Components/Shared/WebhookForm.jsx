import React, { Component } from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { PROXY_URL } from "../../Constants/constants";
import { CopyToClipboard } from "react-copy-to-clipboard";

class WebhookForm extends Component {
  state = {
    copied: false
  };

  webhookURL = `${PROXY_URL}/webhooks/${this.props.notebookId}`;

  onCopy = () => {
    this.setState({ copied: true });
  };

  render() {
    return (
      <Alert variant="primary">
        <Form>
          <Form.Group controlId="formAPI">
            <Form.Label size="lg">
              Here's your notebook's webhook URL: {this.webhookURL}
            </Form.Label>
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
            {this.state.copied ? (
              <p className="copied-text">Copied to clipboard</p>
            ) : null}

            <Form.Text className="text-muted">
              {`Use this URL to configure a webhook provider. 
              When an action triggers a webhook, the JSON payload will appear in a new Javascript cell (upon page refresh).`}
            </Form.Text>
          </Form.Group>

          <Button
            onClick={this.props.onToggleWebhookForm}
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

export default WebhookForm;
