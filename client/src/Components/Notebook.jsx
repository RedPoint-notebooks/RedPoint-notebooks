import React, { Component } from "react";
import CellsList from "./Cells/CellsList";
import Container from "react-bootstrap/Container";
import NavigationBar from "./Shared/NavigationBar";
import uuidv4 from "uuid";
import {
  findSyntaxErrorIdx,
  findPendingIndex,
  findWriteToPendingIndex,
  findCellIndex,
  findLastIndexOfEachLanguageInNotebook,
  makeStopPendingObj
} from "../utils";
import { SIGTERM_ERROR_MESSAGE, PROXY_URL } from "../Constants/constants";

class Notebook extends Component {
  state = {
    cells: [],
    RubyPendingIndexes: [],
    RubyWriteToIndex: 0,
    RubyCodePending: false,
    JavascriptPendingIndexes: [],
    JavascriptWriteToIndex: 0,
    JavascriptCodePending: false,
    PythonPendingIndexes: [],
    PythonWriteToIndex: 0,
    PythonCodePending: false,
    id: uuidv4()
  };

  ws = null;

  loadState = async () => {
    await fetch(`/loadNotebook`, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      redirect: "follow"
    })
      .then(res => {
        return res.json();
      })
      .then(data => {
        // TODO: scrub IDs on proxy server before sending to client
        if (data) {
          console.log("Notebook loaded from server: ", data);
          const { cells, id } = data;
          this.setState({ cells, id });
        } else {
          console.log("No notebook loaded from server");
        }
      });
  };

  componentDidMount() {
    this.loadState();

    if (process.env.NODE_ENV === "development") {
      this.ws = new WebSocket("ws://localhost:8000");
    } else if (process.env.NODE_ENV === "production") {
      this.ws = new WebSocket("ws://" + window.location.host);
    }

    this.ws.onopen = () => console.log(window.location.host);

    this.ws.onmessage = message => {
      message = JSON.parse(message.data);
      let cellIndex = findCellIndex(message, this.state);

      console.log(JSON.stringify(message.data));
      let stopLanguagePending;

      switch (message.type) {
        case "delimiter":
          // update the pending cell index for the language being executed
          const pendingIndex = findWriteToPendingIndex(message.language);
          this.setState(prevState => {
            return {
              [pendingIndex]: prevState[pendingIndex] + 1
            };
          });

          break;
        case "stdout":
          this.updateCellResults(message.type, cellIndex, message);
          break;
        case "return":
        case "error":
          stopLanguagePending = makeStopPendingObj(message.language);
          this.setState(stopLanguagePending);
          this.updateCellResults(message.type, cellIndex, message);
          break;
        // case "stderr":
        //   this.updateCellResults("error", cellIndex, message);
        //   break;
        case "syntax-error":
          stopLanguagePending = makeStopPendingObj(message.language);
          this.setState(stopLanguagePending);
          cellIndex = findSyntaxErrorIdx(
            message,
            this.state.RubyPendingIndexes,
            this.state.JavascriptPendingIndexes,
            this.state.PythonPendingIndexes
          );
          this.updateCellResults("error", cellIndex, message);
          break;
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
          if (resultType === "stdout") {
            cell.results[resultType].push(message.data);
          } else if (resultType === "error") {
            if (message.data.error && message.data.error.signal === "SIGTERM") {
              cell.results[resultType] += SIGTERM_ERROR_MESSAGE;
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

  handleAddCellClick = (index, language) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      newCells.splice(index, 0, {
        language: language,
        code: "",
        results: { stdout: [], error: "", return: "" },
        id: uuidv4()
      });
      return { cells: newCells };
    });
  };

  removeSameLanguageResults = language => {
    const newCells = this.state.cells.map(cell => {
      if (cell.language === language) {
        return Object.assign({}, cell, {
          results: { stdout: [], error: "", return: "" }
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
        results: { stdout: [], error: "", return: "" }
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
      if (i <= indexOfCellRun && cell.language === language) {
        codeStrArray.push(cell.code + "\n");
        pendingIndexes.push(i);
      }
    }

    const langWriteToPending = findWriteToPendingIndex(language);
    const langPendingIndexes = findPendingIndex(language);
    const langCodePending = `${language}CodePending`;

    this.setState({
      [langPendingIndexes]: pendingIndexes,
      [langWriteToPending]: 0,
      [langCodePending]: true
    });

    return { type: "executeCode", language, codeStrArray };
  };

  handleRunClick = indexOfCellRun => {
    const allCells = this.state.cells;
    const language = allCells[indexOfCellRun].language;
    this.removeSameLanguageResults(language);
    const requestObject = this.buildRequest(indexOfCellRun, language);
    this.ws.send(JSON.stringify(requestObject));
  };

  handleRunAllClick = async () => {
    await this.handleClearAllResults();
    const allCells = this.state.cells;
    const cellsToRun = findLastIndexOfEachLanguageInNotebook(allCells);
    cellsToRun.forEach(cellIndex => {
      this.handleRunClick(cellIndex);
    });
  };

  handleSaveClick = e => {
    e.preventDefault();
    const notebook = { cells: this.state.cells, id: this.state.id };

    notebook.cells = notebook.cells.map(cell => {
      cell.results = { stdout: [], error: "", return: "" };
      return cell;
    });

    const serializedNotebook = JSON.stringify(notebook);
    console.log("Notebook save request sent");

    fetch(`/update`, {
      method: "post",
      mode: "cors",
      cache: "no-cache",
      body: serializedNotebook,
      headers: { "Content-Type": "text/plain" }
    })
      .then(res => {
        return res.text();
      })
      .then(data => {
        // **TODO** convert to bootstrap alert/banner
        alert(
          `Your saved notebook url is ${PROXY_URL}/notebooks/${this.state.id}`
        );

        console.log("Save response: ", data);
      })
      .catch(err => {
        console.log("Fetch error on POST request. Failed to save.");
      });
  };

  handleCloneClick = e => {
    e.preventDefault();
    const cloneUUID = uuidv4();
    const notebook = { cells: this.state.cells, id: cloneUUID };

    notebook.cells = notebook.cells.map(cell => {
      cell.results = { stdout: [], error: "", return: "" };
      return cell;
    });

    const serializedNotebook = JSON.stringify(notebook);
    console.log("Notebook clone request sent");

    fetch(`/update`, {
      method: "post",
      mode: "cors",
      cache: "no-cache",
      body: serializedNotebook,
      headers: { "Content-Type": "text/plain" }
    })
      .then(res => {
        return res.text();
      })
      .then(data => {
        // **TODO** convert to bootstrap alert/banner
        alert(
          `Your cloned notebook url is ${PROXY_URL}/notebooks/${cloneUUID}.`
        );

        console.log("Clone response: ", data);
      })
      .catch(err => {
        console.log("Fetch error on POST request. Failed to clone.");
      });
  };

  handleLoadClick = notebookId => {
    const request = JSON.stringify({ type: "loadNotebook", id: notebookId });
    this.ws.send(request);
  };

  handleLanguageChange = (language, cellIndex) => {
    this.setState(prevState => {
      const newCells = [...prevState.cells];
      const changedCell = newCells[cellIndex];
      changedCell.language = language;
      if (language === "Markdown") {
        changedCell.rendered = false;
      }
      if (changedCell.results) {
        changedCell.results = { stdout: [], error: "", return: "" };
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
      const newCells = [...prevState.cells].map((cell, idx) => {
        if (idx === index) {
          return Object.assign({}, cell, { code: code });
        } else {
          return cell;
        }
      });
      return { cells: newCells };
    });
  };

  awaitingServerResponse = () => {
    return (
      this.state.RubyCodePending ||
      this.state.JavascriptCodePending ||
      this.state.PythonCodePending
    );
  };

  languagePending = language => {
    switch (language) {
      case "Ruby":
        return this.state.RubyCodePending;
      case "Javascript":
        return this.state.JavascriptCodePending;
      case "Python":
        return this.state.PythonCodePending;
      default:
        console.log("Error: Invalid Language Supplied in languagePending()");
        return null;
    }
  };

  render() {
    return (
      <div>
        <NavigationBar
          state={this.state}
          awaitingServerResponse={this.awaitingServerResponse}
          deleteAllCells={this.handleDeleteAllCells}
          onSaveClick={this.handleSaveClick}
          onCloneClick={this.handleCloneClick}
          onLoadClick={this.handleLoadClick}
          onClearAllResults={this.handleClearAllResults}
          onRunAllClick={this.handleRunAllClick}
        />
        <Container className="App-body">
          <CellsList
            languagePending={this.languagePending}
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

export default Notebook;
