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
      clearPreviousResponse();
      appendResponse(responseObj);

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

  const appendResponse = responseObj => {
    Object.keys(responseObj).forEach(cellNum => {
      const current = responseObj[cellNum];
      const currentReturn = current.return;
      const currentErrors = current.errors;

      // order dependent since currentOutput is mutated in case of MAXBUFFER
      if (currentErrors) {
        const errorUl = document.getElementById(`codecell-${cellNum}-error`);
        const errorObj = currentErrors.err;
        const stderr = currentErrors.stderr;

        if (errorObj) {
          appendSpecialErrors(errorObj, errorUl, responseObj, cellNum);
        }

        if (stderr) {
          appendLi(errorUl, stderr);
        }
      }

      if (current.output) {
        // have to reference original object here since it is mutated
        const outputUl = document.getElementById(`codecell-${cellNum}-output`);
        current.output.forEach(output => {
          appendLi(outputUl, output);
        });
      }

      if (currentReturn) {
        const returnUl = document.getElementById(`codecell-${cellNum}-return`);
        appendLi(returnUl, currentReturn);
      }
    });
  };

  const appendSpecialErrors = (errorObj, errorUl, responseObj, cellNum) => {
    if (errorObj.signal && errorObj.signal.match("SIGTERM")) {
      appendLi(errorUl, "Infinite Loop Error");
    } else if (errorObj.code && String(errorObj.code).match("MAXBUFFER")) {
      const currentOutput = responseObj[cellNum].output;
      truncatedStdout = currentOutput.slice(0, 10);
      responseObj[cellNum].output = truncatedStdout; // mutate responseObj to truncate stdout

      appendLi(errorUl, "Maximum Buffer Error");
    }
  };

  const buildLineNumberObject = () => {
    let totalLines = 0;
    return codemirrors.reduce((obj, mirror, idx) => {
      const currentLines = mirror.lineCount();
      obj[idx] = { start: totalLines + 1, end: totalLines + currentLines };
      totalLines += currentLines;
      return obj;
    }, {});
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
