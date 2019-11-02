const pty = require("node-pty");
const stripAnsi = require("strip-ansi");

const repl = {
  result: "",
  spawn: () => pty.spawn("node"),
  parseOutput: resultObj => {
    return new Promise(resolve => {
      let outputLines = resultObj.result.split("\n");
      outputLines = stripAnsi(outputLines);
      const returnValue = outputLines[outputLines.length - 3];
      resolve(returnValue);
    });
  },
  execute: (codeString, resultObj) => {
    return new Promise(resolve => {
      console.log("BEFORE STARTING REPL");
      const node = repl.spawn();
      node.onData(data => {
        resultObj.result += data;
      });
      node.write(codeString + ".exit\r");
      node.on("exit", () => {
        if (resultObj.result) {
          console.log("AFTER FINISHING REPL");
          resolve(repl);
        }
      });
    });
  }
};

module.exports = repl;
