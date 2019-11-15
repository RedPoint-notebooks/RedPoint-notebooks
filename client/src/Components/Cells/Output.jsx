import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

const Output = props => {
  return props.output ? (
    <ListGroup.Item className="output" variant="success">
      {props.output}
    </ListGroup.Item>
  ) : null;
};

export default Output;
