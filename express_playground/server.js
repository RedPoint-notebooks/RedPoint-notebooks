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
      console.log(repl.result);
      node.write(replCodeString);
      console.log(repl.result);
      node.on("end", () => {
        console.log("AFTER STOPPING REPL");
      });
      console.log(repl.result);
      resultObj.return = repl.parseOutput();
      if (resultObj.return) {
        resolve();
      } else {
        reject();
      }
    });
  };

  const respondToServer = () => {
    console.log("INSIDE RESPOND TO SERVER");
    res.json({ resultObj });
  };

  userScript
    .writeFile(codeString)
    .then(() => userScript.execute(resultObj))
    .then(() => executeRepl())
    .then(() => respondToServer())
    .catch(err => console.log(err));

  // setTimeout(() => {
  //   resultObj.return = node.parseOutput(node.result);
  //   res.json({ resultObj });
  // }, 1000);
});

app.listen(3000, () => {
  console.log("App started");
});
