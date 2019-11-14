import React from "react";
import Button from "react-bootstrap/Button";

const RunCellButton = props => {
  const handleRunClick = () => {
    props.onClick(props.cellIndex);
  };

  return (
    <Button onClick={handleRunClick} variant="secondary" size="sm">
      <span>&#9658; Run</span>
    </Button>
  );
};

export default RunCellButton;
