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
  handleChange = value => {
    this.props.onChange(value);
  };

  handleBlur = e => {
    this.props.onBlur(e);
  };

  render() {
    const cell = this.props.cell;
    const cellOptions = {
      mode: cell.language.toLowerCase(),
      theme: "darcula",
      lineNumbers: true,
      showCursorWhenSelecting: true
    };

    return (
      <div>
        <div className="add-cell-container">
          <AddCellButton
            className="add-cell-btn"
            onSelect={this.props.onSelect}
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
        />
        <CodeMirror
          value={this.props.value}
          options={cellOptions}
          onBeforeChange={(editor, data, value) => {
            this.handleChange(value);
          }}
          onBlur={(event, editor) => {
            console.log(editor);
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
