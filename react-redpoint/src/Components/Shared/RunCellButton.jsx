import React from "react";
import Button from "react-bootstrap/Button";

const RunCellButton = props => {
  const handleRunCellClick = () => {
    props.onClick(props.cellIndex);
  };

  return (
    <Button onClick={handleRunCellClick} variant="secondary" size="sm">
      <span>&#9658; Run</span>
    </Button>
  );
};

export default RunCellButton;
