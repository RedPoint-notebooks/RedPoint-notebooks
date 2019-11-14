import React from "react";
import DeleteCellButton from "./DeleteCellButton";
import ChangeLanguageDropdown from "./ChangeLanguageDropdown";
import RunCellButton from "./RunCellButton";

const CellToolbar = props => {
  return (
    <div
      className={
        props.language === "Markdown" && props.rendered === true
          ? "cell-toolbar-markdown"
          : "cell-toolbar"
      }
    >
      <ChangeLanguageDropdown
        language={`${props.language} Cell`}
        onLanguageChange={props.onLanguageChange}
        cellIndex={props.cellIndex}
      ></ChangeLanguageDropdown>
      {props.language !== "Markdown" ? (
        <RunCellButton
          onClick={props.onRunClick}
          cellIndex={props.cellIndex}
        ></RunCellButton>
      ) : null}
      <DeleteCellButton
        onClick={props.onDeleteClick}
        cellIndex={props.cellIndex}
      />
    </div>
  );
};

export default CellToolbar;
