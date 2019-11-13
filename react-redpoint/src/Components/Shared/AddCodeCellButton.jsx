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
    const dropDownItems = ["Markdown", "Javascript", "Ruby", "Python"].map(
      lang => {
        return (
          <Dropdown.Item
            as="button"
            value={lang}
            onClick={this.handleSetCellType}
          >
            {lang}
          </Dropdown.Item>
        );
      }
    );
    const capitalizedLanguage =
      this.state.type.charAt(0).toUpperCase() + this.state.type.slice(1);
    return (
      <SplitButton
        className={this.props.soloButton ? "solo-add-cell-btn" : null}
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
