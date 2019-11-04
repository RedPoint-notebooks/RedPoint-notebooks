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
  parseOutput: (resultObj, lang) => {
    switch (lang) {
      case "RUBY":
        repl.parseRubyOutput(resultObj);
        break;
      case "JAVASCRIPT":
        repl.parseJSOutput(resultObj);
        break;
    }
  },
  parseRubyOutput: resultObj => {
    return new Promise(resolve => {
      const byOutput = resultObj.result.split("=>");
      const dirtyReturnValue = byOutput[byOutput.length - 1];
      const indexCleanStops = dirtyReturnValue.indexOf("2.4.1"); // fix hard-coding?
      const cleanReturnValue = dirtyReturnValue.slice(0, indexCleanStops);
      resolve((resultObj.return = cleanReturnValue));
    });
  },
  parseJSOutput: resultObj => {
    return new Promise(resolve => {
      const byOutput = resultObj.result.split(">");
      const dirtyReturnValue = byOutput[byOutput.length - 2];
      const indexCleanStarts = dirtyReturnValue.indexOf("\n");
      const cleanReturnValue = dirtyReturnValue.slice(indexCleanStarts);
      resolve((resultObj.return = cleanReturnValue));
    });
  }
};

const findFirstNewline = () => {
  return;
};

module.exports = repl;
