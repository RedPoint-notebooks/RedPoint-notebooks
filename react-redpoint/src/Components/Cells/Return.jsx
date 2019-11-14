import React from "react";
import ListGroup from "react-bootstrap/ListGroup";

const Return = props => {
  return props.returnVal ? (
    <ListGroup.Item className="output" variant="light">
      > {props.returnVal}
    </ListGroup.Item>
  ) : null;
};

export default Return;
