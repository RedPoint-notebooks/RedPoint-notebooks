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
import "codemirror/keymap/sublime.js";

class CodeCell extends Component {
  state = {
    code: this.props.cell.code
  };

  handleChange = value => {
    this.setState({ code: value });
  };

  handleBlur = (event, editor) => {
    this.props.onUpdateCodeState(this.state.code, this.props.cellIndex);

    if (this.props.language === "Markdown") {
      this.props.toggleRender(this.props.cellIndex);
    }
  };

  render() {
    const cell = this.props.cell;
    const cellOptions = {
      mode: cell.language.toLowerCase(),
      theme: "darcula",
      lineNumbers: true,
      // firstLineNumber: 10,
      showCursorWhenSelecting: true,
      tabSize: 2,
      indentWithTabs: true,
      keyMap: "sublime"
    };

    if (cell.language !== "Markdown") {
      cellOptions.extraKeys = {
        "Shift-Enter": () => {
          this.props.onUpdateCodeState(this.state.code, this.props.cellIndex);
          this.props.onRunClick(this.props.cellIndex);
        },
        "Cmd-Enter": () => {
          this.props.onUpdateCodeState(this.state.code, this.props.cellIndex);
          this.props.onRunClick(this.props.cellIndex);
        }
      };
    }

    return (
      <div>
        <div className="add-cell-container">
          <AddCellButton
            className="add-cell-btn"
            onClick={this.props.onAddClick}
            cellIndex={this.props.cellIndex}
          />
        </div>
        <CellToolbar
          cellIndex={this.props.cellIndex}
          onDeleteClick={this.props.onDeleteClick}
          language={cell.language}
          onLanguageChange={this.props.onLanguageChange}
          rendered={cell.rendered}
          onRunClick={this.props.onRunClick}
          cellCodeState={this.state.code}
        />
        <CodeMirror
          value={this.state.code}
          options={cellOptions}
          onBeforeChange={(editor, data, value) => {
            this.handleChange(value);
          }}
          onBlur={(editor, event) => {
            this.handleBlur(event, editor);
          }}
        />
        {cell.language !== "Markdown" ? (
          <CellResults language={cell.language} results={cell.results} />
        ) : null}
      </div>
    );
  }
}

export default CodeCell;
