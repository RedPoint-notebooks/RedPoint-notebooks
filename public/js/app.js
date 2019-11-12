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
    const json = JSON.stringify({ language, codeStrArray });

    ws.send(json);
  };

  ws.onopen = event => {
    let currentCellIdx = 0;
    let editorNumbers;
    let currentCell;
    let languageCells;
    let delimiter;

    ws.onmessage = message => {
      message = JSON.parse(message.data);

      switch (message.type) {
        case "language":
          // clean up variables in ws.onopen scope
          currentCellIdx = 0;
          editorNumbers = null;
          currentCell = null;
          languageCells = null;

          const language = message.data;
          languageCells = document.querySelectorAll(`.code-cell-${language}`);
          editorNumbers = [...languageCells].map(cell => {
            return cell.id.split("-")[1]; // id is 'editor-{num}', we want to extract num
          });
          break;
        case "delimiter":
          delimiter = message.data;
          break;
        case "stdout":
          // slice off empty string
          const stdoutArr = message.data.split("\n").slice(0, -1);
          stdoutArr.forEach(message => {
            if (message === delimiter) {
              currentCellIdx += 1;
            } else {
              currentCell = editorNumbers[currentCellIdx];
              const outputUl = document.getElementById(
                `codecell-${currentCell}-output`
              );
              appendLi(outputUl, message);
            }
          });
          break;
        case "stderr":
          currentCell = editorNumbers[currentCellIdx];
          const stderrUl = document.getElementById(
            `codecell-${currentCell}-error`
          );
          debugger;
          appendLi(stderrUl, message.data);
          break;
        case "error":
          currentCell = editorNumbers[currentCellIdx];
          const errorUl = document.getElementById(
            `codecell-${currentCell}-error`
          );

          const signal = message.data.signal;
          if (signal && signal.match("SIGTERM")) {
            appendLi(errorUl, "Infinite Loop Error");
          }
          break;
        case "return":
          currentCell = editorNumbers[currentCellIdx];
          const returnUl = document.getElementById(
            `codecell-${currentCell}-return`
          );

          appendLi(returnUl, message.data);

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
