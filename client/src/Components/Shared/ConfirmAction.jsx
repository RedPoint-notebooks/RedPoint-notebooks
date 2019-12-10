import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const ConfirmAction = props => {
  return (
    <Alert variant="danger" className="delete-all-banner">
      <Alert.Heading>{props.warningMessage}</Alert.Heading>
      <span className="banner-buttons">
        <Button
          className="delete-all-btn"
          as="button"
          variant="secondary"
          type="button"
          size="sm"
          onClick={props.onYesClick}
        >
          <span>Yes</span>
        </Button>
        <Button
          className="delete-all-btn"
          as="button"
          variant="secondary"
          type="button"
          size="sm"
          onClick={props.onNoClick}
        >
          <span>No</span>
        </Button>
      </span>
    </Alert>
  );
};

export default ConfirmAction;
