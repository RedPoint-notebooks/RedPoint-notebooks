import React from "react";
import Button from "react-bootstrap/Button";

const DeleteCellButton = props => {
  const handleDeleteCellClick = () => {
    props.onClick(props.cellIndex);
  };

  return (
    <Button onClick={handleDeleteCellClick} variant="secondary" size="sm">
      <span className="delete-cell">&times;</span>
    </Button>
  );
};

export default DeleteCellButton;
