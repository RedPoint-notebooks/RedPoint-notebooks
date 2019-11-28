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
      console.log(
        JSON.stringify(`Repl Command: ${codeString + replExitMessage}`)
      );
      const process = pty.spawn(replType);
      let returnData = "";
      process.onData(data => (returnData += stripAnsi(data)));
      process.write(codeString + replExitMessage);
      process.on("exit", () => {
        process.removeAllListeners("data");
        process.kill();
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
    let indexCleanStops;
    if (process.ENV === "development") {
      indexCleanStops = dirtyReturnValue.indexOf("2.4.1");
    } else if (process.ENV === "production") {
      indexCleanStops = dirtyReturnValue.indexOf("irb(main):");
    }
    const cleanReturnValue = dirtyReturnValue.slice(0, indexCleanStops);
    resolve(cleanReturnValue.trim());
  });
};

const parseJSOutput = returnData => {
  return new Promise(resolve => {
    const byOutput = returnData.split(">");
    const dirtyReturnValue = byOutput[byOutput.length - 2];
    const cleanReturnValue = extractCleanJSReturnValue(dirtyReturnValue);
    resolve(cleanReturnValue.trim());
  });
};

const parsePythonOutput = returnData => {
  return new Promise(resolve => {
    const byOutput = returnData.split(">>>");
    const dirtyReturnValue = byOutput[byOutput.length - 2];
    const indexCleanStarts = dirtyReturnValue.indexOf("\n");
    const cleanReturnValue = dirtyReturnValue.slice(indexCleanStarts);
    resolve(cleanReturnValue.trim());
  });
};

const extractCleanJSReturnValue = string => {
  const newlines = [...string.matchAll(/\n/g)];

  return string.slice(newlines[newlines.length - 2].index + 1);
};

module.exports = repl;
