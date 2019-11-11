document.addEventListener("DOMContentLoaded", () => {
  const codemirrors = {
    ruby: setMirrors("ruby"),
    javascript: setMirrors("javascript")
  };
  const btnMD1 = document.getElementById("render-md-1");
  const mdC1 = document.getElementById("md-cell-1");
  const ws = new WebSocket("ws://localhost:3000");

  const handleCodeSubmit = event => {
    clearPreviousResponse();

    let cellNum = +event.target.dataset.button;
    let language = event.target.dataset.language;

    const codeStrArray = allCodeUpToCell(cellNum, codemirrors[language]);
    language = language.toUpperCase();
    const json = JSON.stringify({ language, codeStrArray });

    ws.send(json);
  };

  ws.onopen = event => {
    // receiving the message from server
    let currentCell = 0;
    ws.onmessage = message => {
      message = JSON.parse(message.data);
      let languageCells;

      switch (message.type) {
        case "language":
          const language = message.data.toLowerCase();
          languageCells = document.querySelectorAll(`.code-cell-${language}`);

          break;
        case "stdout":
          // slice off empty string when split on newline
          const stdoutArr = message.data.split("\n").slice(0, -1);
          stdoutArr.forEach(message => {
            if (message === "DELIMITER") {
              currentCell += 1;
            } else {
              const outputUl = document.getElementById(
                `codecell-${currentCell}-output`
              );
              appendLi(outputUl, message);
            }
          });
          break;
        case "stderr":
          const stderrUl = document.getElementById(
            `codecell-${currentCell}-error`
          );

          appendLi(stderrUl, message.data);
          break;
        case "error":
          const errorUl = document.getElementById(
            `codecell-${currentCell}-error`
          );

          const signal = message.data.signal;
          if (signal && signal.match("SIGTERM")) {
            appendLi(errorUl, "Infinite Loop Error");
          }
          break;
        case "return":
          const returnUl = document.getElementById(
            `codecell-${currentCell}-return`
          );

          appendLi(returnUl, message.data);
          currentCell = 0;
          break;
        case "end":
          console.log(message.data);
          break;
      }
    };
  };

  const clearPreviousResponse = () => {
    document.querySelectorAll(".code-return").forEach(codeReturn => {
      removeChildElements(codeReturn);
    });

    document.querySelectorAll(".code-output").forEach(codeOutput => {
      removeChildElements(codeOutput);
    });

    document.querySelectorAll(".code-error").forEach(codeError => {
      removeChildElements(codeError);
    });
  };

  document.addEventListener("click", event => {
    if (event.target.className === "code-submit") {
      handleCodeSubmit(event);
    }
  });

  const removeChildElements = parent => {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  };

  const appendLi = (parent, content) => {
    const newLi = document.createElement("li");
    newLi.textContent = content;
    parent.appendChild(newLi);
  };

  // extract and render markdown
  const mdCode = CodeMirror.fromTextArea(mdC1, {
    mode: "markdown",
    showCursorWhenSelecting: true,
    theme: "monokai"
  });

  // load markdown-it parser into a variable
  const md = window.markdownit();

  btnMD1.addEventListener("click", () => {
    let mdContent = mdCode.getValue();
    let mdOutput = document.getElementById("md-1-result");
    mdOutput.innerHTML = md.render(mdContent); // use markdown-it parser to render the markdown into html
    mdCode.getWrapperElement().classList.add("hidden");
  });
});

const setMirrors = language => {
  const codeCells = [...document.querySelectorAll(`.code-cell-${language}`)];

  return codeCells.map(codeCell => {
    let editor = CodeMirror.fromTextArea(codeCell, {
      mode: language,
      theme: "darcula",
      lineNumbers: true,
      showCursorWhenSelecting: true
    });

    return editor;
  });
};

// extracts and concatenates all code up to specified cell number

const allCodeUpToCell = (cellNum, cells) => {
  let codeStrArray = [];

  for (let i = 0; i <= cellNum; i += 1) {
    if (cells[i]) {
      let cell = cells[i];
      codeStrArray.push(
        cell
          .getValue()
          .trim()
          .concat("\n")
      );
    }
  }
  return codeStrArray;
};

