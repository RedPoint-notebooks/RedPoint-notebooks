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
      onSelect={(eventKey, event) => {
        debugger;
      }}
    >
      <Dropdown.Item
        eventKey="markdown"
        active={props.language === "markdown" ? true : false}
      >
        Markdown
      </Dropdown.Item>
      <Dropdown.Item
        eventKey="javascript"
        active={props.language === "javascript" ? true : false}
      >
        Javascript
      </Dropdown.Item>
      <Dropdown.Item
        eventKey="ruby"
        active={props.language === "ruby" ? true : false}
      >
        Ruby
      </Dropdown.Item>
      <Dropdown.Item
        eventKey="python"
        active={props.language === "python" ? true : false}
      >
        Python
      </Dropdown.Item>
    </DropdownButton>
  );
};

export default ChangeLanguageDropdown;
