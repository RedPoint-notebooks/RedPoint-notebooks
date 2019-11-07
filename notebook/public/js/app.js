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
      const responseObj = request.response.responseObj;
      debugger;
      clearPreviousResponse();
      appendResponse(responseObj);

      // mapStdoutToCell(resultObj); // mutates each stdout in resultObj to an array
      // appendCellStderror(resultObj);
      // appendCellError(resultObj); // mutates stdout in resultObj for cell with MAXBUFFER error
      // appendCellOutput(resultObj);
      // appendCellReturn(cellNum, resultObj);
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

  const appendResponse = response => {
    Object.keys(response).forEach(cellNum => {
      const current = response[cellNum];
      const currentOutput = current.output;
      const currentReturn = current.return;
      const currentError = current.error;

      if (currentOutput) {
        const outputUl = document.getElementById(`codecell-${cellNum}-output`);
        currentOutput.forEach(output => {
          appendLi(outputUl, output);
        });
      }

      if (currentError) {
        const errorUl = document.getElementById(`codecell-${cellNum}-error`);
        currentError.forEach(error => {
          appendLi(errorUl, error);
        });
      }

      if (currentReturn) {
        const returnUl = document.getElementById(`codecell-${cellNum}-return`);
        appendLi(returnUl, currentReturn);
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

          if (error.signal && error.signal.match("SIGTERM")) {
            removeChildElements(errorUl);
            appendLi(errorUl, "Infinite Loop Error");
          } else if (error.code && String(error.code).match("MAXBUFFER")) {
            removeChildElements(errorUl);

            let stdout = resultObj[cellNumber].stdout;
            truncatedStdout = stdout.slice(0, 10);
            resultObj[cellNumber].stdout = truncatedStdout; // mutate resultObj to truncate stdout

            appendLi(errorUl, "Maximum Buffer Error");
          }
        }
      });
  };

  const appendCellReturn = (cellNum, resultObj) => {
    const codeReturn = document.getElementById(`codecell-${cellNum}-return`);
    const returnText = resultObj.return;

    document.querySelectorAll(".code-return").forEach(codeReturn => {
      removeChildElements(codeReturn);
    });

    if (returnText) {
      appendLi(codeReturn, returnText);
    }
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
