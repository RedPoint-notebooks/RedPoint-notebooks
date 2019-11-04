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
  const codeStringArray = req.body.userCode; // will be an array of code cells
  const codeString = codeStringArray.join("");
  let resultObj = {};
  let prevCodeStr = "";

  const respondToServer = () => {
    res.json({ resultObj });
  };

  let scriptPromises = codeStringArray.map((str, idx) => {
    str = prevCodeStr + str;
    prevCodeStr = str;
    return userScript.writeFile(idx, str, "RUBY");
  });

  const executeCells = async () => {
    for (let i = 0; i < codeStringArray.length; i++) {
      try {
        await userScript.execute(i, resultObj);
        // console.log(codeCells[i]);
      } catch (err) {
        throw new Error("Error executing cell.");
      }
    }
    // return resultObj;
  };

  // This ideally uses a separate promise for
  // writefile to write a new file for each code cell
  // then a new promise to execute each cell as a promise

  Promise.all(scriptPromises).then(() => {
    executeCells()
      .then(() => repl.execute(codeString, resultObj, "RUBY"))
      .then(() => repl.parseOutput(resultObj, "RUBY"))
      .then(returnValue => respondToServer(returnValue))
      .catch(err => {
        respondToServer();
        console.log(err);
      });
  });

  // userScript
  //   .writeFile(codeString, "RUBY")
  //   .then(() => userScript.execute(resultObj))
  //   .then(() => repl.execute(codeString, resultObj, "RUBY"))
  //   .then(() => repl.parseOutput(resultObj, "RUBY"))
  //   .then(returnValue => respondToServer(returnValue))
  //   .catch(err => {
  //     respondToServer();
  //     console.log(err);
  //   });

  // setTimeout(() => {
  //   res.json({ resultObj });
  // }, 1500);
});

app.listen(3000, () => {
  console.log("App started");
});
