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
  // listen for specific message????
  ws.on("message", msg => {
    const codeStrArr = JSON.parse(msg);
    const codeString = codeStrArr.join("");
    const scriptString = codeStrArr.join("console.log('DELIMITER')\n");
    // debugger;

    userScript.writeFile(scriptString, "JAVASCRIPT").then(() => {
      userScript
        .execute(ws)
        .then(responseObj => repl.execute(codeString, "JAVASCRIPT"))
        .then(returnData => repl.parseOutput(returnData, "JAVASCRIPT"))
        .then(returnValue => {
          debugger;
          ws.send(JSON.stringify({ type: "return", data: returnValue }));
        })
        .catch(data => {
          ws.send(data);
        });

      // )
      // .then(responseObj => respondToClient(responseObj))
      // .catch(data => {
      //   ws.send(data);
      //   ws.send("There was an error in the thenable chain.")
      // });
    });

    // console.log(`Received code: ${String(codeArr)}.`);
  });
});

// app.post("/", function(req, res) {
//   const codeStringArray = req.body.userCode;
//   const codeString = codeStringArray.join("");

//   const respondToClient = responseObj => {
//     debugger;
//     res.json({ responseObj });
//   };

//   const writeScript = () => {
//     const script = codeStringArray.join("console.log('DELIMIT')\n"); // cell delimiter must be language-specific
//     return userScript.writeFile(script, "JAVASCRIPT");
//   };

// writeScript().then(() => {
//   userScript
//     .execute()
//     .then(responseObj => repl.execute(codeString, responseObj, "JAVASCRIPT"))
//     .then(responseObj => repl.parseOutput(responseObj, "JAVASCRIPT"))
//     .then(responseObj => respondToClient(responseObj))
//     .catch(responseObj => {
//       respondToClient(responseObj);
//     });
// });
// });

server.listen(3000, () => {
  console.log("App started");
});
