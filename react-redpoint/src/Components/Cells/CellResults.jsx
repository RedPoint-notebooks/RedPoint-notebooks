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
          // maps every time a message is received from stdout
          const outputLines = data.map(outputline => {
            return <Output key={"output"} output={outputline} />;
          });
          return outputLines;
        case "return":
          return <Return key={"return"} returnVal={data} />;
        case "error":
          return <Error key={"error"} error={data} />;
        default:
          return;
      }
    });
    return <ListGroup>{formattedResults}</ListGroup>;
  }
}

export default CellResults;
