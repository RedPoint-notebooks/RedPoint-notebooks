import React from "react";
import DeleteCellButton from "./DeleteCellButton";
import ChangeLanguageDropdown from "./ChangeLanguageDropdown";
import RunButtonOrSpinner from "./RunButtonOrSpinner";

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
        language={props.language}
        onLanguageChange={props.onLanguageChange}
        cellIndex={props.cellIndex}
      ></ChangeLanguageDropdown>
      {props.language !== "Markdown" ? (
        <RunButtonOrSpinner
          language={props.language}
          onClick={props.onRunClick}
          cellIndex={props.cellIndex}
          cellCodeState={props.cellCodeState}
          languagePending={props.languagePending}
        ></RunButtonOrSpinner>
      ) : null}
      <DeleteCellButton
        onClick={props.onDeleteClick}
        cellIndex={props.cellIndex}
      />
    </div>
  );
};

export default CellToolbar;
