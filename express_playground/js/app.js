document.addEventListener("DOMContentLoaded", () => {
  const codeArea = document.getElementById("editor");
  const editor = CodeMirror.fromTextArea(codeArea, {
    mode: "javascript",
    theme: "darcula",
    lineNumbers: true,
    showCursorWhenSelecting: true
  });

  const button = document.getElementById("execute-codecell-1");

  button.addEventListener("click", () => {
    let userCode = editor
      .getValue()
      .trim()
      .concat("\n");
    let codeResult = document.getElementById("result");

    // const userCode = "1+1\n".replace(/ +?/g, "");

    const json = JSON.stringify({ userCode });

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

  const codeArea2 = document.getElementById("editor-2");
  const editor2 = CodeMirror.fromTextArea(codeArea2, {
    mode: "javascript",
    theme: "darcula",
    lineNumbers: true,
    showCursorWhenSelecting: true
  });

  const button2 = document.getElementById("execute-codecell-2");

  button2.addEventListener("click", () => {
    let userCode2 = editor2.getValue();
    let codeResult2 = document.getElementById("codecell-2-result");
    codeResult2.innerText = eval(userCode2);
  });
});
