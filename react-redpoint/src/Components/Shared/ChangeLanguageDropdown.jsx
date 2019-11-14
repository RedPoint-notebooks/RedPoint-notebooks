import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import * as constants from "../../Constants/constants";

const ChangeLanguageDropdown = props => {
  const dropdownItems = constants.LANGUAGES.map(language => {
    return (
      <Dropdown.Item
        eventKey={language}
        key={language}
        active={props.language === language ? true : false}
      >
        {language}
      </Dropdown.Item>
    );
  });

  const handleLanguageChange = eventKey => {
    props.onLanguageChange(eventKey, props.cellIndex);
  };

  return (
    <DropdownButton
      variant="secondary"
      id="dropdown-basic-button"
      title={props.language}
      size="sm"
      onSelect={handleLanguageChange}
    >
      {dropdownItems}
    </DropdownButton>
  );
};

export default ChangeLanguageDropdown;
