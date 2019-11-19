const fs = require("fs");
const { exec } = require("child_process"); // exec uses system default shell

const sendTruncatedOutput = (output, ws, language) => {
  output.forEach(data => {
    ws.send(JSON.stringify({ language, type: "stdout", data: data }));
  });
};

let buffer = [];

const userScript = {
  script: "",
  scriptExecCmd: "",
  execOptions: (execOptions = {
    encoding: "utf8",
    timeout: 5000,
    maxBuffer: 200 * 1024, // this is default (204 kb)
    killSignal: "SIGTERM",
    cwd: null,
    env: null
  }),
  execute: (ws, delimiter, language) => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE EXECUTING SCRIPT");
      const scriptProcess = exec(
        `${this.command} ./codeCellScripts/user_script${this.fileType}`,
        userScript.execOptions,
        (error, stdout, stderr) => {
          if (error) {
            ws.send(
              JSON.stringify({
                language,
                type: "error",
                data: { error, stderr }
              })
            );
            reject();
          }
        }
      );

      scriptProcess.stdout.on("data", data => {
        buffer.push(data);

        setTimeout(() => {
          const bufferArray = buffer.join("").split("\n");

          if (bufferArray.length > 50) {
            const truncatedOutput = bufferArray.slice(1, 3);

            scriptProcess.kill();
            sendTruncatedOutput(truncatedOutput, ws, language);
            buffer = [];
            reject();
          } else {
            bufferArray.forEach(data => {
              if (data === delimiter) {
                ws.send(JSON.stringify({ language, type: "delimiter" }));
              } else {
                ws.send(
                  JSON.stringify({ language, type: "stdout", data: data })
                );
              }
              buffer = [];
            });
          }
        }, 1);
      });

      scriptProcess.stdout.on("end", () => {
        console.log("AFTER EXECUTING SCRIPT");
        // ws.send(JSON.stringify({ type: "end", data: "Script completed" }));
        resolve();
      });

      scriptProcess.stderr.on("data", data => {
        // ws.send(JSON.stringify({ language, type: "stderr", data }));
        // reject(data, "stderr");
        reject();
      });
    });
  },
  writeFile: (codeString, lang) => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE WRITING SCRIPT");

      switch (lang) {
        case "Ruby":
          this.fileType = `.rb`;
          this.command = "ruby";
          break;
        case "Javascript":
          this.fileType = `.js`;
          this.command = "node";
          break;
        case "Python":
          this.fileType = ".py";
          this.command = "python";
      }

      fs.writeFile(
        `./codeCellScripts/user_script${this.fileType}`,
        codeString,
        error => {
          if (error) {
            console.log("ERROR WRITING SCRIPT");
            reject(error, "error");
          } else {
            console.log("AFTER WRITING SCRIPT");
            resolve();
          }
        }
      );
    });
  },
  parseOutput: (err, stdout, stderr) => {
    const splitOutput = stdout.split("DELIMIT\n");
    const outputByCell = splitOutput.reduce((outputObj, currentCell, idx) => {
      outputObj[idx] = { output: currentCell.split("\n") };
      outputObj[idx].output.pop();
      return outputObj;
    }, {});

    if (err || stderr) {
      const lastCellIdx = Object.keys(outputByCell).length - 1;
      outputByCell[lastCellIdx].error = [err, stderr];
    }

    return outputByCell;
  }

  // sendTruncatedOutput: data => {
  //   truncatedOutput.forEach(data => {
  //     ws.send(
  //       JSON.stringify({ language, type: "stdout", data: data })
  //     );
  //   });
  // },
};

module.exports = userScript;
