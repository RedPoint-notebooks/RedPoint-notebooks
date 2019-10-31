const express = require("express");
const logger = require("morgan");
const pty = require("node-pty");
const app = express();
const bodyParser = require("body-parser");
const repl = pty.spawn("irb");
const userScript = require("./libs/modules/userScript");

app.use(logger("dev"));
app.use(express.static("."));
app.use(bodyParser.json());

const parseReplOutput = output => {
  // split REPL output on newlines
  const outputLines = output.split("\n");
  if (output.match("Error")) {
    // TODO: Don't return anything if error
    // console.log(outputLines);
  }
  // REPL return value is second last line in output
  const replReturnValue = outputLines[outputLines.length - 3];
  return replReturnValue;
};

app.post("/", function(req, res) {
  const codeString = req.body.userCode;
  const codeArray = codeString.split("\n");
  codeArray.pop(); // get rid of "\n" array element. This newline is used in the codeString provided to the REPL
  let replResult = "";
  let resultObj = {};

  userScript.writeFile(codeString);

  userScript.execute(resultObj);

  repl.onData(data => {
    replResult += data;
  });

  repl.write(codeString + "exit\r");

  repl.on("end", () => {
    console.log(replResult);
    // processesEnded.replEnded = true;
  });

  // processesEnded = {scriptEnded: false, replEnded: false}

  // TODO : can we listen for `end` of stream data before sending response
  // https://nodejs.org/api/stream.html#stream_event_end
  setTimeout(() => {
    const returnValue = parseReplOutput(replResult);
    resultObj.return = returnValue;
    res.json({ resultObj });
  }, 600);

  //  can also delete using fs:  https://www.tutorialkart.com/nodejs/delete-a-file-in-nodejs-using-node-fs/
  // setTimeout(deleteScript, 2000); // setTimeout, or script is deleted too early
});

app.listen(3000, () => {
  console.log("App started");
});
