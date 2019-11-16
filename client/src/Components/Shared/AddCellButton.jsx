import React, { Component } from "react";
import SplitButton from "react-bootstrap/SplitButton";
import * as constants from "../../Constants/constants";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

class AddCellButton extends Component {
  handleSelectCellType = language => {
    this.props.onClick(this.props.cellIndex, language);
  };

  render() {
    const dropDownItems = constants.LANGUAGES.map(language => {
      return (
        <Dropdown.Item
          as="button"
          value={language}
          key={language}
          eventKey={language}
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
        onSelect={this.handleSelectCellType}
      >
        {dropDownItems}
      </DropdownButton>
    );
  }
}

export default AddCellButton;
