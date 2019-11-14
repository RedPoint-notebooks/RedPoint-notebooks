import React from "react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const ChangeLanguageDropdown = props => {
  return (
    <DropdownButton
      variant="secondary"
      id="dropdown-basic-button"
      title={props.language}
      size="sm"
      onSelect={e => {
        debugger;
      }}
    >
      <Dropdown.Item
        href="#/action-1"
        active={props.language === "markdown" ? true : false}
      >
        Markdown
      </Dropdown.Item>
      <Dropdown.Item
        href="#/action-2"
        active={props.language === "javascript" ? true : false}
      >
        Javascript
      </Dropdown.Item>
      <Dropdown.Item
        href="#/action-3"
        active={props.language === "ruby" ? true : false}
      >
        Ruby
      </Dropdown.Item>
      <Dropdown.Item
        href="#/action-4"
        active={props.language === "python" ? true : false}
      >
        Python
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default ChangeLanguageDropdown;
