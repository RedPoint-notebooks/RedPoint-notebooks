import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

const Error = props => {
  // const brError = props.error.replace(/\n/g, "\r\n");

  const addLineBreaks = string =>
    string.split("\n").map((text, index) => (
      <React.Fragment key={`${text}-${index}`}>
        {text}
        <br />
      </React.Fragment>
    ));

  return props.error ? (
    <ListGroup.Item className="output" variant="danger">
      {addLineBreaks(props.error)}
    </ListGroup.Item>
  ) : null;
};

export default Error;
