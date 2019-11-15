const uuidv4 = require("uuid/v4");
const express = require("express");
const http = require("http");
const Websocket = require("ws");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const wss = new Websocket.Server({ server });

const logger = require("morgan");
const userScript = require("./libs/modules/userScript");
const repl = require("./libs/modules/repl");

app.use(express.static("."));
app.use(logger("dev"));

const generateDelimiter = (language, delimiter) => {
  switch (language) {
    case "Ruby":
      return `puts "${delimiter}"\n`;
    case "Javascript":
      return `console.log('${delimiter}');\n`;
    case "Python":
      return `print(${delimiter})\n`;
  }
};

// const sendDelimiterToClient = (ws, uuid) => {
//   ws.send(JSON.stringify({ type: "delimiter", data: uuid }));
// };

wss.on("connection", ws => {
  const delimiter = uuidv4();
  // sendDelimiterToClient(ws, delimiter);

  ws.on("message", message => {
    message = JSON.parse(message);
    console.log(message);

    if (message.type === "saveNotebook") {
      saveNotebook(message.notebook)
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
      // } else if (message.type === "executeCode") {
    } else if (message.type === "loadNotebook") {
      loadNotebook(message.id)
        .then(notebook => {
          ws.send(JSON.stringify({ type: "loadNotebook", data: notebook }));
        })
        .catch(error => {
          ws.send(JSON.stringify({ type: "error", data: error }));
          console.log(error);
        });
    } else {
      const { language, codeStrArray } = message;
      const codeString = codeStrArray.join("") + "\n";
      const delimiterStatement = generateDelimiter(language, delimiter);
      const scriptString = codeStrArray.join(delimiterStatement);

      // is this the best place to set language for upcoming data?
      // ws.send(JSON.stringify({ type: "language", data: language }));

      userScript.writeFile(scriptString, language).then(() => {
        userScript
          .execute(ws, delimiter)
          .then(() => repl.execute(codeString, language))
          .then(returnData => repl.parseOutput(returnData, language))
          .then(returnValue => {
            ws.send(JSON.stringify({ type: "return", data: returnValue }));
          })
          .catch(data => {
            ws.send(data);
          });
      });
    }
  });
});

server.listen(8000, () => {
  console.log("App started");
});

const saveNotebook = notebook => {
  return new Promise((resolve, reject) => {
    console.log("BEFORE SAVING NOTEBOOK");
    jsonNotebook = JSON.stringify(notebook);

    fs.writeFile(
      `./savedNotebooks/${notebook.id}.json`,
      jsonNotebook,
      error => {
        if (error) {
          console.log("ERROR SAVING NOTEBOOK");
          reject(error);
        } else {
          console.log(`AFTER SAVING NOTEBOOK: ${notebook.id}`);
          resolve(notebook.id);
        }
      }
    );
  });
};

const loadNotebook = id => {
  return new Promise((resolve, reject) => {
    console.log("BEFORE LOADING NOTEBOOK");

    fs.readFile(`./savedNotebooks/${id}.json`, (error, data) => {
      if (error) {
        console.log("ERROR LOADING NOTEBOOK");
        reject(error);
      } else {
        console.log("AFTER LOADING NOTEBOOK");
        resolve(JSON.parse(data));
      }
    });
  });
};
