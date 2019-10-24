import CodeMirror from "codemirror";

const code = document.querySelector(".codemirror-textarea");
const editor = CodeMirror.fromTextArea(code, {
  lineNumbers: true
});
