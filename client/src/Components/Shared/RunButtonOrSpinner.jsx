import React, { Component } from "react";
import RunCellButton from "./RunCellButton";
import Spinner from "react-bootstrap/Spinner";

const RunButtonOrSpinner = props => {
  return props.awaitingServerResponse() ? (
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
