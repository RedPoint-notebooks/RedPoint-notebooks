import React, { Component } from "react";
import CodeCell from "./CodeCell";
import RenderedMarkdown from "./RenderedMarkdown";

const CodeCellContainer = props => {
  const cell = props.cell;
  const isRenderedMarkdown = cell.type === "Markdown" && cell.rendered;

  return isRenderedMarkdown ? (
    <RenderedMarkdown
      cell={cell}
      cellIndex={props.cellIndex}
      onDeleteClick={props.onDeleteCellClick}
      onAddClick={props.onAddCellClick}
      defaultLanguage={props.defaultLanguage}
      onRenderedMarkdownClick={props.toggleRender}
      onLanguageChange={props.onLanguageChange}
    />
  ) : (
    <CodeCell
      // cell={cell}
      language={cell.type}
      key={props.index}
      code={cell.code}
      results={cell.results}
      onAddClick={props.onAddCellClick}
      onDeleteClick={props.onDeleteCellClick}
      cellIndex={props.cellIndex}
      defaultLanguage={props.defaultLanguage}
      onLanguageChange={props.onLanguageChange}
      toggleRender={props.toggleRender}
      onUpdateCodeState={props.onUpdateCodeState}
      rendered={cell.rendered}
      onRunClick={props.onRunClick}
    />
  );
};

export default CodeCellContainer;

// class CodeCellContainer extends Component {
//   render() {
//     const cell = this.props.cell;
//     const isRenderedMarkdown = cell.type === "Markdown" && cell.rendered;
//     return isRenderedMarkdown ? (
//       <RenderedMarkdown
//         language={cell.type}
//         code={cell.code}
//         cellIndex={this.props.cellIndex}
//         onDeleteClick={this.props.onDeleteCellClick}
//         onAddClick={this.props.onAddCellClick}
//         defaultLanguage={this.props.defaultLanguage}
//         onRenderedMarkdownClick={this.props.toggleRender}
//         onLanguageChange={this.props.onLanguageChange}
//         rendered={cell.rendered}
//       />
//     ) : (
//       <CodeCell
//         language={cell.type}
//         key={this.props.index}
//         code={cell.code}
//         results={cell.results}
//         onAddClick={this.props.onAddCellClick}
//         onDeleteClick={this.props.onDeleteCellClick}
//         cellIndex={this.props.cellIndex}
//         defaultLanguage={this.props.defaultLanguage}
//         onLanguageChange={this.props.onLanguageChange}
//         toggleRender={this.props.toggleRender}
//         onUpdateCodeState={this.props.onUpdateCodeState}
//         rendered={cell.rendered}
//         onRunClick={this.props.onRunClick}
//       />
//     );
//   }
// }

// export default CodeCellContainer;
