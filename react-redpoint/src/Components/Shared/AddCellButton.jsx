import React, { Component } from "react";
import SplitButton from "react-bootstrap/SplitButton";
import * as constants from "../../Constants/constants";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

class AddCellButton extends Component {
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
    const dropDownItems = constants.LANGUAGES.map(language => {
      return (
        <Dropdown.Item
          as="button"
          value={language}
          key={language}
          onClick={this.handleSetCellType}
          active={this.state.type === language ? true : false}
        >
          {language}
        </Dropdown.Item>
      );
    });

    return (
      <DropdownButton
        className="add-cell-btn"
        variant="secondary"
        id="dropdown-basic-button"
        title={<span>&#43;</span>}
        size="sm"
        onSelect={this.handleAddCellClick}
      >
        {dropDownItems}
      </DropdownButton>
    );
  }
}

export default AddCellButton;
