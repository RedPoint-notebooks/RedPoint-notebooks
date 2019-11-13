import React, { Component } from "react";
// import Button from "react-bootstrap/Button";
import DropdownButton from "react-bootstrap/DropdownButton";
import SplitButton from "react-bootstrap/SplitButton";
import Dropdown from "react-bootstrap/Dropdown";

class AddCodeCellButton extends Component {
  state = {
    type: this.props.defaultLanguage
  };

  handleAddCodeCellClick = () => {
    this.props.onClick(this.props.cellIndex);
  };

  handleSetMarkdown = () => {
    this.setState({ type: "markdown" });
  };
  handleSetJavascript = () => {
    this.setState({ type: "javascript" });
  };
  handleSetRuby = () => {
    this.setState({ type: "ruby" });
  };
  handleSetPython = () => {
    this.setState({ type: "python" });
  };

  render() {
    return (
      <SplitButton
        className={this.props.soloButton ? "solo-add-cell-btn" : null}
        variant="secondary"
        id="dropdown-basic-button"
        title={`Add ${this.state.type} Cell`}
        size="sm"
        onClick={this.handleAddCodeCellClick}
      >
        <Dropdown.Item as="button" onClick={this.handleSetMarkdown}>
          Markdown
        </Dropdown.Item>
        <Dropdown.Item
          as="button"
          onClick={this.handleSetJavascript}
          active // TODO: fix hard-coding of active language
        >
          Javascript
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={this.handleSetRuby}>
          Ruby
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={this.handleSetPython}>
          Python
        </Dropdown.Item>
      </SplitButton>
    );
  }
}

export default AddCodeCellButton;

// const AddCodeCellButton = props => {
//   const handleAddCodeCellClick = () => {
//     props.onClick(props.cellIndex);
//   };

//   return (
//     // <Button
//     //   className={props.soloButton ? "solo-add-code-cell-btn" : null}
//     //   onClick={handleAddCodeCellClick}
//     //   variant="secondary"
//     //   size="sm"
//     // >
//     //   Add Cell
//     // </Button>
//     <DropdownButton
//       className={props.soloButton ? "solo-add-cell-btn" : null}
//       variant="secondary"
//       id="dropdown-basic-button"
//       title="Add Cell"
//       size="sm"
//     >
//       <Dropdown.Item as="button" onClick={handleAddCodeCellClick}>
//         Markdown
//       </Dropdown.Item>
//       <Dropdown.Item
//         as="button"
//         onClick={handleAddCodeCellClick}
//         active // TODO: fix hard-coding of active language
//       >
//         Javascript
//       </Dropdown.Item>
//       <Dropdown.Item as="button" onClick={handleAddCodeCellClick}>
//         Ruby
//       </Dropdown.Item>
//       <Dropdown.Item as="button" onClick={handleAddCodeCellClick}>
//         Python
//       </Dropdown.Item>
//     </DropdownButton>
//   );
// };

// export default AddCodeCellButton;
