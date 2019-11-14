import React from "react";
import ReactMarkdown from "react-markdown";
import CodeCellToolbar from "../Shared/CodeCellToolbar";

const RenderedMarkdown = props => {
  const handleRenderedMarkdownClick = () => {
    props.onRenderedMarkdownClick(props.cellIndex);
  };

  return (
    <React.Fragment>
      <CodeCellToolbar
        language={props.language}
        onAddClick={props.onAddCellClick}
        onDeleteClick={props.onDeleteCellClick}
        cellIndex={props.cellIndex}
        defaultLanguage={props.defaultLanguage}
        onLanguageChange={props.onLanguageChange}
      />
      <div onClick={handleRenderedMarkdownClick}>
        <ReactMarkdown className="rendered-markdown" source={props.code} />
      </div>
    </React.Fragment>
  );
};

export default RenderedMarkdown;
