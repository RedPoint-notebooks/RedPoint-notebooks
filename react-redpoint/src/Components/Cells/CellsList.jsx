import React from "react";
import AddCellButton from "../Shared/AddCellButton";
import CodeCellContainer from "./CodeCellContainer";
import uuidv4 from "uuid/v4";

const CellsList = props => {
  const cellContainers = props.cells.map((cell, index) => {
    return (
      <CodeCellContainer
        cell={cell}
        key={uuidv4()}
        onDeleteCellClick={props.onDeleteCellClick}
        onAddCellClick={props.onAddCellClick}
        cellIndex={index}
        defaultLanguage={props.defaultLanguage}
        onLanguageChange={props.onLanguageChange}
        toggleRender={props.toggleRender}
        onUpdateCodeState={props.onUpdateCodeState}
        onRunClick={props.onRunClick}
      />
    );
  });

  cellContainers.push(
    <div className="add-cell-container">
      <AddCellButton
        // id="add-solo-cell-container"
        className="add-cell-btn"
        cellIndex={cellContainers.length}
        onClick={props.onAddCellClick}
        key={uuidv4()}
        defaultLanguage={props.defaultLanguage}
      />
    </div>
  );

  return cellContainers;
};

export default CellsList;
