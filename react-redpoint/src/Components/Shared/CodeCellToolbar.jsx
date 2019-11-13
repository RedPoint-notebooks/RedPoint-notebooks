import React from "react";
import AddCodeCellButton from "../Shared/AddCodeCellButton";
import DeleteCellButton from "./DeleteCellButton";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";

const CodeCellToolbar = props => {
  const handleAddCellClick = () => {
    props.onAddClick(props.cellIndex);
  };

  return (
    <div className="code-cell-toolbar">
      <DropdownButton
        variant="secondary"
        id="dropdown-basic-button"
        title={props.language}
        size="sm"
      >
        <Dropdown.Item href="#/action-1">Markdown</Dropdown.Item>
        <Dropdown.Item
          href="#/action-2"
          active // TODO: fix hard-coding of active language
        >
          Javascript
        </Dropdown.Item>
        <Dropdown.Item href="#/action-3">Ruby</Dropdown.Item>
        <Dropdown.Item href="#/action-4">Python</Dropdown.Item>
      </DropdownButton>
      <AddCodeCellButton
        onClick={handleAddCellClick}
        cellIndex={props.cellIndex}
      />
      <DeleteCellButton
        onClick={props.onDeleteClick}
        cellIndex={props.cellIndex}
      />
    </div>
  );
};

export default CodeCellToolbar;
