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
  let resultObj = {};

  const executeRepl = () => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE STARTING REPL");
      const node = repl.spawn();
      repl.setDataListener(node);
      node.write(replCodeString);
      node.on("end", () => console.log("AFTER STOPPING REPL"));
      resolve();
    });
  };

  const respondToServer = () => {
    return new Promise((resolve, reject) => {
      const returnValue = repl.parseOutput();
      console.log("INSIDE RESPOND TO SERVER");
      resultObj.return = returnValue;
      res.json({ resultObj });
      resolve();
    });
  };

  userScript
    .writeFile(codeString)
    .then(userScript.execute(resultObj))
    .then(executeRepl())
    .then(respondToServer)
    .catch(err => console.log(err));
});

app.listen(3000, () => {
  console.log("App started");
});
