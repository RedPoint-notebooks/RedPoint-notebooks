import React, { Component } from "react";
import CodeCell from "./CodeCell";

class CellsList extends Component {
  state = {};

  render() {
    const codemirrorCells = this.props.cells.map((cell, index) => {
      switch (cell.type) {
        case "javascript":
          return (
            <CodeCell
              key={index}
              code={cell.code}
              onAddCodeCellClick={this.props.onAddCodeCellClick}
              cellIndex={index}
            />
          );
        default:
          throw new Error("Bad cell type provided");
      }
    });
    return codemirrorCells;
  }
}

export default CellsList;
