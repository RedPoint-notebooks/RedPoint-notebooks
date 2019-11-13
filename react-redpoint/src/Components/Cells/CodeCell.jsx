import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/javascript/javascript.js";
import "codemirror/mode/ruby/ruby.js";
import "codemirror/mode/python/python.js";
import CodeCellToolbar from "../Shared/CodeCellToolbar";

class CodeCell extends Component {
  state = {};

  handleChange = value => {
    this.setState({ code: value });
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
        />

        <br />
        <CodeMirror
          value={this.props.code}
          options={this.cellOptions}
          onBeforeChange={(editor, data, value) => {
            console.log("Editor:", editor);
            console.log("Data:", data);
            console.log("Value:", value);
            console.log("inside onBeforeChange");
            this.handleChange(value);
          }}
          onChange={(editor, data, value) => {
            console.log(editor);
            console.log(data);
            console.log(value);
            console.log("inside onChange");
          }}
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
