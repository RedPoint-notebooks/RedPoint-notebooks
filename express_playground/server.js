const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const userScript = require("./libs/modules/userScript");
// const repl = require("./libs/modules/rubyRepl");
const repl = require("./libs/modules/nodeRepl");
const app = express();

app.use(logger("dev"));
app.use(express.static("."));
app.use(bodyParser.json());

app.post("/", function(req, res) {
  let codeString = req.body.userCode;
  const replCodeString = codeString + ".exit\r"; // repl req's this, but it will break the script exec
  // const codeArray = codeString.split("\n");
  // codeArray.pop(); // get rid of "\n" array element. This newline is used in the codeString provided to the REPL
  let resultObj = {};

  // userScript.writeFile(codeString);
  userScript.execute(resultObj);

  const node = repl.spawn();
  repl.setDataListener(node);
  node.write(replCodeString);
  node.on("end", () => {
    console.log("Node process has ended");
  });

  // const irb = repl.spawn();
  // repl.setDataListener(irb);
  // irb.write(codeString + "exit\r");
  // irb.on("end", () => {
  //   // processesEnded.replEnded = true;
  // });

  // processesEnded = {scriptEnded: false, replEnded: false}

  // TODO : can we listen for `end` of stream data before sending response
  // https://nodejs.org/api/stream.html#stream_event_end
  setTimeout(() => {
    const returnValue = repl.parseOutput();
    console.log(node.result);
    resultObj.return = returnValue;
    res.json({ resultObj });
  }, 900);
});

app.listen(3000, () => {
  console.log("App started");
});
