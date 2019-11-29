import React from "react";
import RunCellButton from "./RunCellButton";
import Spinner from "react-bootstrap/Spinner";

const RunButtonOrSpinner = props => {
  return props.languagePending(props.language) ? (
    <Spinner
      as="span"
      className="cellbar-spinner"
      animation="border"
      variant="secondary"
      size="sm"
    />
  ) : (
    <RunCellButton
      onClick={props.onClick}
      cellIndex={props.cellIndex}
      cellCodeState={props.cellCodeState}
    ></RunCellButton>
  );
};

export default RunButtonOrSpinner;
