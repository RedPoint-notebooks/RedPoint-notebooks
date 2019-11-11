import React, { Component } from "react";

class CodeCell extends Component {
  state = {
    placeholder: "(Insert Code Cells Here)"
  };
  render() {
    return <p>{this.state.placeholder}</p>;
  }
}

export default CodeCell;
