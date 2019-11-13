import React, { Component } from "react";
import CodeCell from "./CodeCell";
import ToggleableMarkdownContainer from "./ToggleableMarkdownContainer";
import AddCodeCellButton from "../Shared/AddCodeCellButton";
import CodeCellContainer from "./CodeCellContainer";

class CellsList extends Component {
  state = {};

  render() {
    const cellContainers = this.props.cells.map((cell, index) => {
      if (cell.type === ("javascript" || "ruby" || "python")) {
        return (
          <CodeCellContainer
            language={cell.type}
            key={index}
            code={cell.code}
            onDeleteCellClick={this.props.onDeleteCellClick}
            onAddCodeCellClick={this.props.onAddCodeCellClick}
            cellIndex={index}
          />
        );
      } else {
        return <ToggleableMarkdownContainer />;
      }
    });

    cellContainers.push(
      <AddCodeCellButton
        cellIndex={cellContainers.length}
        onClick={this.props.onAddCodeCellClick}
      />
    );
    return cellContainers;
  }
}

export default CellsList;
