const pty = require("node-pty");
const stripAnsi = require("strip-ansi");

const repl = {
  execute: (codeString, lang) => {
    console.log("BEFORE REPL EXECUTE");

    let replExitMessage;
    let replType;

    switch (lang) {
      case "Ruby":
        replExitMessage = "exit\r";
        replType = "irb";
        break;
      case "Javascript":
        replExitMessage = ".exit\r";
        replType = "node";
        break;
      case "Python":
        replExitMessage = "exit()\r";
        replType = "python";
        break;
    }

    return new Promise(resolve => {
      console.log(`Repl Command: ${codeString + replExitMessage}`);
      const node = pty.spawn(replType);
      let returnData = "";
      node.onData(data => (returnData += stripAnsi(data)));
      node.write(codeString + replExitMessage);
      node.on("exit", () => {
        // assumes REPL is finished, and data is captured, and written to returnData
        console.log("AFTER REPL EXECUTE");
        resolve(returnData);
      });
    });
  },
  parseOutput: (returnData, lang) => {
    switch (lang) {
      case "Ruby":
        return parseRubyOutput(returnData);
      case "Javascript":
        return parseJSOutput(returnData);
      case "Python":
        return parsePythonOutput(returnData);
    }
  }
};

const parseRubyOutput = returnData => {
  return new Promise(resolve => {
    const byOutput = returnData.split("=>");
    const dirtyReturnValue = byOutput[byOutput.length - 1];
    const indexCleanStops = dirtyReturnValue.indexOf("2.4.1"); // fix hard-coding?
    const cleanReturnValue = dirtyReturnValue.slice(0, indexCleanStops);
    resolve(cleanReturnValue);
  });
};

const parseJSOutput = returnData => {
  return new Promise(resolve => {
    const byOutput = returnData.split(">");
    const dirtyReturnValue = byOutput[byOutput.length - 2];
    const cleanReturnValue = extractCleanJSReturnValue(dirtyReturnValue);
    resolve(cleanReturnValue);
  });
};

const parsePythonOutput = returnData => {
  return new Promise(resolve => {
    const byOutput = returnData.split(">>>");
    const dirtyReturnValue = byOutput[byOutput.length - 2];
    const indexCleanStarts = dirtyReturnValue.indexOf("\n");
    const cleanReturnValue = dirtyReturnValue.slice(indexCleanStarts);
    resolve(cleanReturnValue);
  });
};

const extractCleanJSReturnValue = string => {
  const newlines = [...string.matchAll(/\n/g)];

  return string.slice(newlines[newlines.length - 2].index + 1);
};

module.exports = repl;
