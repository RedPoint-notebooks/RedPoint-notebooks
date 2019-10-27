document.addEventListener("DOMContentLoaded", () => {
  const codeAreas = [...document.querySelectorAll(".code-cell")];

  let codeMirrorObjs = codeAreas.map(textArea => {
    let editor = CodeMirror.fromTextArea(textArea, {
      mode: "javascript",
      theme: "darcula",
      lineNumbers: true,
      showCursorWhenSelecting: true
    });

    return editor;
  });

  const button = document.getElementById("execute-codecell-2");

  button.addEventListener("click", () => {
    let allCodeString = "";

    codeMirrorObjs.forEach(editor => {
      allCodeString += editor
        .getValue()
        .trim()
        .concat("\n");
    });

    let codeResult = document.getElementById("codecell-2-result");

    const json = JSON.stringify({ userCode: allCodeString });

    const request = new XMLHttpRequest();

    request.open("POST", "/");
    request.setRequestHeader("Content-Type", "application/json");
    request.responseType = "json";

    request.send(json);

    request.addEventListener("load", () => {
      const resultString = request.response.result;
      codeResult.textContent = resultString;
    });
  });

  const mdbutton = document.getElementById("render-md");
  const mdCell = document.getElementById("markdown-cell");
  const mdCode = CodeMirror.fromTextArea(mdCell, {
    mode: "markdown",
    showCursorWhenSelecting: true,
    theme: "monokai"
  });

  const md = window.markdownit(); // load markdown-it parser into a variable

  mdbutton.addEventListener("click", () => {
    let mdContent = mdCode.getValue();
    let mdOutput = document.getElementById("rendered-markdown");
    mdOutput.innerHTML = md.render(mdContent); // use markdown-it parser to render the markdown into html
  });
});
