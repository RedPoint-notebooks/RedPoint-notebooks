import React, { Component } from "react";
// import DropdownButton from "react-bootstrap/DropdownButton";
import SplitButton from "react-bootstrap/SplitButton";
import Dropdown from "react-bootstrap/Dropdown";

class AddCodeCellButton extends Component {
  state = {
    type: this.props.defaultLanguage
  };

  handleAddCellClick = () => {
    this.props.onClick(this.props.cellIndex, this.state.type);
  };

  handleSetMarkdown = () => {
    this.setState({ type: "markdown" });
  };
  handleSetJavascript = () => {
    this.setState({ type: "javascript" });
  };
  handleSetRuby = () => {
    this.setState({ type: "ruby" });
  };
  handleSetPython = () => {
    this.setState({ type: "python" });
  };

  render() {
    return (
      <SplitButton
        className={this.props.soloButton ? "solo-add-cell-btn" : null}
        variant="secondary"
        id="dropdown-basic-button"
        title={`Add ${this.state.type} Cell`}
        size="sm"
        onClick={this.handleAddCellClick}
      >
        <Dropdown.Item
          as="button"
          onClick={this.handleSetMarkdown}
          active={this.state.type === "markdown" ? true : false}
        >
          Markdown
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={this.handleSetJavascript}
          active={this.state.type === "javascript" ? true : false}
        >
          Javascript
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={this.handleSetRuby}
          active={this.state.type === "ruby" ? true : false}
        >
          Ruby
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={this.handleSetPython}
          active={this.state.type === "python" ? true : false}
        >
          Python
        </Dropdown.Item>
      </SplitButton>
    );
  }
}

export default AddCodeCellButton;
