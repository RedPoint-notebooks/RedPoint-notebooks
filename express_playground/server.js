const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
// const repl = pty.spawn("irb");
const userScript = require("./libs/modules/userScript");
const repl = require("./libs/modules/rubyRepl");
const app = express();

app.use(logger("dev"));
app.use(express.static("."));
app.use(bodyParser.json());

app.post("/", function(req, res) {
  const codeString = req.body.userCode;
  const codeArray = codeString.split("\n");
  codeArray.pop(); // get rid of "\n" array element. This newline is used in the codeString provided to the REPL
  // let replResult = "";
  let resultObj = {};

  userScript.writeFile(codeString);

  userScript.execute(resultObj);

  const irb = repl.spawn();

  // repl.onData(data => {
  //   replResult += data;
  // });

  repl.setDataListener(irb);

  irb.write(codeString + "exit\r");

  irb.on("end", () => {
    // processesEnded.replEnded = true;
  });

  // processesEnded = {scriptEnded: false, replEnded: false}

  // TODO : can we listen for `end` of stream data before sending response
  // https://nodejs.org/api/stream.html#stream_event_end
  setTimeout(() => {
    const returnValue = repl.parseOutput();
    resultObj.return = returnValue;
    res.json({ resultObj });
  }, 1000);

  //  can also delete using fs:  https://www.tutorialkart.com/nodejs/delete-a-file-in-nodejs-using-node-fs/
  // setTimeout(deleteScript, 2000); // setTimeout, or script is deleted too early
});

app.listen(3000, () => {
  console.log("App started");
});
