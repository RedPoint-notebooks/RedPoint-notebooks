import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

const Return = props => {
  const returnStyle = { "white-space": "pre-wrap" };

  return props.returnVal ? (
    <ListGroup.Item className="output" variant="light" style={returnStyle}>
      {props.returnVal}
    </ListGroup.Item>
  ) : null;
};

export default Return;
