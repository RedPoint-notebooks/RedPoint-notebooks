import React, { Component } from "react";
import CodeCell from "./CodeCell";
import RenderedMarkdown from "./RenderedMarkdown";

class CodeCellContainer extends Component {
  render() {
    const isRenderedMarkdown =
      this.props.language === "Markdown" && this.props.rendered;

    return isRenderedMarkdown ? (
      <RenderedMarkdown
        language={this.props.language}
        code={this.props.code}
        cellIndex={this.props.cellIndex}
        onDeleteClick={this.props.onDeleteCellClick}
        onAddClick={this.props.onAddCellClick}
        defaultLanguage={this.props.defaultLanguage}
        onRenderedMarkdownClick={this.props.toggleRender}
        onLanguageChange={this.props.onLanguageChange}
        rendered={this.props.rendered}
      />
    ) : (
      <CodeCell
        language={this.props.language}
        key={this.props.index}
        code={this.props.code}
        results={this.props.results}
        onAddClick={this.props.onAddCellClick}
        onDeleteClick={this.props.onDeleteCellClick}
        cellIndex={this.props.cellIndex}
        defaultLanguage={this.props.defaultLanguage}
        onLanguageChange={this.props.onLanguageChange}
        toggleRender={this.props.toggleRender}
        onUpdateCodeState={this.props.onUpdateCodeState}
        rendered={this.props.rendered}
      />
    );
  }
}

export default CodeCellContainer;
