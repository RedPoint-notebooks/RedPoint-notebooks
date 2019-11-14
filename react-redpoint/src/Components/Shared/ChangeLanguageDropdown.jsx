import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import * as constants from "../../Constants/constants";

const ChangeLanguageDropdown = props => {
  const dropdownItems = constants.LANGUAGES.map(language => {
    return (
      <Dropdown.Item
        eventKey="markdown"
        key={language}
        active={props.language === language.toLowerCase() ? true : false}
      >
        {language}
      </Dropdown.Item>
    );
  });

  const capitalizedLanguage = constants.capitalizeLanguage(props.language);

  return (
    <DropdownButton
      variant="secondary"
      id="dropdown-basic-button"
      title={capitalizedLanguage}
      size="sm"
      onSelect={(eventKey, event) => {
        debugger;
      }}
    >
      {dropdownItems}
    </DropdownButton>
  );
};

export default ChangeLanguageDropdown;
