const pty = require("node-pty");

const repl = {
  result: "",
  spawn: () => pty.spawn("irb"),
  parseOutput: () => {
    const outputLines = this.result.split("\n");
    const replReturnValue = outputLines[outputLines.length - 3];
    return replReturnValue;
  },
  setDataListener: irb => {
    irb.onData(data => (this.result += data));
  }
};

module.exports = repl;
