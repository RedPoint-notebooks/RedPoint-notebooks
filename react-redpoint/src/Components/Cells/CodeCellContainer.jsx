import React, { Component } from "react";
import CodeCell from "./CodeCell";
import RenderedMarkdown from "./RenderedMarkdown";

class CodeCellContainer extends Component {
  render() {
    const isRenderedMarkdown =
      this.props.language === "markdown" && this.props.rendered;

    return isRenderedMarkdown ? (
      <RenderedMarkdown
        language={this.props.language}
        code={this.props.code}
        cellIndex={this.props.cellIndex}
        onDeleteCellClick={this.props.onDeleteCellClick}
        onAddCellClick={this.props.onAddCellClick}
        defaultLanguage={this.props.defaultLanguage}
      />
    ) : (
      <CodeCell
        language={this.props.language}
        key={this.props.index}
        code={this.props.code}
        onAddCellClick={this.props.onAddCellClick}
        onDeleteCellClick={this.props.onDeleteCellClick}
        cellIndex={this.props.cellIndex}
        defaultLanguage={this.props.defaultLanguage}
      />
    );
  }
}

export default CodeCellContainer;