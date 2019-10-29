const express = require("express");
const logger = require("morgan");
const pty = require("node-pty");
const { exec } = require("child_process"); // exec uses system default shell
const app = express();
const bodyParser = require("body-parser");
const repl = pty.spawn("irb");

app.use(logger("dev"));
app.use(express.static("."));
app.use(bodyParser.json());

const parseReplOutput = output => {
  // split REPL output on newlines
  const outputLines = output.split("\n");
  if (output.match("Error")) {
    // TODO: Don't return anything if error
    console.log(outputLines);
  }
  // REPL return value is second last line in output
  const replReturnValue = outputLines[outputLines.length - 2];
  return replReturnValue;
};

const createAndWriteToScript = command => {
  // console.log(command);
  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`error from create (a Node Error object): ${err}`);
    } else {
      console.log("script.rb created and written to!");
      console.log(`stdout from create: ${stdout}`);
      console.log(`stderr from create: ${stderr}`);
    }
  });
};

const executeScript = () => {
  const rubyScript = exec("ruby script.rb");

  rubyScript.stdout.on("data", data => {
    console.log(`stout from execute: ${data}`); // happy path. no error.
  });
  rubyScript.stderr.on("data", data => {
    console.error(`sterr from execute: ${data}`);
  });
};

const deleteScript = () => {
  exec("rm script.rb", (err, stdout, stderr) => {
    if (err) {
      console.error(`error from delete: ${err}`);
    } else {
      console.log("script deleted!");
    }
  });
};

app.post("/", function(req, res) {
  const code = req.body.userCode;
  let replResult = "";
  let resultObj = {};

  const command = "echo \"puts 'hi from script!'\" >> script.rb";

  createAndWriteToScript(command);
  executeScript();

  repl.write(code); // repl.pipe(code) ?

  repl.onData(data => {
    replResult += data;
  });

  setTimeout(() => {
    const returnValue = parseReplOutput(replResult);
    resultObj.return = returnValue;
    res.json({ resultObj });
  }, 200);

  setTimeout(deleteScript, 3000); // setTimeout, or script is deleted too early
});

app.listen(3000, () => {
  console.log("App started");
});
