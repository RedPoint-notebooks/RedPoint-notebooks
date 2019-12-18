import React, { Component } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";

class TitleForm extends Component {
  state = {
    title: ""
  };

  handleChange = e => {
    this.setState({ title: e.target.value });
  };

  handleSubmitClick = () => {
    let title = this.state.title;
    if (!this.state.title) {
      this.setState({ title: "My Notebook" });
      title = "My Notebook";
    }
    this.props.onTitleSubmit(title);
  };

  componentDidMount = () => {
    this.setState({ title: this.props.title });
  };

  render() {
    return (
      <div className="title-form">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Enter Title:</InputGroup.Text>
          </InputGroup.Prepend>

          <FormControl
            placeholder={this.props.title ? "" : "My Notebook"}
            value={this.state.title}
            onChange={this.handleChange}
          />

          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              className="title-submit-btn"
              onClick={this.handleSubmitClick}
            >
              Update
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    );
  }
}

export default TitleForm;
