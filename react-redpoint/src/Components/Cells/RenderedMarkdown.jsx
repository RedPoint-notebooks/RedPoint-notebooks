import React from "react";
import ReactMarkdown from "react-markdown";
import CellToolbar from "../Shared/CellToolbar";
import AddCellButton from "../Shared/AddCellButton";

const RenderedMarkdown = props => {
  const handleRenderedMarkdownClick = () => {
    props.onRenderedMarkdownClick(props.cellIndex);
  };

  return (
    <React.Fragment>
      <AddCellButton
        onClick={props.onAddClick}
        cellIndex={props.cellIndex}
        defaultLanguage={props.defaultLanguage}
      />
      <CellToolbar
        language={props.language}
        onAddClick={props.onAddCellClick}
        onDeleteClick={props.onDeleteCellClick}
        cellIndex={props.cellIndex}
        defaultLanguage={props.defaultLanguage}
        onLanguageChange={props.onLanguageChange}
        rendered={props.rendered}
      />
      <div onClick={handleRenderedMarkdownClick} className="rendered-markdown">
        <ReactMarkdown source={props.code} />
      </div>
    </React.Fragment>
  );
};

export default RenderedMarkdown;
