import React, { Component } from "react";
import AddCellButton from "../Shared/AddCellButton";
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
          results={cell.results}
          onDeleteCellClick={this.props.onDeleteCellClick}
          onAddCellClick={this.props.onAddCellClick}
          cellIndex={index}
          defaultLanguage={this.props.defaultLanguage}
          rendered={cell.rendered}
          onLanguageChange={this.props.onLanguageChange}
          toggleRender={this.props.toggleRender}
          onUpdateCodeState={this.props.onUpdateCodeState}
          onRunClick={this.props.onRunClick}
        />
      );
    });

    cellContainers.push(
      <AddCellButton
        soloButton="true"
        cellIndex={cellContainers.length}
        onClick={this.props.onAddCellClick}
        key={uuidv4()}
        defaultLanguage={this.props.defaultLanguage}
      />
    );
    return cellContainers;
  }
}

export default CellsList;
