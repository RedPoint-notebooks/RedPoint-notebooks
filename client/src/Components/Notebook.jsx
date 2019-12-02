import React, { Component } from "react";
import CellsList from "./Cells/CellsList";
import Container from "react-bootstrap/Container";
import NavigationBar from "./Shared/NavigationBar";
import uuidv4 from "uuid";

import { findLastIndexOfEachLanguageInNotebook } from "../utils";
import { SIGTERM_ERROR_MESSAGE, PROXY_URL } from "../Constants/constants";

class Notebook extends Component {
  state = {
    cells: [],
    Ruby: {
      pendingIndexes: [],
      writeToIndex: 0,
      codePending: false
    },
    Javascript: {
      pendingIndexes: [],
      writeToIndex: 0,
      codePending: false
    },
    Python: {
      pendingIndexes: [],
      writeToIndex: 0,
      codePending: false
    },

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

  establishWebsocket = () => {
    if (process.env.NODE_ENV === "development") {
      this.ws = new WebSocket("ws://localhost:8000");
    } else if (process.env.NODE_ENV === "production") {
      this.ws = new WebSocket("ws://" + window.location.host);
    }
  };

  componentDidMount() {
    this.loadState();
    this.establishWebsocket();
    this.ws.onopen = e => {
      let urlNoProtocol = e.target.url.replace(/ws:\/\//, "");
      console.log("urlNoProtocol", urlNoProtocol);
      this.ws.send(
        JSON.stringify({ type: "sessionAddress", data: urlNoProtocol })
      );
    };
    this.ws.onerror = e => {
      console.log("Error encountered : ", e);
    };
    // this.ws.onclose = () => {
    //   reestablish when websocket times out?

    //   this.establishWebsocket();
    //   // console.log(this.ws.readyState);
    // };

    this.ws.onmessage = message => {
      message = JSON.parse(message.data);

      const language = message.language;
      const writeToIndex = this.state[language].writeToIndex;
      const cellIndex = this.state[language].pendingIndexes[writeToIndex];

      console.log(JSON.stringify(message.data));

      switch (message.type) {
        case "delimiter":
          // update the pending cell index for the language being executed
          this.setState(prevState => {
            const newWriteToIndex = prevState[language].writeToIndex + 1;
            const newState = Object.assign({}, prevState[language], {
              writeToIndex: newWriteToIndex
            });

            return { [language]: newState };
          });

          break;
        case "stdout":
          this.updateCellResults(message.type, cellIndex, message);
          break;
        case "return":
        case "error":
          this.setState(prevState => {
            const newState = Object.assign({}, prevState[language], {
              codePending: false
            });
            return { [language]: newState };
          });
          this.updateCellResults(message.type, cellIndex, message);
          break;
        case "syntax-error":
          this.setState(prevState => {
            const newState = Object.assign({}, prevState[language], {
              codePending: false
            });
            return { [language]: newState };
          });

          const errorLocation = message.data.location[0];
          const errorCellIndex = this.state[language].pendingIndex[
            errorLocation
          ];

          this.updateCellResults("error", errorCellIndex, message);
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

    this.setState(prevState => {
      const newState = Object.assign(
        {},
        prevState[language],
        { pendingIndexes },
        { writeToIndex: 0 },
        { codePending: true }
      );

      return { [language]: newState };
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

  handleSaveOrCloneClick = e => {
    e.preventDefault();
    const operation = e.target.name;

    const isSaveClick = operation === "save";
    const cloneId = uuidv4();
    const notebookId = isSaveClick ? this.state.id : cloneId;

    const notebook = {
      cells: this.state.cells,
      id: notebookId
    };

    notebook.cells = notebook.cells.map(cell => {
      cell.results = { stdout: [], error: "", return: "" };
      return cell;
    });

    const serializedNotebook = JSON.stringify(notebook);
    console.log(`Notebook ${operation} request sent`);

    fetch(`/${operation}`, {
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
          `Your ${operation}d notebook url is ${PROXY_URL}/notebooks/${notebookId}`
        );

        console.log(`${operation} response: `, data);
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
      this.state.Ruby.codePending ||
      this.state.Javascript.codePending ||
      this.state.Python.codePending
    );
  };

  languagePending = language => {
    switch (language) {
      case "Ruby":
        return this.state.Ruby.codePending;
      case "Javascript":
        return this.state.Javascript.codePending;
      case "Python":
        return this.state.Python.codePending;
      default:
        console.log("Error: Invalid Language Supplied in languagePending()");
        return null;
    }
  };

  handleAPISubmit = url => {
    fetch(url, { method: "GET" })
      .then(res => {
        return res.json();
      })
      .then(data => {
        console.log(data);
        this.setState(prevState => {
          const newCells = [...prevState.cells];
          newCells.splice(0, 0, {
            language: "Javascript",
            code: `const apiData = ${JSON.stringify(data, null, 2)}`,
            results: { stdout: [], error: "", return: "" },
            id: uuidv4()
          });
          return { cells: newCells };
        });
      });
  };

  render() {
    return (
      <div>
        <NavigationBar
          state={this.state}
          awaitingServerResponse={this.awaitingServerResponse}
          deleteAllCells={this.handleDeleteAllCells}
          onSaveClick={this.handleSaveOrCloneClick}
          onCloneClick={this.handleSaveOrCloneClick}
          onLoadClick={this.handleLoadClick}
          onClearAllResults={this.handleClearAllResults}
          onRunAllClick={this.handleRunAllClick}
          onAPISubmit={this.handleAPISubmit}
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
