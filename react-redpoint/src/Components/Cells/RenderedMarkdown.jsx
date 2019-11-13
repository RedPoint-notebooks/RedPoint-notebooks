import React from "react";
import ReactMarkdown from "react-markdown";
import AddCodeCellButton from "../Shared/AddCodeCellButton";
import DeleteCellButton from "../Shared/DeleteCellButton";

const RenderedMarkdown = props => {
  return (
    <React.Fragment>
      <AddCodeCellButton
        onClick={props.onAddCellClick}
        cellIndex={props.cellIndex}
      />
      <div className="code-cell-toolbar">
        <select>
          <option>Javascript</option>
        </select>
        <DeleteCellButton
          onClick={props.onDeleteCellClick}
          cellIndex={props.cellIndex}
        />
      </div>
      <ReactMarkdown
        className="rendered-markdown"
        source={props.code}
        escapeHtml={true}
      />
    </React.Fragment>
  );
};

export default RenderedMarkdown;
