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

  handleSetCellType = e => {
    this.setState({ type: e.target.value });
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
          value="Markdown"
          onClick={this.handleSetCellType}
        >
          Markdown
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          value="Javascript"
          onClick={this.handleSetCellType}
          active // TODO: fix hard-coding of active language
        >
          Javascript
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          value="Ruby"
          onClick={this.handleSetCellType}
        >
          Ruby
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          value="Python"
          onClick={this.handleSetCellType}
        >
          Python
        </Dropdown.Item>
      </SplitButton>
    );
  }
}

export default AddCodeCellButton;
