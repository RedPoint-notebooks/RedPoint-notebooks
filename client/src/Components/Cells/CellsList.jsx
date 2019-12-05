import React from "react";
import AddCellButton from "../Shared/AddCellButton";
import CodeCellContainer from "./CodeCellContainer";

const CellsList = props => {
  const cellContainers = props.cells.map((cell, index) => {
    return (
      <CodeCellContainer
        cell={cell}
        key={cell.id}
        onDeleteCellClick={props.onDeleteCellClick}
        onAddCellClick={props.onAddCellClick}
        cellIndex={index}
        onLanguageChange={props.onLanguageChange}
        toggleRender={props.toggleRender}
        onUpdateCodeState={props.onUpdateCodeState}
        onRunClick={props.onRunClick}
        languagePending={props.languagePending}
        presentation={props.presentation}
      />
    );
  });

  if (!props.presentation || props.cells.length === 0) {
    cellContainers.push(
      <div className="add-cell-container" key="add-cell-container">
        <AddCellButton
          lastButton="true"
          key="add-cell-btn"
          className="add-cell-btn"
          cellIndex={cellContainers.length}
          onClick={props.onAddCellClick}
        />
      </div>
    );
  }

  return cellContainers;
};

export default CellsList;
