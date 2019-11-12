document.addEventListener("DOMContentLoaded", () => {
  const codemirrors = setAllCodemirrorObjects();
  const btnMD1 = document.getElementById("render-md-1");
  const mdC1 = document.getElementById("md-cell-1");
  const ws = new WebSocket("ws://localhost:8000");

  ws.onopen = event => {
    // receiving the message from server
    let currentCell = 0;
    ws.onmessage = message => {
      message = JSON.parse(message.data);

      switch (message.type) {
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

  const handleCodeSubmit = event => {
    clearPreviousResponse();

    let cellNum = +event.target.dataset.button;
    const codeStrArray = allCodeUpToCell(cellNum, codemirrors);
    const json = JSON.stringify(codeStrArray);

    ws.send(json);
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
