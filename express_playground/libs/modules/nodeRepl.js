const pty = require("node-pty");
const stripAnsi = require("strip-ansi");

const repl = {
  result: "",
  spawn: () => pty.spawn("node"),
  parseOutput: () => {
    console.log(`result: ${this.result}`);
    const outputLines = this.result.split("\n");
    let replReturnValue = outputLines[outputLines.length - 3];
    replReturnValue = stripAnsi(replReturnValue);
    return replReturnValue;
  },
  setDataListener: repl => {
    repl.onData(chunk => {
      this.result += chunk;
    });
  },

  execute: () => {}
};

module.exports = repl;
