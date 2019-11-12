const express = require("express");
const http = require("http");
const Websocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new Websocket.Server({ server });

const logger = require("morgan");
const userScript = require("./libs/modules/userScript");
const repl = require("./libs/modules/repl");

app.use(express.static("."));
app.use(logger("dev"));

wss.on("connection", ws => {
  ws.on("message", msg => {
    const codeStrArr = JSON.parse(msg);
    const codeString = codeStrArr.join("");
    const scriptString = codeStrArr.join("console.log('DELIMITER')\n");

    userScript.writeFile(scriptString, "JAVASCRIPT").then(() => {
      userScript
        .execute(ws)
        .then(() => repl.execute(codeString, "JAVASCRIPT"))
        .then(returnData => repl.parseOutput(returnData, "JAVASCRIPT"))
        .then(returnValue => {
          ws.send(JSON.stringify({ type: "return", data: returnValue }));
        })
        .catch(data => {
          debugger;
          ws.send(data);
        });
    });
  });
});

app.get("/reacttest", (req, res) => {
  res.send("Served here");
});

server.listen(8000, () => {
  console.log("App started");
});
