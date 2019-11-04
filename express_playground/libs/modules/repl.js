const pty = require("node-pty");
const stripAnsi = require("strip-ansi");

const repl = {
  execute: (codeString, resultObj, lang) => {
    let replExitMessage;
    let replType;

    switch (lang) {
      case "RUBY":
        replExitMessage = "exit\r";
        replType = "irb";
        break;
      case "JAVASCRIPT":
        replExitMessage = ".exit\r";
        replType = "node";
        break;
    }

    return new Promise(resolve => {
      const node = pty.spawn(replType);
      node.onData(data => (resultObj.result += stripAnsi(data)));
      node.write(codeString + replExitMessage);
      node.on("exit", () => {
        if (resultObj.result) {
          resolve();
        }
      });
    });
  },
  parseOutput: resultObj => {
    return new Promise(resolve => {
      const byOutput = resultObj.result.split(">");
      const dirtyReturnValue = byOutput[byOutput.length - 2];
      const indexCleanStarts = dirtyReturnValue.indexOf("\n");
      const cleanReturnValue = dirtyReturnValue.slice(indexCleanStarts);
      const returnValue = cleanReturnValue;
      resolve(returnValue);
    });
  }
};

const findFirstNewline = () => {
  return;
};

module.exports = repl;
