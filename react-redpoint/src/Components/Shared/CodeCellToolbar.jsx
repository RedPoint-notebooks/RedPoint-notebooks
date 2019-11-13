import React from "react";
import AddCodeCellButton from "../Shared/AddCodeCellButton";
import DeleteCellButton from "./DeleteCellButton";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const CodeCellToolbar = props => {
  // const handleAddCellClick = () => {
  //   props.onAddClick(props.cellIndex);
  // };

  return (
    <div className="code-cell-toolbar">
      <DropdownButton
        variant="secondary"
        id="dropdown-basic-button"
        title={props.language}
        size="sm"
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
      <AddCodeCellButton
        onClick={props.onAddClick}
        cellIndex={props.cellIndex}
        defaultLanguage={props.defaultLanguage}
      />
      <DeleteCellButton
        onClick={props.onDeleteClick}
        cellIndex={props.cellIndex}
      />
    </div>
  );
};

export default CodeCellToolbar;
