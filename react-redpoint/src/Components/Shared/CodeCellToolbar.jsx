import React from "react";
import AddCodeCellButton from "../Shared/AddCodeCellButton";
import DeleteCellButton from "./DeleteCellButton";
import RunCellButton from "./RunCellButton";
import ChangeLanguageDropdown from "./ChangeLanguageDropdown";

const CodeCellToolbar = props => {
  return (
    <div className="code-cell-toolbar">
      <ChangeLanguageDropdown
        language={props.language}
        onLanguageChange={props.onLanguageChange}
        cellIndex={props.cellIndex}
      ></ChangeLanguageDropdown>
      <AddCodeCellButton
        onClick={props.onAddClick}
        cellIndex={props.cellIndex}
        defaultLanguage={props.defaultLanguage}
      />
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

export default CodeCellToolbar;
