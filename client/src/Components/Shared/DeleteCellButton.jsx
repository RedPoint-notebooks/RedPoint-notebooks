import React from "react";
import Button from "react-bootstrap/Button";
import IconWithTooltip from "./IconWithTooltip";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const DeleteCellButton = props => {
  const handleDeleteCellClick = () => {
    props.onClick(props.cellIndex);
  };

  return (
    <Button onClick={handleDeleteCellClick} variant="secondary" size="sm">
      <span className="delete-cell">
        <IconWithTooltip
          tooltipText="Delete Cell"
          icon={faTimes}
          placement="top"
          className="delete-button-icon"
          class="delete-button-icon"
        />
      </span>
    </Button>
  );
};

export default DeleteCellButton;
