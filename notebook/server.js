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
  const resultObj = { result: "", return: "" }; // sets result and return so resultObj has consistent shape on client side
  let prevCodeStr = "";

  const respondToServer = () => {
    res.json({ resultObj });
  };

  const scriptPromises = codeStringArray.map((str, idx) => {
    str = prevCodeStr + str;
    prevCodeStr = str;
    return userScript.writeFile(idx, str, "JAVASCRIPT");
  });

  // find out if fs allows unlink on every file in a dir
  const deleteScripts = () => {
    codeStringArray.forEach((_, idx) => {
      fs.unlinkSync(`./codeCellScripts/cell_${idx}${".js"}`); // hard-coded .rb value
    });
  };

  const executeCells = async () => {
    for (let i = 0; i < codeStringArray.length; i++) {
      try {
        await userScript.execute(i, resultObj);
      } catch (err) {
        throw new Error("Error executing cell.");
      }
    }
  };

  Promise.all(scriptPromises).then(() => {
    executeCells()
      .then(() => repl.execute(codeString, resultObj, "JAVASCRIPT"))
      .then(() => repl.parseOutput(resultObj, "JAVASCRIPT"))
      .then(() => respondToServer())
      .catch(err => {
        respondToServer();
        console.log(err);
      });
  });
});

app.listen(3000, () => {
  console.log("App started");
});
