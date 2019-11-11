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

const generateDelimiter = (lang, delimiter) => {
  switch (lang) {
    case "RUBY":
      return `puts "${delimiter}"\n`;
    case "JAVASCRIPT":
      return `console.log(${delimiter})\n`;
    case "PYTHON":
      return `print(${delimiter})\n`;
  }
};

wss.on("connection", ws => {
  ws.on("message", msg => {
    const { language, codeStrArray } = JSON.parse(msg);
    const codeString = codeStrArray.join("");
    const delimiterStatement = generateDelimiter(language, "DELIMITER");
    const scriptString = codeStrArray.join(delimiterStatement);

    // is this the best place to set language for upcoming data?
    ws.send(JSON.stringify({ type: "language", data: language }));

    userScript.writeFile(scriptString, language).then(() => {
      userScript
        .execute(ws)
        .then(() => repl.execute(codeString, language))
        .then(returnData => repl.parseOutput(returnData, language))
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

server.listen(3000, () => {
  console.log("App started");
});
