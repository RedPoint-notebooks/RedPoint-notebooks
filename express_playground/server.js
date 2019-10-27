const express = require("express");
const logger = require("morgan");
const pty = require("node-pty");
const app = express();
const bodyParser = require("body-parser");
const repl = pty.spawn("irb");

app.use(logger("dev"));
app.use(express.static("."));
app.use(bodyParser.json());

app.post("/", function(req, res) {
  const code = req.body.userCode;
  let result = "";

  repl.write(code); // repl.pipe(code) ?

  repl.onData(data => {
    result += data;
  });

  setTimeout(() => res.json({ result: result }), 200);
});

app.listen(3000, () => {
  console.log("App started");
});
