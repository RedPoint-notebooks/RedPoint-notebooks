const pty = require("node-pty");
const stripAnsi = require("strip-ansi");

const repl = {
  execute: (codeString, resultObj, lang) => {
    console.log("BEFORE REPL EXECUTE");

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
      case "PYTHON":
        replExitMessage = "exit()\r";
        replType = "python";
        break;
    }

    return new Promise(resolve => {
      const repl = pty.spawn(replType);
      repl.onData(data => (resultObj.result += stripAnsi(data)));
      console.log(resultObj.result);
      repl.write(codeString + replExitMessage);
      repl.on("exit", () => {
        if (resultObj.result) {
          console.log("AFTER REPL EXECUTE");
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
      case "PYTHON":
        repl.parsePythonOutput(resultObj);
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
  },
  parsePythonOutput: resultObj => {
    return new Promise(resolve => {
      const byOutput = resultObj.result.split(">>>");
      const dirtyReturnValue = byOutput[byOutput.length - 2];
      const indexCleanStarts = dirtyReturnValue.indexOf("\n");
      const cleanReturnValue = dirtyReturnValue.slice(indexCleanStarts);
      resolve((resultObj.return = cleanReturnValue));
    });
  }
};

module.exports = repl;
