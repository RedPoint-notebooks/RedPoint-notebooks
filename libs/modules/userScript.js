const fs = require("fs");
const { exec } = require("child_process"); // exec uses system default shell

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
  execute: (ws, delimiter) => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE EXECUTING SCRIPT");
      const scriptProcess = exec(
        `${this.command} ./codeCellScripts/user_script${this.fileType}`,
        userScript.execOptions,
        (error, stdout, stderr) => {
          if (error) {
            ws.send(JSON.stringify({ type: "error", data: error }));
          }
        }
      );

      scriptProcess.stdout.on("data", data => {
        debugger;
        if (data === delimiter) {
          ws.send(JSON.stringify({ type: "delimiter" }));
        }
        ws.send(JSON.stringify({ type: "stdout", data: data }));
      });

      scriptProcess.stdout.on("end", () => {
        ws.send(JSON.stringify({ type: "end", data: "Script completed" }));
        resolve();
      });

      scriptProcess.stderr.on("data", data => {
        reject(JSON.stringify({ type: "stderr", data: data }));
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
            reject(error);
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
