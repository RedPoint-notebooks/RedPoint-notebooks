import React from "react";
import Button from "react-bootstrap/Button";

class RunCellButton extends React.Component {
  state = {
    active: true
  };

  static getDerivedStateFromProps(props, state) {
    if (props.cellCodeState !== state.cellCodeState) {
      return {
        active: !!props.cellCodeState
      };
    }
    return null;
  }

  handleRunClick = () => {
    this.props.onClick(this.props.cellIndex);
  };

  render() {
    return (
      <Button
        disabled={!this.state.active}
        cellindex={this.props.cellIndex}
        className="run-button"
        onClick={this.handleRunClick}
        variant="secondary"
        size="sm"
      >
        <span>&#9658;</span>
      </Button>
    );
  }
}

export default RunCellButton;
