import React from "react";
import ReactMarkdown from "react-markdown";
import CellToolbar from "../Shared/CellToolbar";
import AddCellButton from "../Shared/AddCellButton";

const RenderedMarkdown = props => {
  const handleRenderedMarkdownClick = () => {
    props.onRenderedMarkdownClick(props.cellIndex);
  };
  const cell = props.cell;
  return (
    <React.Fragment>
      <div className="add-cell-container">
        <AddCellButton
          className="add-cell-btn"
          onClick={props.onAddClick}
          cellIndex={props.cellIndex}
        />
      </div>
      <CellToolbar
        language={cell.language}
        onAddClick={props.onAddClick}
        onDeleteClick={props.onDeleteClick}
        cellIndex={props.cellIndex}
        onLanguageChange={props.onLanguageChange}
        rendered={cell.rendered}
      />
      <div onClick={handleRenderedMarkdownClick} className="rendered-markdown">
        <ReactMarkdown source={cell.code} />
      </div>
    </React.Fragment>
  );
};

export default RenderedMarkdown;
