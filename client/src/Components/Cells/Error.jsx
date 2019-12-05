import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

const Error = props => {
  const returnStyle = { "white-space": "pre-wrap" };
  const cleanedError = props.error.replace(/.*user_script(.{4})/, "");

  return props.error ? (
    <ListGroup.Item className="output" variant="danger" style={returnStyle}>
      {cleanedError}
    </ListGroup.Item>
  ) : null;
};

export default Error;
