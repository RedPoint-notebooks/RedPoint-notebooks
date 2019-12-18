require("dotenv").config();
const uuidv4 = require("uuid/v4");
const express = require("express");
const http = require("http");
const Websocket = require("ws");
const path = require("path");
const fetch = require("node-fetch");
const app = express();
const server = http.createServer(app);
const wss = new Websocket.Server({ server, clientTracking: true });
let webSocketEstablished = false;

const logger = require("morgan");
const userScript = require("./libs/modules/userScript");
const repl = require("./libs/modules/repl");

let sessionAddress;

app.use(logger("dev"));

const generateDelimiter = (language, delimiter) => {
  switch (language) {
    case "Ruby":
      return `puts "${delimiter}"\n`;
    case "Javascript":
      return `console.log('${delimiter}');\n`;
    case "Python":
      return `print('${delimiter}')\n`;
  }
};

wss.on("connection", ws => {
  const delimiter = uuidv4();
  const queue = [];
  webSocketEstablished = true;

  ws.on("close", () => {
    console.log("Sending fetch delete request to : ", sessionAddress);
    // sessionAddress = new URL("http://" + sessionAddress);
    fetch("http://" + sessionAddress, {
      method: "DELETE"
    });
  });
  ws.on("error", () => {});

  ws.on("message", message => {
    message = JSON.parse(message);
    console.log("Server received message: ", message);

    if (message.type === "sessionAddress") {
      sessionAddress = message.data;
    } else if (message.type === "executeCode") {
      if (queue.length === 0) {
        queue.push(message);
        executeQueue(queue, ws, delimiter);
      } else {
        queue.push(message);
      }
    }
  });
});

const handleExecuteCode = (message, ws, delimiter) => {
  const { language, codeStrArray } = message;
  const codeString = codeStrArray.join("");
  const delimiterStatement = generateDelimiter(language, delimiter);
  const scriptString = codeStrArray.join(delimiterStatement);

  return userScript.writeFile(scriptString, language).then(() => {
    userScript
      .execute(ws, delimiter, language, scriptString, codeStrArray)
      .then(() => repl.execute(codeString, language))
      .then(returnData => repl.parseOutput(returnData, language))
      .then(returnValue => {
        ws.send(
          JSON.stringify({ type: "return", language, data: returnValue })
        );
      })
      .catch((data, type) => {
        console.log("Handle Execute Code Catch");
        console.log(data);
      });
  });
};

const executeQueue = (queue, ws, delimiter) => {
  handleExecuteCode(queue[0], ws, delimiter).then(() => {
    queue.shift();
    if (queue.length > 0) {
      executeQueue(queue, ws, delimiter);
    }
  });
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

app.use(express.static(path.join(__dirname, "client", "build")));

app.get("/checkHealth", function(req, res) {
  console.log("INSIDE /checkHealth");
  res.end(JSON.stringify({ webSocketEstablished: !!webSocketEstablished }));
});

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(8000, () => {
  console.log("App started");
});
