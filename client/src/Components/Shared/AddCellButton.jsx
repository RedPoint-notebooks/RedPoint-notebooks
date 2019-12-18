import React, { Component } from "react";
import * as constants from "../../Constants/constants";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import IconWithTooltip from "./IconWithTooltip";

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
        className={
          this.props.lastButton === "true"
            ? "last-add-cell-button"
            : "add-cell-btn"
        }
        variant="secondary"
        id="add-cell-button"
        title={
          <IconWithTooltip
            tooltipText="Add New Cell"
            icon={faPlus}
            placement="top"
            class="add-cell-icon"
          />
        }
        size="sm"
        onSelect={this.handleSelectCellType}
      >
        {dropDownItems}
      </DropdownButton>
    );
  }
}

export default AddCellButton;
