import React, { Component } from "react";
import CodeCell from "./CodeCell";
import RenderedMarkdown from "./RenderedMarkdown";

class CodeCellContainer extends Component {
  render() {
    const cell = this.props.cell;
    const isRenderedMarkdown = cell.type === "Markdown" && cell.rendered;
    return isRenderedMarkdown ? (
      <RenderedMarkdown
        language={cell.type}
        code={cell.code}
        cellIndex={this.props.cellIndex}
        onDeleteClick={this.props.onDeleteCellClick}
        onAddClick={this.props.onAddCellClick}
        defaultLanguage={this.props.defaultLanguage}
        onRenderedMarkdownClick={this.props.toggleRender}
        onLanguageChange={this.props.onLanguageChange}
        rendered={cell.rendered}
      />
    ) : (
      <CodeCell
        language={cell.type}
        key={this.props.index}
        code={cell.code}
        results={cell.results}
        onAddClick={this.props.onAddCellClick}
        onDeleteClick={this.props.onDeleteCellClick}
        cellIndex={this.props.cellIndex}
        defaultLanguage={this.props.defaultLanguage}
        onLanguageChange={this.props.onLanguageChange}
        toggleRender={this.props.toggleRender}
        onUpdateCodeState={this.props.onUpdateCodeState}
        rendered={cell.rendered}
        onRunClick={this.props.onRunClick}
      />
    );
  }
}

export default CodeCellContainer;
