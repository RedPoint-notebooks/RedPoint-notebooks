const fs = require("fs");
const { exec } = require("child_process"); // exec uses system default shell

const userScript = {
  script: "",
  scriptExecCmd: "",
  execOptions: (execOptions = {
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 200 * 1024, // this is default (204 kb)
    killSignal: "SIGTERM",
    cwd: null,
    env: null
  }),
  execute: (ws, delimiter, language, scriptString, codeStrArray) => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE EXECUTING SCRIPT");
      const scriptProcess = exec(
        `${this.command} ./codeCellScripts/user_script${this.fileType}`,
        userScript.execOptions,
        (error, stdout, stderr) => {
          if (error) {
            if (/[Ss]yntax/.test(stderr)) {
              // const originalCellsLines = codeStrArray.reduce(
              //   (linesObj, currentCell, cellIdx) => {
              //     linesObj[cellIdx] = currentCell.split("\n").length - 1;
              //     return linesObj;
              //   },
              //   {}
              // );
              const scriptArray = scriptString.split("\n");
              const syntaxErrorLine = +stderr.match(/\d+/)[0];
              let scriptErrorIdx = syntaxErrorLine - 1;
              const delimsBeforeError = scriptArray
                .slice(0, scriptErrorIdx)
                .filter(line => {
                  const delimRegex = new RegExp(delimiter);
                  return delimRegex.test(line);
                }).length;

              const errorCell = delimsBeforeError;

              // const errorLineinCell = syntaxErrorLine - originalCellsLines[errorCell];
              // stderr = stderr.replace(/\d+/, errorLineinCell);

              ws.send(
                JSON.stringify({
                  type: "syntax-error",
                  data: {
                    location: [errorCell, 42],
                    error,
                    stderr
                  },
                  language
                })
              );
              reject();
            } else {
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
        }
      );

      scriptProcess.stdout.on("data", data => {
        const dataArray = data.split("\n").slice(0, -1);
        dataArray.forEach(data => {
          if (data === delimiter) {
            ws.send(JSON.stringify({ language, type: "delimiter" }));
          } else {
            ws.send(JSON.stringify({ language, type: "stdout", data: data }));
          }
        });
      });

      scriptProcess.stdout.on("end", () => {
        resolve();
      });

      scriptProcess.stderr.on("data", data => {
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
};

module.exports = userScript;
