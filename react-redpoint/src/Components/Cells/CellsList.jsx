import React, { Component } from "react";
import CodeCell from "./CodeCell";
import ToggleableMarkdownContainer from "./ToggleableMarkdownContainer";
import AddCodeCellButton from "../Shared/AddCodeCellButton";
import CodeCellContainer from "./CodeCellContainer";

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

    codemirrorCells.push(
      <AddCodeCellButton
        cellIndex={codemirrorCells.length}
        onClick={this.props.onAddCodeCellClick}
      />
    );
    return codemirrorCells;
  }
}

export default CellsList;
