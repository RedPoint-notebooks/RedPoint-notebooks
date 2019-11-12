import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/darcula.css";
import "codemirror/mode/javascript/javascript.js";

class CodeCell extends Component {
  state = {
    code: "console.log('hello world');"
  };

  handleChange = value => {
    this.setState({ code: value });
  };

  cellOptions = {
    mode: "javascript",
    theme: "darcula",
    lineNumbers: true,
    showCursorWhenSelecting: true
  };

  render() {
    return (
      <CodeMirror
        value={this.state.code}
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
