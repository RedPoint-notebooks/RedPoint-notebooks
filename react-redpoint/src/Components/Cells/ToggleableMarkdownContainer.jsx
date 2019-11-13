import React, { Component } from "react";
import CodeCellContainer from "./CodeCellContainer";
import RenderedMarkdown from "./RenderedMarkdown";

class ToggleableMarkdownContainer extends Component {
  state = {
    editable: false
  };

  render() {
    if (this.state.editable) {
      return (
        <CodeCellContainer
          language={this.props.language}
          key={this.props.index}
          code={this.props.code}
          onDeleteCellClick={this.props.onDeleteCellClick}
          onAddCellClick={this.props.onAddCellClick}
          cellIndex={this.props.cellIndex}
        />
      );
    } else {
      return <RenderedMarkdown code={this.props.code} />;
    }
  }
}

export default ToggleableMarkdownContainer;