// // maps all textareas designated as code cells to codemirror objects
// const setAllCodemirrorObjects = () => {
//   const codeCells = [...document.querySelectorAll(".code-cell")];

//   return codeCells.map(codeCell => {
//     let editor = CodeMirror.fromTextArea(codeCell, {
//       mode: "javascript",
//       theme: "darcula",
//       lineNumbers: true,
//       showCursorWhenSelecting: true
//     });

//     return editor;
//   });
// };

// // extracts and concatenates all code up to specified cell number
// const allCodeUpToCell = (cellNum, allCodeCells) => {
//   let codeStrArray = [];

//   for (let i = 0; i <= cellNum; i += 1) {
//     let cell = allCodeCells[i];
//     codeStrArray.push(
//       cell
//         .getValue()
//         .trim()
//         .concat("\n")
//     );
//   }

//   return codeStrArray;
// };

// const appendCellOutput = resultObj => {
//   Object.keys(resultObj)
//     .slice(0, -2) // need to slice off return and result here
//     .forEach(cellNumber => {
//       const outputUl = document.getElementById(
//         `codecell-${cellNumber}-output`
//       );

//       removeChildElements(outputUl);

//       resultObj[cellNumber].stdout.forEach(output => {
//         appendLi(outputUl, output);
//       });
//     });
// };

// const appendCellStderror = resultObj => {
//   Object.keys(resultObj)
//     .slice(0, -2) // need to slice off return and result here
//     .forEach(cellNumber => {
//       const errorUl = document.getElementById(`codecell-${cellNumber}-error`);
//       const stderr = resultObj[cellNumber].stderr;
//       removeChildElements(errorUl);

//       if (stderr) {
//         appendLi(errorUl, stderr);
//       }
//     });
// };

// const appendCellError = resultObj => {
//   Object.keys(resultObj)
//     .slice(0, -2) // need to slice off return and result here
//     .forEach(cellNumber => {
//       const errorUl = document.getElementById(`codecell-${cellNumber}-error`);

//       if (resultObj[cellNumber].error) {
//         const error = resultObj[cellNumber].error;

//         if (error.signal && error.signal.match("SIGTERM")) {
//           removeChildElements(errorUl);
//           appendLi(errorUl, "Infinite Loop Error");
//         } else if (error.code && String(error.code).match("MAXBUFFER")) {
//           removeChildElements(errorUl);

//           let stdout = resultObj[cellNumber].stdout;
//           truncatedStdout = stdout.slice(0, 10);
//           resultObj[cellNumber].stdout = truncatedStdout; // mutate resultObj to truncate stdout

//           appendLi(errorUl, "Maximum Buffer Error");
//         }
//       }
//     });
// };

// const appendCellReturn = (cellNum, resultObj) => {
//   const codeReturn = document.getElementById(`codecell-${cellNum}-return`);
//   const returnText = resultObj.return;

//   document.querySelectorAll(".code-return").forEach(codeReturn => {
//     removeChildElements(codeReturn);
//   });

//   if (returnText) {
//     appendLi(codeReturn, returnText);
//   }
// };

// mutates resultObj, converts stdout to an array with output mapped to correct cell
// const mapStdoutToCell = resultObj => {
//   let prevOutLength = 0;
//   Object.keys(resultObj)
//     .slice(0, -2) // need to slice off return and result here
//     .forEach(cellNum => {
//       const stdoutArr = resultObj[cellNum].stdout.split("\n").slice(0, -1);
//       const newStdoutArr = stdoutArr.slice(prevOutLength);
//       resultObj[cellNum].stdout = newStdoutArr;
//       prevOutLength += stdoutArr.length;
//     });
//   return resultObj;
// };

// WRITE TO PAGE
// listen for stdout / stderr / delimiters as they come across
// slot appropriately & increment cellNum if DELIMITER
// request.addEventListener("load", () => {
//   const resultObj = request.response.responseObj;
//   debugger;
//   mapStdoutToCell(resultObj); // mutates each stdout in resultObj to an array
//   appendCellStderror(resultObj);
//   appendCellError(resultObj); // mutates stdout in resultObj for cell with MAXBUFFER error
//   appendCellOutput(resultObj);
//   appendCellReturn(cellNum, resultObj);
// });
