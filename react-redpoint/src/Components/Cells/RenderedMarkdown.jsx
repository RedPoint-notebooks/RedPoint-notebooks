import React from "react";
import ReactMarkdown from "react-markdown";
import CodeCellToolbar from "../Shared/CodeCellToolbar";

const RenderedMarkdown = props => {
  return (
    <React.Fragment>
      <CodeCellToolbar
        onAddClick={props.onAddCellClick}
        onDeleteClick={props.onDeleteCellClick}
        cellIndex={props.cellIndex}
      />
      <ReactMarkdown
        className="rendered-markdown"
        source={props.code}
        escapeHtml={true}
      />
    </React.Fragment>
  );
};

export default RenderedMarkdown;
