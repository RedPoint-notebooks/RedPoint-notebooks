import React, { Component } from "react";
import CodeCellContainer from "./CodeCellContainer";
import RenderedMarkdown from "./RenderedMarkdown";

class ToggleableMarkdownContainer extends Component {
  state = {
    editable: false
  };

  render() {
    return this.state.editable ? (
      <CodeCellContainer
        language={this.props.language}
        key={this.props.index}
        code={this.props.code}
        onDeleteCellClick={this.props.onDeleteCellClick}
        onAddCellClick={this.props.onAddCellClick}
        cellIndex={this.props.cellIndex}
      />
    ) : (
      <RenderedMarkdown
        code={this.props.code}
        cellIndex={this.props.cellIndex}
        onDeleteCellClick={this.props.onDeleteCellClick}
        onAddCellClick={this.props.onAddCellClick}
      />
    );
  }
}

export default ToggleableMarkdownContainer;
