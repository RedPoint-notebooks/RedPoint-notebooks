import React from "react";
import Button from "react-bootstrap/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const DeleteCellButton = props => {
  const handleDeleteCellClick = () => {
    props.onClick(props.cellIndex);
  };

  return (
    <Button onClick={handleDeleteCellClick} variant="secondary" size="sm">
      <span className="delete-cell">
        <FontAwesomeIcon icon={faTimes} />
      </span>
    </Button>
  );
};

export default DeleteCellButton;
