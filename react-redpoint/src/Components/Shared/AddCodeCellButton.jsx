import React from "react";

const AddCodeCellButton = props => {
  const handleAddCodeCellClick = () => {
    props.onClick(props.cellIndex);
  };

  return <button onClick={handleAddCodeCellClick}>Add Code Cell</button>;
};

export default AddCodeCellButton;
