import React from "react";
import ReactMarkdown from "react-markdown";
import CellToolbar from "../Shared/CellToolbar";
import AddCodeCellButton from "../Shared/AddCodeCellButton";

const RenderedMarkdown = props => {
  const handleRenderedMarkdownClick = () => {
    props.onRenderedMarkdownClick(props.cellIndex);
  };

  return (
    <React.Fragment>
      <AddCodeCellButton
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
      <div onClick={handleRenderedMarkdownClick}>
        <ReactMarkdown className="rendered-markdown" source={props.code} />
      </div>
    </React.Fragment>
  );
};

export default RenderedMarkdown;
