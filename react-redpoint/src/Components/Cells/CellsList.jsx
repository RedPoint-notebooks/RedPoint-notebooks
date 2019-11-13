import React, { Component } from "react";
import AddCodeCellButton from "../Shared/AddCodeCellButton";
import CodeCellContainer from "./CodeCellContainer";
import uuidv4 from "uuid/v4";

class CellsList extends Component {
  state = {};

  render() {
    const cellContainers = this.props.cells.map((cell, index) => {
      return (
        <CodeCellContainer
          language={cell.type}
          key={uuidv4()}
          code={cell.code}
          onDeleteCellClick={this.props.onDeleteCellClick}
          onAddCellClick={this.props.onAddCellClick}
          cellIndex={index}
          defaultLanguage={this.props.defaultLanguage}
          editable={cell.editable}
        />
      );
    });

    cellContainers.push(
      <AddCodeCellButton
        soloButton="true"
        // className="solo-add-code-cell-btn" // TODO: not being applied
        cellIndex={cellContainers.length}
        onClick={this.props.onAddCellClick}
        key={cellContainers.length}
        defaultLanguage={this.props.defaultLanguage}
      />
    );
    return cellContainers;
  }
}

export default CellsList;
