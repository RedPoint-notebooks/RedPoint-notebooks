import React from "react";
import CodeCell from "./CodeCell";
import RenderedMarkdown from "./RenderedMarkdown";

class CodeCellContainer extends React.Component {
  state = {
    code: this.props.cell.code
  };

  handleChange = value => {
    this.setState({ code: value });
  };

  handleBlur = event => {
    // within onBlur, relatedTarget is the EventTarget receiving focus (if any)
    const nextTarget = event.relatedTarget;
    if (nextTarget) {
      if (nextTarget.className.includes("run-button")) {
        this.props.onRunClick(+nextTarget.getAttribute("cellindex"));
      } else if (nextTarget.type === "button") {
        nextTarget.click();
      } else if (nextTarget.type === "textarea") {
        nextTarget.focus();
      }
    }
    this.props.onUpdateCodeState(this.state.code, this.props.cellIndex);

    if (this.props.language === "Markdown") {
      this.props.toggleRender(this.props.cellIndex);
    }
  };
  render() {
    const cell = this.props.cell;
    const isRenderedMarkdown = cell.language === "Markdown" && cell.rendered;

    return (
      // isRenderedMarkdown ? (
      //   <RenderedMarkdown
      //     cell={cell}
      //     cellIndex={this.props.cellIndex}
      //     onDeleteClick={this.props.onDeleteCellClick}
      //     onAddClick={this.props.onAddCellClick}
      //     onRenderedMarkdownClick={this.props.toggleRender}
      //     onLanguageChange={this.props.onLanguageChange}
      //   />
      // ) :
      <CodeCell
        cell={cell}
        language={cell.language}
        key={this.props.index}
        value={this.state.code}
        onChange={this.handleChange}
        onSelect={this.props.onSelect}
        onBlur={this.handleBlur}
        onAddClick={this.props.onAddCellClick}
        onDeleteClick={this.props.onDeleteCellClick}
        cellIndex={this.props.cellIndex}
        onLanguageChange={this.props.onLanguageChange}
        toggleRender={this.props.toggleRender}
        onUpdateCodeState={this.props.onUpdateCodeState}
        onRunClick={this.props.onRunClick}
      />
    );
  }
}

export default CodeCellContainer;
