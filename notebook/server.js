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
  const codeStringArray = req.body.userCode;
  const codeString = codeStringArray.join("");

  const respondToClient = responseObj => {
    debugger;
    res.json({ responseObj });
  };

  const writeScript = () => {
    const script = codeStringArray.join("console.log('DELIMIT')\n"); // cell delimiter must be language-specific
    return userScript.writeFile(script, "JAVASCRIPT");
  };

  writeScript().then(() => {
    userScript
      .execute()
      .then(responseObj => repl.execute(codeString, responseObj, "JAVASCRIPT"))
      .then(responseObj => repl.parseOutput(responseObj, "JAVASCRIPT"))
      .then(responseObj => respondToClient(responseObj))
      .catch(responseObj => {
        respondToClient(responseObj);
      });
  });
});

app.listen(3000, () => {
  console.log("App started");
});
