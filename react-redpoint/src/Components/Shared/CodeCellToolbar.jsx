import React from "react";
import AddCodeCellButton from "../Shared/AddCodeCellButton";
import DeleteCellButton from "./DeleteCellButton";
import ChangeLanguageDropdown from "./ChangeLanguageDropdown";

const CodeCellToolbar = props => {
  return (
    <div className="code-cell-toolbar">
      <ChangeLanguageDropdown
        language={props.language}
      ></ChangeLanguageDropdown>
      <AddCodeCellButton
        onClick={props.onAddClick}
        cellIndex={props.cellIndex}
        defaultLanguage={props.defaultLanguage}
      />
      <DeleteCellButton
        onClick={props.onDeleteClick}
        cellIndex={props.cellIndex}
      />
    </div>
  );
};

export default CodeCellToolbar;
