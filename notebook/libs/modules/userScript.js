const fs = require("fs");
const { exec } = require("child_process"); // exec uses system default shell

const userScript = {
  script: "",
  scriptExecCmd: "",
  execOptions: (execOptions = {
    encoding: "utf8",
    timeout: 5000,
    maxBuffer: 200 * 1024, // this is 1mb, default is 204 kb
    killSignal: "SIGTERM",
    cwd: null,
    env: null
  }),

  execute: resultObj => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE EXECUTING SCRIPT");
      // console.log(userScript.execOptions);
      exec(
        `${this.command} ./codeCellScripts/user_script${this.fileType}`,
        userScript.execOptions,
        (error, stdout, stderr) => {
          resultObj.script = { error, stderr, stdout };

          if (error || stderr) {
            console.log("ERROR EXECUTING SCRIPT");
            reject();
          } else {
            console.log("AFTER EXECUTING SCRIPT");
            resolve();
          }
        }
      );
    });
  },
  writeFile: (codeString, lang) => {
    return new Promise((resolve, reject) => {
      console.log("BEFORE WRITING SCRIPT");

      switch (lang) {
        case "RUBY":
          this.fileType = `.rb`;
          this.command = "ruby";
          break;
        case "JAVASCRIPT":
          this.fileType = `.js`;
          this.command = "node";
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
  parseOutput: resultObj => {
    const stdout = resultObj.script.stdout;
    const splitOutput = stdout.split("DELIMIT\n");
    // ['sergwe\nservrew\nerge\n', 'ewt\nwevrr\n', 'erbrbrtb\n']
    const outputByCell = splitOutput.reduce((outputObj, currentCell, idx) => {
      outputObj[idx] = currentCell.split("\n");
      outputObj[idx].pop();
      return outputObj;
    }, {});

    resultObj.cellsOutput = outputByCell;
  }
};

module.exports = userScript;
