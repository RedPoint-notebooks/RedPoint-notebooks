import React from "react";
import CodeCell from "./CodeCell";
import RenderedMarkdown from "./RenderedMarkdown";

const CodeCellContainer = props => {
  const cell = props.cell;
  const isRenderedMarkdown = cell.language === "Markdown" && cell.rendered;

  return isRenderedMarkdown ? (
    <RenderedMarkdown
      cell={cell}
      cellIndex={props.cellIndex}
      onDeleteClick={props.onDeleteCellClick}
      onAddClick={props.onAddCellClick}
      onRenderedMarkdownClick={props.toggleRender}
      onLanguageChange={props.onLanguageChange}
    />
  ) : (
    <CodeCell
      cell={cell}
      language={cell.language}
      key={props.index}
      onAddClick={props.onAddCellClick}
      onDeleteClick={props.onDeleteCellClick}
      cellIndex={props.cellIndex}
      onLanguageChange={props.onLanguageChange}
      toggleRender={props.toggleRender}
      onUpdateCodeState={props.onUpdateCodeState}
      onRunClick={props.onRunClick}
      languagePending={props.languagePending}
    />
  );
};

export default CodeCellContainer;
