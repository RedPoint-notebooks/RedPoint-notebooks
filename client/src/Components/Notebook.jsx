import React, { Component } from "react";
import CellsList from "./Cells/CellsList";
import Container from "react-bootstrap/Container";
import NavigationBar from "./Shared/NavigationBar";
import uuidv4 from "uuid";

class Notebook extends Component {
  state = {
    cells: [
      {
        type: "Ruby",
        code: "while true do \nputs 'hi'\nend",
        results: { output: [], error: "", return: "" }
      },
      {
        type: "Javascript",
        code: "while (true) {\n  console.log('hi')\n}",
        results: { output: [], error: "", return: "" }
      },
      {
        type: "Python",
        code: "while True:\n  print('hi')",
        results: { output: [], error: "", return: "" }
      }
    ],
    // pendingCellExecution: true,
    RubyPendingIndexes: [],
    RubyWriteToPendingIndex: 0,
    JavascriptPendingIndexes: [],
    JavascriptWriteToPendingIndex: 0,
    PythonPendingIndexes: [],
    PythonWriteToPendingIndex: 0,

    id: uuidv4()
  };

  ws = new WebSocket("ws://localhost:8000");

  componentDidMount() {
    this.ws.onopen = event => {
      console.log("Websockets open!");
    };

    this.ws.onmessage = message => {
      message = JSON.parse(message.data);
      let cellIndex;
      const state = this.state;

      if (message.language) {
        switch (message.language) {
          case "Ruby":
            cellIndex = state.RubyPendingIndexes[state.RubyWriteToPendingIndex];
            break;
          case "Javascript":
            cellIndex =
              state.JavascriptPendingIndexes[
                state.JavascriptWriteToPendingIndex
              ];
            break;
          case "Python":
            cellIndex =
              state.PythonPendingIndexes[state.PythonWriteToPendingIndex];
            break;
          default:
            console.log("Error slotting message");
            return null;
        }
      }

      console.log(JSON.stringify(message.data));
      // debugger;

      switch (message.type) {
        case "delimiter":
          switch (message.language) {
            case "Ruby":
              this.setState(prevState => {
                return {
                  RubyWriteToPendingIndex: prevState.RubyWriteToPendingIndex + 1
                };
              });
              break;
            case "Javascript":
              this.setState(prevState => {
                return {
                  JavascriptWriteToPendingIndex:
                    prevState.JavascriptWriteToPendingIndex + 1
                };
              });
              break;
            case "Python":
              this.setState(prevState => {
                return {
                  PythonWriteToPendingIndex:
                    prevState.PythonWriteToPendingIndex + 1
                };
              });
              break;
            default:
              return null;
          }
          this.setState(prevState => {
            return {
              writeToPendingCellIndex: prevState.writeToPendingCellIndex + 1
            };
          });
          break;
        case "stdout":
          this.updateCellResults("output", cellIndex, message);
          break;
        case "return":
          this.updateCellResults("return", cellIndex, message);
          break;
        case "error":
          this.updateCellResults("error", cellIndex, message);
          break;
        // case "stderr":
        //   this.updateCellResults("error", cellIndex, message);
        //   break;
        case "loadNotebook":
          const newState = message.data;
          this.setState({
            cells: newState.cells,
            id: newState.id
          });
          break;
        case "saveResult":
          break;
        case "loadError":
          console.log(message.data);
          break;
        default:
          console.log("Error: Unknown message received from server");
      }
    };
  }

