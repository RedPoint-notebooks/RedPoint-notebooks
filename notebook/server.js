const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const userScript = require("./libs/modules/userScript");
const repl = require("./libs/modules/repl");
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

  const respondToServer = () => {
    res.json({ resultObj });
  };

  // This ideally uses a separate promise for
  // writefile to write a new file for each code cell
  // then a new promise to execute each cell as a promise

  userScript
    .writeFile(codeString, "RUBY")
    .then(() => userScript.execute(resultObj))
    .then(() => repl.execute(codeString, resultObj, "RUBY"))
    .then(() => repl.parseOutput(resultObj, "RUBY"))
    .then(returnValue => respondToServer(returnValue))
    .catch(err => {
      respondToServer();
      console.log(err);
    });
});

app.listen(3000, () => {
  console.log("App started");
});
