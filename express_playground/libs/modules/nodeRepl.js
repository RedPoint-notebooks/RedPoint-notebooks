const pty = require("node-pty");
const stripAnsi = require("strip-ansi");

const repl = {
  result: "",
  spawn: () => pty.spawn("node"),
  parseOutput: resultObj => {
    const outputLines = resultObj.result.split("\n");
    let replReturnValue = outputLines[outputLines.length - 3];
    replReturnValue = stripAnsi(replReturnValue);
    return replReturnValue;
  },
  setDataListener: (repl, resultObj) => {
    repl.onData(chunk => (resultObj.result += chunk));
  },
  execute: (replCodeString, resultObj) => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE STARTING REPL");
      const node = repl.spawn();
      repl.setDataListener(node, resultObj);
      node.write(replCodeString);
      console.log(`resultObj.result within repl: ${resultObj.result}`);
      node.on("end", () => {
        console.log("AFTER STOPPING REPL");
      });
      console.log(`resultObj.result after repl: ${resultObj.result}`);
      resultObj.return = repl.parseOutput(resultObj);
      if (resultObj.return) {
        resolve();
      } else {
        reject();
      }
    });
  }
};

module.exports = repl;
