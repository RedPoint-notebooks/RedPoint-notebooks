import React, { Component } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import Output from "./Output";
import Return from "./Return";
import Error from "./Error";

class CellResults extends Component {
  render() {
    const resultsObj = this.props.results;
    const formattedResults = Object.keys(resultsObj).map(resultType => {
      const data = resultsObj[resultType];

      switch (resultType) {
        case "output":
          return <Output output={data} />;
        case "return":
          return <Return returnVal={data} />;
        case "error":
          return <Error error={data} />;
        default:
          return;
      }
    });
    return <ListGroup>{formattedResults}</ListGroup>;
  }
}

export default CellResults;
