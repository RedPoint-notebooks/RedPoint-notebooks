import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

const Error = props => {
  // debugger;
  return props.error ? (
    <ListGroup.Item className="output" variant="danger">
      {props.error}
    </ListGroup.Item>
  ) : null;
};

export default Error;
