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
        replExitMessage = "\nexit()\r";
        replType = "python3";
        break;
    }

    return new Promise(resolve => {
      console.log(
        JSON.stringify(`Repl Command: ${codeString + replExitMessage}`)
      );
      const options = { cols: 1000, rows: 1000 };
      const process = pty.spawn(replType, null, options);
      let returnData = "";
      process.onData(data => (returnData += stripAnsi(data)));
      process.write(codeString + replExitMessage);
      process.on("exit", () => {
        // To ensure that the spawned REPL is killed after finishing processing
        console.log(returnData);
        process.removeAllListeners("data");
        process.kill();
        console.log("AFTER REPL EXECUTE");
        resolve(returnData);
      });
    });
  },
  parseOutput: (returnData, lang) => {
    console.log("BEFORE PARSE OUTPUT");
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
    const returnVal = dirtyReturnValue.split("\n")[0].trim();
    resolve(returnVal);
  });
};

const parseJSOutput = returnData => {
  return new Promise(resolve => {
    const byOutput = returnData.split(">");
    const dirtyReturnValue = byOutput[byOutput.length - 2];
    if (/console\./.test(dirtyReturnValue)) {
      extractLogReturnValue(dirtyReturnValue).then(clean => {
        resolve(clean);
      });
    } else {
      extractOtherReturnValue(dirtyReturnValue).then(clean => {
        resolve(clean);
      });
    }
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

const extractOtherReturnValue = string => {
  return new Promise(resolve => {
    const splitReturn = string.split("\r\r\n");
    const joinedReturn = splitReturn.slice(1).join("\n");
    resolve(joinedReturn);
  });
};

const extractLogReturnValue = string => {
  return new Promise(resolve => {
    const newlines = findNewlineIndexes(string);
    console.log("newlines in extractCleanJS: ", newlines);
    const cleanStarts = newlines[newlines.length - 2];
    const cleanStops = newlines[newlines.length - 1];
    const clean = string.slice(cleanStarts, cleanStops).trim();
    resolve(clean);
  });
};

const findNewlineIndexes = string => {
  const indexes = [];

  for (let i = 0; i < string.length; i += 1) {
    let char = string[i];
    if (char === "\n") {
      indexes.push(i);
    }
  }

  return indexes;
};

module.exports = repl;
