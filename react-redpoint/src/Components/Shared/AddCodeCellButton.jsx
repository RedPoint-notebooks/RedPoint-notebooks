import React from "react";
import Button from "react-bootstrap/Button";

const AddCodeCellButton = props => {
  const handleAddCodeCellClick = () => {
    props.onClick(props.cellIndex);
  };

  return (
    <Button
      className={props.soloButton ? "solo-add-code-cell-btn" : null}
      onClick={handleAddCodeCellClick}
      variant="secondary"
      size="sm"
    >
      Add Code Cell
    </Button>
  );
};

export default AddCodeCellButton;