  updateCellResults = (resultType, cellIndex, message) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells].map((cell, index) => {
        if (index === cellIndex) {
          if (resultType === "output") {
            cell.results[resultType].push(message.data);
          } else if (resultType === "error") {
            if (message.data.error && message.data.error.signal === "SIGTERM") {
              const ERROR_MESSAGE = `Timeout Error: the request to the server timed out.
              The maximum timeout threshold for server requests is currently $ seconds.
              Check your code for infinite loops, or timeouts greater than the threshold.`;
              // debugger;
              cell.results[resultType] += ERROR_MESSAGE;
            }
            cell.results[resultType] += message.data.stderr;
          } else {
            cell.results[resultType] += message.data;
          }
        }
        return cell;
      });
      return { cells: newCells };
    });
  };

  handleDeleteCellClick = index => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      newCells.splice(index, 1);
      return { cells: newCells };
    });
  };

  handleDeleteAllCells = () => {
    this.setState({
      cells: [],
      pendingCellIndexes: [],
      writeToPendingCellIndex: 0
    });
  };

  handleAddCellClick = (index, type) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      newCells.splice(index, 0, {
        type: type,
        code: "",
        results: { output: [], error: "", return: "" }
      });
      return { cells: newCells };
    });
  };

  removeSameLanguageResults = language => {
    const newCells = this.state.cells.map(cell => {
      if (cell.type === language) {
        return Object.assign({}, cell, {
          results: { output: [], error: "", return: "" }
        });
      } else {
        return cell;
      }
    });

    this.setState({ cells: newCells });
  };

  handleClearAllResults = () => {
    const newCells = this.state.cells.map(cell => {
      return Object.assign({}, cell, {
        results: { output: [], error: "", return: "" }
      });
    });

    this.setState({ cells: newCells });
  };

  buildRequest = (indexOfCellRun, language) => {
    const codeStrArray = [];
    const allCells = this.state.cells;
    const pendingIndexes = [];
    for (let i = 0; i <= indexOfCellRun; i += 1) {
      const cell = allCells[i];
      if (i <= indexOfCellRun && cell.type === language) {
        codeStrArray.push(cell.code + "\n");
        pendingIndexes.push(i);
      }
    }

    switch (language) {
      case "Ruby": {
        this.setState({
          RubyPendingIndexes: pendingIndexes,
          RubyWriteToPendingIndex: 0
        });
        break;
      }
      case "Javascript": {
        this.setState({
          JavascriptPendingIndexes: pendingIndexes,
          JavascriptWriteToPendingIndex: 0
        });
        break;
      }
      case "Python": {
        this.setState({
          PythonPendingIndexes: pendingIndexes,
          PythonWriteToPendingIndex: 0
        });
        break;
      }
      default:
        console.log("Error building language request");
    }
    return { type: "executeCode", language, codeStrArray };
  };

  handleRunClick = indexOfCellRun => {
    const allCells = this.state.cells;
    const language = allCells[indexOfCellRun].type;
    this.removeSameLanguageResults(language);
    const requestObject = this.buildRequest(indexOfCellRun, language);
    this.ws.send(JSON.stringify(requestObject));
  };

  handleRunAllClick = () => {
    const allCells = this.state.cells;
    const cellsToRun = findLastIndexOfEachLanguageInNotebook(allCells);
    cellsToRun.forEach(cellIndex => {
      this.handleRunClick(cellIndex);
    });
  };

  handleSaveClick = e => {
    e.preventDefault();
    const notebook = this.state;
    notebook.cells = notebook.cells.map(cell => {
      cell.results = { output: [], error: "", return: "" };
      return cell;
    });
    notebook.RubyPendingIndexes = [];
    notebook.RubyWriteToPendingIndex = 0;
    notebook.JavascriptPendingIndexes = [];
    notebook.JavascriptWriteToPendingIndex = 0;
    notebook.PythonPendingIndexes = [];
    notebook.PythonWriteToPendingIndex = 0;
    const request = JSON.stringify({ type: "saveNotebook", notebook });
    console.log("Notebook save request sent");
    this.ws.send(request);
  };

  handleLoadClick = notebookId => {
    const request = JSON.stringify({ type: "loadNotebook", id: notebookId });
    this.ws.send(request);
  };

  handleLanguageChange = (type, cellIndex) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      const changedCell = newCells[cellIndex];
      changedCell.type = type;
      if (type === "Markdown") {
        changedCell.rendered = false;
      }
      if (changedCell.results) {
        changedCell.results = { output: [], error: "", return: "" };
      }
      return { cells: newCells };
    });
  };

  handleToggleRender = index => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      const cellToToggle = newCells[index];
      cellToToggle.rendered = !cellToToggle.rendered;
      return { cells: newCells };
    });
  };

  handleUpdateCodeState = (code, index) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      const cellToUpdate = newCells[index];
      cellToUpdate.code = code;
      return { cells: newCells };
    });
  };

  render() {
    return (
      <div>
        <NavigationBar
          state={this.state}
          deleteAllCells={this.handleDeleteAllCells}
          onSaveClick={this.handleSaveClick}
          onLoadClick={this.handleLoadClick}
          onClearAllResults={this.handleClearAllResults}
          onRunAllClick={this.handleRunAllClick}
        />
        <Container className="App-body">
          <CellsList
            onDeleteCellClick={this.handleDeleteCellClick}
            onAddCellClick={this.handleAddCellClick}
            cells={this.state.cells}
            onLanguageChange={this.handleLanguageChange}
            toggleRender={this.handleToggleRender}
            onUpdateCodeState={this.handleUpdateCodeState}
            onRunClick={this.handleRunClick}
          />
        </Container>
      </div>
    );
  }
}

const findLastIndexOfEachLanguageInNotebook = allCells => {
  const languages = [];
  const indexes = [];

  for (let i = allCells.length - 1; i >= 0; i -= 1) {
    let cell = allCells[i];
    if (!languages.includes(cell.type) && cell.type !== "Markdown") {
      languages.push(cell.type);
      indexes.unshift(i);
    }
  }

  return indexes;
};

export default Notebook;
