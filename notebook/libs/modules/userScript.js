const fs = require("fs");
const { exec } = require("child_process"); // exec uses system default shell
var spawn = require("child_process").spawn;

const userScript = {
  script: "",
  scriptExecCmd: "",
  execOptions: (execOptions = {
    encoding: "utf8",
    timeout: 10000,
    maxBuffer: 200 * 1024, // this is 1mb, default is 204 kb
    killSignal: "SIGTERM",
    cwd: null,
    env: null
  }),
  execute: ws => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE EXECUTING SCRIPT");
      // console.log(userScript.execOptions);
      const scriptProcess = exec(
        `${this.command} ./codeCellScripts/user_script${this.fileType}`,
        userScript.execOptions
      );

      scriptProcess.stdout.on("data", data => {
        ws.send(JSON.stringify({ type: "stdout", data: data }));
      });

      scriptProcess.stdout.on("end", () => {
        ws.send(JSON.stringify({ type: "message", data: "Script completed" }));
        resolve();
      });

      scriptProcess.stderr.on("data", data => {
        ws.send(data);
        reject(JSON.stringify({ type: "stderr", data: data }));
      });
    });
  },
  writeFile: (codeString, lang) => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE WRITING SCRIPT");

      switch (lang) {
        case "RUBY":
          this.fileType = `.rb`;
          this.command = "ruby";
          // this.delimiter = "puts 'DELIMITER'\n";
          break;
        case "JAVASCRIPT":
          this.fileType = `.js`;
          this.command = "node";
          // this.delimiter = "console.log('DELIMITER')\n";
          break;
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

    // { 0: ['ser', 'er'], 1: ['er', 'wrgerg'] }

    // { 0: { output: ['ser', 'er']},
    //   1: { output: ['er', 'wrgerg']}
    // }
    return outputByCell;
  }
};

module.exports = userScript;
