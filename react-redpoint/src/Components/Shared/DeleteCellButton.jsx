import React from "react";

const DeleteCellButton = props => {
  const handleDeleteCellClick = () => {
    props.onClick(props.cellIndex);
  };

  return (
    <button onClick={handleDeleteCellClick} type="button">
      <span>&times; Delete</span>
    </button>
  );
};

export default DeleteCellButton;
