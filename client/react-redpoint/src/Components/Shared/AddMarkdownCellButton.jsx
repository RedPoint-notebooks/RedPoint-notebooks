import React from "react";

const AddMarkdownCellButton = props => {
  const handleAddMarkdownCellClick = () => {
    props.onClick(props.cellIndex);
  };

  return (
    <button onClick={handleAddMarkdownCellClick}>Add Markdown Cell</button>
  );
};

export default AddMarkdownCellButton;
