import React, { Component } from "react";
import AddCellButton from "../Shared/AddCellButton";
import CodeCellContainer from "./CodeCellContainer";
import uuidv4 from "uuid/v4";

const CellsList = props => {
  const cellContainers = props.cells.map((cell, index) => {
    return (
      <CodeCellContainer
        cell={cell}
        // language={cell.type}
        key={uuidv4()}
        // code={cell.code}
        // results={cell.results}
        onDeleteCellClick={props.onDeleteCellClick}
        onAddCellClick={props.onAddCellClick}
        cellIndex={index}
        defaultLanguage={props.defaultLanguage}
        // rendered={cell.rendered}
        onLanguageChange={props.onLanguageChange}
        toggleRender={props.toggleRender}
        onUpdateCodeState={props.onUpdateCodeState}
        onRunClick={props.onRunClick}
      />
    );
  });

  cellContainers.push(
    <AddCellButton
      soloButton="true"
      cellIndex={cellContainers.length}
      onClick={props.onAddCellClick}
      key={uuidv4()}
      defaultLanguage={props.defaultLanguage}
    />
  );

  return cellContainers;
};

export default CellsList;

// class CellsList extends Component {
//   render() {
//     const cellContainers = this.props.cells.map((cell, index) => {
//       return (
//         <CodeCellContainer
//           cell={cell}
//           // language={cell.type}
//           key={uuidv4()}
//           // code={cell.code}
//           // results={cell.results}
//           onDeleteCellClick={this.props.onDeleteCellClick}
//           onAddCellClick={this.props.onAddCellClick}
//           cellIndex={index}
//           defaultLanguage={this.props.defaultLanguage}
//           // rendered={cell.rendered}
//           onLanguageChange={this.props.onLanguageChange}
//           toggleRender={this.props.toggleRender}
//           onUpdateCodeState={this.props.onUpdateCodeState}
//           onRunClick={this.props.onRunClick}
//         />
//       );
//     });

//     cellContainers.push(
//       <AddCellButton
//         soloButton="true"
//         cellIndex={cellContainers.length}
//         onClick={this.props.onAddCellClick}
//         key={uuidv4()}
//         defaultLanguage={this.props.defaultLanguage}
//       />
//     );
//     return cellContainers;
//   }
// }

// export default CellsList;
