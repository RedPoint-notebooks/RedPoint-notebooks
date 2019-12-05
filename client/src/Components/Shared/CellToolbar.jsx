import React from "react";
import DeleteCellButton from "./DeleteCellButton";
import ChangeLanguageDropdown from "./ChangeLanguageDropdown";
import RunButtonOrSpinner from "./RunButtonOrSpinner";

const CellToolbar = props => {
  return (
    <div
      visible={false}
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
      {props.language !== "Markdown" && !props.presentation ? (
        <RunButtonOrSpinner
          language={props.language}
          onClick={props.onRunClick}
          cellIndex={props.cellIndex}
          cellCodeState={props.cellCodeState}
          languagePending={props.languagePending}
        ></RunButtonOrSpinner>
      ) : null}
      {!props.presentation ? (
        <DeleteCellButton
          onClick={props.onDeleteClick}
          cellIndex={props.cellIndex}
        />
      ) : null}
    </div>
  );
};

export default CellToolbar;
