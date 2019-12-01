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

const logger = require("morgan");
const userScript = require("./libs/modules/userScript");
const repl = require("./libs/modules/repl");

const db = require("./libs/modules/db");
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

function heartbeat(ws) {
  ws.isAlive = true;
}
function noop() {}

wss.on("connection", ws => {
  const delimiter = uuidv4();
  const queue = [];

  ws.on("close", () => {
    console.log("Sending fetch delete request to : ", sessionAddress);
    // sessionAddress = new URL("http://" + sessionAddress);
    fetch("http://" + sessionAddress, {
      method: "DELETE"
    });
  });
  ws.on("error", () => {});

  ws.isAlive = true;
  ws.on("pong", () => {
    heartbeat(ws);
  });

  ws.on("message", message => {
    message = JSON.parse(message);
    console.log("Server received message: ", message);

    if (message.type === "sessionAddress") {
      sessionAddress = message.data;
    } else if (message.type === "saveNotebook") {
      handleSaveNotebook(message.notebook, ws);
    } else if (message.type === "loadNotebook") {
      handleLoadNotebook(message.id, ws);
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

const interval = setInterval(function ping() {
  wss.clients.forEach(function each(ws) {
    // when tab closed, there are no more clients. no iteration here.
    if (ws.isAlive === false) {
      ws.terminate();
    }

    ws.isAlive = false;
    ws.ping(noop);
    console.log("ping sent to client");
  });
}, 4000);

const handleSaveNotebook = (notebook, ws) => {
  db("SAVE", notebook)
    .then(() => {
      ws.send(
        JSON.stringify({
          type: "saveResult",
          data: "Notebook has been saved"
        })
      );
    })
    .catch(error => {
      ws.send(JSON.stringify({ type: "saveResult", data: error }));
      console.log(error);
    });
};

const handleLoadNotebook = (notebookId, ws) => {
  db("LOAD", null, notebookId)
    .then(notebook => {
      ws.send(JSON.stringify({ type: "loadNotebook", data: notebook }));
    })
    .catch(error => {
      ws.send(JSON.stringify({ type: "loadError", data: error }));
      console.log(error);
    });
};

const handleExecuteCode = (message, ws, delimiter) => {
  return new Promise((resolve, reject) => {
    const { language, codeStrArray } = message;
    const codeString = codeStrArray.join("");
    const delimiterStatement = generateDelimiter(language, delimiter);
    const scriptString = codeStrArray.join(delimiterStatement);

    userScript.writeFile(scriptString, language).then(() => {
      userScript
        .execute(ws, delimiter, language, scriptString, codeStrArray)
        .then(() => repl.execute(codeString, language))
        .then(returnData => repl.parseOutput(returnData, language))
        .then(returnValue => {
          ws.send(
            JSON.stringify({ type: "return", language, data: returnValue })
          );
          resolve();
        })
        .catch((data, type) => {
          // ws.send(JSON.stringify({ language, type, data }));
          resolve();
        });
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

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

server.listen(8000, () => {
  console.log("App started");
});
