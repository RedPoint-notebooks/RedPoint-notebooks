import React from "react";
import AddCellButton from "../Shared/AddCellButton";
import CodeCellContainer from "./CodeCellContainer";
import uuidv4 from "uuid/v4";

class CellsList extends React.Component {
  state = {
    show: false
  }
  handleSelect = (cellIndex, language, callback) => {
    this.props.onAddCellClick(cellIndex,language,callback)
  }
  handleToggle = () => {
    this.setState({show: !this.state.show})
  }
  render() {
    
  const cellContainers = this.props.cells.map((cell, index) => {
    return (
      <CodeCellContainer
        cell={cell}
        onSelect={this.handleSelect}
        key={uuidv4()}
        onDeleteCellClick={this.props.onDeleteCellClick}
        onAddCellClick={this.props.onAddCellClick}
        cellIndex={index}
        onLanguageChange={this.props.onLanguageChange}
        toggleRender={this.props.toggleRender}
        onUpdateCodeState={this.props.onUpdateCodeState}
        onRunClick={this.props.onRunClick}
      />
    );
  });

  cellContainers.push(
    <div className="add-cell-container" key={uuidv4()}>
      <AddCellButton
        show={this.state.show}
        onToggle={this.handleToggle}
        onSelect={this.handleSelect}
        className="add-cell-btn"
        cellIndex={cellContainers.length}
        onClick={this.props.onAddCellClick}
        key={uuidv4()}
      />
    </div>
  );

  return cellContainers;
  }
};

export default CellsList;
