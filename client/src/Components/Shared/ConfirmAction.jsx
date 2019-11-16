import React from "react";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

const ConfirmAction = props => {
  return (
    <Alert variant="danger">
      <Alert.Heading>{props.warningMessage}</Alert.Heading>
      <Button
        className="delete-all-btn"
        as="button"
        variant="secondary"
        type="button"
        size="sm"
        onClick={props.onYesClick}
      >
        Yes
      </Button>
      <Button
        className="delete-all-btn"
        as="button"
        variant="secondary"
        type="button"
        size="sm"
        onClick={props.onNoClick}
      >
        No
      </Button>
    </Alert>
  );
};

export default ConfirmAction;
