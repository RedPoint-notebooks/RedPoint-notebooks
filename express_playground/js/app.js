document.addEventListener("DOMContentLoaded", () => {
  const codemirrors = setAllCodemirrorObjects();
  const btnCC1 = document.getElementById("btn-codecell-1");
  const btnCC2 = document.getElementById("btn-codecell-2");
  const btnMD1 = document.getElementById("render-md-1");
  const mdC1 = document.getElementById("md-cell-1");

  btnCC1.addEventListener("click", () => {
    const cellNumber = 1;
    const codeToRender = allCodeUpToCell(cellNumber, codemirrors);
    const codeResult = document.getElementById(`codecell-${cellNumber}-result`);
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
  });

  // want to replace this hard-coded anti-DRY with named cb func for event listener
  btnCC2.addEventListener("click", () => {
    const cellNumber = 2;
    const codeToRender = allCodeUpToCell(cellNumber, codemirrors);
    const codeResult = document.getElementById(`codecell-${cellNumber}-result`);
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
  return outputLines[outputLines.length - 2];
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

// I wanted to pass a named function as a callback on clicking a coderender button so we could supply
// the code cell number dynamically and DRY code, but named callback functions with parameters get immediately
// invoked if passed args. I know this shouldn't be hard but 2:30am brain isn't so good

// const sendCodeToServer = (cellNumber, codemirrors) => {
//   const codeToRender = allCodeUpToCell(cellNumber, codemirrors);
//   const codeResult = document.getElementById(`codecell-${cellNumber}-result`);
//   const json = JSON.stringify({ userCode: codeToRender });
//   const request = new XMLHttpRequest();

//   request.open("POST", "/");
//   request.setRequestHeader("Content-Type", "application/json");
//   request.responseType = "json";

//   request.send(json);

//   request.addEventListener("load", () => {
//     const resultString = request.response.result;

//     codeResult.textContent = parseRubyOutput(resultString);
//   });
// };
