const express = require("express");
const logger = require("morgan");
const pty = require("node-pty");
const app = express();
const bodyParser = require("body-parser");
const repl = pty.spawn("irb");

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

app.post("/", function(req, res) {
  const code = req.body.userCode;
  let result = "";

  repl.write(code); // repl.pipe(code) ?

  repl.onData(data => {
    result += data;
  });

  setTimeout(() => {
    const returnValue = parseReplOutput(result);
    console.log(returnValue);
    res.json({ result: returnValue });
  }, 200);
});

app.listen(3000, () => {
  console.log("App started");
});
