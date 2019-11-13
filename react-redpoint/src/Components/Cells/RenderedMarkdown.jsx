import React from "react";
import ReactMarkdown from "react-markdown";
import AddCodeCellButton from "../Shared/AddCodeCellButton";

const RenderedMarkdown = props => {
  return (
    <React.Fragment>
      <AddCodeCellButton
        onClick={props.onAddCellClick}
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
