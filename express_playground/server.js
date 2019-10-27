const express = require("express");
const logger = require("morgan");
const pty = require("node-pty");
const app = express();
const bodyParser = require("body-parser");
const repl = pty.spawn("node");

app.use(logger("dev"));
app.use(express.static("."));
app.use(bodyParser.json());

app.post("/", function(req, res) {
  const code = req.body.userCode;
  let result = "";

  repl.write(code); // repl.pipe(code) ?

  repl.onData(data => {
    // console.log(data);
    result += data;
  });

  setTimeout(() => res.json({ result: result }), 200);
  // repl.removeAllListeners("data");
});

app.listen(3000, () => {
  console.log("App started");
});
