const express = require("express");
const logger = require("morgan");
const pty = require("node-pty");
const { exec } = require("child_process"); // exec uses system default shell
const app = express();
const bodyParser = require("body-parser");
const repl = pty.spawn("irb");
const fs = require("fs");

app.use(logger("dev"));
app.use(express.static("."));
app.use(bodyParser.json());

const parseReplOutput = output => {
  // split REPL output on newlines
  const outputLines = output.split("\n");
  if (output.match("Error")) {
    // TODO: Don't return anything if error
    console.log(outputLines);
  }
  // REPL return value is second last line in output
  const replReturnValue = outputLines[outputLines.length - 2];
  return replReturnValue;
};

const executeScript = resultObj => {
  const rubyScript = exec("ruby script.rb");

  rubyScript.stdout.on("data", data => {
    resultObj.output = data;
    // console.log(`stout from execute: ${data}`); // happy path. no error.
  });
  rubyScript.stderr.on("data", data => {
    resultObj.error = data;
    // console.error(`sterr from execute: ${data}`);
  });
};

const deleteScript = () => {
  exec("rm script.rb", (err, stdout, stderr) => {
    if (err) {
      // console.error(`error from delete: ${err}`);
    } else {
      console.log("script deleted!");
    }
  });
};

app.post("/", function(req, res) {
  const codeString = req.body.userCode;
  const codeArray = codeString.split("\n");
  codeArray.pop(); // get rid of "\n" array element. This newline is used in the codeString provided to the REPL
  let replResult = "";
  let resultObj = {};

  // create the file
  fs.writeFile("script.rb", codeString, err => {
    if (err) {
      console.log("there was an error");
    }
  });
  // execute in bash, and collect output

  executeScript(resultObj);

  if (!resultObj.error) {
    // run REPL
  }

  // erase file ?

  repl.write(codeString);

  repl.onData(data => {
    replResult += data;
  });

  // TODO : can we listen for `end` of stream data before sending response
  // https://nodejs.org/api/stream.html#stream_event_end
  setTimeout(() => {
    const returnValue = parseReplOutput(replResult);
    resultObj.return = returnValue;
    res.json({ resultObj });
  }, 2000);

  // setTimeout(deleteScript, 2000); // setTimeout, or script is deleted too early
});

app.listen(3000, () => {
  console.log("App started");
});
