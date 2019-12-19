import React from "react";
import Switch from "react-switch";
import IconWithTooltip from "./IconWithTooltip";
import { faBookOpen } from "@fortawesome/free-solid-svg-icons";

class PresentationToggle extends React.Component {
  constructor() {
    super();
    this.state = { checked: false };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange() {
    this.props.onClick();
    this.setState(prevState => {
      return { checked: !prevState.checked };
    });
  }
  render() {
    return (
      <span onClick={this.handleChange}>
        <IconWithTooltip
          tooltipText="Toggle View"
          icon={faBookOpen}
          placement="bottom"
          class="clean-mode-icon"
        />
        <Switch
          id="switch"
          className="react-switch"
          checked={this.state.checked}
          onColor="#8dbc9d"
          onChange={() => {}}
          height={17.5}
          width={35}
        />
      </span>
    );
  }
}

export default PresentationToggle;
