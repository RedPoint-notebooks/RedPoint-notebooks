import React from "react";
import ReactMarkdown from "react-markdown";
import AddCellButton from "../Shared/AddCellButton";

const RenderedMarkdown = props => {
  const handleRenderedMarkdownClick = () => {
    props.onRenderedMarkdownClick(props.cellIndex);
  };
  const cell = props.cell;
  return (
    <div>
      <div className="add-cell-container">
        <AddCellButton
          className="add-cell-btn"
          onClick={props.onAddClick}
          cellIndex={props.cellIndex}
        />
      </div>
      <div onClick={handleRenderedMarkdownClick} className="rendered-markdown">
        <ReactMarkdown source={cell.code} />
      </div>
    </div>
  );
};

export default RenderedMarkdown;
