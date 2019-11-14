import React, { Component } from "react";
import SplitButton from "react-bootstrap/SplitButton";
import Dropdown from "react-bootstrap/Dropdown";
import * as constants from "../../Constants/constants";

class AddCodeCellButton extends Component {
  state = {
    type: this.props.defaultLanguage
  };

  handleAddCellClick = () => {
    this.props.onClick(this.props.cellIndex, this.state.type);
  };

  handleSetCellType = e => {
    this.setState({ type: e.target.value.toLowerCase() });
  };

  capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  render() {
    const dropDownItems = constants.LANGUAGES.map(language => {
      return (
        <Dropdown.Item
          as="button"
          value={language}
          key={language}
          onClick={this.handleSetCellType}
          active={this.state.type === language.toLowerCase() ? true : false}
        >
          {language}
        </Dropdown.Item>
      );
    });

    const capitalizedLanguage = constants.capitalizeLanguage(this.state.type);

    return (
      <SplitButton
        className="solo-add-cell-btn"
        variant="secondary"
        id="dropdown-basic-button"
        title={`Add ${capitalizedLanguage} Cell`}
        size="sm"
        onClick={this.handleAddCellClick}
      >
        {dropDownItems}
      </SplitButton>
    );
  }
}

export default AddCodeCellButton;
