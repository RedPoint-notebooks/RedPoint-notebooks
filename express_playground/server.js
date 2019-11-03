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
  const codeString = req.body.userCode; // will be an array of code cells
  let resultObj = {
    result: "",
    output: "",
    error: ""
  };

  const respondToServer = returnValue => {
    if (resultObj.responseSent === true) {
      return; // unnecessary? Want to avoid sending 2 responses to client
    }
    if (returnValue) {
      resultObj.return = returnValue;
      delete resultObj.result;
      delete resultObj.responseSent;
    }
    res.json({ resultObj });
    resultObj.responseSent = true;
  };

  // This ideally uses a separate promise for
  // writefile to write a new file for each code cell
  // then a new promise to execute each cell as a promise

  userScript
    .writeFile(codeString)
    .then(() => userScript.execute(resultObj))
    .catch(() => respondToServer()) // send error to client instead of trying REPL
    .then(() => repl.execute(codeString, resultObj))
    .then(() => repl.parseOutput(resultObj))
    .then(returnValue => respondToServer(returnValue))
    .catch(err => {
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log("App started");
});
