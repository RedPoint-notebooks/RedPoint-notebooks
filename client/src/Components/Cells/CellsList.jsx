import React from "react";
import AddCellButton from "../Shared/AddCellButton";
import CodeCellContainer from "./CodeCellContainer";
import uuidv4 from "uuid/v4";

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
      />
    );
  });

  cellContainers.push(
    <div className="add-cell-container" key={uuidv4()}>
      <AddCellButton
        className="add-cell-btn"
        cellIndex={cellContainers.length}
        onClick={props.onAddCellClick}
        key={uuidv4()}
      />
    </div>
  );

  return cellContainers;
};

export default CellsList;
