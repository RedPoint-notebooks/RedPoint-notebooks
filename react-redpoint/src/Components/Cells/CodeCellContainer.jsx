import React, { Component } from "react";
import CodeCell from "./CodeCell";

class CodeCellContainer extends Component {
  render() {
    return (
      <CodeCell
        language={this.props.cell.type}
        key={this.props.index}
        code={this.props.cell.code}
        onAddCodeCellClick={this.props.onAddCodeCellClick}
        cellIndex={this.props.cellIndex}
      />
    );
  }
}

export default CodeCellContainer;
