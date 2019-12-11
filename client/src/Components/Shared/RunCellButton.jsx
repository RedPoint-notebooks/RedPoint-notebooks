import React from "react";
import Button from "react-bootstrap/Button";
import IconWithTooltip from "./IconWithTooltip";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

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
        <span>
          {/* <FontAwesomeIcon icon={faPlay} className="run-button-icon" /> */}
          <IconWithTooltip
            tooltipText="Run Cell"
            icon={faPlay}
            placement="top"
            className="run-button-icon"
          />
        </span>
      </Button>
    );
  }
}

export default RunCellButton;
