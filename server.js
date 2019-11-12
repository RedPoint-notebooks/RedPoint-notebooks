const uuidv4 = require("uuid/v4");
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
    case "ruby":
      return `puts "${delimiter}"\n`;
    case "javascript":
      return `console.log(${delimiter})\n`;
    case "python":
      return `print(${delimiter})\n`;
  }
};

const sendDelimiterToClient = (ws, uuid) => {
  ws.send(JSON.stringify({ type: "delimiter", data: uuid }));
};

wss.on("connection", ws => {
  const delimiter = uuidv4();
  sendDelimiterToClient(ws, delimiter);

  ws.on("message", msg => {
    const { language, codeStrArray } = JSON.parse(msg);
    const codeString = codeStrArray.join("");
    const delimiterStatement = generateDelimiter(language, delimiter);
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
