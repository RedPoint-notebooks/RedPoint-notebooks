import React, { Component } from "react";
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
            onAddCellClick={this.props.onAddCellClick}
            cellIndex={index}
            defaultLanguage={this.props.defaultLanguage}
          />
        );
      } else if (cell.type === "markdown") {
        return (
          <ToggleableMarkdownContainer
            language={cell.type}
            key={index}
            code={cell.code}
            onDeleteCellClick={this.props.onDeleteCellClick}
            onAddCellClick={this.props.onAddCellClick}
            cellIndex={index}
            defaultLanguage={this.props.defaultLanguage}
          />
        );
      }
      return null; // to appease React warning
    });

    cellContainers.push(
      <AddCodeCellButton
        soloButton="true"
        // className="solo-add-code-cell-btn" // TODO: not being applied
        cellIndex={cellContainers.length}
        onClick={this.props.onAddCellClick}
        key={cellContainers.length}
      />
    );
    return cellContainers;
  }
}

export default CellsList;
