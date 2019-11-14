import React, { Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";

class CellResults extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <ListGroup variant="flush">
        <ListGroup.Item className="output" variant="success">
          OUTPUT
        </ListGroup.Item>
        <ListGroup.Item className="output" variant="danger">
          ERROR
        </ListGroup.Item>
        <ListGroup.Item className="output" variant="light">
          RETURN VALUE
        </ListGroup.Item>
      </ListGroup>
    );
  }
}

export default CellResults;
