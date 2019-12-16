import React, { Component } from "react";
import CellsList from "./Cells/CellsList";
import Container from "react-bootstrap/Container";
import NavigationBar from "./Shared/NavigationBar";
import uuidv4 from "uuid";
import ReconnectingWebSocket from "reconnecting-websocket";

import { findLastIndexOfEachLanguageInNotebook } from "../utils";
import { SIGTERM_ERROR_MESSAGE } from "../Constants/constants";

class Notebook extends Component {
  state = {
    id: uuidv4(),
    title: "",
    presentation: false,
    cells: [],
    Ruby: {
      pendingIndexes: [],
      writeToIndex: 0, // the index of the pending indexes array
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
    }
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
        if (data) {
          console.log("Notebook loaded from server: ", data);
          let { cells, id } = data;

          if (data.webhookData) {
            const webhookDataCells = data.webhookData.map(
              (webhookData, idx) => {
                return {
                  language: "Javascript",
                  code: `const webhookData${idx} = ${JSON.stringify(
                    webhookData,
                    null,
                    2
                  )}`,
                  results: { stdout: [], error: "", return: "" },
                  id: uuidv4()
                };
              }
            );

            this.setState(prevState => {
              const newCells = [...webhookDataCells, ...cells];
              return { cells: newCells, id };
            });
          } else {
            this.setState({ cells, id });
          }
        }
      })
      .catch(err => {
        console.log("No notebook loaded from server");
      });
  };

  establishWebsocket = () => {
    if (process.env.NODE_ENV === "development") {
      this.ws = new ReconnectingWebSocket("ws://localhost:8000");
    } else if (process.env.NODE_ENV === "production") {
      this.ws = new ReconnectingWebSocket("wss://" + window.location.host);
    }
  };

  componentDidMount() {
    this.loadState();
    this.establishWebsocket();
    this.ws.onopen = e => {
      // send subdomained address to container for use in container teardown/cleanup
      let urlNoProtocol = e.target.url.replace(/wss:\/\//, "");
      this.ws.send(
        JSON.stringify({ type: "sessionAddress", data: urlNoProtocol })
      );
    };
    this.ws.onerror = e => {
      console.log("Websocket error: ", e);
    };

    this.ws.onmessage = message => {
      message = JSON.parse(message.data);

      const language = message.language;
      const writeToIndex = this.state[language].writeToIndex;
      const cellIndex = this.state[language].pendingIndexes[writeToIndex];

      console.log(JSON.stringify(message.data));

      switch (message.type) {
        case "delimiter":
          // update the pending cell index for results of the language being executed
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
          this.stopLanguagePending(language);
          this.updateCellResults(message.type, cellIndex, message);
          break;
        case "syntax-error":
          this.stopLanguagePending(language);

          const errorLocation = message.data.location[0];
          const errorCellIndex = this.state[language].pendingIndexes[
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

  handleToggleView = () => {
    this.setState(prevState => {
      return { presentation: !prevState.presentation };
    }, () => {
      if(this.state.presentation) {
        const newCells = this.state.cells.map(cell => {
          if (cell.language === "Markdown") {
            return Object.assign({}, cell, {rendered: true})
          } else {
            return cell;
          }
        })
        this.setState({cells: newCells})
      } else {
        const newCells = this.state.cells.map(cell => {
          if (cell.language === "Markdown") {
            return Object.assign({}, cell, {rendered: false})
          } else {
            return cell;
          }
        })
        this.setState({cells: newCells})
      }
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
        return res.text();
      })
      .then(data => {
        if (data[0] !== "{") {
          console.log("Invalid API URL provided");
        } else {
          data = JSON.parse(data);
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
        }
      });
  };

  stopLanguagePending = language => {
    this.setState(prevState => {
      const newState = Object.assign({}, prevState[language], {
        codePending: false
      });
      return { [language]: newState };
    });
  };

  handleTitleSubmit = title => {
    this.setState({ title });
  };

  render() {
    return (
      <div>
        <NavigationBar
          cells={this.state.cells}
          notebookId={this.state.id}
          presentation={this.state.presentation}
          title={this.state.title}
          awaitingServerResponse={this.awaitingServerResponse}
          deleteAllCells={this.handleDeleteAllCells}
          onSaveClick={this.handleSaveOrCloneClick}
          onCloneClick={this.handleSaveOrCloneClick}
          onClearAllResults={this.handleClearAllResults}
          onRunAllClick={this.handleRunAllClick}
          onAPISubmit={this.handleAPISubmit}
          onToggleView={this.handleToggleView}
          onTitleSubmit={this.handleTitleSubmit}
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
            presentation={this.state.presentation}
          />
        </Container>
      </div>
    );
  }
}

export default Notebook;
