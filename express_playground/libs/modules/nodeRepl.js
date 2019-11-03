const pty = require("node-pty");
const stripAnsi = require("strip-ansi");

const repl = {
  parseOutput: resultObj => {
    return new Promise(resolve => {
      const outputLines = resultObj.result.split("\n");
      const returnValue = outputLines[outputLines.length - 3];
      resolve(returnValue);
    });
  },
  execute: (codeString, resultObj) => {
    return new Promise(resolve => {
      const node = pty.spawn("node");
      node.onData(data => (resultObj.result += stripAnsi(data)));
      node.write(codeString + ".exit\r");
      node.on("exit", () => {
        if (resultObj.result) {
          resolve();
        }
      });
    });
  }
};

module.exports = repl;
