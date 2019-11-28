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
    const indexCleanStops = dirtyReturnValue.indexOf("irb(main):");
    const cleanReturnValue = dirtyReturnValue.slice(0, indexCleanStops);
    resolve(cleanReturnValue.trim());
  });
};

const parseJSOutput = returnData => {
  return new Promise(resolve => {
    const byOutput = returnData.split(">");
    const dirtyReturnValue = byOutput[byOutput.length - 2];
    console.log("Dirty return value: ", dirtyReturnValue);
    extractCleanJSReturnValue(dirtyReturnValue).then(clean => {
      resolve(clean);
    });
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
  return new Promise(resolve => {
    const newlines = [...string.matchAll(/\n/g)];
    console.log("newlines in extractCleanJS: ", newlines);
    const cleanStarts = newlines[newlines.length - 2].index;
    const cleanStops = newlines[newlines.length - 1].index;
    const clean = string.slice(cleanStarts, cleanStops).trim();
    console.log("Clean: ", clean);
    resolve(clean);
  });
};

module.exports = repl;

// `Welcome to Node.js v12.13.0.\nType ".help" for more information.\n> console.log('hey');\nhey\nundefined\n> console.log('you');\nyou\nundefined\n> .exit`;
