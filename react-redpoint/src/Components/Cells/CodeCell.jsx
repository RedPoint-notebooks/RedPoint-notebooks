import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import CellResults from "./CellResults";
import CellToolbar from "../Shared/CellToolbar";
import AddCellButton from "../Shared/AddCellButton";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/ruby/ruby.js";
import "codemirror/mode/python/python.js";

class CodeCell extends Component {
  state = {
    code: this.props.code
  };

  handleChange = value => {
    this.setState({ code: value });
    // this.props.onUpdateCodeState(value, this.props.cellIndex);
  };

  handleBlur = () => {
    this.props.onUpdateCodeState(this.state.code, this.props.cellIndex);

    if (this.props.language === "Markdown") {
      this.props.toggleRender(this.props.cellIndex);
    }
  };

  cellOptions = {
    mode: this.props.language.toLowerCase(),
    theme: "darcula",
    lineNumbers: true,
    showCursorWhenSelecting: true
  };

  render() {
    return (
      <div>
        <AddCellButton
          className="add-cell-btn"
          onClick={this.props.onAddClick}
          cellIndex={this.props.cellIndex}
          defaultLanguage={this.props.defaultLanguage}
        />
        <CellToolbar
          cellIndex={this.props.cellIndex}
          onDeleteClick={this.props.onDeleteClick}
          language={this.props.language}
          defaultLanguage={this.props.defaultLanguage}
          onLanguageChange={this.props.onLanguageChange}
          rendered={this.props.rendered}
          onRunClick={this.props.onRunClick}
        />
        <CodeMirror
          value={this.state.code}
          options={this.cellOptions}
          onBeforeChange={(editor, data, value) => {
            this.handleChange(value);
          }}
          onBlur={this.handleBlur}
        />
        {this.props.language !== "Markdown" ? (
          <CellResults
            language={this.props.language}
            results={this.props.results}
          />
        ) : null}
      </div>
    );
  }
}

export default CodeCell;
