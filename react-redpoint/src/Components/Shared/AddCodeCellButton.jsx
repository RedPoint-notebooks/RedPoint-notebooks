import React, { Component } from "react";
import SplitButton from "react-bootstrap/SplitButton";
import Dropdown from "react-bootstrap/Dropdown";
import * as constants from "../../Constants/constants";
import uuidv4 from "uuid";

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
    const dropDownItems = constants.LANGUAGES.map(language => {
      return (
        <Dropdown.Item
          as="button"
          value={language}
          key={language}
          onClick={this.handleSetCellType}
          active={this.state.type === language ? true : false}
          key={uuidv4()}
        >
          {language}
        </Dropdown.Item>
      );
    });

    return (
      <SplitButton
        className={this.props.soloButton ? "solo-add-cell-btn" : null}
        variant="secondary"
        id="dropdown-basic-button"
        title={`Add ${this.state.type} Cell`}
        size="sm"
        onClick={this.handleAddCellClick}
      >
        {dropDownItems}
      </SplitButton>
    );
  }
}

export default AddCodeCellButton;
