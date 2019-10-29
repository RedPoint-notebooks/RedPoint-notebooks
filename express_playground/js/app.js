document.addEventListener("DOMContentLoaded", () => {
  const codemirrors = setAllCodemirrorObjects();
  const btnMD1 = document.getElementById("render-md-1");
  const mdC1 = document.getElementById("md-cell-1");

  const handleCodeSubmit = event => {
    let cellNum = +event.target.dataset.button;
    codeToRender = allCodeUpToCell(cellNum, codemirrors);
    codeResult = document.getElementById(`codecell-${cellNum}-result`);
    codeReturn = document.getElementById(`codecell-${cellNum}-return`);
    const json = JSON.stringify({ userCode: codeToRender });

    const request = new XMLHttpRequest();

    request.open("POST", "/");
    request.setRequestHeader("Content-Type", "application/json");
    request.responseType = "json";

    request.send(json);

    request.addEventListener("load", () => {
      const resultString = request.response.result;

      codeResult.textContent = parseRubyOutput(resultString);
    });
  };

  document.addEventListener("click", event => {
    if (event.target.className === "code-submit") {
      handleCodeSubmit(event);
    }
  });

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

const parseRubyOutput = output => {
  // split REPL output on newlines
  const outputLines = output.split("\n");
  if (output.match("Error")) {
    // TODO => decide how to handle bad user code
    console.log(outputLines);
  }
  // REPL return value is second last line in output
  const replReturnValue = outputLines[outputLines.length - 2];

  // tty instance of Ruby REPL never appends the ruby version or line number to first input line (?)
  outputLines.shift();

  // remove any repl output line that begins with ruby version num (input) or " =>" undesired output
  const replLogs = outputLines.filter(line => {
    return !line.match(/^(\d\.\d\.\d\s:\d\d\d)|(^ =>)/);
  });
  replLogs.push(replReturnValue);
  return replLogs;
};

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
  let allCodeString = "";

  for (let i = 0; i < cellNum; i += 1) {
    let cell = allCodeCells[i];
    allCodeString += cell
      .getValue()
      .trim()
      .concat("\n");
  }

  return allCodeString;
};

const extractRubyOutput = replOutput => {
  return replOutput.filter(line => !line.match(/^[^\s=>|2.6.3\s:\d\d\d]/g));
};
