import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import CodeCellToolbar from "../Shared/CodeCellToolbar";
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
  };

  handleToggleVisibility = () => {
    if (this.props.language === "markdown") {
      this.props.onUpdateCodeState(this.state.code, this.props.cellIndex);
      this.props.toggleRender(this.props.cellIndex);
    }
  };

  cellOptions = {
    mode: this.props.language,
    theme: "darcula",
    lineNumbers: true,
    showCursorWhenSelecting: true
  };

  render() {
    return (
      <div>
        <CodeCellToolbar
          onAddClick={this.props.onAddCellClick}
          cellIndex={this.props.cellIndex}
          onDeleteClick={this.props.onDeleteCellClick}
          language={this.props.language}
          defaultLanguage={this.props.defaultLanguage}
        />
        <CodeMirror
          value={this.state.code}
          options={this.cellOptions}
          onBeforeChange={(editor, data, value) => {
            // console.log("Editor:", editor);
            this.handleChange(value);
          }}
          onChange={(editor, data, value) => {}}
          onBlur={this.handleToggleVisibility}
        />
      </div>
    );
  }
}

export default CodeCell;

// class MyComponent extends Component {
//   handleValueChange = value => this.props.onUpdateValue({ value });
//   render() {
//     const { shade } = this.props;
//     const myOptions = {
//       mode: "xml",
//       theme: shade === "dark" ? "material" : "default",
//       lineNumbers: true
//     };
//     return (
//       <CodeMirror
//         id="editor"
//         value={this.props.value}
//         options={myOptions}
//         onBeforeChange={(editor, data, value) => {
//           this.handleValueChange(value);
//         }}
//         onChange={(editor, data, value) => {}}
//       />
//     );
//   }
// }

// function mapStateToProps(state) {
//   return {
//     shade: state.muiTheme.shade
//   };
// }
