document.addEventListener("DOMContentLoaded", () => {
  const codemirrors = setAllCodemirrorObjects();
  const btnMD1 = document.getElementById("render-md-1");
  const mdC1 = document.getElementById("md-cell-1");

  const handleCodeSubmit = event => {
    let cellNum = +event.target.dataset.button;
    const codeStrArray = allCodeUpToCell(cellNum, codemirrors);
    const json = JSON.stringify({ userCode: codeStrArray });

    const request = new XMLHttpRequest();

    request.open("POST", "/");
    request.setRequestHeader("Content-Type", "application/json");
    request.responseType = "json";

    request.send(json);

    request.addEventListener("load", () => {
      const resultObj = request.response.resultObj;
      mapStdoutToCell(resultObj); // mutates each stdout in resultObj to an array
      appendCellStderror(resultObj);
      appendCellError(resultObj);
      appendCellOutput(resultObj);
      appendCellReturn(cellNum, resultObj);
    });
  };

  // ***** event listeners ******

  document.addEventListener("click", event => {
    if (event.target.className === "code-submit") {
      handleCodeSubmit(event);
    }
  });

  const appendCellOutput = resultObj => {
    Object.keys(resultObj)
      .slice(0, -2) // need to slice off return and result here
      .forEach(cellNumber => {
        const outputUl = document.getElementById(
          `codecell-${cellNumber}-output`
        );

        // clear current output from all cells
        while (outputUl.firstChild) {
          outputUl.removeChild(outputUl.firstChild);
        }

        resultObj[cellNumber].stdout.forEach(output => {
          const newLi = document.createElement("li");
          newLi.textContent = output;
          outputUl.appendChild(newLi);
        });
      });
  };

  const appendCellStderror = resultObj => {
    Object.keys(resultObj)
      .slice(0, -2) // need to slice off return and result here
      .forEach(cellNumber => {
        const errorUl = document.getElementById(`codecell-${cellNumber}-error`);

        // clear current errors from all cells
        while (errorUl.firstChild) {
          errorUl.removeChild(errorUl.firstChild);
        }

        if (resultObj[cellNumber].stderr) {
          const newLi = document.createElement("li");
          newLi.textContent = resultObj[cellNumber].stderr;
          errorUl.appendChild(newLi);
        }
      });
  };

  const appendCellError = resultObj => {
    Object.keys(resultObj)
      .slice(0, -2) // need to slice off return and result here
      .forEach(cellNumber => {
        const errorUl = document.getElementById(`codecell-${cellNumber}-error`);

        if (resultObj[cellNumber].error) {
          const error = resultObj[cellNumber].error;

          // clear current error from all cells
          while (errorUl.firstChild) {
            errorUl.removeChild(errorUl.firstChild);
          }

          if (error.signal && error.signal.match("SIGTERM")) {
            const newLi = document.createElement("li");
            newLi.textContent = "Infinite Loop Error";
            errorUl.appendChild(newLi);
          } else if (error.code && error.code.match("MAXBUFFER")) {
            let stdout = resultObj[cellNumber].stdout;
            truncatedStdout = stdout.slice(0, 10);
            resultObj[cellNumber].stdout = truncatedStdout; // mutate resultObj to truncate stdout

            const newLi = document.createElement("li");
            newLi.textContent = "Maximum Buffer Error";
            errorUl.appendChild(newLi);
          }
        }
      });
  };

  const appendCellReturn = (cellNum, resultObj) => {
    const codeReturn = document.getElementById(`codecell-${cellNum}-return`);

    // clear current return from all cells
    document.querySelectorAll(".code-return").forEach(codeReturn => {
      while (codeReturn.firstChild) {
        codeReturn.removeChild(codeReturn.firstChild);
      }
    });

    if (resultObj.return) {
      const newLi = document.createElement("li");
      newLi.textContent = resultObj.return;
      codeReturn.appendChild(newLi);
    }
  };

  // mutates resultObj, converts stdout to an array with output mapped to correct cell
  const mapStdoutToCell = resultObj => {
    let prevOutLength = 0;
    Object.keys(resultObj)
      .slice(0, -2) // need to slice off return and result here
      .forEach(cellNum => {
        const stdoutArr = resultObj[cellNum].stdout.split("\n").slice(0, -1);
        const newStdoutArr = stdoutArr.slice(prevOutLength);
        resultObj[cellNum].stdout = newStdoutArr;
        prevOutLength += stdoutArr.length;
      });
    return resultObj;
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

// maps all textareas designated as code cells to codemirror objects
const setAllCodemirrorObjects = () => {
  const codeCells = [...document.querySelectorAll(".code-cell")];

  return codeCells.map(codeCell => {
    let editor = CodeMirror.fromTextArea(codeCell, {
      mode: "javascript",
      theme: "darcula",
      lineNumbers: true,
      showCursorWhenSelecting: true
    });

    return editor;
  });
};

// extracts and concatenates all code up to specified cell number
const allCodeUpToCell = (cellNum, allCodeCells) => {
  let codeStrArray = [];

  for (let i = 0; i <= cellNum; i += 1) {
    let cell = allCodeCells[i];
    codeStrArray.push(
      cell
        .getValue()
        .trim()
        .concat("\n")
    );
  }
  return codeStrArray;
};
