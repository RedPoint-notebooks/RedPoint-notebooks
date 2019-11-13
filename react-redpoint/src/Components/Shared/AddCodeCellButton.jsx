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
        <Dropdown.Item as="button" onClick={this.handleSetMarkdown}>
          Markdown
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={this.handleSetJavascript}
          active // TODO: fix hard-coding of active language
        >
          Javascript
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={this.handleSetRuby}>
          Ruby
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={this.handleSetPython}>
          Python
        </Dropdown.Item>
      </SplitButton>
    );
  }
}

export default AddCodeCellButton;
