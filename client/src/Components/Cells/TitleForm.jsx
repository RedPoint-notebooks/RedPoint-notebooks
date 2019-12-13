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
    this.props.onTitleSubmit(this.state.title);
  };

  render() {
    return (
      <div>
        <InputGroup className="title-form">
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon1">Enter Title:</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl placeholder="My Notebook" onChange={this.handleChange} />
          <InputGroup.Append>
            <Button
              variant="outline-secondary"
              className="title-submit-btn"
              onClick={this.handleSubmitClick}
            >
              Save
            </Button>
          </InputGroup.Append>
        </InputGroup>
      </div>
    );
  }
}

export default TitleForm;
