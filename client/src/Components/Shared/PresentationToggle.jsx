import React from "react";
import Switch from "react-switch";

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
      <Switch
        id="switch"
        className="react-switch"
        onChange={this.handleChange}
        checked={this.state.checked}
      />
    );
  }
}

export default PresentationToggle;
