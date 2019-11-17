import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

const Error = props => {
  const addLineBreaks = string =>
    string.split("\n").map((text, index) => (
      <React.Fragment key={`${text}-${index}`}>
        {text}
        <br />
      </React.Fragment>
    ));

  const cleanedError = props.error.replace(/.*user_script(.{4})/, "");

  return props.error ? (
    <ListGroup.Item className="output" variant="danger">
      {addLineBreaks(cleanedError)}
    </ListGroup.Item>
  ) : null;
};

export default Error;
