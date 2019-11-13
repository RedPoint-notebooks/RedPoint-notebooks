import React, { Component } from "react";
import CodeCell from "./CodeCell";

class CodeCellContainer extends Component {
  render() {
    return (
      <CodeCell
        language={this.props.language}
        key={this.props.index}
        code={this.props.code}
        onAddCodeCellClick={this.props.onAddCodeCellClick}
        onDeleteCellClick={this.props.onDeleteCellClick}
        cellIndex={this.props.cellIndex}
      />
    );
  }
}

export default CodeCellContainer;
