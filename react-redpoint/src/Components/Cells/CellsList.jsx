import React, { Component } from "react";
import CodeCell from "./CodeCell";
import ToggleableMarkdownContainer from "./ToggleableMarkdownContainer";

class CellsList extends Component {
  state = {};

  render() {
    const codemirrorCells = this.props.cells.map((cell, index) => {
      if (cell.type === ("javascript" || "ruby" || "python")) {
        return (
          <CodeCell
            language={cell.type}
            key={index}
            code={cell.code}
            onAddCodeCellClick={this.props.onAddCodeCellClick}
            cellIndex={index}
          />
        );
      } else {
        return <ToggleableMarkdownContainer />;
      }
    });
    return codemirrorCells;
  }
}

export default CellsList;
