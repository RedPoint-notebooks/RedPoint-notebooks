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
  const codeString = req.body.userCode;
  let resultObj = {
    result: "",
    output: "",
    error: ""
  };

  const respondToServer = returnValue => {
    console.log("INSIDE RESPOND TO SERVER");
    resultObj.return = returnValue;
    delete resultObj.result;
    console.log(`resultObj.return = ${resultObj.return}`);
    res.json({ resultObj });
  };

  userScript
    .writeFile(codeString)
    .then(() => userScript.execute(resultObj))
    .then(() => repl.execute(codeString, resultObj))
    .then(() => repl.parseOutput(resultObj))
    .then(returnValue => respondToServer(returnValue))
    .catch(err => console.log(err));
});

app.listen(3000, () => {
  console.log("App started");
});

// spawn('irb', [], { stdio: [process.stdout, process.stdin, process.stderr] });
